# MediSphere — Milestone 4 (Full Stack)

This is your Milestone 4 frontend, now wired to a real backend and
your Postgres database, running fully on localhost.

```
milestone4_database.sql      Schema for the 6 new M4 tables (you already ran this)
milestone4_demo_data.sql     Demo data for the 6 new M4 tables (you already ran this)
medisphere-m4-backend/       New Node.js/Express API (port 4001)
medisphere-m4-frontend/      Your Milestone 4 React app (port 5177), now calling the API
```

## Why a separate backend service?

Your Milestone 4 SQL references `patients(patient_id)`,
`predictions(prediction_id)`, `clinical_rules(rule_id)` and
`rule_executions(execution_id)` — tables owned by parts of your stack
that already exist in your live database (visible in your pgAdmin
screenshots) but aren't fully present in the Milestone 3 zip you sent
(that zip's Java backend and Flask ml-service use different table
names — `ml_patient_data` / `ml_predictions` — for their own data).
Rather than guess at schema I can't see and risk breaking your
existing services, I built a small, self-contained API that talks
directly to your existing `medisphere` database and only touches the
six Milestone 4 tables. It runs independently of your Java backend
(`:8080`), Flask ml-service (`:5000`) and Node monitoring-service
(`:4000`), so nothing else changes.

## Run it locally — ONE link (recommended)

This gives you a single process and a single URL:
**http://localhost:4001**. Open VS Code's integrated terminal at the
root of this project and run:

```bash
# 1) database — you've already run these against `medisphere` (per your screenshots);
#    only needed again if you rebuild the DB from scratch, in this order,
#    AFTER your Milestone 1-3 schema:
#    psql -U postgres -d medisphere -f milestone4_database.sql
#    psql -U postgres -d medisphere -f milestone4_demo_data.sql

# 2) backend setup
cd medisphere-m4-backend
npm install
cp .env.example .env        # edit DB_USER / DB_PASSWORD if yours differ

# 3) build the frontend into the backend (one command, needs medisphere-m4-frontend/ next to it)
npm run build

# 4) start the single process
npm start
```

Now open **http://localhost:4001** — that's it, one link, the whole
app (login screen, dashboard, Predictions page with all three
Milestone 4 panels) is served from there, with the API on the same
origin at `/api/*`.

> Whenever you change frontend code, re-run `npm run build` in
> `medisphere-m4-backend` to refresh what's served.

## Run it locally — two terminals (for active frontend development)

If you're actively editing the React code and want hot-reload, run
two terminals instead — you'll still only ever need to **open one
link in the browser** (`http://localhost:5177`); Vite proxies `/api`
calls to the backend for you.

**Terminal 1 — backend:**
```bash
cd medisphere-m4-backend
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:4001` (don't open this directly — it's API-only).

**Terminal 2 — frontend:**
```bash
cd medisphere-m4-frontend
npm install
npm run dev
```

Open **http://localhost:5177** in the browser. Log in with the demo
credentials already wired into the app (see the login screen), then
open the **Predictions** page to see:

- **Outcome Measurement** — live "Outcome Records" table + a "Log
  measurement" form, backed by `outcome_measurements`
- **Provider Collaboration** — live collaboration threads and notes
  per patient, with "New collaboration" and "Add note" actions
- **Clinical Guideline Compliance** — live compliance cards per
  patient, sourced from `guidance_compliance`, with a "Mark
  compliant" action

Each of these three panels has a patient picker in its header —
pick `P004` first, since that's the patient with the fullest demo
data set (per your demo data file).

## What's real vs. illustrative

The KPI tiles, trend chart and milestone timeline at the top of
**Outcome Measurement**, and the "Care team" roster at the top of
**Provider Collaboration**, are the original polished demo visuals
from your frontend — they aren't backed by the current schema (no
vitals/wearable-sync tables exist yet) so I left them as illustrative
design. Everything below them — the outcome records table, the
collaboration threads/notes, and the entire compliance section — is
live, reads and writes through the new backend, and will reflect
whatever's actually in your `medisphere` database.

## Troubleshooting

- **"Could not reach the Milestone 4 backend" banners in the UI** —
  make sure `medisphere-m4-backend` is running and that
  `curl http://localhost:4001/api/health` returns `"database":"connected"`.
- **`npm run build` fails inside `medisphere-m4-backend`** — it needs
  `medisphere-m4-frontend/` to exist as a sibling folder (same parent
  directory). Don't move one without the other.
- **CORS errors in the browser console** (two-terminal dev mode only) —
  the backend's `.env` only allows `http://localhost:5177` by default;
  if Vite picks a different port, add it to `CORS_ALLOWED_ORIGINS` in
  `medisphere-m4-backend/.env`. In single-link mode this can't happen
  since everything is same-origin.
- **Empty patient dropdowns** — means the Milestone 4 tables are
  empty; re-run `milestone4_demo_data.sql`.
- **Frontend changes not showing up in single-link mode** — you need
  to re-run `npm run build` in `medisphere-m4-backend` after editing
  React code; it doesn't hot-reload like the two-terminal dev setup.
