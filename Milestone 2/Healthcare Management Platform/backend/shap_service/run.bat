@echo off
cd /d %~dp0\..\..
set PYTHONPATH=%CD%
python -m backend.shap_service.app
