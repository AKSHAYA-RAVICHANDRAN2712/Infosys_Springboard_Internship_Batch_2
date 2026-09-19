@echo off
setlocal
if "%DB_PASSWORD%"=="" (
  echo ERROR: Set DB_PASSWORD first.
  echo Example: set DB_PASSWORD=your_database_password
  exit /b 1
)
start "FHIR Validation - 8080" cmd /k "cd /d %~dp0fhir-validation && mvnw.cmd spring-boot:run"
start "Patient Consent - 8081" cmd /k "cd /d %~dp0patient-consent-verification-main && mvnw.cmd spring-boot:run"
start "Audit Service - 8082" cmd /k "cd /d %~dp0audit-service && mvnw.cmd spring-boot:run"
echo Started the three backend services in separate windows.
