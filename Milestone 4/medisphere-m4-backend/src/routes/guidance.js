const express = require('express');
const { query } = require('../db');
const { asyncHandler, ValidationError, NotFoundError } = require('../errors');

const router = express.Router();

const VALID_GUIDANCE_TYPES = [
  'MONITORING',
  'MEDICATION',
  'FOLLOW_UP',
  'DIAGNOSTIC',
  'LIFESTYLE',
  'REFERRAL',
  'OTHER',
];
const VALID_SEVERITIES = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];
const VALID_COMPLIANCE_STATUSES = [
  'PENDING',
  'COMPLIANT',
  'PARTIALLY_COMPLIANT',
  'NON_COMPLIANT',
  'NOT_APPLICABLE',
];

/* -------------------------------------------------------------- */
/* Clinical guidance (the protocol catalog)                        */
/* -------------------------------------------------------------- */

// GET /api/guidance
router.get(
  '/guidance',
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT guidance_id, guidance_title, description, guidance_type,
              source_rule_id, severity, is_active, created_at, updated_at
       FROM clinical_guidance
       WHERE is_active = TRUE
       ORDER BY guidance_title;`
    );
    res.json(result.rows);
  })
);

// POST /api/guidance
router.post(
  '/guidance',
  asyncHandler(async (req, res) => {
    const {
      guidance_title: guidanceTitle,
      description,
      guidance_type: guidanceType,
      source_rule_id: sourceRuleId,
      severity = 'NORMAL',
    } = req.body || {};

    if (!guidanceTitle || !description || !guidanceType) {
      throw new ValidationError('guidance_title, description and guidance_type are required.');
    }
    if (!VALID_GUIDANCE_TYPES.includes(guidanceType)) {
      throw new ValidationError(`guidance_type must be one of: ${VALID_GUIDANCE_TYPES.join(', ')}`);
    }
    if (!VALID_SEVERITIES.includes(severity)) {
      throw new ValidationError(`severity must be one of: ${VALID_SEVERITIES.join(', ')}`);
    }

    const result = await query(
      `INSERT INTO clinical_guidance
        (guidance_title, description, guidance_type, source_rule_id, severity)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING guidance_id, guidance_title, description, guidance_type,
                 source_rule_id, severity, is_active, created_at, updated_at;`,
      [guidanceTitle, description, guidanceType, sourceRuleId || null, severity]
    );
    res.status(201).json(result.rows[0]);
  })
);

/* -------------------------------------------------------------- */
/* Guidance compliance (per-patient tracking)                      */
/* -------------------------------------------------------------- */

// GET /api/compliance?patient_id=P004
router.get(
  '/compliance',
  asyncHandler(async (req, res) => {
    const { patient_id: patientId } = req.query;
    const params = [];
    let where = '';
    if (patientId) {
      params.push(patientId);
      where = `WHERE patient_id = $${params.length}`;
    }
    const result = await query(
      `SELECT compliance_id, patient_id, guidance_title, guidance_type, severity,
              provider_name, compliance_status, action_taken, compliance_date, remarks
       FROM clinical_guidance_compliance_summary
       ${where}
       ORDER BY compliance_id DESC;`,
      params
    );
    res.json(result.rows);
  })
);

// GET /api/compliance/summary?patient_id=P004
router.get(
  '/compliance/summary',
  asyncHandler(async (req, res) => {
    const { patient_id: patientId } = req.query;
    const params = [];
    let where = '';
    if (patientId) {
      params.push(patientId);
      where = `WHERE patient_id = $${params.length}`;
    }
    const result = await query(
      `SELECT compliance_status, COUNT(*)::int AS count
       FROM guidance_compliance
       ${where}
       GROUP BY compliance_status;`,
      params
    );
    const counts = {
      PENDING: 0,
      COMPLIANT: 0,
      PARTIALLY_COMPLIANT: 0,
      NON_COMPLIANT: 0,
      NOT_APPLICABLE: 0,
    };
    result.rows.forEach((r) => {
      counts[r.compliance_status] = r.count;
    });
    const scored = counts.COMPLIANT + counts.PARTIALLY_COMPLIANT + counts.NON_COMPLIANT + counts.PENDING;
    const overallScore = scored > 0
      ? Math.round(((counts.COMPLIANT + counts.PARTIALLY_COMPLIANT * 0.5) / scored) * 100)
      : null;
    res.json({ counts, overallScore });
  })
);

// POST /api/compliance
// body: { guidance_id, patient_id, provider_name, compliance_status?, action_taken?, remarks? }
router.post(
  '/compliance',
  asyncHandler(async (req, res) => {
    const {
      guidance_id: guidanceId,
      patient_id: patientId,
      provider_name: providerName,
      compliance_status: complianceStatus = 'PENDING',
      action_taken: actionTaken,
      remarks,
    } = req.body || {};

    if (!guidanceId || !patientId || !providerName) {
      throw new ValidationError('guidance_id, patient_id and provider_name are required.');
    }
    if (!VALID_COMPLIANCE_STATUSES.includes(complianceStatus)) {
      throw new ValidationError(
        `compliance_status must be one of: ${VALID_COMPLIANCE_STATUSES.join(', ')}`
      );
    }

    const complianceDate = complianceStatus === 'PENDING' ? null : new Date();

    const result = await query(
      `INSERT INTO guidance_compliance
        (guidance_id, patient_id, provider_name, compliance_status, action_taken,
         compliance_date, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING compliance_id;`,
      [guidanceId, patientId, providerName, complianceStatus, actionTaken || null, complianceDate, remarks || null]
    );

    const created = await query(
      `SELECT compliance_id, patient_id, guidance_title, guidance_type, severity,
              provider_name, compliance_status, action_taken, compliance_date, remarks
       FROM clinical_guidance_compliance_summary WHERE compliance_id = $1;`,
      [result.rows[0].compliance_id]
    );
    res.status(201).json(created.rows[0]);
  })
);

// PATCH /api/compliance/:id  body: { compliance_status, action_taken?, remarks? }
router.patch(
  '/compliance/:id',
  asyncHandler(async (req, res) => {
    const { compliance_status: complianceStatus, action_taken: actionTaken, remarks } = req.body || {};
    if (!complianceStatus || !VALID_COMPLIANCE_STATUSES.includes(complianceStatus)) {
      throw new ValidationError(
        `compliance_status must be one of: ${VALID_COMPLIANCE_STATUSES.join(', ')}`
      );
    }

    const complianceDate = complianceStatus === 'PENDING' ? null : new Date();

    const result = await query(
      `UPDATE guidance_compliance
       SET compliance_status = $1,
           action_taken = COALESCE($2, action_taken),
           remarks = COALESCE($3, remarks),
           compliance_date = $4
       WHERE compliance_id = $5
       RETURNING compliance_id;`,
      [complianceStatus, actionTaken || null, remarks || null, complianceDate, req.params.id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`Compliance record ${req.params.id} not found`);
    }

    const updated = await query(
      `SELECT compliance_id, patient_id, guidance_title, guidance_type, severity,
              provider_name, compliance_status, action_taken, compliance_date, remarks
       FROM clinical_guidance_compliance_summary WHERE compliance_id = $1;`,
      [req.params.id]
    );
    res.json(updated.rows[0]);
  })
);

module.exports = router;
