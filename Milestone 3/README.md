# Medisphere — Healthcare Management Platform for Clinical Operations

A merged, single coherent application built from three milestones:

- **Milestone 1** (`medisphere-fullstack`): the main full-stack app — Spring
  Boot backend, JWT auth, role-based React frontend, patients, appointments,
  vitals streaming, alerts, care plans, consent, digital twins, reports, and
  a heuristic risk-prediction feature.
- **Milestone 2** (`Medisphere-Healthcare-Platform`): a Flask ML
  microservice — Model Versioning, a trained Random Forest risk model, and
  real SHAP explainability — plus frontend pages for it.
- **Milestone 3** (`medisphere-milestone3`): a Node/Express + Socket.IO
  microservice — a database-backed clinical rule engine and real-time
  "mobile-style" notifications — plus a frontend page for it.

Milestone 1 is the base application. Milestone 2's and Milestone 3's real,
working backend logic (not their mock UI screens or, for Milestone 3, its
own standalone frontend) has been integrated into it as internal
microservices.

## Architecture

```
React Frontend  (frontend/, Vite + React 18, port 5173 dev / 3000 docker)
      |
      +----> Spring Boot Backend      (backend/, port 8080)
      |         auth (JWT) · patients · appointments · vitals · alerts
      |         care plans · consent · twins · reports · predictions (heuristic)
      |
      +----> Flask ML Service         (ml-service/, port 5000)
      |         model versioning · prediction · SHAP explainability
      |
      +----> Monitoring Service       (monitoring-service/, port 4000)
                clinical rule engine · rule execution audit trail
                real-time notifications (Socket.IO)
                    |
                    +---- PostgreSQL (one shared database: "medisphere")
                          <---- all three services connect here directly ---->
```

One frontend, one authentication system (Spring Security + JWT), one
database — and, via the Docker Compose build (default build args, see
`docker-compose.yml`), **one URL**: nginx serves the frontend and proxies
`/api`, `/ml`, `/monitoring`, and `/socket.io` to the three backend
services internally, so the browser never talks to them directly. The ML
service and monitoring service are internal microservices reached only
through the authenticated app (their pages are behind `ProtectedRoute`,
restricted to ADMIN/DOCTOR) — see [Authentication](#authentication) for
the current limitation on that.

```
Medisphere-Healthcare-Platform/
├── backend/             Spring Boot API (Java 17, Maven) — Milestone 1
├── ml-service/          Flask ML microservice (Python) — Milestone 2
├── monitoring-service/  Node/Express + Socket.IO microservice — Milestone 3
├── frontend/            React + Vite app — Milestone 1 base + Milestone 2/3 pages
├── database/            Shared schema SQL (model_versions, ml_predictions,
│                        shap_explanations, ml_patient_data, clinical_rules,
│                        rule_executions, notifications)
├── docker-compose.yml   Full stack: postgres, backend, ml-service,
│                        monitoring-service, frontend, (optional) kafka
├── .env.example         Every env var used across the stack, documented in one place
└── README.md            This file
```

## Technology stack

| Layer | Tech |
|---|---|
| Backend (main API) | Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Spring Kafka, WebSocket |
| ML microservice | Python 3.11, Flask, scikit-learn, SHAP, psycopg2, pandas |
| Monitoring microservice | Node.js 20, Express, Socket.IO, pg |
| Frontend | React 18, React Router 6, Vite, Bootstrap 5, Axios, Socket.IO client |
| Database | PostgreSQL 16 |
| Streaming (optional) | Kafka (KRaft mode) for live vitals |

## Features

**From Milestone 1 (preserved as-is):**
Login/register, role-based dashboards (Admin/Doctor/Patient/Receptionist),
Patients CRUD, Appointments, live Vitals monitoring (WebSocket + Kafka),
Alerts, Care Plans, Consent management + verification, Digital Twins,
Reports, and the existing heuristic Predictions feature (transparent
rules-based risk score wired to real patient records + alerting).

**From Milestone 2 (integrated as a new "ML Models" section, ADMIN/DOCTOR only):**
- **Prediction** — run the trained Random Forest model against a patient
  in the ML feature table (demo IDs `P001`–`P003`).
- **SHAP Explainability** — see which features drove a given prediction,
  ranked by absolute SHAP value, with a base value and predicted output.
- **Model Versioning** — register new model versions, activate one
  (auto-archiving whichever was previously active), archive versions,
  browse the full version history.
- **Analytics** and **Federated Training** pages — carried over from
  Milestone 2 **as UI mockups only** (clearly labeled with an in-app
  banner). They use static sample data; there is no live analytics
  aggregation endpoint or federated-learning coordinator in this project.
  Wiring them to real data is a natural next step, not done here to avoid
  fabricating numbers.

**From Milestone 3 (integrated as "Continuous Monitoring", under the ML
Models section, ADMIN/DOCTOR only):**
- **Clinical Rule Engine** — 5 seeded rules (irregular HR/possible AFib,
  low blood oxygen, sustained tachycardia, hypertensive reading, elevated
  temperature) evaluated server-side against a submitted vitals reading
  for a demo patient (`P001`–`P003`).
- **Rule Execution Audit Trail** — every evaluation is logged, fired or
  not, with the matching rule and result.
- **Real-Time Notifications** — a notification is created and pushed live
  over Socket.IO for every rule that fires; acknowledge it to mark it read.

## Prerequisites

- Java 17 + Maven 3.9+
- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL 16 (or Docker, which provides it for you)
- (Optional) Docker + Docker Compose
- (Optional) Kafka, only for live vitals streaming — the backend runs fine without it

## Quick start — Docker (recommended)

```bash
copy .env.example .env          REM Windows
# cp .env.example .env          # macOS/Linux
docker compose up -d --build
```

Then open **http://localhost:3000** — that is the *only* URL you need.
The frontend is served by nginx, which proxies `/api` → the Java backend
(8080), `/ml` → the Flask ML service (5000), and `/monitoring` +
`/socket.io` → the monitoring service (4000) — all internally, over the
Docker network. Postgres and all four app services start together; the
ML and monitoring schemas are created automatically on first run
(mounted as Postgres init scripts, including 5 seeded clinical rules);
the Java backend creates its own tables and demo data on first boot.
(Each service's port is still published to the host too, so you can
`curl localhost:5000` or `localhost:4000` directly for debugging — but
the app itself, as loaded in a browser, only ever talks to port 3000.)

## Quick start — local (no Docker)

### 1. Database

Install PostgreSQL, then:

```bash
createdb medisphere
psql -U postgres -d medisphere -f database/ml_model_versioning.sql
psql -U postgres -d medisphere -f database/ml_patient_data.sql
psql -U postgres -d medisphere -f database/shap_explainability.sql
psql -U postgres -d medisphere -f database/updates.sql
psql -U postgres -d medisphere -f database/z_monitoring_schema.sql
```

(Windows/psql on PATH: same commands work from `cmd` or PowerShell.) Order
matters: `z_monitoring_schema.sql` has foreign keys into `ml_predictions`
and `ml_patient_data`, so it must run last — see `database/README.md` and
`docs/INTEGRATION_NOTES.md` for the full explanation.

The Java backend's own tables (`users`, `patients`, `appointments`,
`predictions`, ...) are created automatically the first time it starts —
nothing to run manually for those.

### 2. Backend (Spring Boot)

```bash
cd backend
copy .env.example .env    REM if you keep one here; otherwise set env vars directly
mvn clean package
java -jar target\backend-0.1.0.jar
```

Or for development: `mvn spring-boot:run`. Defaults (from
`application.yml`) connect to `jdbc:postgresql://localhost:5432/medisphere`
with user `postgres` / password `NewPassword@123` — override via
`DB_URL` / `DB_USERNAME` / `DB_PASSWORD` env vars or a real password to
match what you created above. Runs on **http://localhost:8080**.

### 3. ML service (Flask)

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate        REM Windows
REM source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
copy .env.example .env
REM edit .env with your DB_PASSWORD
python app.py
```

Runs on **http://localhost:5000**. A pre-trained model is already at
`ml-service/models/patient_risk_v1.pkl` — register it with the app once
running (see [API overview](#api-overview) below), or run
`python train_model.py` to retrain from `ml_patient_data`.

### 4. Monitoring service (Node/Express + Socket.IO)

```bash
cd monitoring-service
npm install
copy .env.example .env
REM edit .env with your DB_PASSWORD if not "postgres"
npm start
```

Runs on **http://localhost:4000** (REST + Socket.IO on the same port). The
5 default clinical rules were already seeded by `z_monitoring_schema.sql`
above; run `npm run db:seed` only if you applied the schema without it.
Needs at least one row in `ml_predictions` for whichever demo patient you
evaluate against — run a Prediction for that patient from ML Models first
(or `npm run simulate` for a scripted demo feed once rules + predictions
exist).

### 5. Frontend (React)

```bash
cd frontend
npm install
copy .env.example .env    REM optional — defaults already work for local dev
npm run dev
```

Runs on **http://localhost:5173**, with `/api` proxied to the backend
(see `vite.config.js`) and ML / monitoring calls going directly to
`http://127.0.0.1:5000` / `http://127.0.0.1:4000` (see `src/api/mlClient.js`
and `src/api/monitoringClient.js`).

## Environment variables

See the root `.env.example` for the full, documented list. Summary:

| Variable | Used by | Purpose |
|---|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | ml-service | Postgres connection |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | backend | Postgres connection (JDBC URL form) |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | monitoring-service | Postgres connection |
| `JWT_SECRET`, `JWT_EXPIRATION_MS` | backend | Auth token signing |
| `CORS_ALLOWED_ORIGINS` | backend | Allowed frontend origins |
| `CORS_ORIGIN` | monitoring-service | Allowed frontend origin |
| `KAFKA_BOOTSTRAP_SERVERS`, `KAFKA_VITALS_TOPIC*` | backend | Optional live vitals streaming |
| `VITE_API_BASE_URL` | frontend | Java backend base URL (defaults to `/api` via the dev proxy) |
| `VITE_ML_API_URL` | frontend | Flask ML service base URL |
| `VITE_MONITORING_API_URL` | frontend | Monitoring service base URL (REST + Socket.IO) |
| `ML_SERVICE_PORT`, `ML_SERVICE_URL` | ml-service / docs | ML service's own port and its externally-visible URL |
| `MONITORING_SERVICE_PORT`, `MONITORING_SERVICE_URL` | monitoring-service / docs | Monitoring service's own port and its externally-visible URL |

No real secrets are committed anywhere in this project — every `.env` is
git-ignored; only `.env.example` files (placeholders) are tracked.

## Authentication

Single source of truth: **Spring Security + JWT**, from Milestone 1
(`AuthController` / `AuthService` / `JwtUtil` / `JwtAuthFilter`).
Milestone 2's stand-alone demo-user auth (`localStorage`-only, no real
backend) was **not** carried forward — it has been fully replaced by this
real system. Milestone 3's own frontend had no auth at all and was not
carried forward either (see `docs/INTEGRATION_NOTES.md`). Login/register/
logout, `/api/auth/me` session restore, and role-based route protection
(`ProtectedRoute`, `SecurityConfig`) all work exactly as they did before
this integration.

**Demo credentials** (seeded by `backend/src/main/resources/data.sql`):

| Role | Email | Password |
|---|---|---|
| Admin | admin@medisphere.com | admin123 |
| Doctor | doctor@medisphere.com | doctor123 |
| Patient | patient@medisphere.com | patient123 |
| Receptionist | reception@medisphere.com | reception123 |

**Known limitation:** neither the Flask ML service nor the monitoring
service verify the JWT on incoming requests — each is reached only through
the frontend, whose `/ml/*` routes are gated by `ProtectedRoute` to
ADMIN/DOCTOR, but nothing stops a direct HTTP call to `ml-service:5000` or
`monitoring-service:4000` from bypassing that. This is acceptable for
services meant to sit behind a private network/VPC (their tables contain
no real patient PII — just demo feature rows), but **before any real
deployment**, add JWT verification to both (e.g. validate the same
`JWT_SECRET` with `pyjwt` / a Node JWT library) or put them behind the
same reverse proxy / auth gateway as the rest of the API.

## API overview

### Java backend (`http://localhost:8080/api`)
`/auth/login`, `/auth/register`, `/auth/me`, `/patients`, `/appointments`,
`/vitals` (+ WebSocket `/ws/vitals`), `/alerts`, `/careplans`, `/consent`,
`/twins`, `/reports`, `/predictions` (heuristic risk score — unchanged by
this integration). See each `*Controller.java` for exact routes/roles.

### ML service (`http://localhost:5000`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Health check |
| GET | `/models` | List all model versions, newest first |
| GET | `/models/active` | Get the currently active model |
| GET | `/models/<id>` | Get one model version |
| POST | `/models` | Register a new version (inserted as `Inactive`) |
| PUT | `/models/<id>/activate` | Activate a version (archives whatever was active) |
| PUT | `/models/<id>/archive` | Archive a version |
| POST | `/predict` | `{"patient_id": "P001"}` → prediction using the active model |
| GET | `/explain/<patient_id>` | SHAP explanation for that patient's latest prediction |

Example:

```bash
curl -X POST http://localhost:5000/models -H "Content-Type: application/json" -d "{\"model_name\":\"Patient Risk Prediction\",\"version_number\":\"v1.0\",\"algorithm\":\"Random Forest\",\"dataset_name\":\"ml_patient_data\",\"accuracy\":0.91,\"precision_score\":0.89,\"recall_score\":0.88,\"f1_score\":0.885,\"model_path\":\"models/patient_risk_v1.pkl\"}"

curl -X PUT http://localhost:5000/models/1/activate

curl -X POST http://localhost:5000/predict -H "Content-Type: application/json" -d "{\"patient_id\":\"P001\"}"

curl http://localhost:5000/explain/P001
```

### Monitoring service (`http://localhost:4000`)

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/rules` | List clinical rules (`?activeOnly=true` to filter) |
| POST | `/api/rules` | Create a rule |
| PATCH | `/api/rules/:id` | Update a rule (e.g. `{"isActive": false}`) |
| POST | `/api/monitoring/evaluate` | Run every active rule against one vitals reading |
| GET | `/api/monitoring/executions` | Full audit trail (fired and not-fired) |
| GET | `/api/notifications` | List notifications (`?patientId=&status=`) |
| PATCH | `/api/notifications/:id` | Update status, e.g. `{"status": "READ"}` |

Realtime: connect a Socket.IO client to the same origin/port; every client
auto-joins the global `notifications` room and receives a `notification:new`
event whenever a rule fires. See `monitoring-service/README.md` for the
full payload shape and the patient-specific room pattern.

Example:

```bash
curl -X POST http://localhost:4000/api/monitoring/evaluate \
  -H "Content-Type: application/json" \
  -d "{\"patient\":{\"id\":\"P001\",\"name\":\"P001\"},\"vitals\":{\"hr\":150,\"spo2\":85,\"systolic\":160,\"diastolic\":95,\"temp\":38.5,\"context\":\"At rest\"},\"history\":[]}"
```

## What was tested (in this sandbox)

- **ML service**: installed a real PostgreSQL 16 instance, applied all four
  `database/*.sql` files cleanly, installed `ml-service/requirements.txt`,
  and ran the Flask app for real. Verified end-to-end: register model
  (→ `Inactive`) → activate (→ `Active`, archives priors) → `POST /predict`
  for `P001` (real RandomForest inference, row written to `ml_predictions`)
  → `GET /explain/P001` (real SHAP values, written to `shap_explanations`)
  → archive → predict again correctly fails with "No active model version
  found." Also verified 404 for an unknown patient and 400 for a malformed
  request body.
- **Monitoring service**: applied the full `database/*.sql` sequence
  (including `z_monitoring_schema.sql`) against the same real Postgres 16
  instance, confirmed all foreign keys resolve, confirmed the 5 default
  rules seed correctly. Installed `monitoring-service`'s dependencies and
  ran the real server. Verified end-to-end: `GET /health` → `GET /api/rules`
  (5 seeded rules) → `POST /api/monitoring/evaluate` for `P001` with vitals
  crafted to trip 4 of the 5 rules (AFib pattern, low SpO2, hypertensive
  reading, elevated temperature) → all 4 fired correctly, each logged to
  `rule_executions` (plus one correctly-not-fired row for the 5th rule),
  each created a `notifications` row and transitioned `PENDING` → `SENT`
  → `GET /api/monitoring/executions` and `GET /api/notifications` both
  returned the expected rows.
- **Frontend**: `npm install && npm run build` succeeds with the merged
  codebase (Milestone 1 pages + the ML pages + the new Continuous
  Monitoring page). No new compile/import errors were introduced.
- **Database**: confirmed no table-name collisions after the
  `predictions` → `ml_predictions` rename, and confirmed
  `z_monitoring_schema.sql`'s foreign keys resolve correctly against
  `ml_predictions` / `ml_patient_data` (its original FK targets,
  `predictions(prediction_id)` / `patients(patient_id)`, do not exist in
  this schema and would have failed — see `docs/INTEGRATION_NOTES.md`).

## What could not be tested here

- **The Spring Boot backend could not be built or run in this sandbox** —
  the sandbox's network allowlist doesn't include Maven Central, so
  `mvn clean package` cannot download dependencies. The backend code
  itself is **unmodified from the working Milestone 1 project** (no
  merge-related changes were made to `backend/`), and was reviewed
  statically (controllers, services, repositories, entities, DTOs,
  `SecurityConfig`, `application.yml`) rather than executed. Build and run
  it locally with the commands above to verify — it's expected to work
  exactly as it did before this integration, since nothing under
  `backend/` was changed.
- **The Docker Compose stack itself could not be run in this sandbox** (no
  Docker daemon available) — each service was instead verified directly
  against a real local Postgres, and every `docker-compose.yml` change was
  reviewed for correctness (service definitions, `depends_on`, env vars,
  port mappings, init-script mount order). Run `docker compose up -d --build`
  locally to bring up the full stack; if anything doesn't match what's
  described here, check `docker compose logs <service>` first.
- Live vitals streaming (Kafka) was not exercised.
- The Analytics and Federated Training pages are intentionally
  UI-mockups-only (see above) — there's nothing live to test there yet.
- The monitoring page's Socket.IO live-push path (`notification:new`
  arriving in the browser in real time) was verified at the protocol level
  by inspecting `monitoring-service/src/sockets/index.js` and the
  frontend's `monitoringSocket.js`, but not click-tested in an actual
  browser (no browser available in this sandbox) — the REST path that
  creates and persists the same notifications was fully verified (see
  above).

## Troubleshooting

- **Frontend can't reach the ML service (network error on `/ml/models`
  etc.)** — confirm `ml-service` is running on port 5000 and check its
  CORS list in `ml-service/app.py` includes your frontend's origin
  (`http://localhost:5173` for `npm run dev`, or update it for a
  different port/host).
- **Frontend can't reach the monitoring service (network error on
  `/ml/monitoring`)** — confirm `monitoring-service` is running on port
  4000 and that `CORS_ORIGIN` in its `.env` matches your frontend's origin.
- **`POST /api/monitoring/evaluate` returns 422 "No prediction found"** —
  that demo patient needs a row in `ml_predictions` first; run a Prediction
  for them from ML Models → Prediction, then try again.
- **`psycopg2.OperationalError` from ml-service** — check `ml-service/.env`
  matches your actual Postgres credentials/port, and that the ML tables
  exist (`database/README.md`).
- **Backend won't start / Hibernate errors** — check `DB_URL` /
  `DB_USERNAME` / `DB_PASSWORD` match a real, reachable Postgres instance,
  and that nothing else is using port 8080.
- **`/predict` returns "Patient 'X' was not found."** — use one of the
  ML demo IDs (`P001`, `P002`, `P003`), not a numeric patient ID from the
  main app — they're different tables (see `database/README.md`).
- **`/explain/<id>` returns "has no prediction yet"** — call `POST
  /predict` for that patient first; SHAP explains the most recent
  prediction, it doesn't generate one.
- **CORS errors in the browser console** — the backend's allowed origins
  come from `CORS_ALLOWED_ORIGINS`; the ML service's are hardcoded in
  `ml-service/app.py`'s `CORS(...)` call. Both need your frontend's actual
  origin.
EOF
