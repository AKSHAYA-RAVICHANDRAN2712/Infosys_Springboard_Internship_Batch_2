# MediSphere — Local Run with Render PostgreSQL

This package keeps the supplied MediSphere frontend/layout and project folder structure. Backend/database logic has been cleaned up so local Spring Boot services use the Render PostgreSQL database instead of the old H2/old Render configurations.

## 1. Database

Render PostgreSQL database:

- Database: `medisphere_ohxq`
- Username: `medisphere_user`
- Port: `5432`

For local development use the Render **External Database URL**. Do not commit that URL or its password.

## 2. First run

Run:

`SETUP-LOCAL-RENDER-DB.bat`

It asks for:

- Render External Database URL (paste it exactly as copied from Render, without `jdbc:`)
- Render database password

The values are kept in the current CMD session and passed to the backend processes. Nothing is written into the source files.

## 3. Start services

The launcher starts the Java services on their existing ports:

- FHIR Validation — 8083
- Patient Consent — 8081
- HIPAA Audit — 8082
- Milestone 3 — 8080
- Clinical Guideline — 8102
- Careplan Safety — 8100
- Drug Interaction — 8101

Milestone 2 Python services are also launched when their existing runner is available. Their Python dependencies must be installed from the supplied requirements files.

## 4. Unified Dashboard

Open `Unified-Dashboard/index.html` using VS Code Live Server (recommended) or another local static web server.

The supplied visual design is preserved. The small `Unified Project Dashboard` text under the MediSphere brand was removed as requested.

## 5. Patient/consent data

The Patient Consent service now initializes the shared `patients` table with the supplied dashboard patient records (P1001–P1005) if they do not already exist. It also initializes `patient_consents` with the corresponding consent records. Running the service again does not duplicate those records.

Therefore, entering `P1001` in Patient Consent should query the same PostgreSQL database that was initialized by the service rather than an isolated H2 file.

## 6. Important

- Do not manually create the application tables in Render.
- Do not use the old `teamc`/`healthcare_teamc_db` credentials from earlier project files.
- The new configuration uses environment variables: `DATABASE_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
- For deployment on Render later, switch the services to the Render Internal Database URL. The application code does not need a second database schema for deployment.
