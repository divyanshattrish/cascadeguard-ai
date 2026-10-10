# 🛡️ CascadeGuard AI — Comprehensive Implementation & Architecture Plan

> **Autonomous Lateral Social Engineering & Account Takeover (ATO) Interceptor**  
> *Target Events: InnoHacks 4.0 (KIET) & Build with Bharat (KCC)*  
> *Track: Agentic AI & GenAI / Open Innovation / Cybersecurity*

---

## 1. Project Vision & Core Thesis

When an attacker gains unauthorized access to a victim's messaging account (WhatsApp Web session hijacking, SIM swap, QR code phishing, credential leaks), **they weaponize established social trust**. 

Traditional cybersecurity solutions fail because:
1. **End-to-End Encryption (E2EE) Blindness:** Server-side platforms (Meta, Telegram) cannot inspect message content without breaking encryption.
2. **Endpoint Antivirus Blindness:** Antivirus scanners only detect malicious binaries/signatures, not conversational coercion coming from an authentic phone number.
3. **Lateral Viral Cascade:** A single compromised student account can phish dozens of peers, hostel groups, and family members within minutes.

**CascadeGuard AI operates "At the Glass" (Client-Side Edge)** — analyzing incoming messages ephemerally in local RAM without ever sending raw text to the cloud, deploying automated payment interlocks, and halting lateral cascades before financial loss occurs.

---

## 2. Multi-Agent Engine Architecture

```
                                  [ Incoming Message Decrypted Locally ]
                                                    │
                                     ┌──────────────┴──────────────┐
                                     ▼                             ▼
                    ┌────────────────────────────┐  ┌────────────────────────────┐
                    │    Agent 1: Stylometric    │  │    Agent 2: Forensic &     │
                    │      Profiler Engine       │  │       Intent Scanner       │
                    ├────────────────────────────┤  ├────────────────────────────┤
                    │ • Lexical Entropy & Punct. │  │ • Financial Coercion Score │
                    │ • Hinglish/English Ratio   │  │ • Urgency Sentiment Vector │
                    │ • N-gram Cosine Distance   │  │ • VPA / UPI / QR Extractor │
                    │ • Tone & Greeting Anomaly  │  │ • Malicious APK/URL Filter │
                    └──────────────┬─────────────┘  └──────────────┬─────────────┘
                                   │                               │
                                   └──────────────┬────────────────┘
                                                  ▼
                                    ┌────────────────────────────┐
                                    │    Risk Fusion Arbiter     │
                                    │   Score = w1·Drift + w2·Coer│
                                    └─────────────┬──────────────┘
                                                  │
                            ┌─────────────────────┴─────────────────────┐
                            │ (Score < 75%)                             │ (Score >= 75%)
                            ▼                                           ▼
                 [ Render Normal Message ]                  ┌────────────────────────────┐
                                                            │   Agent 3: Autonomous      │
                                                            │      Challenger & Shield   │
                                                            ├────────────────────────────┤
                                                            │ • In-line Warning Banner   │
                                                            │ • One-Click Payment Lock   │
                                                            │ • Dynamic 'Friend Quiz'    │
                                                            └─────────────┬──────────────┘
                                                                          │
                                                                          ▼
                                                            ┌────────────────────────────┐
                                                            │    Agent 4: Blast-Radius   │
                                                            │     Containment Engine     │
                                                            ├────────────────────────────┤
                                                            │ • Local Attack Graph Update│
                                                            │ • Contact Isolation Flag   │
                                                            │ • Anonymous Threat Alert   │
                                                            └────────────────────────────┘
```

---

## 3. Four Core Defense Agents

### Agent 1: Stylometric Profiler (Linguistic Drift)
* **Objective:** Detect when the person typing does not match the historical owner of the account.
* **Metrics:**
  * **Punctuation Entropy:** Semicolons, comma frequencies, missing emojis, caps-lock intensity.
  * **Hinglish/Vernacular Ratio:** Sudden formal Hindi or English when historical baseline uses informal slang (`"bhai"`, `"yaar"`, `"kaha h"`).
  * **Vocabulary Cosine Distance:** Compares unigram/bigram token vectors against local user baseline.
  * **Greeting Anomaly:** E.g., starting with `"Dear Priya"` instead of habitual `"Oyee"`.

### Agent 2: Forensic Intent & Financial Scanner
* **Objective:** Parse intent signals that characteristic ATO attacks exhibit.
* **Detection Vectors:**
  * **Urgency & Coercion Keywords:** Heuristics scoring for words like *"hospital"*, *"emergency"*, *"immediately"*, *"account blocked"*, *"police"*, *"urgent transfer"*.
  * **Financial Targets:** Regex extraction of UPI IDs (`[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}`), phone numbers linked to payment handles, and bank account numbers.
  * **Malicious Artifacts:** APK file names, shortlink redirects (`bit.ly`, `tinyurl.com`), and fake voting/contest links.

### Agent 3: Autonomous Challenger & Payment Interlock
* **Objective:** Take instantaneous protective action before the user clicks or pays.
* **Actions:**
  * **Payment Interlock:** Automatically intercepts clicks on UPI links or QR codes, rendering them inactive with a warning dialog.
  * **Reverse-Challenge Generator ("Friend Quiz"):** Prompts the recipient with an automated zero-knowledge challenge to send the sender (e.g. *"What is the nickname of our 2nd-year lab instructor?"*). An imposter cannot answer without revealing themselves.

### Agent 4: Blast-Radius & Network Contagion Engine
* **Objective:** Prevent lateral cascading infection across shared groups (e.g., college hostels, batch groups, department channels).
* **Capabilities:**
  * Visualizes the attack propagation tree in real-time.
  * Flags high-risk compromised sender nodes to protect group members.
  * Issues automated containment telemetry (hash-only, zero chat text) to alert group admins.

---

## 4. Privacy & Regulatory Moat (DPDP Act 2023)

Judges in cybersecurity and AI hackathons rigorously test privacy. CascadeGuard's architecture is built specifically around **India's Digital Personal Data Protection (DPDP) Act 2023**:

| Requirement | CascadeGuard Implementation |
| :--- | :--- |
| **Data Minimization** | Raw chat messages are parsed exclusively in ephemeral device RAM. No chat text is logged or stored to disk. |
| **No Cloud Egress** | Stylometry scoring and intent scanning occur client-side on the device. |
| **Irreversible Fingerprints** | Historical user baselines are saved as normalized mathematical feature vectors (e.g., punctuation ratio = 0.12, slang index = 0.84), from which original conversation text can never be reconstructed. |
| **Zero Third-Party APIs** | Does not send private chats to external LLM providers (OpenAI/Anthropic) for analysis. |

---

## 5. Hackathon Prototype Deliverables

1. **Dual-Screen Live Simulator:**
   - **Sender View (Attacker / Compromised Account):** Custom input with preloaded scam templates (Hospital Emergency, Fake APK Voting, Urgent Transfer).
   - **Receiver View (Target Victim):** Realistic WhatsApp/Telegram web UI with CascadeGuard real-time inline badge, payment lock overlay, and alert card.
2. **Real-Time Security Inspector HUD:**
   - Stylometric Drift Gauge (0-100%).
   - Forensic Intent & Coercion Score.
   - Lexical Breakdown (Punctuation, Vocabulary Shift, Hinglish Delta).
   - VPA Threat Status (Checked against simulated NPCI/I4C blacklist).
3. **Interactive Contagion & Blast-Radius Graph:**
   - Dynamic topological visualizer illustrating how an attack spreads from Compromised Node $\rightarrow$ Victims $\rightarrow$ College Groups, with automatic quarantine nodes.
4. **Interactive Reverse Challenge Modal:**
   - Friend verification challenge test runner.
5. **Privacy & DPDP Act Verification Console:**
   - Real-time audit log showing 0 bytes of raw text transmitted over the wire.
