"""
CascadeGuard AI - Telegram Surface Automated Verification Test Suite
Validates the entire multi-agent defense pipeline, scoring algorithms, and Telegram responses.
"""

import sys
import time

# Ensure UTF-8 stdout encoding on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from engine import CascadeGuardCore, BaselineProfile
from bot import build_alert_card, build_alert_keyboard


def run_tests():
    print("=" * 70)
    print("RUNNING CASCADEGUARD TELEGRAM SURFACE AUTOMATED TEST SUITE")
    print("=" * 70)

    engine = CascadeGuardCore()
    tests_passed = 0
    total_tests = 6

    # ── TEST 1: Hospital Emergency ₹5,000 Scam (Critical ATO) ──
    print("\n[TEST 1] Verifying Hospital Emergency Scam Detection...")
    scam_msg = (
        "Priya urgent emergency hai! Chacha hospital me admit hue hain, operation start krna hai. "
        "URGENTLY ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga."
    )
    res1 = engine.evaluate(scam_msg)
    assert res1.threat_level == "CRITICAL_ATO", f"Expected CRITICAL_ATO, got {res1.threat_level}"
    assert res1.overall_risk_score >= 85, f"Expected risk >= 85, got {res1.overall_risk_score}"
    assert "aman.emergency@okhdfcbank" in res1.extracted_vpas, "Failed to extract VPA"
    assert res1.is_vpa_blacklisted == True, "Failed to match blacklisted mule VPA"
    assert res1.friend_quiz is not None, "Friend Quiz not generated"
    print(f"  [PASS] Intercepted in {res1.processing_time_ms}ms (Risk: {res1.overall_risk_score}%, VPA: {res1.extracted_vpas[0]})")
    tests_passed += 1

    # ── TEST 2: Fest Voting APK Malware Phishing ──
    print("\n[TEST 2] Verifying Fest Voting APK Phishing Detection...")
    apk_msg = (
        "Hey everyone, please vote for our band in InnoHacks fest contest! "
        "Just download this campus voting app: InnoHacks_Vote_2026.apk and enter OTP. Urgent deadline!"
    )
    res2 = engine.evaluate(apk_msg)
    assert res2.threat_level == "CRITICAL_ATO", f"Expected CRITICAL_ATO, got {res2.threat_level}"
    assert "InnoHacks_Vote_2026.apk" in res2.extracted_apks, "Failed to extract APK payload"
    assert res2.urgency_score > 50, "Urgency score too low"
    print(f"  [PASS] Intercepted in {res2.processing_time_ms}ms (Risk: {res2.overall_risk_score}%, APK: {res2.extracted_apks[0]})")
    tests_passed += 1

    # ── TEST 3: Authentic Baseline Hinglish Chat (Safe) ──
    print("\n[TEST 3] Verifying Legitimate User Baseline Alignment...")
    legit_msg = "Oyee sun, kal ke lab notes hain tere paas? Bhai canteen me aa rha h kya 10 min me?"
    res3 = engine.evaluate(legit_msg)
    assert res3.threat_level == "SAFE", f"Expected SAFE, got {res3.threat_level}"
    assert res3.overall_risk_score < 40, f"Expected risk < 40, got {res3.overall_risk_score}"
    assert len(res3.extracted_vpas) == 0, "False positive on VPA"
    print(f"  [PASS] Verified Authentic in {res3.processing_time_ms}ms (Risk: {res3.overall_risk_score}%)")
    tests_passed += 1

    # ── TEST 4: Sub-50ms Edge Latency Benchmark ──
    print("\n[TEST 4] Verifying Sub-50ms Edge Audit Latency Benchmark...")
    latencies = []
    for _ in range(50):
        t0 = time.perf_counter()
        engine.evaluate(scam_msg)
        latencies.append((time.perf_counter() - t0) * 1000)
    avg_latency = sum(latencies) / len(latencies)
    assert avg_latency < 50.0, f"Latency benchmark exceeded: {avg_latency:.2f}ms"
    print(f"  [PASS] 50-run Average Edge Latency: {avg_latency:.2f}ms (Well under 50ms limit!)")
    tests_passed += 1

    # ── TEST 5: Telegram Alert Card & Keyboard Builder ──
    print("\n[TEST 5] Verifying Telegram HTML Card & Inline Keyboard Generation...")
    card_html = build_alert_card(res1, "Aman Sharma")
    assert "<b>CASCADEGUARD ATO INTERCEPTION SHIELD</b>" in card_html
    assert "aman.emergency@okhdfcbank" in card_html
    
    keyboard = build_alert_keyboard(res1, 123456)
    assert len(keyboard.inline_keyboard) >= 2, "Keyboard should have at least 2 rows"
    assert "Payment Interlocked" in keyboard.inline_keyboard[0][0].text
    print(f"  [PASS] Telegram In-Chat Card & Inline Buttons constructed cleanly.")
    tests_passed += 1

    # ── TEST 6: User Calibration / Dynamic Baseline Update ──
    print("\n[TEST 6] Verifying Dynamic User Baseline Calibration (Adaptive Memory)...")
    profile = engine.memory.get_profile(1001)
    initial_samples = len(profile.messages)
    engine.memory.record_safe_message(1001, "Aman Sharma", "bhai hostel me match dekhne aa jao sab")
    updated_profile = engine.memory.get_profile(1001)
    assert len(updated_profile.messages) == initial_samples + 1
    print(f"  [PASS] Local zero-knowledge vector centroid updated (Total samples: {len(updated_profile.messages)})")
    tests_passed += 1

    # ── TEST 7: Forensic URL & Phishing Link Detection ──
    print("\n[TEST 7] Verifying Phishing & Malicious Link Detection...")
    phish_msg = "Vote for us right now: https://fest-voting-portal.xyz/login?ref=aman_vote"
    res7 = engine.evaluate(phish_msg)
    assert res7.threat_level == "CRITICAL_ATO", f"Expected CRITICAL_ATO, got {res7.threat_level}"
    assert res7.is_url_malicious == True, "Failed to flag malicious phishing URL"
    assert len(res7.extracted_urls) > 0, "Failed to extract URL"
    print(f"  [PASS] Intercepted Phishing Link in {res7.processing_time_ms}ms (URL: {res7.extracted_urls[0]})")
    tests_passed += 1

    total_tests = 7
    print("\n" + "=" * 70)
    print(f"ALL {tests_passed}/{total_tests} TESTS PASSED SUCCESSFULLY! (100% SUCCESS RATE)")
    print("Telegram Surface is fully validated and ready for hackathon deployment.")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    run_tests()
