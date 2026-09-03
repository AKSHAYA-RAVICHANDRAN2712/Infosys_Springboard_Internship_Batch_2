const express = require('express');
const { query } = require('../db');
const { asyncHandler, ValidationError, NotFoundError } = require('../errors');

const router = express.Router();

const VALID_STATUSES = ['IMPROVED', 'STABLE', 'WORSENED', 'NO_CHANGE', 'UNKNOWN'];

/* -------------------------------------------------------------- */
/* Outcome metrics (reference data: Blood Glucose, Heart Rate, ...) */
/* -------------------------------------------------------------- */

// GET /api/outcome-metrics
router.get(
  '/outcome-metrics',
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT metric_id, metric_name, description, unit, target_value, created_at
       FROM outcome_metrics ORDER BY metric_name;`
    );
    res.json(result.rows);
  })
);

/* -------------------------------------------------------------- */
/* Outcome measurements                                           */
/* -------------------------------------------------------------- */

// GET /api/outcomes?patient_id=P004&limit=50
router.get(
  '/outcomes',
  asyncHandler(async (req, res) => {
    const { patient_id: patientId, limit } = req.query;
    const params = [];
    let where = '';
    if (patientId) {
      params.push(patientId);
      where = `WHERE patient_id = $${params.length}`;
    }
    params.push(Math.min(Number(limit) || 100, 500));
    const result = await query(
      `SELECT outcome_id, patient_id, metric_name, unit, baseline_value,
              measured_value, outcome_status, measurement_date, notes
       FROM patient_outcome_summary
       ${where}
       ORDER BY measurement_date DESC
       LIMIT $${params.length};`,
      params
    );
    res.json(result.rows);
  })
);

// GET /api/outcomes/summary?patient_id=P004
// Aggregate counts by status, used to drive the KPI/status widgets.
router.get(
  '/outcomes/summary',
  asyncHandler(async (req, res) => {
    const { patient_id: patientId } = req.query;
    const params = [];
    let where = '';
    if (patientId) {
      params.push(patientId);
      where = `WHERE patient_id = $${params.length}`;
    }
    const result = await query(
      `SELECT outcome_status, COUNT(*)::int AS count
       FROM outcome_measurements
       ${where}
       GROUP BY outcome_status;`,
      params
    );
    const counts = { IMPROVED: 0, STABLE: 0, WORSENED: 0, NO_CHANGE: 0, UNKNOWN: 0 };
    result.rows.forEach((r) => {
      counts[r.outcome_status] = r.count;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const latestResult = await query(
      `SELECT measurement_date FROM outcome_measurements
       ${where}
       ORDER BY measurement_date DESC LIMIT 1;`,
      params
    );

    res.json({
      total,
      counts,
      latestMeasurementDate: latestResult.rows[0] ? latestResult.rows[0].measurement_date : null,
    });
  })
);

// GET /api/outcomes/:id
router.get(
  '/outcomes/:id',
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT outcome_id, patient_id, metric_name, unit, baseline_value,
              measured_value, outcome_status, measurement_date, notes
       FROM patient_outcome_summary WHERE outcome_id = $1;`,
      [req.params.id]
    );
    if (result.rows.length === 0) throw new NotFoundError(`Outcome ${req.params.id} not found`);
    res.json(result.rows[0]);
  })
);

// POST /api/outcomes
// body: { patient_id, metric_id, baseline_value, measured_value, outcome_status, notes,
//         prediction_id?, rule_execution_id? }
router.post(
  '/outcomes',
  asyncHandler(async (req, res) => {
    const {
      patient_id: patientId,
      metric_id: metricId,
      baseline_value: baselineValue,
      measured_value: measuredValue,
      outcome_status: outcomeStatus,
      notes,
      prediction_id: predictionId,
      rule_execution_id: ruleExecutionId,
    } = req.body || {};

    if (!patientId || !metricId || !outcomeStatus) {
      throw new ValidationError('patient_id, metric_id and outcome_status are required.');
    }
    if (!VALID_STATUSES.includes(outcomeStatus)) {
      throw new ValidationError(`outcome_status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const result = await query(
      `INSERT INTO outcome_measurements
        (patient_id, metric_id, prediction_id, rule_execution_id,
         baseline_value, measured_value, outcome_status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING outcome_id;`,
      [
        patientId,
        metricId,
        predictionId || null,
        ruleExecutionId || null,
        baselineValue ?? null,
        measuredValue ?? null,
        outcomeStatus,
        notes || null,
      ]
    );

    const created = await query(
      `SELECT outcome_id, patient_id, metric_name, unit, baseline_value,
              measured_value, outcome_status, measurement_date, notes
       FROM patient_outcome_summary WHERE outcome_id = $1;`,
      [result.rows[0].outcome_id]
    );
    res.status(201).json(created.rows[0]);
  })
);

module.exports = router;
