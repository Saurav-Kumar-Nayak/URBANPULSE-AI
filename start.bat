@echo off
setlocal
title UrbanPulse AI - Smart City Operations Platform
cd /d "%~dp0"

echo ==================================================================
echo   URBANPULSE AI - SMART CITY OPERATIONS PLATFORM
echo ==================================================================
echo.

:: Detect Python environment
if exist ".venv\Scripts\python.exe" (
    set "PYTHON_CMD=.venv\Scripts\python.exe"
    echo [*] Using project virtual environment (.venv)
) else (
    set "PYTHON_CMD=python"
    echo [*] Using system Python
)

:: Validate Python
"%PYTHON_CMD%" --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python was not found!
    echo Please make sure Python 3.10+ is installed or .venv exists.
    echo.
    pause
    exit /b 1
)

echo [*] Starting unified server...
echo [*] Your browser will open automatically at http://localhost:8000
echo.
echo Press Ctrl+C at any time to stop the server.
echo ==================================================================
echo.

"%PYTHON_CMD%" run.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo [!] Server stopped with exit code %ERRORLEVEL%.
    pause
)

