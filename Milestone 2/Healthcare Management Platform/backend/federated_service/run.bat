@echo off
cd /d %~dp0\..\..
set PYTHONPATH=%CD%
python -m backend.federated_service.app.main
