# MediSphere — Fullstack (Patient 360)

One project, two ways to run it:

```
medisphere-fullstack/
  backend/    Spring Boot API + WebSocket + Kafka consumer (Java 17, Maven)
              — also serves the built frontend as static files, so
                `mvn spring-boot:run` (or the packaged .jar) alone
                gives you the WHOLE app on one port.
  frontend/   React + Vite source (edit here, then rebuild into backend/)
  docker-compose.yml   Local Kafka broker (KRaft mode) for vitals streaming
```

The `backend/src/main/resources/static/` folder already contains a
production build of the frontend, wired to call the API at the
same-origin relative path `/api` (see `frontend/.env`:
`VITE_API_BASE_URL=/api`). That means **one running process, one URL,
no CORS to configure** — exactly what you want for "one host link".

## Run it (single artifact, closest to how you'll deploy it)

```bash
# 1. Start Kafka (optional but needed for live vitals streaming)
docker compose up -d

# 2. Build and run the backend (which also serves the frontend)
cd backend
mvn clean package
java -jar target/backend-0.1.0.jar
```

Set your PostgreSQL connection first (env vars, see `backend/README.md`).
Note PostgreSQL needs the `medisphere` database created ahead of time
(`CREATE DATABASE medisphere;` — there's no MySQL-style auto-create):
```bash
export DB_URL="jdbc:postgresql://localhost:5432/medisphere"
export DB_USERNAME=postgres
export DB_PASSWORD=yourpassword
```

Open **http://localhost:8080** — that's the full app: login page,
dashboards, Patient 360, everything. Demo login:
`admin@medisphere.com` / `admin123` (or doctor/patient/reception,
same passwords as before). Open a Patient 360 page and the vitals
panel will show live readings once Kafka is running.

## If you're actively editing the frontend

Run the two dev servers separately (hot reload, etc.) like before:
```bash
# terminal 1
cd backend && mvn spring-boot:run          # API on :8080

# terminal 2
cd frontend && npm install && npm run dev  # UI on :5173, proxies to :8080
```
For this mode, temporarily set `frontend/.env` back to
`VITE_API_BASE_URL=http://localhost:8080/api`. When you're done
editing, rebuild and re-embed the static files:
```bash
cd frontend
# .env: VITE_API_BASE_URL=/api  (relative, for the combined build)
npm run build
rm -rf ../backend/src/main/resources/static/*
cp -r dist/* ../backend/src/main/resources/static/
```

## Deploying so it's reachable globally

You need three things publicly hosted: the PostgreSQL database, Kafka,
and this backend (which now bundles the frontend). See
`backend/README.md` → "Deploying so it's reachable globally" for the
full step-by-step (Railway/Render for the database + backend, Upstash
or Confluent Cloud for Kafka's free tier). Kafka is the only
optional piece — the app runs fine without it, vitals just won't
stream.

That gives you one public URL — e.g.
`https://medisphere-production.up.railway.app` — and that's your
share-able "host link".

## What's implemented (Patient 360 scope)

- Login (JWT), patient CRUD, allergies/prescriptions/appointment
  history per patient
- Appointment CRUD + status updates, role-based dashboard summary
- **Consent management** — per-patient consent toggles + an immutable
  audit trail (`GET/PATCH /api/patients/{id}/consents`, `GET
  .../audit-log`), plus a standalone `POST /api/consent/verify` for
  staff-facing verification. Fully wired end-to-end: frontend calls
  the real API in `consentService.js`, backend persists every change.
- **Live vitals over Kafka** — a simulated bedside-monitor producer
  publishes readings to a `vitals.raw` topic; a consumer persists them
  and pushes live updates to the browser over WebSocket. See
  `backend/README.md` → "Kafka vitals streaming" for the full data
  flow and how to swap in real monitors later.

See `backend/README.md` for the full endpoint list.
