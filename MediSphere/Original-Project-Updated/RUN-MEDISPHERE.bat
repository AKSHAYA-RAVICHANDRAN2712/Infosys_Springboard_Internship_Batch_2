@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo MediSphere - RUN ALL BACKEND COMPONENTS
 echo Render PostgreSQL configuration is already included.
echo ============================================================
echo.

if not exist "Milestone 2\Healthcare Management Platform\venv\Scripts\python.exe" (
  echo ERROR: M2 Python environment is missing.
  echo Open a terminal in "Milestone 2\Healthcare Management Platform" and run run_all_windows.bat once.
  pause
  exit /b 1
)

REM ---------- Milestone 1 ----------
start "M1 - Patient Consent (8081)" /D "%~dp0Milestone 1\Medisphere Healthcare\patient-consent-verification-main" cmd /k "mvnw.cmd spring-boot:run"
start "M1 - Audit Service (8082)" /D "%~dp0Milestone 1\Medisphere Healthcare\audit-service" cmd /k "mvnw.cmd spring-boot:run"
start "M1 - FHIR Validation (8083)" /D "%~dp0Milestone 1\Medisphere Healthcare\fhir-validation" cmd /k "mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

REM ---------- Milestone 2 ----------
start "M2 - Model Accuracy (8091)" /D "%~dp0Milestone 2\Healthcare Management Platform" cmd /k "call venv\Scripts\activate.bat && set PYTHONPATH=. && python -m uvicorn backend.model_accuracy.main:app --host 0.0.0.0 --port 8091"
start "M2 - Federated (8092)" /D "%~dp0Milestone 2\Healthcare Management Platform" cmd /k "call venv\Scripts\activate.bat && set PYTHONPATH=. && python -m uvicorn backend.federated_service.app.main:app --host 0.0.0.0 --port 8092"
start "M2 - SHAP Python (8093)" /D "%~dp0Milestone 2\Healthcare Management Platform" cmd /k "call venv\Scripts\activate.bat && set PYTHONPATH=. && set PORT=8093 && python -m backend.shap_service.app"
start "M2 - SHAP Spring Boot (8094)" /D "%~dp0Milestone 2\Healthcare Management Platform\legacy\shap-spring-boot" cmd /k "mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

REM ---------- Milestone 3 ----------
start "M3 - Spring Boot (8080)" /D "%~dp0Milestone 3\Healthcare Management Platform for Clinical Operations\MediSphere-Milestone3-End-to-End" cmd /k "mvnw.cmd spring-boot:run"

set "M3ML=%~dp0Milestone 3\Healthcare Management Platform for Clinical Operations\MediSphere-Milestone3-End-to-End\ml-service"
if not exist "%M3ML%\venv\Scripts\python.exe" (
  echo Creating M3 Python environment. This may take a few minutes...
  where py >nul 2>&1
  if not errorlevel 1 (set "PY=py") else (set "PY=python")
  %PY% -m venv "%M3ML%\venv"
  call "%M3ML%\venv\Scripts\activate.bat"
  python -m pip install -r "%M3ML%\requirements.txt"
  deactivate
)
start "M3 - Python ML (5001)" /D "%M3ML%" cmd /k "call venv\Scripts\activate.bat && python app.py"

timeout /t 3 /nobreak >nul

REM ---------- Milestone 4 ----------
where mvn >nul 2>&1
if errorlevel 1 (
  echo WARNING: Maven command not found. M4 services cannot start with the current project structure.
  echo Install Maven or open the M4 projects in an IDE configured with Maven.
) else (
  start "M4 - Careplan (8100)" /D "%~dp0Milestone 4\Healthcare Managment Platform\02-Careplan-Safety-Checks" cmd /k "mvn spring-boot:run"
  start "M4 - Drug Interaction (8101)" /D "%~dp0Milestone 4\Healthcare Managment Platform\03-Drug-Interaction-Validation" cmd /k "mvn spring-boot:run"
  start "M4 - Clinical Guideline (8102)" /D "%~dp0Milestone 4\Healthcare Managment Platform\01-Clinical-Guideline-Compliance" cmd /k "mvn spring-boot:run"
)

echo.
echo ============================================================
start "MediSphere Unified Dashboard (5500)" /D "%~dp0..\Unified-Dashboard" cmd /k "python -m http.server 5500 --directory ."
timeout /t 2 /nobreak >nul
start http://127.0.0.1:5500
echo Launch commands sent.
echo Check each CMD window for a final "Started ..." message.
echo ============================================================
echo M1 Patient Consent : 8081
echo M1 Audit           : 8082
echo M1 FHIR            : 8083
echo M2 Model Accuracy  : 8091
echo M2 Federated       : 8092
echo M2 SHAP Python     : 8093
echo M2 SHAP Spring     : 8094
echo M3 Backend         : 8080
echo M3 Python ML       : 5001
echo M4 Careplan        : 8100
echo M4 Drug Interaction: 8101
echo M4 Guideline       : 8102
echo ============================================================
pause
endlocal
