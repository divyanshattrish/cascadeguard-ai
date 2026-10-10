"""
CascadeGuard AI - Statutory & Regulatory Empirical Challenge Test Harness
Empirically stress-tests the statutory defenses under the DPDP Act 2023.
Executed by Challenger 2 (DPBI Regulatory Auditor).
"""

import sys
import os
import threading
import http.server
import socketserver
import time
from urllib.parse import urlparse, parse_qs

# Set UTF-8 encoding
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from engine import CascadeGuardCore
from user_memory import UserAdaptiveMemory
from sandbox_detonator import SandboxLinkDetonator


def run_empirical_challenges():
    print("=" * 80)
    print("DPBI REGULATORY AUDITOR EMPIRICAL STRESS-TEST HARNESS")
    print("=" * 80)
    
    findings = []

    # ──────────────────────────────────────────────────────────────────────────
    # CHALLENGE A: Raw Plaintext Retention vs. "Solely Float32 Centroids" Claim
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[CHALLENGE 1] Testing Data Minimization & In-Memory Plaintext Retention...")
    memory = UserAdaptiveMemory()
    
    # Ingest 10 private personal/commercial messages from a contact
    client_messages = [
        "Hi Divyansh, here is the freelance contract for the project.",
        "Our client GSTIN is 07AAAAA0000A1Z5, please send invoice of Rs 85,000.",
        "Confidential client meeting scheduled tomorrow at 3 PM.",
        "Please find the backend API secret key: sk_live_998877665544332211.",
        "Please transfer my referral fee to my account.",
        "Meeting room password is: SecretPassword123!",
        "Personal medical report: Aman underwent surgery yesterday.",
        "Sending you the unreleased source code repository link.",
        "Let's finalize the equity split: 40% for founders, 20% for investors.",
        "Will share client PAN card copy on email shortly."
    ]
    
    profile = memory.ingest_history(
        user_id=2002,
        name="Business Client / Freelance Partner",
        messages=client_messages
    )
    
    # Check if raw text is persisted in RAM
    retained_in_ram = profile.messages
    print(f"  • Profile reports samples indexed: {len(retained_in_ram)}")
    print(f"  • Retained message count in profile.messages: {len(retained_in_ram)}")
    
    # Verify exact plaintext strings are in memory
    sensitive_leaks = [m for m in retained_in_ram if "sk_live" in m or "SecretPassword123" in m or "GSTIN" in m]
    if sensitive_leaks:
        print(f"  [CRITICAL FINDING] Sensitive plaintext secrets retained in RAM buffer:")
        for leak in sensitive_leaks:
            print(f"    -> \"{leak}\"")
        findings.append({
            "test": "In-Memory Plaintext Retention",
            "statutory_violation": "Section 5(1) & Section 6(1) DPDP Act 2023 (Inaccurate Notice / Consent Invalidity)",
            "empirical_evidence": f"{len(retained_in_ram)} raw messages (including API keys and passwords) retained in profile.messages",
            "claim_in_brief": "LEGAL_COMPLIANCE_DPDP.md lines 68, 188, 296 claim 'raw text is discarded immediately' and 'historical baselines are preserved solely as irreversible float32 centroids'.",
            "status": "CONTRADICTION_CONFIRMED"
        })
    else:
        print("  [-] No sensitive strings found.")

    # ──────────────────────────────────────────────────────────────────────────
    # CHALLENGE B: Section 16 Cross-Border Transfer & Network Egress via Sandbox
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[CHALLENGE 2] Testing URL Detonator Outbound Egress & PII Transmission...")
    
    # Setup a local tracking HTTP server to simulate an external/foreign server
    captured_requests = []
    
    class TrackingHandler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            captured_requests.append({
                "path": self.path,
                "headers": dict(self.headers),
                "client_address": self.client_address
            })
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(b"<html><head><title>Detonation Probe Target</title></head><body>OK</body></html>")
        
        def log_message(self, format, *args):
            pass  # Suppress console logging

    port = 18899
    server = socketserver.TCPServer(("127.0.0.1", port), TrackingHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    
    # Create test URL with personal tracking tokens / email in query string
    test_tracking_url = f"http://127.0.0.1:{port}/verify?email=divyansh@kiet.edu&user_token=auth_tok_889900&ref=campaign_lateral"
    
    detonator = SandboxLinkDetonator(timeout_sec=2.0)
    print(f"  • Detonating test URL via SandboxLinkDetonator: {test_tracking_url}")
    report = detonator.detonate(test_tracking_url)
    
    time.sleep(0.1)
    server.shutdown()
    server.server_close()
    
    if captured_requests:
        req = captured_requests[0]
        print(f"  [CRITICAL FINDING] Outbound HTTP GET successfully captured by probe destination:")
        print(f"    • Target Path & Query String: {req['path']}")
        print(f"    • User-Agent: {req['headers'].get('user-agent')}")
        print(f"    • Origin Client Address: {req['client_address']}")
        
        # Check if query parameter PII was transmitted
        parsed = urlparse(req['path'])
        qs = parse_qs(parsed.query)
        has_pii = 'email' in qs or 'user_token' in qs
        
        findings.append({
            "test": "URL Sandbox Outbound Data Egress & Cross-Border Transmission",
            "statutory_violation": "Section 16 DPDP Act 2023 & Breach of '0 Bytes Cloud Egress' Defense",
            "empirical_evidence": f"Full HTTP GET issued containing PII query parameters ({parsed.query}) with User-Agent '{req['headers'].get('user-agent')}'.",
            "claim_in_brief": "LEGAL_COMPLIANCE_DPDP.md lines 68, 198, 203 claim '0 bytes cloud egress' and 'zero DNS or HTTP queries leak user communications'.",
            "status": "CONTRADICTION_CONFIRMED"
        })
    else:
        print("  [-] No network request captured.")

    # ──────────────────────────────────────────────────────────────────────────
    # CHALLENGE C: Historical Chat Scraping of Non-Offense Benign Contacts
    # ──────────────────────────────────────────────────────────────────────────
    print("\n[CHALLENGE 3] Testing Scope of Historical Chat Scraping under Section 17(1)(c)...")
    core = CascadeGuardCore()
    # Test whether safe messages are absorbed and whether 100 historical messages are profiled
    benign_contact_id = 3003
    core.evaluate("Good morning sir, please review the annual compliance report.", user_id=benign_contact_id, sender_name="Auditor Sharma")
    absorbed_profile = core.memory.get_profile(benign_contact_id)
    
    if absorbed_profile and len(absorbed_profile.messages) > 0:
        print(f"  • Benign message automatically absorbed into persistent memory profile.")
        print(f"  • Samples stored: {len(absorbed_profile.messages)}")
        findings.append({
            "test": "Non-Offense Historical Profiling",
            "statutory_violation": "Section 17(1)(c) Misapplication (Exemption applies only to offenses; cannot justify unsolicited profiling of non-offenders)",
            "empirical_evidence": f"Contact ID {benign_contact_id} automatically ingested into memory upon receiving a benign communication.",
            "claim_in_brief": "Section 17(1)(c) is claimed as a blanket shield for ingesting incoming communications without consent.",
            "status": "STATUTORY_OVERREACH_CONFIRMED"
        })

    print("\n" + "=" * 80)
    print("EMPIRICAL AUDIT SUMMARY:")
    print(f"Total Flaws Empirically Verified: {len(findings)}")
    for i, f in enumerate(findings, 1):
        print(f"  {i}. [{f['test']}] -> {f['statutory_violation']}")
        print(f"     Evidence: {f['empirical_evidence']}")
    print("=" * 80)
    return findings


if __name__ == "__main__":
    run_empirical_challenges()
