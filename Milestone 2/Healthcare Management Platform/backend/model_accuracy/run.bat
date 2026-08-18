@echo off
cd /d %~dp0\..\..
set PYTHONPATH=%CD%
python -m uvicorn backend.model_accuracy.main:app --host 0.0.0.0 --port 8091 --reload
