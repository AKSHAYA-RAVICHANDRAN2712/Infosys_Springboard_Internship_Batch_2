# MediSphere Milestone 4 — Team C — Final Working Structure

This package keeps the three backends separate and gives them one shared frontend:

- 01-Clinical-Guideline-Compliance → port 8102
- 02-Careplan-Safety-Checks → port 8100
- 03-Drug-Interaction-Validation → port 8101
- 04-Frontend → common UI

All backends use the same Render PostgreSQL database and isolated tables.

## Database

The application.properties files are preconfigured for the current Render database used during setup:
- host: dpg-dacldk7avr4c73flcg60-a.singapore-postgres.render.com
- database: healthcare_teamc_db
- username: teamc
- SSL required

The password is included because the owner explicitly requested it in this presentation build. Do NOT commit these application.properties files to a public GitHub repository. Rotate the Render password after the presentation.

## Run in IntelliJ

Open each backend as a separate Maven project and run its main application class.

1. ClinicalGuidelineComplianceApplication → 8102
2. CareplanSafetyApplication → 8100
3. DrugInteractionValidationApplication → 8101

The first start creates the tables and seeds the clinical guideline + drug interaction data.

## Frontend

Serve 04-Frontend with Python from a terminal:

    cd 04-Frontend
    python -m http.server 5500

Open:
    http://localhost:5500

## API endpoints

Clinical:
- GET  /api/clinical-guidelines/health
- GET  /api/clinical-guidelines
- POST /api/clinical-guidelines/check

Careplan:
- GET  /api/careplans/health
- POST /api/careplans/safety-check
- GET  /api/careplans/history/{patientId}

Drug:
- GET  /api/interactions/health
- GET  /api/interactions/medicines
- POST /api/interactions/check

## Important credential note

The new Render database has its own password from the current External Database URL. The old database password does not automatically work against this new database. This package therefore uses the CURRENT Render database credential so the project matches the database that was actually created.
