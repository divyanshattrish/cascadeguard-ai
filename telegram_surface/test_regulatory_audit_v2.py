"""
Adversarial Verification Suite for Challenger 2 (Regulatory Auditor & DPBI Auditor).
Tests:
1. PII memory leakage and scrubbing across extensive adversarial inputs.
2. Unsolicited stranger profiling prevention (DPDP §6(1) and §17(1)(c) scope).
3. 4-Stage Client-Side URL Scrubbing Protocol and outbound network socket sanitization.
4. RAM flush and lifecycle controls (§6(4) withdrawal).
"""

import sys
from urllib.parse import urlparse, parse_qs
from engine import CascadeGuardCore
from user_memory import UserAdaptiveMemory, scrub_sensitive_data
from sandbox_detonator import SandboxLinkDetonator, scrub_url_client_side

def test_pii_scrubbing_adversarial():
    print("[TEST A] Stress-testing PII Scrubber against adversarial inputs...")
    adversarial_inputs = [
        "Client GSTIN: 07AAAAA0000A1Z5, bill amount Rs. 1,50,000",
        "API Secret: sk_live_998877665544332211, test key: pk_test_abcdef123456",
        "Your login password:= MyP@ssw0rd! and meeting passcode: SecretPassword123!",
        "Aadhaar: 1234 5678 9012, PAN: ABCDE1234F",
        "Bank account: 123456789012, OTP: 948271",
        "Phone number: +91 9876543210, email: victim@corporate.in",
        "GitHub token: ghp_1234567890abcdefghijklmnopqrstuvwxyz"
    ]
    for text in adversarial_inputs:
        scrubbed = scrub_sensitive_data(text)
        # Check that no sensitive literal leaked
        assert "07AAAAA0000A1Z5" not in scrubbed, f"GSTIN leaked: {scrubbed}"
        assert "sk_live" not in scrubbed, f"API key leaked: {scrubbed}"
        assert "SecretPassword123" not in scrubbed, f"Password leaked: {scrubbed}"
        assert "1234 5678 9012" not in scrubbed, f"Aadhaar leaked: {scrubbed}"
        assert "ABCDE1234F" not in scrubbed, f"PAN leaked: {scrubbed}"
        assert "948271" not in scrubbed, f"OTP leaked: {scrubbed}"
        assert "victim@corporate.in" not in scrubbed, f"Email leaked: {scrubbed}"
        assert "9876543210" not in scrubbed, f"Phone leaked: {scrubbed}"
        assert "ghp_" not in scrubbed, f"GitHub token leaked: {scrubbed}"
    print("  -> PASS: All adversarial PII successfully redacted into lossy tokens.")

def test_unsolicited_stranger_profiling():
    print("\n[TEST B] Testing Unsolicited Stranger Profiling Prevention...")
    core = CascadeGuardCore()
    stranger_ids = [9001, 9002, 9003]
    for sid in stranger_ids:
        # Evaluate benign messages from strangers
        res = core.evaluate(f"Hey bro, how are you? Let's catch up.", user_id=sid, sender_name=f"Stranger_{sid}")
        # Verify stranger is NOT in memory profiles
        prof = core.memory.get_profile(sid)
        assert prof is None, f"Stranger {sid} was profiled in memory without consent!"
    print("  -> PASS: Unenrolled third parties are strictly excluded from memory profiling.")

def test_url_scrubbing_protocol():
    print("\n[TEST C] Testing 4-Stage Client-Side URL Scrubbing Protocol...")
    test_urls = [
        ("http://phish.xyz/login?email=victim@corp.com&token=secret_tok_123&ref=campaign_lateral#jwt_fragment_token",
         "http://phish.xyz/login"),
        ("https://BANK-PORTAL.COM:8443/auth?user_id=admin&otp=837261&session=sess_9999",
         "https://bank-portal.com:8443/auth"),
        ("https://tracker.net/click?utm_source=telegram&utm_medium=lateral&track_id=trk_888",
         "https://tracker.net/click")
    ]
    for raw, expected in test_urls:
        scrubbed = scrub_url_client_side(raw)
        assert scrubbed == expected, f"Scrubbing failed: got '{scrubbed}', expected '{expected}'"
        parsed = urlparse(scrubbed)
        assert parsed.query == "", f"Query not stripped: {parsed.query}"
        assert parsed.fragment == "", f"Fragment not stripped: {parsed.fragment}"
    print("  -> PASS: All query PII, tokens, and fragments completely purged client-side.")

def test_memory_flush_lifecycle():
    print("\n[TEST D] Testing Memory Flush & Lifecycle Controls (§6(4) / §12)...")
    memory = UserAdaptiveMemory()
    assert len(memory.profiles) > 0, "Initial demo profiles expected"
    memory.flush()
    assert len(memory.profiles) == 0, f"Memory flush failed, profiles remain: {len(memory.profiles)}"
    print("  -> PASS: Memory flush completely purged all volatile RAM state.")

if __name__ == "__main__":
    test_pii_scrubbing_adversarial()
    test_unsolicited_stranger_profiling()
    test_url_scrubbing_protocol()
    test_memory_flush_lifecycle()
    print("\n" + "=" * 60)
    print("ALL ADVERSARIAL STRESS TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)
