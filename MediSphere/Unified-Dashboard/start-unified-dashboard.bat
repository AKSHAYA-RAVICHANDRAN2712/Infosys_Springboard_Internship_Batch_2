@echo off
cd /d "%~dp0"
start "MediSphere Unified Dashboard - 5500" cmd /k "python -m http.server 5500 --directory ."
timeout /t 2 /nobreak >nul
start http://127.0.0.1:5500
