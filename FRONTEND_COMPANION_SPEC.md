# 🖥️ CascadeGuard AI — Companion Frontend PRD & Engineering Blueprint

**Target Component:** Live Telegram Companion GUI / Dashboard (`src/components/LiveCompanionDashboard.tsx`)  
**Target Environment:** React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons  
**Backend Connection:** Local WebSocket & REST Bridge (`ws://localhost:5001/ws` and `http://localhost:5001/api`)  
**Primary Developer:** Frontend Teammate (Working in parallel on their machine)

---

## 1. Executive Summary & Objective

Currently, CascadeGuard AI's MTProto companion runs in the background as a headless Python script (`python -u mtproto_companion.py --live`). While it intercepts attacks in Telegram, the user only sees terminal logs. 

Your objective is to build the **Live Companion Dashboard** for CascadeGuard AI—a futuristic, glassmorphic security operations center (SOC) view that connects directly to the running companion, displaying real-time message stream audits, stylometric drift gauges, active interlock cards, zero-knowledge contact challenge managers, and one-click DPDP memory flush controls.

---

## 2. System Architecture & Separation of Concerns

```
┌───────────────────────────────────────────────┐
│         FRONTEND (React + Vite + Tailwind)    │
│   • LiveCompanionDashboard.tsx                │
│   • ThreatFeedStream.tsx                      │
│   • ContactProfileVault.tsx                   │
│   • QRCodeScannerModal.tsx                    │
└───────────────────────▲───────────────────────┘
                        │ WebSocket: ws://localhost:5001/ws
                        │ REST API:  http://localhost:5001/api/*
┌───────────────────────▼───────────────────────┐
│        BACKEND COMPANION (Python + Telethon)   │
│   • mtproto_companion.py (Telethon MTProto)   │
│   • companion_server.py  (FastAPI + WebSockets)│
│   • engine.py & user_memory.py                │
└───────────────────────────────────────────────┘
```

> **Parallel Work Guarantee:**  
> You can build and test the entire UI using the provided **Mock WebSocket & REST Provider** (included below). When you push your code and merge with the backend repo, it will connect to the real Python companion seamlessly!

---

## 3. Core Feature Requirements

### Feature 1: Live Status & System Telemetry Header
* **Connection Pill:**
  - `🟢 Connected: Divyansh Attrish (@divyanshattrish)` with live heartbeat pulse indicator (ping < 25ms).
  - Shows current Telegram MTProto Data Center connection status.
* **Key Metrics Gauges:**
  1. **Avg Edge Latency:** E.g., `0.72 ms` (Target < 50ms statutory ceiling).
  2. **Active Centroids in RAM:** E.g., `12 Contacts` (With indicator: `0 Bytes Cloud Egress`).
  3. **Threats Neutralized:** Total count of intercepted mule VPAs and phishing links.
* **Global Action Controls:**
  - **`🗑️ Flush Memory (DPDP §6(4))`**: Triggers instant erasure of all in-memory centroids and active interlocks.
  - **`⚡ Run Live Attack Simulation`**: Sends a simulated test scam to verify interception.
  - **`🛡️ Shield Toggle`**: Enable / Pause active interlock defense.

---

### Feature 2: Real-Time Threat Feed (Live Intercept Stream)
A live virtualized feed displaying incoming Telegram messages as they are audited:
* **Message Card Elements:**
  - **Sender Information:** Contact Name (e.g. `Aman Sharma`), Handle (`@aman_kiet`), Avatar initials, and timestamp.
  - **Threat Classification Badge:**
    - `CRITICAL_ATO` $\rightarrow$ Vibrant Red pulse border, badge, and alarm icon.
    - `SUSPICIOUS` $\rightarrow$ Amber warning badge.
    - `SAFE` $\rightarrow$ Emerald green verified badge.
  - **Composite Risk Bar:** Progress bar from 0% to 100%.
  - **Linguistic & Forensic Breakdown Chips:**
    - *Stylometric Drift:* `48% Drift (Uncharacteristic Uppercase & Missing Hinglish)`
    - *Urgency Score:* `70% Coercion (hospital, operation)`
    - *Financial Score:* `100% Transfer (₹5,000, GPay)`
    - *Mule VPA Detected:* `aman.emergency@okhdfcbank` (`[NPCI Flagged]`)
    - *Extracted Links / APKs:* Highlighted with safety badges.
  - **Live Interlock Action Controls (For CRITICAL_ATO):**
    - `[🛑 Block & Quarantine Contact]`
    - `[❓ Deploy Zero-Knowledge Challenge]`
    - `[✅ Dismiss / Mark Safe]`

---

### Feature 3: Contact Profiling Vault & Custom Quiz Manager
* **Contact Cards Grid:**
  - Shows each calibrated contact (e.g., `Aman Sharma`, `Ayush Srivastav`, `Naresh Ji`).
  - **Linguistic Footprint:**
    - Hinglish Vernacular Ratio (e.g., `72%`)
    - Casing & Punctuation Density (e.g., `0.02`)
    - Baseline Samples Indexed (e.g., `40 messages`)
    - Anchor vs. Short-Term Drift indicator.
* **Zero-Knowledge Challenge Configurator Modal:**
  - Form to set a personalized shared secret for that contact:
    - *Contact:* Select contact.
    - *Security Question:* E.g. `"What was the nickname of our 1st-year hostel warden?"`
    - *Correct Answer:* E.g. `"Gabbar Sir"` (Hashed with SHA-256 before storing).
  - Save button dispatches `POST /api/contacts/{id}/challenge`.

---

### Feature 4: QR Code & Screenshot Safety Detonator
* Upload or drag & drop a UPI QR code screenshot or APK download link.
* Shows instant on-device decode output:
  - Extracted UPI Intent string (`upi://pay?pa=...&pn=...&am=...`)
  - Whitelist / NPCI Mule Registry check.
  - Instant Verdict Card.

---

## 4. API & WebSocket Contract

### WebSocket Stream: `ws://localhost:5001/ws`
The backend companion pushes real-time events in JSON:

#### A. Initial State Event (on connect):
```json
{
  "event": "INIT_STATE",
  "data": {
    "status": "connected",
    "account_name": "Divyansh Attrish",
    "username": "divyanshattrish",
    "active_interlocks": 1,
    "indexed_contacts": 12,
    "avg_latency_ms": 0.68,
    "recent_events": [...]
  }
}
```

#### B. Inbound Message Audited Event:
```json
{
  "event": "MESSAGE_AUDITED",
  "data": {
    "id": "evt_109283",
    "timestamp": 1728574800,
    "chat_id": 987654321,
    "sender_name": "Aman Sharma",
    "username": "aman_kiet",
    "text": "Priya emergency hai! Chacha hospital me hain, ₹5000 transfer kr: aman.emergency@okhdfcbank",
    "result": {
      "threat_level": "CRITICAL_ATO",
      "overall_risk_score": 95,
      "processing_time_ms": 0.72,
      "stylometric_drift": 48,
      "financial_coercion_score": 100,
      "urgency_score": 70,
      "extracted_vpas": ["aman.emergency@okhdfcbank"],
      "is_vpa_blacklisted": true,
      "extracted_urls": [],
      "extracted_apks": [],
      "flagged_reasons": [
        "Uncharacteristic uppercase emphasis (45% casing drift)",
        "Urgency coercion markers detected: emergency, hospital",
        "Financial transfer requests detected: ₹5000, transfer",
        "Target VPA matches I4C / NPCI Mule Registry!"
      ],
      "interlocked": true
    }
  }
}
```

#### C. Memory Flushed Event:
```json
{
  "event": "MEMORY_FLUSHED",
  "data": {
    "centroids_purged": 12,
    "profiles_cleared": 12,
    "timestamp": 1728574820
  }
}
```

---

### REST API Endpoints: `http://localhost:5001/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | Returns companion service health & account info |
| `GET` | `/api/contacts` | Returns list of all indexed contacts and their baselines |
| `POST` | `/api/flush` | Purges volatile RAM centroids per DPDP Act §6(4) |
| `POST` | `/api/contacts/{id}/challenge` | Sets custom friend quiz `{ question: string, answer: string }` |
| `POST` | `/api/simulate` | Triggers a test scam ingestion |
| `POST` | `/api/interlocks/{chat_id}/resolve` | Dismisses or confirms quarantine `{ action: "block" \| "dismiss" }` |

---

## 5. Development Mock Provider (For Zero-Dependency Frontend Work)

To start development immediately without running the Python script, create `src/services/mockCompanionService.ts`:

```typescript
export const startMockWebSocket = (onEvent: (event: any) => void) => {
  // Emit initial state
  setTimeout(() => {
    onEvent({
      event: "INIT_STATE",
      data: {
        status: "connected",
        account_name: "Divyansh Attrish",
        username: "divyanshattrish",
        active_interlocks: 1,
        indexed_contacts: 8,
        avg_latency_ms: 0.65,
        recent_events: []
      }
    });
  }, 500);

  // Emit a sample scam event after 4 seconds
  const timer = setTimeout(() => {
    onEvent({
      event: "MESSAGE_AUDITED",
      data: {
        id: "evt_demo_1",
        timestamp: Date.now() / 1000,
        chat_id: 1001,
        sender_name: "Aman Sharma",
        username: "aman_kiet",
        text: "Divyansh emergency hai! Chacha hospital me admit hue hain, ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now!",
        result: {
          threat_level: "CRITICAL_ATO",
          overall_risk_score: 95,
          processing_time_ms: 0.74,
          stylometric_drift: 52,
          financial_coercion_score: 100,
          urgency_score: 70,
          extracted_vpas: ["aman.emergency@okhdfcbank"],
          is_vpa_blacklisted: true,
          extracted_urls: [],
          extracted_apks: [],
          flagged_reasons: [
            "Sudden depletion of habitual Hinglish vocabulary (52% vernacular drift)",
            "Urgency coercion markers: emergency, hospital",
            "Financial transfer request: ₹5,000, transfer",
            "CRITICAL: Target VPA matches I4C / NPCI Mule Registry!"
          ],
          interlocked: true
        }
      }
    });
  }, 4000);

  return () => clearTimeout(timer);
};
```

---

## 6. Copy-Paste AI Prompt for Your Teammate

Give your teammate this exact prompt to paste into **Cursor**, **ChatGPT**, or **Claude**:

```markdown
You are an expert Frontend Security UI Architect. 
I am building the Frontend Companion Dashboard for "CascadeGuard AI" (an Autonomous Account Takeover & Social Engineering Interceptor for Telegram).

Our tech stack is React 18, Vite, TypeScript, and Tailwind CSS with Lucide-React icons.

Please read the PRD specifications in FRONTEND_COMPANION_SPEC.md and create:
1. `src/components/LiveCompanionDashboard.tsx`: A cyber-dark, glassmorphic Security Dashboard featuring:
   - Header with active Telegram connection status, live edge latency badge (<1ms), and 0-byte cloud egress indicator.
   - Live Threat Feed that streams intercepted messages with real-time risk gauges, stylometric drift breakdown tags, and interlock action buttons.
   - Contact Vault tab showing calibrated contacts, their Hinglish ratio, and a modal to set custom Zero-Knowledge security questions.
   - Quick action buttons for "/flush (DPDP Sec 6(4))" and "Simulate Attack".
2. `src/services/companionSocket.ts`: A resilient WebSocket client that connects to `ws://localhost:5001/ws` with auto-reconnect and falls back seamlessly to mock telemetry when offline.
3. Update `src/App.tsx` with a top navigation toggle between "Dual Chat Simulator" and "Live Telegram Companion".

Style Guidelines:
- Cyberpunk / SOC Aesthetic: Slate-950 background, Emerald green accents for authentic traffic, Crimson red glows for CRITICAL_ATO interlocks, and Amber for warnings.
- Clean animations with Tailwind transitions.
- Fully typed with TypeScript interfaces.
```
