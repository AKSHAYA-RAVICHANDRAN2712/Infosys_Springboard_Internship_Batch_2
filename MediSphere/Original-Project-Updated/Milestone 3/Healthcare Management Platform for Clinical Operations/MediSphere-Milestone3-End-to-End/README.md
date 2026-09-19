# MediSphere Milestone 3 - End-to-End Integrated Project

## What this project contains
- Vitals Range Validation (Java/Spring Boot)
- Anomaly Detection Precision >85% (Python/Flask ML + Java integration)
- Alert Fatigue Prevention (Java/Spring Boot)
- Dynamic frontend served by Spring Boot
- PostgreSQL integration using the shared `medisphere` database

## Start
1. Install JDK 21+ (JDK 25 also works).
2. Install Python 3.11+.
3. Update the PostgreSQL password in `src/main/resources/application.properties` after Nilesh rotates it.
4. On Windows, run `start-all.bat`.
5. Open http://localhost:8080/

## Services
- Spring Boot: http://localhost:8080
- Python ML: http://localhost:5001
- Swagger: http://localhost:8080/swagger-ui.html

## Main endpoints
- POST `/api/vitals`
- GET `/api/vitals/recent`
- POST `/api/anomaly/detect`
- GET `/api/anomaly/health`
- GET `/api/anomaly/precision`
- POST `/api/alerts`
- GET `/api/alerts/recent`
- GET `/api/alerts/metrics`
- POST `/api/alerts/{id}/acknowledge`
- POST `/api/alerts/{id}/escalate`
- GET `/api/dashboard`

## Database
The project connects to the shared PostgreSQL database `medisphere`. It maps the existing `vitals` table without assuming a `created_at` column, because the supplied team schema did not list one. It creates/uses two Milestone 3 tables:
- `alert_fatigue`
- `m3_anomaly_record`

See `DB_SETUP.sql` for the SQL definition.

## End-to-end behavior
1. Vitals are submitted to `/api/vitals`.
2. Raja's range checks mark each vital as NORMAL/HIGH/LOW and store the reading in `vitals`.
3. Any out-of-range reading creates a `VITALS_OUT_OF_RANGE` event and sends it to Alert Fatigue Prevention.
4. `/api/anomaly/detect` sends six vital fields to the Python ML service.
5. When an anomaly is detected, Java stores the result in `m3_anomaly_record` and sends an `ANOMALY_DETECTED` event through Alert Fatigue Prevention.
6. Alert Fatigue Prevention checks recent patient+alert-type history. Repeats inside the configurable 5-minute window are suppressed; critical/worsening alerts are escalated.
7. The frontend reads the live APIs. It does not generate random/fake production metrics.

## Precision note
The included benchmark is a generated project evaluation dataset, provided so the application can demonstrate the precision workflow. It is not a clinical validation or diagnostic claim.

## Security note
This package contains the database credential that was explicitly supplied for this deployment setup. Rotate that password and remove credentials from version control before sharing or publishing the repository.
