#!/usr/bin/env bash
# =========================================================================
# CASCADEGUARD AI — ONE-CLICK ENVIRONMENT LAUNCHER (MACOS / LINUX)
# =========================================================================

set -e

echo "========================================================================="
echo " CASCADEGUARD AI — ONE-CLICK ENVIRONMENT LAUNCHER"
echo "========================================================================="

# Verify dependencies
command -v python3 >/dev/null 2>&1 || { echo "[ERROR] Python 3 is required. Install from https://python.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "[ERROR] Node.js/npm is required. Install from https://nodejs.org"; exit 1; }

echo "[*] Verifying Node & Python packages..."
[ ! -d "node_modules" ] && npm install
pip3 install -r requirements.txt --quiet

# Check if session exists
if [ ! -f "cascadeguard_session.session" ] && [ ! -f "telegram_surface/cascadeguard_session.session" ]; then
    echo ""
    echo "[!] No active Telegram session detected!"
    read -p "Do you want to log in to Telegram now? (y/n): " LOGIN_CHOICE
    if [[ "$LOGIN_CHOICE" =~ ^[Yy]$ ]]; then
        python3 telegram_surface/login_session.py
    else
        echo "[*] Continuing in mock simulation mode..."
    fi
fi

echo ""
echo "========================================================================="
echo " STARTING CASCADEGUARD SERVICES"
echo " • Web SOC Dashboard : http://localhost:5173"
echo " • Telemetry Bridge  : http://127.0.0.1:5001"
echo "========================================================================="
echo ""

# Start companion server in background
python3 telegram_surface/companion_server.py &
COMPANION_PID=$!

trap "kill $COMPANION_PID 2>/dev/null || true" EXIT

npm run dev
