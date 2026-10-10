# 🛡️ CascadeGuard AI: Telegram Surface

> **Autonomous Lateral Social Engineering & Account Takeover (ATO) Interceptor for Telegram**  
> *Target Events: InnoHacks 4.0 & Build with Bharat*

---

## 📌 Overview

The **Telegram Surface** provides a 100% platform-compliant, anti-ban defense layer for the Telegram messaging ecosystem. 

Because Telegram is open-source and officially supports client extensions and bots, CascadeGuard operates directly within Telegram chats and groups without web DOM scraping, reverse-engineering, or account ban risks.

---

## 🚀 How to Run the Telegram Surface

### Option 1: Fast Interactive Terminal Simulator (Offline / Instant)
You can test the entire Telegram multi-agent pipeline immediately in your terminal without any API keys:

```bash
cd cascadeguard-ai/telegram_surface
python cli_runner.py
```

This runs:
- Scenario 1: Hospital Emergency ₹5,000 Scam (ATO Detection + Payment Interlock)
- Scenario 2: Fest Voting APK Phishing Malware (APK Payload Interception)
- Scenario 3: Authentic Baseline Message (Normal Friend Hinglish Profile)

---

### Option 2: Live Telegram Bot on Your Phone (1-Minute Setup)

To test CascadeGuard live on your phone in real Telegram chats:

1. **Get a Free Bot Token from Telegram:**
   - Open Telegram on your phone or desktop and search for **`@BotFather`**.
   - Send the message `/newbot`.
   - Name your bot (e.g., `CascadeGuard Defense`).
   - Choose a username (e.g., `CascadeGuard_Demo_Bot`).
   - Copy the HTTP API token provided (e.g. `123456789:ABCdef...`).

2. **Run the Bot:**
   In PowerShell:
   ```powershell
   cd "c:\DEMO\KCC KIET HACKATHON\cascadeguard-ai\telegram_surface"
   $env:TELEGRAM_BOT_TOKEN="your_bot_token_here"
   python bot.py
   ```

3. **Interact on Telegram:**
   - Open your bot in Telegram and click **Start** (or send `/start`).
   - Try the preset test commands:
     - `/test_scam` — Triggers the ₹5,000 emergency ATO scam.
     - `/test_apk` — Triggers the fest voting APK phishing attempt.
     - `/test_legit` — Tests an authentic casual friend message.
     - `/stats` — Displays live telemetry, prevented loss in ₹, and DPDP Act compliance.
     - Or send any custom message (or add the bot to a college group!).

---

## 🔒 Telegram Multi-Agent Capabilities

1. **In-Line Threat Card:** Displays risk index, stylometric drift %, urgency velocity, and flagged forensic signals.
2. **Interactive Inline Keyboard:**
   - 🔒 **[Payment Interlocked]:** Locks direct UPI links.
   - ❓ **[Deploy Friend Quiz]:** Interactive zero-knowledge multiple-choice quiz callback directly inside Telegram.
   - 🛑 **[Quarantine Session]:** If added as a group admin, calls `restrict_chat_member` to revoke message permissions for compromised accounts for 24 hours.
3. **Sub-50ms Audit:** Real-time on-device vectorization and heuristic evaluation.
4. **DPDP Act 2023 Compliant:** Ephemeral RAM processing with zero cloud data egress.
