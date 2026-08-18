@echo off
title UrbanPulse AI Single-Server Platform
echo ==================================================================
echo  URBANPULSE AI — UNIFIED SINGLE-SERVER PLATFORM (FRONTEND + BACKEND)
echo ==================================================================
echo.

cd /d "%~dp0frontend"
if not exist "dist\index.html" (
    echo [1/2] Building React production frontend bundle...
    call npm run build
) else (
    echo [1/2] Production frontend build found.
)

cd /d "%~dp0"
echo [2/2] Starting Unified FastAPI Single Server on http://127.0.0.1:8000 ...
echo.
python run.py
pause
