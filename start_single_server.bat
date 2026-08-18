@echo off
setlocal enabledelayedexpansion
title UrbanPulse AI Platform Launcher

:: Navigate to script directory
cd /d "%~dp0"

echo ==================================================================
echo   URBANPULSE AI - UNIFIED PLATFORM LAUNCHER
echo ==================================================================
echo.

:: Automatically free port 8000 if previously occupied
powershell -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

if exist "%~dp0.venv\Scripts\python.exe" (
    echo [INFO] Found Virtual Environment: .venv\Scripts\python.exe
    echo [INFO] Starting UrbanPulse AI Single Server on http://127.0.0.1:8000 ...
    echo.
    "%~dp0.venv\Scripts\python.exe" run.py
) else (
    echo [INFO] Using System Python...
    echo [INFO] Starting UrbanPulse AI Single Server on http://127.0.0.1:8000 ...
    echo.
    python run.py
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ==================================================================
    echo [ERROR] Server execution stopped with error code %ERRORLEVEL%.
    echo ==================================================================
)

echo.
echo Press any key to exit...
pause >nul
