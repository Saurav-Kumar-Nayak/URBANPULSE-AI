@echo off
setlocal enabledelayedexpansion
title UrbanPulse AI Platform Launcher

:: Navigate to folder containing this bat file
cd /d "%~dp0"

echo ==================================================================
echo   URBANPULSE AI - UNIFIED PLATFORM LAUNCHER
echo ==================================================================
echo.

if exist "%~dp0.venv\Scripts\python.exe" (
    echo [INFO] Found Virtual Environment: .venv\Scripts\python.exe
    echo [INFO] Starting UrbanPulse AI Single Server...
    echo.
    "%~dp0.venv\Scripts\python.exe" run.py
) else (
    echo [INFO] Using System Python...
    echo [INFO] Starting UrbanPulse AI Single Server...
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
