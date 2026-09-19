@echo off
cd /d "%~dp0ml-service"
where py >nul 2>&1
if %errorlevel%==0 (set PY=py) else (set PY=python)
if not exist "venv\Scripts\python.exe" %PY% -m venv venv
call venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python app.py
