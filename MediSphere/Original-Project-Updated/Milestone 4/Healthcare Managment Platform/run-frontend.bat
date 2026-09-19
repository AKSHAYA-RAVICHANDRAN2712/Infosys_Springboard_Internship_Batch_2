@echo off
cd /d "%~dp0\04-Frontend"
python -m http.server 5500
pause
