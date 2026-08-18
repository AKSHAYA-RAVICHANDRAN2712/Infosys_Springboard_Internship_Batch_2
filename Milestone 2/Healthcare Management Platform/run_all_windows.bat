@echo off
setlocal
cd /d %~dp0
if not exist .env (
  echo .env not found. Copy .env.example to .env and set DATABASE_URL first.
  pause
  exit /b 1
)
if not exist venv\Scripts\python.exe (
  echo Creating shared Python environment...
  python -m venv venv
)
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r requirements-common.txt
python -m pip install -r backend\model_accuracy\requirements.txt
python -m pip install -r backend\federated_service\requirements.txt
python -m pip install -r backend\shap_service\requirements.txt
set PYTHONPATH=%CD%
python scripts\init_db.py
start "MediSphere Model Accuracy" cmd /k "cd /d %CD% && call venv\Scripts\activate.bat && set PYTHONPATH=%CD% && python -m uvicorn backend.model_accuracy.main:app --host 0.0.0.0 --port 8091"
start "MediSphere Federated" cmd /k "cd /d %CD% && call venv\Scripts\activate.bat && set PYTHONPATH=%CD% && python -m uvicorn backend.federated_service.app.main:app --host 0.0.0.0 --port 8092"
start "MediSphere SHAP" cmd /k "cd /d %CD% && call venv\Scripts\activate.bat && set PYTHONPATH=%CD% && python -m backend.shap_service.app"
start "MediSphere Frontend" cmd /k "cd /d %CD% && call venv\Scripts\activate.bat && python -m http.server 5500 --directory frontend"
echo.
echo Services starting:
echo Frontend: http://127.0.0.1:5500
 echo Model Accuracy: http://127.0.0.1:8091/docs
 echo Federated: http://127.0.0.1:8092/docs
 echo SHAP: http://127.0.0.1:8093/api/health
pause
