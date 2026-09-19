@echo off
cd /d "%~dp0"
echo Starting Unified Dashboard on http://127.0.0.1:5500
python -m http.server 5500 --directory Unified-Dashboard
