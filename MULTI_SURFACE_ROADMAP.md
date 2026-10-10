# 🛡️ CascadeGuard AI: Multi-Surface Engineering Blueprint & Team Roadmap

> **Autonomous Lateral Social Engineering & Account Takeover (ATO) Interceptor**  
> *Target Hackathons: InnoHacks 4.0 (KIET) & Build with Bharat (KCC)*  
> *Themes: Agentic AI & GenAI / Open Innovation / Cybersecurity / Privacy-Preserving Systems*

---

## 📌 1. Strategic Context: Why "Mitigation 4" (Multi-Surface)?

When attackers hijack messaging accounts via SIM swaps, QR phishing, or rogue web sessions, **they weaponize established interpersonal trust**. They don't steal accounts to read messages—they use them as viral launchpads to defraud college batches, hostel mates, and family members.

To solve this without triggering platform bans or violating platform Terms of Service (ToS), **CascadeGuard implements a Multi-Surface Architecture**:

```
                       ┌────────────────────────────────────────────────────────┐
                       │           CASCADEGUARD MULTI-SURFACE DEFENSE           │
                       └──────────────────────────┬─────────────────────────────┘
                                                  │
            ┌─────────────────────────────────────┼─────────────────────────────────────┐
            ▼                                     ▼                                     ▼
┌───────────────────────────┐         ┌───────────────────────────┐         ┌───────────────────────────┐
│         SURFACE 1         │         │         SURFACE 2         │         │         SURFACE 3         │
│     WhatsApp Web (DOM)    │         │     Telegram Ecosystem    │         │    Android OS Companion   │
├───────────────────────────┤         ├───────────────────────────┤         ├───────────────────────────┤
│ • Passive MutationObserver│         │ • Official Open-Source    │         │ • NotificationListener    │
│ • Zero WebSocket hooking  │         │   TDLib Client Plugin     │         │ • AccessibilityService    │
│ • Floating Shadow DOM UI  │         │ • Bot Security Gateway    │         │ • Truecaller/Bank Shield  │
│ • CSP: connect-src 'none' │         │ • Zero ToS violations     │         │ • Intercepts UPI intents  │
└───────────────────────────┘         └───────────────────────────┘         └───────────────────────────┘
```

### Surface Breakdown & ToS Defense Matrix

| Surface | Deployment Model | Mechanism | Anti-Ban / Legal Defense |
| :--- | :--- | :--- | :--- |
| **Surface 1: WhatsApp Web** *(Primary Live Demo)* | Chromium Extension (Manifest v3) | Passive `MutationObserver` on stable accessibility nodes (`[role="row"]`). In-line shield rendered via isolated Shadow DOM overlay. | Never automates clicks, never sends automated messages, never touches WebSockets. Exactly like Grammarly or 1Password. |
| **Surface 2: Telegram** *(Ecosystem Expansion)* | Native Plugin / TDLib Client | Built on Telegram's official, open-source MTProto/TDLib client framework. | 100% compliant with Telegram Terms of Service; no reverse-engineering required. |
| **Surface 3: Android Companion** *(Bharat Mobile Scale)* | Android Companion App (Kotlin/Java) | Android OS `NotificationListenerService` & `AccessibilityService`. | Follows Google Play Protect guidelines and Truecaller spam detection standards; operates at the OS intent layer. |

---

## ⚙️ 2. Core 4-Agent Defense Pipeline

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
                    │ • Hinglish/Vernacular Ratio│  │ • Urgency Sentiment Vector │
                    │ • N-gram Cosine Distance   │  │ • VPA / UPI / QR Extractor │
                    │ • Casing & Pressure Drift  │  │ • Malicious APK/URL Filter │
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

* **Agent 1 (Stylometric Profiler):** Analyzes punctuation entropy, casing pressure, Hinglish slang ratios, and vocabulary cosine distance against a mathematical local baseline.
* **Agent 2 (Forensic Intent & VPA Scanner):** Parses conversational coercion heuristics, urgency sentiment velocity, extracts UPI IDs/VPAs, and checks against the simulated NPCI/I4C mule account registry.
* **Agent 3 (Autonomous Challenger & Interlock):** Renders the floating alert shield, locks payment buttons, and generates a zero-knowledge "Friend Quiz" verification challenge.
* **Agent 4 (Blast-Radius Containment Engine):** Maps contagion topology in real time, notifying group administrators to mute compromised sessions before lateral spreading occurs.

---

## 🔒 3. The Privacy Moat: DPDP Act 2023 Compliance

Judges in cybersecurity tracks rigorously evaluate privacy. Our architecture is built specifically around **India's Digital Personal Data Protection (DPDP) Act 2023**:

| Statutory Principle | Implementation in CascadeGuard |
| :--- | :--- |
| **Data Minimization** | Raw chat messages are parsed exclusively in volatile process RAM. Zero chat text is written to persistent disk. |
| **Zero Cloud Ingestion** | All stylometric scoring and intent parsing occur client-side on the device. `0 Bytes` of chat text ever leave the phone. |
| **Irreversible Fingerprints** | Historical user baselines are stored as non-reversible mathematical vectors (float arrays), from which original conversation text can never be reconstructed. |
| **Zero Third-Party APIs** | No cloud LLM dependencies (OpenAI/Anthropic) that could leak private conversational data. |

---

## 📅 4. Hackathon Execution Phases (24-Hour Timeline)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      24-HOUR HACKATHON TIMELINE                        │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ Phase 1      │ Phase 2      │ Phase 3      │ Phase 4      │ Phase 5    │
│ Hours 0 - 6  │ Hours 6 - 12 │ Hours 12 - 18│ Hours 18 - 21│ Hours 21-24│
│ Core Engine  │ Surface 1    │ Surface 2/3  │ Contagion &  │ Pitch &    │
│ & Algorithms │ Web Ext/Sim  │ Telegram/App │ DPDP Audit   │ Rehearsal  │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
```

### Phase 1: Core Intelligence Engine & Heuristics Calibration (Hours 0 – 6)
* Implement mathematical stylometric profiling (cosine distance, Hinglish slang vectorizer, punctuation entropy).
* Implement forensic heuristics (urgency detection, financial triggers, VPA regex extractor).
* Build simulated I4C / NPCI mule account threat feed matcher.
* *Deliverable:* Self-contained edge inference engine running in sub-50ms.

### Phase 2: Surface 1 — Web Extension & Live Dual Simulator (Hours 6 – 12)
* Create the interactive Dual-Screen Simulator (Attacker console vs. Protected Victim WhatsApp Web client).
* Implement the In-Line Interception Shield and Payment Interlock Barrier.
* Package unpacked Manifest v3 Chrome Extension skeleton with Shadow DOM injection.
* *Deliverable:* Fully functional live demo showing attack presets and instant interception.

### Phase 3: Surface 2 & 3 Architecture — Telegram & Android Stubs (Hours 12 – 18)
* Configure Telegram TDLib / bot security interceptor demonstration.
* Outline Android OS Companion architecture (`NotificationListenerService` and `AccessibilityService` workflow).
* Build interactive Zero-Knowledge "Friend Quiz" challenge module.
* *Deliverable:* Complete multi-surface defense proof and interactive verification challenge.

### Phase 4: Blast-Radius Contagion Graph & Privacy Audit (Hours 18 – 21)
* Build the interactive topological contagion graph (visualizing node isolation and group containment).
* Finalize the DPDP Act 2023 Statutory Audit Console with 0-byte egress verification.
* *Deliverable:* Visual proof of viral cascade containment and legal compliance.

### Phase 5: Pitch Rehearsal, Slide Deck & Judge Q&A Playbook (Hours 21 – 24)
* Prepare the 3-minute pitch slide deck and live presentation choreography.
* Rehearse judge Q&A handling (ToS defense, false positives, privacy proof).
* Freeze codebase and test offline presentation backup.
* *Deliverable:* Winning pitch deck, live demo, and team readiness.

---

## 👥 5. Team Role Allocation Matrix (4 Members)

| Member | Focus Area | Primary Deliverables |
| :--- | :--- | :--- |
| **Member 1: Frontend & Presentation Lead** | Interactive Simulator & UX | Dual-screen chat UI, WhatsApp Web companion view, Payment lock modal, live preset buttons. |
| **Member 2: AI / NLP & Stylometry Lead** | Stylometric & Forensic Engine | Mathematical vector calculation, Hinglish tokenizer, VPA regex, risk scoring calibration. |
| **Member 3: Full-Stack & Systems Lead** | Contagion Graph & Multi-Surface | Topological network graph visualizer, Telegram TDLib integration / Android listener stub, NPCI threat feed. |
| **Member 4: Product, Research & Pitch Lead** | Pitch Deck & Compliance | Presentation slides, DPDP Act compliance documentation, live demo choreography, judge Q&A defense. |

---

## 🎤 6. Winning Judge Q&A Playbook

### Q1: "Won't WhatsApp ban users for injecting scripts into their web client?"
> **Answer:**  
> *"Meta bans tools that automate messaging, scrape contact lists, or hook into WebSockets. CascadeGuard operates strictly at the presentation layer—the exact same way Grammarly, 1Password, or accessibility screen readers work. We use a passive `MutationObserver` on stable accessibility nodes and render our shield inside an isolated Shadow DOM. WhatsApp's internal React engine never knows our elements exist, so it cannot crash or trigger anti-bot flags."*

### Q2: "Isn't a browser extension with chat access a massive spyware vector?"
> **Answer:**  
> *"Under Manifest v3, our extension's Content Security Policy enforces `connect-src: 'none'`. It is cryptographically impossible for the extension to make network requests to external servers. All text processing occurs in volatile RAM and is immediately garbage-collected. Zero bytes of chat text leave the device."*

### Q3: "What happens in a genuine emergency when a friend truly needs money?"
> **Answer:**  
> *"CascadeGuard does not delete or censor messages—it deploys a protective interlock and offers a zero-knowledge 'Friend Quiz' (e.g., 'What was the nickname of our 1st-year hostel warden?'). If it is the real friend, they answer correctly in seconds and the interlock is dismissed. If it's an attacker, the transaction is safely stopped."*

### Q4: "Why can't Meta or Telegram just build this on their servers?"
> **Answer:**  
> *"Because WhatsApp and Telegram are End-to-End Encrypted (E2EE). The server only sees encrypted ciphertexts and cannot read message content without breaking encryption. Protection must occur 'at the glass' on the client device after legitimate decryption."*
