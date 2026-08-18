@echo off
title UrbanPulse AI Platform
cls

echo ==================================================================
echo   URBANPULSE AI - UNIFIED SINGLE-SERVER PLATFORM
echo ==================================================================
echo.

:: Navigate to script directory
cd /d "%~dp0"

:: Detect Python executable (.venv virtualenv or system python)
set "PYTHON_EXE=python"
if exist "%~dp0.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0.venv\Scripts\python.exe"
    echo [INFO] Using Virtual Environment: .venv\Scripts\python.exe
) else (
    echo [INFO] Using System Python
)

:: Check and install frontend dependencies if node_modules is missing
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [1/3] Installing frontend node dependencies...
    call npm install
)

:: Build React production bundle if dist is missing
if not exist "dist\index.html" (
    echo [2/3] Building React frontend production bundle...
    call npm run build
) else (
    echo [2/3] Production frontend build verified.
)

:: Return to project root
cd /d "%~dp0"

echo [3/3] Launching UrbanPulse AI Single Server...
echo.
echo ==================================================================
echo  App URL: http://127.0.0.1:8000
echo  API Docs: http://127.0.0.1:8000/docs
echo ==================================================================
echo.

:: Automatically launch default browser
start "" "http://127.0.0.1:8000"

:: Start Python Unified Server
"%PYTHON_EXE%" run.py

pause
