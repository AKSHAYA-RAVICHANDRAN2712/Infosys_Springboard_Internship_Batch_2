# MediSphere — Fullstack (Patient 360)

One project, two ways to run it:

```
medisphere-fullstack/
  backend/    Spring Boot API + WebSocket (Java 17, Maven)
              — also serves the built frontend as static files, so
                `mvn spring-boot:run` (or the packaged .jar) alone
                gives you the WHOLE app on one port.
  frontend/   React + Vite source (edit here, then rebuild into backend/)
```

The `backend/src/main/resources/static/` folder already contains a
production build of the frontend, wired to call the API at the
same-origin relative path `/api` (see `frontend/.env`:
`VITE_API_BASE_URL=/api`). That means **one running process, one URL,
no CORS to configure** — exactly what you want for "one host link".

## Run it (single artifact, closest to how you'll deploy it)

```bash
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
same passwords as before).

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

Because it's one Spring Boot app now, you only need to deploy **two**
things instead of three:

1. **Database** — managed PostgreSQL on [Railway](https://railway.app), [Render](https://render.com), [Supabase](https://supabase.com), or [Neon](https://neon.tech) (all have free tiers).
2. **This backend** (which now includes the frontend) — deploy the
   `backend/` folder to [Railway](https://railway.app) or
   [Render](https://render.com). Both auto-detect Maven/Spring Boot.
   Set env vars in their dashboard:
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (from step 1)
   - `JWT_SECRET` — a long random string, don't reuse the default
   - `SQL_INIT_MODE=always` for the first deploy (seeds demo data), then switch to `never`
   - `CORS_ALLOWED_ORIGINS` — can stay as-is since everything's same-origin now, but harmless to set anyway

That platform gives you one public URL — e.g.
`https://medisphere-production.up.railway.app` — and that's your
share-able "host link": open it in a browser and the whole app (UI +
API + live vitals) works from that single address.

## What's implemented (Patient 360 scope)

See `backend/README.md` for the full endpoint list. In short: login,
patient CRUD, allergies/prescriptions/appointment-history per patient,
consent management + audit trail, and live vitals over WebSocket.
Appointment booking and role dashboards aren't built yet.
