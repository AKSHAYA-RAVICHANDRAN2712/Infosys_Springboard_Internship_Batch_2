@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo MediSphere Milestone 3 - Starting services
echo ============================================
where py >nul 2>&1
if %errorlevel%==0 (set PY=py) else (set PY=python)
if not exist "ml-service\venv\Scripts\python.exe" (
  echo Creating Python virtual environment...
  %PY% -m venv ml-service\venv
)
call ml-service\venv\Scripts\activate.bat
python -m pip install -r ml-service\requirements.txt
start "MediSphere Python ML" cmd /k "cd /d %~dp0ml-service && call venv\Scripts\activate.bat && python app.py"
timeout /t 3 /nobreak >nul
echo Starting Spring Boot backend...
call mvnw.cmd spring-boot:run
endlocal
