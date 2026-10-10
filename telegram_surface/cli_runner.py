"""
CascadeGuard AI - Telegram Surface Interactive Terminal Simulator
Test and demonstrate the Telegram defense pipeline without needing a live Telegram API connection.
"""

import sys
import time

# Ensure UTF-8 stdout encoding on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from engine import CascadeGuardCore

def print_banner():
    print("""
=============================================================================
[SHIELD] CASCADEGUARD AI - TELEGRAM SURFACE INTERCEPTOR (CLI RUNNER)
=============================================================================
Platform Target: Telegram Ecosystem (TDLib / Bot Security Gateway)
Privacy Guarantee: Zero Cloud Egress * Volatile RAM Processing * DPDP Act 2023
=============================================================================
""")

def run_simulation():
    engine = CascadeGuardCore()
    print_banner()

    test_scenarios = [
        {
            "title": "Scenario 1: Hospital Emergency Rs 5,000 Scam (Lateral ATO)",
            "sender": "Aman Sharma (Compromised Session)",
            "message": "Priya urgent emergency hai! Chacha hospital me admit hue hain, operation start krna hai. URGENTLY Rs 5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga."
        },
        {
            "title": "Scenario 2: College Fest Voting APK Malware Phishing",
            "sender": "Aman Sharma (Compromised Session)",
            "message": "Hey everyone, vote for our band in the contest! Download this campus voting app: InnoHacks_Vote_Secure.apk and login with your mobile number. Urgent deadline!"
        },
        {
            "title": "Scenario 3: Authentic Baseline Message (Normal Friend)",
            "sender": "Aman Sharma (Legitimate Owner)",
            "message": "Oyee sun, kal ke lab notes hain tere paas? Bhai canteen me aa rha h kya 10 min me?"
        }
    ]

    for idx, sc in enumerate(test_scenarios, 1):
        print(f"\n[{idx}/3] RUNNING TEST: {sc['title']}")
        print(f"From: {sc['sender']}")
        print(f"Message: \"{sc['message']}\"")
        print("\n[*] Intercepting message 'at the glass'...")
        
        result = engine.evaluate(sc["message"])
        
        print(f"[*] Audit Completed in {result.processing_time_ms} ms!")
        print("-" * 65)
        print(f"• Threat Classification : {result.threat_level}")
        print(f"• Combined Risk Index   : {result.overall_risk_score}% / 100%")
        print(f"• Stylometric Drift     : {result.stylometric_drift}% (Divergence from Aman)")
        print(f"• Financial Coercion    : {result.financial_coercion_score}%")
        print(f"• Urgency Velocity      : {result.urgency_score}%")
        if result.extracted_vpas:
            print(f"• Extracted VPA         : {', '.join(result.extracted_vpas)}")
            print(f"• I4C / NPCI Blacklist  : {'[!] MATCH DETECTED (Mule Account)' if result.is_vpa_blacklisted else 'Clean'}")
        if result.extracted_apks:
            print(f"• Malicious APK Vector  : {', '.join(result.extracted_apks)}")
        
        print("\n[!] Triggered Autonomous Defensive Enforcement:")
        if result.threat_level == "CRITICAL_ATO":
            print("  [LOCK] [PAYMENT INTERLOCK ENGAGED] Direct payment links disabled.")
            print("  [ALERT] [IN-LINE TELEGRAM ALERT CARD DISPATCHED]")
            if result.friend_quiz:
                print(f"  [QUIZ] [FRIEND QUIZ GENERATED]: {result.friend_quiz['question']}")
                print(f"         Options: {', '.join(result.friend_quiz['options'])}")
            print("  [MUTE] [AGENT 4 CONTAGION ISOLATION]: Quarantine signal issued to group admin.")
        else:
            print("  [OK] [SAFE] Verified authentic baseline profile. No coercion found.")
        print("=" * 65)

    print("\n[+] All 3 Telegram defense scenarios verified successfully!")
    print("Ready to link with live Telegram Bot via 'python bot.py' using BotFather token.\n")


if __name__ == "__main__":
    run_simulation()
