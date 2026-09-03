# MediSphere Milestone 4 Backend

A small Node.js/Express API that serves the Milestone 4 features
(Outcome Measurement, Provider Collaboration, Clinical Guidance
Compliance) directly from the Postgres schema created by
`milestone4_database.sql`.

It connects to the **same `medisphere` database** the rest of the
MediSphere platform uses — it does not stand up its own database. It
only reads/writes the six Milestone 4 tables (`outcome_metrics`,
`outcome_measurements`, `provider_collaborations`,
`collaboration_notes`, `clinical_guidance`, `guidance_compliance`)
plus a read-only lookup of `patient_id` values for the patient picker.

## Prerequisites

- Node.js 18+ 
- A running Postgres instance with the `medisphere` database, already
  containing your Milestone 1-3 tables (`patients`, `predictions`,
  `clinical_rules`, `rule_executions`) **and** the Milestone 4 schema
  applied (see the two SQL files one level up in this delivery:
  `milestone4_database.sql`, then `milestone4_demo_data.sql`). If
  you've already run these in pgAdmin, you're good to go.

## Setup

```bash
cd medisphere-m4-backend
npm install
cp .env.example .env
# edit .env if your Postgres user/password/port differ from the defaults
npm run dev
```

The API starts on **http://localhost:4001**. Check it's talking to
Postgres:

```bash
curl http://localhost:4001/api/health
# {"status":"ok","database":"connected"}
```

## Single-link mode (serve the frontend from here too)

Instead of running the frontend separately, you can build it and have
this backend serve it — one process, one URL:

```bash
npm run build   # builds ../medisphere-m4-frontend and copies it into ./public
npm start       # now http://localhost:4001 serves the whole app + API
```

`npm run build` requires `medisphere-m4-frontend/` to be a sibling
folder of this one. Re-run it any time you change frontend code —
this mode doesn't hot-reload.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/api/patients` | Distinct patient IDs with Milestone 4 data |
| GET | `/api/outcome-metrics` | Reference metric catalog |
| GET | `/api/outcomes?patient_id=` | Outcome measurements (patient_outcome_summary view) |
| GET | `/api/outcomes/summary?patient_id=` | Counts by status + latest date |
| GET | `/api/outcomes/:id` | Single outcome record |
| POST | `/api/outcomes` | Log a new measurement |
| GET | `/api/collaborations?patient_id=` | Provider collaborations |
| GET | `/api/collaborations/:id` | Single collaboration |
| GET | `/api/collaborations/:id/notes` | Notes on a collaboration |
| POST | `/api/collaborations` | Open a new collaboration |
| POST | `/api/collaborations/:id/notes` | Add a note |
| PATCH | `/api/collaborations/:id` | Update status |
| GET | `/api/guidance` | Active clinical guidance catalog |
| POST | `/api/guidance` | Add a guidance entry |
| GET | `/api/compliance?patient_id=` | Compliance records (view) |
| GET | `/api/compliance/summary?patient_id=` | Counts + overall score |
| POST | `/api/compliance` | Log a compliance record |
| PATCH | `/api/compliance/:id` | Update a compliance record |

All list endpoints accept an optional `?patient_id=` filter. All
`POST`/`PATCH` bodies are JSON; validation errors return `400` with an
`{"error": "..."}` body.

## Project layout

```
src/
  server.js        Express app, CORS, error handling
  db.js             pg connection pool
  errors.js         AppError / NotFoundError / ValidationError + asyncHandler
  routes/
    patients.js
    outcomes.js
    collaborations.js
    guidance.js
```
