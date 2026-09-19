MediSphere - Integrated Frontend
================================

This ZIP contains the MediSphere frontend UI supplied by the Team C project,
with the frontend integration cleaned up and connected to the backend APIs that
are known from the current Team C services.

Backend targets
---------------
FHIR Validation : http://localhost:8083
Patient Consent : http://localhost:8081 (automatic fallback to http://localhost:8080)
HIPAA Audit     : http://localhost:8082

Connected endpoints
-------------------
Patient Consent
  GET  /api/consent/patients
  POST /api/consent/verify

FHIR Validation
  POST /api/fhir/patient/validate

HIPAA Audit
  GET /api/audit/logs

What was fixed
--------------
1. Centralized API configuration in api-config.js.
2. Removed duplicate Patient Consent submit handling from app.js.
3. Added one shared script.js integration layer.
4. Added Patient Consent patient-ID loading with the backend endpoint.
5. Added automatic consent-port fallback between 8081 and 8080.
6. Added FHIR JSON upload -> backend validation integration.
7. Added dynamic FHIR result rendering and donut status update.
8. Added Audit Log table loading from the backend and dynamic success/failure totals.
9. Kept the supplied UI design and pages intact.

Important backend limitation
----------------------------
The Patient Consent backend currently documented in the project exposes
verification and patient-ID retrieval. It does not expose an endpoint that
returns the complete consent table shown in the UI (patient name, consent date,
expiry date, granted/pending/revoked records, view/delete operations). Those
rows therefore remain the supplied UI data rather than inventing a backend API
that the service does not currently provide.

Running the frontend
--------------------
Use VS Code Live Server (recommended), for example:
  http://127.0.0.1:5500/index.html

Then start the three Spring Boot services on their configured ports.

If the browser reports a CORS error
-----------------------------------
The backend must allow requests from the frontend origin, for example:
  http://127.0.0.1:5500

The frontend cannot bypass browser CORS rules by itself.

Recommended test order
----------------------
1. Open index.html.
2. Open Patient Consent and click Refresh Patients.
3. Verify a known patient such as P1001 using the form.
4. Open FHIR Validation and upload a Patient JSON resource.
5. Open HIPAA Audit Logs and click Refresh.
