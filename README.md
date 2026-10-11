# 🛡️ CascadeGuard AI

> **Autonomous Lateral Social Engineering & Account Takeover (ATO) Interceptor**  
> *Target Events: InnoHacks 4.0 (KIET Ghaziabad) & Build with Bharat (KCC)*  
> *Theme: Agentic AI & GenAI / Open Innovation / Cybersecurity*

---

## 📌 Executive Summary

When an attacker hijacks a legitimate user's messaging account (via rogue web sessions, QR phishing, SIM swap, or session hijacking), **they weaponize established social trust** to defraud friends, family, and college groups.

Current defenses fail:
1. **Antivirus software** checks for malicious file binaries, not social engineering from authentic phone numbers.
2. **Messaging platforms (WhatsApp / Telegram)** are End-to-End Encrypted (E2EE), meaning server-side filters cannot inspect messages without breaking user privacy.

**CascadeGuard AI** operates **"At the Glass"** (on-device client companion & browser extension) to:
- Detect **Linguistic Stylometric Drift** (< 50ms edge inference).
- Identify **Financial Coercion, Malicious VPAs & Phishing APKs**.
- Run **Headless Sandboxed Link Detonation** (unmasks short links, detects credential harvesters & DOM fake OAuth lures).
- Pre-approves **10,500+ global trusted domains** with $O(1)$ sub-millisecond hash verification for zero false positives.
- Deploy **Automated Payment Interlocks & Reverse-Challenge "Friend Quizzes"**.
- Provide instant **Recipient Controls** (`/approve` to unlock, `/remove` to delete scam messages for both parties, `/block` to quarantine).

---

## ⚙️ Multi-Agent Architecture

```
                                  [ Incoming Message Decrypted Locally ]
                                                    │
                                     ┌──────────────┴──────────────┐
                                     ▼                             ▼
                    ┌────────────────────────────┐  ┌────────────────────────────┐
                    │    Agent 1: Stylometric    │  │    Agent 2: Forensic &     │
                    │      Profiler Engine       │  │    Link Sandbox Detonator  │
                    ├────────────────────────────┤  ├────────────────────────────┤
                    │ • Lexical Entropy & Punct. │  │ • Financial Coercion Score │
                    │ • Hinglish/Vernacular Ratio│  │ • 10,500+ Top Domain Bloom │
                    │ • N-gram Cosine Distance   │  │ • Headless Redirect Unmask │
                    │ • Per-User Adaptive Memory │  │ • DOM Password/OTP Harvester│
                    └──────────────┬─────────────┘  └──────────────┬─────────────┘
                                   │                               │
                                   └──────────────┬────────────────┘
                                                  ▼
                                    ┌────────────────────────────┐
                                    │    Risk Fusion Arbiter     │
                                    │  Score = Drift + Coercion  │
                                    └─────────────┬──────────────┘
                                                  │
                            ┌─────────────────────┴─────────────────────┐
                            │ (Score < 70% or Trusted Link)              │ (Score >= 70%)
                            ▼                                           ▼
                 [ Render Normal Message ]                  ┌────────────────────────────┐
                                                            │   Agent 3: Autonomous      │
                                                            │      Challenger & Shield   │
                                                            ├────────────────────────────┤
                                                            │ • In-line Warning Banner   │
                                                            │ • One-Click Payment Lock   │
                                                            │ • Dynamic 'Friend Quiz'    │
                                                            │ • Recipient: /approve      │
                                                            │ • Recipient: /remove       │
                                                            └─────────────┬──────────────┘
                                                                          │
                                                                          ▼
                                                            ┌────────────────────────────┐
                                                            │    Agent 4: Blast-Radius   │
                                                            │     Containment Engine     │
                                                            ├────────────────────────────┤
                                                            │ • Local Attack Graph Update│
                                                            │ • Contact Isolation Flag   │
                                                            │ • Zero-Knowledge Broadcast │
                                                            └────────────────────────────┘
```

---

## 🔒 Privacy & Legal Moat: DPDP Act 2023

Judges rigorously evaluate privacy compliance. CascadeGuard AI is architected specifically around India's **Digital Personal Data Protection (DPDP) Act 2023**:

| Statutory Principle | Implementation in CascadeGuard |
| :--- | :--- |
| **Data Minimization** | Raw chat messages are parsed exclusively in volatile process RAM. Zero chat text is written to disk. |
| **No Cloud Egress** | Stylometry scoring and intent scanning occur client-side on the device (0 bytes uploaded). |
| **Irreversible Fingerprints** | Historical profiles are stored as mathematical float vectors (token length, punctuation ratios), from which original text can never be reconstructed. |
| **Zero Third-Party APIs** | Does not transmit private chats to external LLM providers (OpenAI, Anthropic). |

---

## 🚀 Teammate Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18+) & npm
- **Python** (3.10+) & pip
- **Git**

### ⚡ Option A: 1-Click Launch (Recommended for Any PC)

**On Windows:**
Simply double-click `start.bat` or run:
```cmd
start.bat
```

**On macOS / Linux:**
```bash
chmod +x start.sh
./start.sh
```

*What this does automatically:*
1. Checks Python 3.10+ and Node.js 18+ environments.
2. Auto-installs npm and pip requirements.
3. Offers a 1-time secure Telegram phone login (or runs with built-in mock simulation).
4. Launches the **Companion Telemetry Bridge** (`http://127.0.0.1:5001`) and **Web SOC Dashboard** (`http://localhost:5173`).

---

### 🛠️ Option B: Step-by-Step Manual Setup

#### 1. Clone & Install Dependencies
```bash
git clone https://github.com/divyanshattrish/cascadeguard-ai.git
cd cascadeguard-ai

npm install
pip install -r requirements.txt
```

#### 2. Configure Telegram Credentials (Optional for Live Monitoring)
Copy `.env.example` to `telegram_surface/.env`:
```bash
cp .env.example telegram_surface/.env
```
Add your free Telegram API credentials (from [my.telegram.org](https://my.telegram.org)):
```env
TELEGRAM_API_ID=your_api_id_here
TELEGRAM_API_HASH=your_api_hash_here
```

#### 3. Run the Services
```bash
# Terminal 1: Launch Web SOC Dashboard
npm run dev

# Terminal 2: Launch Companion API & WebSocket Bridge
python telegram_surface/companion_server.py
```
*Open `http://localhost:5173` $\rightarrow$ Click **"🛡️ Live Telegram Companion"** $\rightarrow$ Click **"▶ Start Live Guardian"** directly from the UI!*

#### 4. Run Automated Test Suites (Offline Verification)
```bash
python telegram_surface/test_suite.py
python telegram_surface/test_advanced_hardening.py
python telegram_surface/test_regulatory_audit_v2.py
```

---

## 🎮 Recipient Control Commands

When CascadeGuard drops an alert card in your chat:
- **`/approve`** *(or `approve`)* — Dismisses the alert, lifts the interlock, and absorbs the contact's style into trusted memory.
- **`/remove`** *(or `remove`)* — Revokes and deletes the scam message for **BOTH parties** (`revoke=True`) and cleans up the alert.
- **`/block`** — Blocks and quarantines the hijacked session immediately.

---

## 📁 Repository Structure

```
cascadeguard-ai/
├── src/                          # React + Tailwind Dashboard & Contagion Graph
│   ├── components/               # SecurityHUD, ChatSimulator, AttackGraph, FriendQuiz
│   ├── data/                     # Scenarios & Indian Scam Archetypes
│   └── types/                    # Threat metrics & simulation models
├── telegram_surface/             # Production On-Device Defense Surface
│   ├── engine.py                 # Stylometry NLP + Mule VPA + Risk Arbiter
│   ├── user_memory.py            # DPDP-Compliant Adaptive Float Centroids
│   ├── url_scanner.py            # Forensic Link Scanner & Context Lure Analyzer
│   ├── sandbox_detonator.py      # Headless Ephemeral Link Detonation Engine
│   ├── top_10k_domains.json      # 10,500+ Pre-Approved Global & Indian Domains
│   ├── mtproto_companion.py      # Telethon Client Operating "At the Glass"
│   ├── bot.py                    # Telegram Bot Gateway (@Thelastprotector_bot)
│   ├── test_suite.py             # 7-Step Automated Test Suite
│   └── .env.example              # Environment variables template
├── requirements.txt              # Root Python dependencies
├── package.json                  # Node.js dependencies
└── README.md                     # Project Documentation
```

---

## 👥 Hackathon Team Git Workflow

1. Always pull latest before starting work:
   ```bash
   git pull origin main
   ```
2. Create a branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit with clear messages:
   ```bash
   git add .
   git commit -m "feat: your change summary"
   git push origin feature/your-feature-name
   ```
