# MediSphere Team-C Deployment

## 1. Backend services on Render
Create three Render Web Services from this repository/branch, each using Docker:

- `audit-service`
- `fhir-validation`
- `patient-consent-verification-main`

For each service, add the environment variable:
- `DB_PASSWORD` = your Render PostgreSQL password

For FHIR and Patient Consent also add:
- `AUDIT_SERVICE_URL` = the deployed Audit service URL, for example `https://medisphere-audit.onrender.com`

The applications use `${PORT:...}`, so Render's `PORT` is used automatically.

## 2. Frontend
Deploy `Frontend/frontend` as a Render Static Site.

After the three backend services are deployed, open `Frontend/frontend/api-config.js` and replace:
- `YOUR-FHIR-SERVICE-URL`
- `YOUR-CONSENT-SERVICE-URL`
- `YOUR-AUDIT-SERVICE-URL`

with the actual Render service hostnames. Commit/push that change and redeploy the static site.

## 3. Database
All three services use the existing Render PostgreSQL database. Keep the password in Render Environment Variables; do not commit it to GitHub.

## 4. Local test
The local defaults remain:
- FHIR: 8083
- Consent: 8081
- Audit: 8082

## 5. Important
Do not upload `.idea/` or `target/` folders to GitHub. This deployment copy removes generated build output and IDE metadata.
