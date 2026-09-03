const express = require('express');
const { query } = require('../db');
const { asyncHandler } = require('../errors');

const router = express.Router();

/**
 * GET /api/patients
 *
 * Returns the distinct patient IDs that already have Milestone 4 data
 * (outcomes, collaborations, or compliance records), for use in the
 * patient picker on the frontend. We deliberately only select
 * patient_id -- we don't assume any other column names on the
 * `patients` table since it's owned/created outside this service.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const result = await query(`
      SELECT patient_id FROM (
        SELECT DISTINCT patient_id FROM outcome_measurements
        UNION
        SELECT DISTINCT patient_id FROM provider_collaborations
        UNION
        SELECT DISTINCT patient_id FROM guidance_compliance
      ) p
      ORDER BY patient_id;
    `);
    res.json(result.rows.map((r) => r.patient_id));
  })
);

module.exports = router;
