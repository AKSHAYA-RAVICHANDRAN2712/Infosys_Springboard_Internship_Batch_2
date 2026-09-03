/**
 * db.js
 *
 * Shared PostgreSQL connection pool for the Milestone 4 backend.
 *
 * Talks to the SAME "medisphere" database used by the rest of the
 * MediSphere platform (Java backend on :8080, Flask ml-service on
 * :5000, Node monitoring-service on :4000). This service only reads
 * and writes the Milestone 4 tables created by milestone4_database.sql:
 *   outcome_metrics, outcome_measurements,
 *   provider_collaborations, collaboration_notes,
 *   clinical_guidance, guidance_compliance
 * plus a read-only lookup against patients(patient_id) for the
 * patient picker.
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'medisphere',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected error on idle Postgres client', err);
});

async function query(text, params) {
  return pool.query(text, params);
}

/** Run a callback inside a single transaction (client checked out once). */
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, withTransaction };
