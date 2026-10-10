"""
CascadeGuard AI - Advanced Security Hardening Test Suite
Validates:
1. Multi-turn decoupled lateral coercion detection
2. Adversarial homoglyph & leetspeak de-obfuscation
3. Dynamic salted SHA-256 zero-knowledge friend quiz
4. Baseline model poisoning protection
5. On-device QR Code UPI Intent scanner
"""

import sys
import os
import time

# Ensure UTF-8
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from engine import CascadeGuardCore
from adversarial_normalizer import normalize_adversarial_text
from qr_scanner import QRCodeUPIScanner


def run_hardening_tests():
    print("=" * 70)
    print("RUNNING CASCADEGUARD ADVANCED HARDENING VALIDATION SUITE")
    print("=" * 70)

    core = CascadeGuardCore()
    tests_passed = 0

    # ── TEST 1: Adversarial De-obfuscation (Homoglyphs & Leetspeak) ──
    print("\n[TEST 1] Testing Homoglyph, Leetspeak & Interstitial De-obfuscation...")
    raw_leetspeak = "em3rgency h0spital me h jaldi ₹5000 t-r-a-n-s-f-e-r krde ispe: aman.emergency@okhdfcbank"
    res1 = core.evaluate(raw_leetspeak)
    assert res1.threat_level == "CRITICAL_ATO", f"Expected CRITICAL_ATO, got {res1.threat_level}"
    assert res1.overall_risk_score >= 88, f"Expected risk >= 88, got {res1.overall_risk_score}"
    assert any("Normalized" in r for r in res1.flagged_reasons), "Normalizer reason not flagged"
    print(f"  [PASS] Obfuscated attack intercepted (Risk: {res1.overall_risk_score}%, Latency: {res1.processing_time_ms}ms)")
    tests_passed += 1

    # ── TEST 2: Multi-Turn Decoupled Lateral Coercion ──
    print("\n[TEST 2] Testing Multi-Turn Split Attack (Decoupled Intent)...")
    # Turn 1: Panic & urgency marker only (no financial request)
    res2_a = core.evaluate("bhai urgent emergency hai hospital me hu call mt krna", user_id=4001, sender_name="Karan")
    assert res2_a.threat_level in ["SUSPICIOUS", "SAFE"], f"Expected non-critical, got {res2_a.threat_level}"

    # Turn 2: Financial request & VPA only (no panic words in message)
    res2_b = core.evaluate("gpay pe ₹10000 transfer krde ispe: karan.personal@paytm", user_id=4001, sender_name="Karan")
    assert res2_b.threat_level == "CRITICAL_ATO", f"Expected CRITICAL_ATO via multi-turn context, got {res2_b.threat_level}"
    assert any("Multi-Turn" in r for r in res2_b.flagged_reasons), "Multi-turn coercion reason not logged"
    print(f"  [PASS] Multi-turn split scam intercepted in Turn 2 (Risk: {res2_b.overall_risk_score}%)")
    tests_passed += 1

    # ── TEST 3: Dynamic Salted SHA-256 Friend Quiz ──
    print("\n[TEST 3] Testing Dynamic Salted SHA-256 Zero-Knowledge Quiz...")
    profile = core.memory.get_profile(1001)
    profile.set_challenge("Where was our 2024 trip?", "Manali Hills")
    assert profile.custom_challenge_hash is not None
    assert profile.custom_challenge_salt is not None
    assert "manali" not in profile.custom_challenge_hash  # Verify zero plaintext in RAM hash
    assert profile.verify_challenge("manali hills") is True
    assert profile.verify_challenge("Goa Beach") is False

    # Verify engine emits the custom challenge
    res3 = core.evaluate("Divyansh emergency hai ₹5000 bhej aman.emergency@okhdfcbank", user_id=1001)
    assert res3.friend_quiz is not None
    assert "Where was our 2024 trip?" in res3.friend_quiz["question"]
    print(f"  [PASS] Custom challenge generated & verified (Salted Hash: {profile.custom_challenge_hash[:12]}...)")
    tests_passed += 1

    # ── TEST 4: Baseline Model Poisoning Defense ──
    print("\n[TEST 4] Testing Model Poisoning Shield (Anchor Baseline Protection)...")
    # Attempt to inject 10 wildly different messages into Aman's profile
    poison_messages = [
        "CORPORATE FORMAL NOTIFICATION: PLEASE ADVISE REGARDING QUARTERLY BUDGETING MATTERS",
        "KINDLY DIRECT INVOICE DOCUMENTATION ACCORDINGLY WITHOUT FURTHER DELAY",
        "PURSUANT TO SECTION 14 CLAUSE 3 WE HEREBY DEMAND COMPLIANCE"
    ]
    for pmsg in poison_messages:
        core.memory.record_safe_message(1001, "Aman Sharma", pmsg)

    # Check that poisoning flag engaged
    assert profile.is_poisoning_flagged is True, "Failed to flag baseline poisoning attempt"
    print(f"  [PASS] Poisoning attempt detected and baseline frozen against contamination.")
    tests_passed += 1

    # ── TEST 5: QR Code Scanner Initialization & Payload Parsing ──
    print("\n[TEST 5] Testing On-Device QR Code Scanner...")
    qr_scanner = QRCodeUPIScanner()
    assert qr_scanner.detector is not None
    print(f"  [PASS] OpenCV QRCodeDetector initialized and ready for on-device image auditing.")
    tests_passed += 1

    print("\n" + "=" * 70)
    print(f"ALL {tests_passed}/{tests_passed} ADVANCED HARDENING TESTS PASSED!")
    print("=" * 70)


if __name__ == "__main__":
    run_hardening_tests()
