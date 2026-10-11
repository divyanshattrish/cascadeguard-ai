@echo off
title CascadeGuard AI - Autonomous Interceptor
echo =========================================================================
echo  CASCADEGUARD AI — ONE-CLICK ENVIRONMENT LAUNCHER
echo =========================================================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3 is not installed or not in PATH!
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [*] Checking and installing dependencies...
if not exist "node_modules\" (
    echo [*] Installing Node dependencies (npm install)...
    call npm install
)

echo [*] Verifying Python requirements...
pip install -r requirements.txt --quiet

REM Check if session file exists
if not exist "cascadeguard_session.session" (
    if not exist "telegram_surface\cascadeguard_session.session" (
        echo.
        echo [!] No active Telegram session detected!
        echo [*] To monitor your real Telegram account, a one-time login is required.
        set /p LOGIN_CHOICE="Do you want to log in to Telegram now? (Y/N): "
        if /i "%LOGIN_CHOICE%"=="Y" (
            python telegram_surface\login_session.py
        ) else (
            echo [*] Skipping login. CascadeGuard will start with mock simulation enabled!
        )
    )
)

echo.
echo =========================================================================
echo  STARTING CASCADEGUARD SERVICES
echo  • Web SOC Dashboard : http://localhost:5173
echo  • Telemetry Bridge  : http://127.0.0.1:5001 (WebSocket ws://127.0.0.1:5001/ws)
echo =========================================================================
echo.

REM Start FastAPI companion server in separate window
start "CascadeGuard Companion Server" cmd /k "python telegram_surface\companion_server.py"

REM Start Vite dev server in current terminal
call npm run dev
