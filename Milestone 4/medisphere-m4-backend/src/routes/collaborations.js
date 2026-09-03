const express = require('express');
const { query, withTransaction } = require('../db');
const { asyncHandler, ValidationError, NotFoundError } = require('../errors');

const router = express.Router();

const VALID_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const VALID_NOTE_TYPES = ['COMMENT', 'OBSERVATION', 'RECOMMENDATION', 'DECISION', 'FOLLOW_UP'];

// GET /api/collaborations?patient_id=P004
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { patient_id: patientId } = req.query;
    const params = [];
    let where = '';
    if (patientId) {
      params.push(patientId);
      where = `WHERE patient_id = $${params.length}`;
    }
    const result = await query(
      `SELECT collaboration_id, patient_id, initiated_by, collaborating_provider,
              subject, priority, status, total_notes, created_at
       FROM provider_collaboration_summary
       ${where}
       ORDER BY created_at DESC;`,
      params
    );
    res.json(result.rows);
  })
);

// GET /api/collaborations/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT collaboration_id, patient_id, initiated_by, collaborating_provider,
              subject, priority, status, total_notes, created_at
       FROM provider_collaboration_summary WHERE collaboration_id = $1;`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`Collaboration ${req.params.id} not found`);
    }
    res.json(result.rows[0]);
  })
);

// GET /api/collaborations/:id/notes
router.get(
  '/:id/notes',
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT note_id, collaboration_id, provider_name, note_type, note_text, created_at
       FROM collaboration_notes WHERE collaboration_id = $1
       ORDER BY created_at ASC, note_id ASC;`,
      [req.params.id]
    );
    res.json(result.rows);
  })
);

// POST /api/collaborations
// body: { patient_id, initiated_by, collaborating_provider, subject, priority?, status? }
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      patient_id: patientId,
      initiated_by: initiatedBy,
      collaborating_provider: collaboratingProvider,
      subject,
      priority = 'NORMAL',
      status = 'OPEN',
    } = req.body || {};

    if (!patientId || !initiatedBy || !collaboratingProvider || !subject) {
      throw new ValidationError(
        'patient_id, initiated_by, collaborating_provider and subject are required.'
      );
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      throw new ValidationError(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    if (!VALID_STATUSES.includes(status)) {
      throw new ValidationError(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const result = await query(
      `INSERT INTO provider_collaborations
        (patient_id, initiated_by, collaborating_provider, subject, priority, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING collaboration_id;`,
      [patientId, initiatedBy, collaboratingProvider, subject, priority, status]
    );

    const created = await query(
      `SELECT collaboration_id, patient_id, initiated_by, collaborating_provider,
              subject, priority, status, total_notes, created_at
       FROM provider_collaboration_summary WHERE collaboration_id = $1;`,
      [result.rows[0].collaboration_id]
    );
    res.status(201).json(created.rows[0]);
  })
);

// PATCH /api/collaborations/:id  body: { status }
router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { status } = req.body || {};
    if (!status || !VALID_STATUSES.includes(status)) {
      throw new ValidationError(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    const result = await query(
      `UPDATE provider_collaborations SET status = $1 WHERE collaboration_id = $2
       RETURNING collaboration_id;`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`Collaboration ${req.params.id} not found`);
    }
    const updated = await query(
      `SELECT collaboration_id, patient_id, initiated_by, collaborating_provider,
              subject, priority, status, total_notes, created_at
       FROM provider_collaboration_summary WHERE collaboration_id = $1;`,
      [req.params.id]
    );
    res.json(updated.rows[0]);
  })
);

// POST /api/collaborations/:id/notes
// body: { provider_name, note_type?, note_text }
router.post(
  '/:id/notes',
  asyncHandler(async (req, res) => {
    const { provider_name: providerName, note_type: noteType = 'COMMENT', note_text: noteText } =
      req.body || {};

    if (!providerName || !noteText) {
      throw new ValidationError('provider_name and note_text are required.');
    }
    if (!VALID_NOTE_TYPES.includes(noteType)) {
      throw new ValidationError(`note_type must be one of: ${VALID_NOTE_TYPES.join(', ')}`);
    }

    const created = await withTransaction(async (client) => {
      const collab = await client.query(
        `SELECT collaboration_id FROM provider_collaborations WHERE collaboration_id = $1;`,
        [req.params.id]
      );
      if (collab.rows.length === 0) {
        throw new NotFoundError(`Collaboration ${req.params.id} not found`);
      }
      const inserted = await client.query(
        `INSERT INTO collaboration_notes (collaboration_id, provider_name, note_type, note_text)
         VALUES ($1,$2,$3,$4)
         RETURNING note_id, collaboration_id, provider_name, note_type, note_text, created_at;`,
        [req.params.id, providerName, noteType, noteText]
      );
      return inserted.rows[0];
    });

    res.status(201).json(created);
  })
);

module.exports = router;
