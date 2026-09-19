@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo MediSphere - Local Run using Render PostgreSQL
echo ============================================================
echo.
echo Paste the Render EXTERNAL PostgreSQL URL when asked.
echo Do not add "jdbc:" to the beginning.
echo Example: postgresql://user:password@host:5432/database?sslmode=require
echo.
set /p "DATABASE_URL=External Database URL: "
if "%DATABASE_URL%"=="" (
  echo ERROR: DATABASE_URL is required.
  exit /b 1
)
set /p "DB_PASSWORD=Database password: "
if "%DB_PASSWORD%"=="" (
  echo ERROR: DB_PASSWORD is required.
  exit /b 1
)
set "DB_USERNAME=medisphere_user"

set "MEDISPHERE_DATABASE_URL=%DATABASE_URL%"
set "MEDISPHERE_DB_USERNAME=%DB_USERNAME%"
set "MEDISPHERE_DB_PASSWORD=%DB_PASSWORD%"

echo.
echo Database settings loaded for this CMD session.
echo Starting the Java backends...
echo.
call "%~dp0start-all-backends.bat"
