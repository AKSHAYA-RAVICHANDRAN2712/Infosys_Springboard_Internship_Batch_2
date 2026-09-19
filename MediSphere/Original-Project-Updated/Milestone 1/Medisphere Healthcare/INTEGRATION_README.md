# MediSphere Team-C Integration

## Services
- FHIR Validation: `http://localhost:8080`
- Patient Consent Verification: `http://localhost:8081`
- HIPAA Audit Service: `http://localhost:8082`
- Frontend: serve the `frontend` folder with IntelliJ Live Server, VS Code Live Server, or another static HTTP server.

## Flow
1. Frontend uploads a FHIR Patient JSON.
2. FHIR service validates the resource and saves a valid patient into PostgreSQL.
3. FHIR service calls Audit Service and creates a HIPAA audit log for success/failure.
4. Patient Consent page calls the Consent service.
5. Consent service reads the same `patients` table created by FHIR validation.
6. Consent service calls Audit Service for every verification attempt.
7. Audit Logs page reads the real audit records from PostgreSQL through the Audit Service.

## Database
All three services use the same PostgreSQL database. Set the environment variable `DB_PASSWORD` before starting the services. The database URL and username remain in each service's `application.properties`.

> The original project contained a database password in source control. It has been removed from the updated files. Rotate that database password in Render/PostgreSQL if the old credential was ever shared outside the team.

## Run in IntelliJ
Open each backend as a separate Spring Boot application and run: `FhirValidationApplication`, `PatientConsentVerificationApplication`, and `AuditServiceApplication`. Make sure the run configuration has `DB_PASSWORD` set.

Then serve `frontend/` over HTTP and open `index.html`.

## Test URLs
- FHIR health: `GET http://localhost:8080/api/fhir/patient/health`
- Consent health: `GET http://localhost:8081/api/consent/health`
- Consent patients: `GET http://localhost:8081/api/consent/patients`
- Audit health: `GET http://localhost:8082/api/audit/health`
- Audit logs: `GET http://localhost:8082/api/audit/logs`

## FHIR sample JSON
```json
{
  "resourceType": "Patient",
  "id": "P2001",
  "active": true,
  "gender": "male",
  "birthDate": "2000-01-15"
}
```

Use a new patient ID for each successful test because duplicate IDs are intentionally rejected.
