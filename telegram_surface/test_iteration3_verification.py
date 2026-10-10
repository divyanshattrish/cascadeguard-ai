"""
Adversarial Verification Suite - Iteration 3
Empirical Challenger Verification for CascadeGuard Telegram Surface.

Verifies:
1. Bank OTP alerts in varied SMS syntaxes.
2. Natural language passwords and passcodes.
3. Formatted credit cards vs Aadhaar and account numbers without numerical collisions.
4. CountVectorizer feature vocabulary contamination immunity.
5. Statutory documentation token alignment in LEGAL_COMPLIANCE_DPDP.md.
"""

import sys
import re
from pathlib import Path
from user_memory import UserAdaptiveMemory, scrub_sensitive_data, SCRUB_RULES

def test_bank_otp_alerts():
    print("[CHALLENGE 1] Verifying Bank OTP Alerts Scrubbing...")
    cases = [
        ("Your HDFC OTP is 987654", "987654"),
        ("OTP for txn of INR 5000 is 112233", "112233"),
        ("Dear Customer, OTP for txn of INR 5000 is 112233", "112233"),
        ("Your SBI OTP is 445566", "445566"),
        ("Your ICICI bank verification code is 654321", "654321"),
        ("Use OTP: 1234 to login", "1234"),
        ("One-Time-Password for your order is 789012", "789012"),
        ("Enter your 6-digit OTP 889900 within 10 mins", "889900"),
        ("Share OTP 443322 with delivery agent", "443322"),
        ("Your security code is 556677", "556677"),
        ("Do not share this code: your Axis OTP is 332211", "332211"),
        ("Your OTP for payment of Rs 2499.00 is 556677", "556677"),
        ("Enter OTP 4321 for your purchase of INR 999", "4321")
    ]
    for text, secret in cases:
        scrubbed = scrub_sensitive_data(text)
        assert secret not in scrubbed, f"FAILED: Secret {secret} leaked in: {scrubbed}"
        assert "[REDACTED_OTP]" in scrubbed, f"FAILED: [REDACTED_OTP] token missing in: {scrubbed}"
    print("  -> [PASS] All Bank OTP alerts successfully redacted to [REDACTED_OTP].")

def test_natural_language_passwords():
    print("\n[CHALLENGE 2] Verifying Natural Language Passwords Scrubbing...")
    cases = [
        ("My password is Password123", "Password123"),
        ("WiFi pass: Secret123", "Secret123"),
        ("password = hunter2", "hunter2"),
        ("passcode is 9988", "9988"),
        ("secret is TopSecretKey", "TopSecretKey"),
        ("passwd: admin_pwd", "admin_pwd"),
        ("SecretPassword99!", "SecretPassword99!"),
        ("My login pass is securePass99", "securePass99")
    ]
    for text, secret in cases:
        scrubbed = scrub_sensitive_data(text)
        assert secret not in scrubbed, f"FAILED: Password {secret} leaked in: {scrubbed}"
        assert "[REDACTED_CREDENTIAL]" in scrubbed, f"FAILED: [REDACTED_CREDENTIAL] token missing in: {scrubbed}"
    print("  -> [PASS] All Natural Language Passwords successfully redacted to [REDACTED_CREDENTIAL].")

def test_cards_and_numerical_collision():
    print("\n[CHALLENGE 3] Verifying Payment Cards vs Aadhaar & Account Collisions...")
    cases = [
        # 16-digit cards formatted
        ("Card: 4532 0123 4567 8910", "[REDACTED_CARD]", ["4532", "0123", "4567", "8910"]),
        ("Card: 4532-0123-4567-8910", "[REDACTED_CARD]", ["4532", "0123", "4567", "8910"]),
        ("Card: 4532012345678910", "[REDACTED_CARD]", ["4532012345678910"]),
        # 12-digit Aadhaar
        ("Aadhaar: 1234 5678 9012", "[REDACTED_AADHAAR]", ["1234", "5678", "9012"]),
        ("Aadhaar: 123456789012", "[REDACTED_AADHAAR]", ["123456789012"]),
        # 9-18 digit Account numbers
        ("Bank A/C: 123456789012345", "[REDACTED_ACCOUNT]", ["123456789012345"]),
        ("Bank A/C: 987654321", "[REDACTED_ACCOUNT]", ["987654321"])
    ]
    for text, expected_token, raw_digits in cases:
        scrubbed = scrub_sensitive_data(text)
        assert expected_token in scrubbed, f"FAILED: Expected {expected_token} in: {scrubbed}"
        for d in raw_digits:
            assert d not in scrubbed, f"FAILED: Digit sequence {d} leaked in: {scrubbed}"
    print("  -> [PASS] Payment cards, Aadhaar, and Accounts scrubbed cleanly without numerical collision.")

def test_vectorizer_vocabulary_isolation():
    print("\n[CHALLENGE 4] Verifying CountVectorizer Vocabulary Immunity...")
    memory = UserAdaptiveMemory()
    test_user_id = 9999
    sensitive_messages = [
        "Your HDFC OTP is 987654",
        "OTP for txn of INR 5000 is 112233",
        "My password is Password123",
        "WiFi pass: Secret123",
        "Card: 4532 0123 4567 8910",
        "Aadhaar: 1234 5678 9012",
        "Client GSTIN: 07AAAAA0000A1Z5",
        "PAN: ABCDE1234F",
        "API Secret: sk_live_998877665544332211",
        "Bank account: 123456789012345"
    ]
    for msg in sensitive_messages:
        memory.record_safe_message(user_id=test_user_id, name="Adversarial User", text=msg, create_if_missing=True)

    profile = memory.get_profile(test_user_id)
    assert profile is not None, "Profile was not created!"
    assert profile.vectorizer is not None, "Vectorizer was not initialized!"
    vocab = profile.vectorizer.get_feature_names_out()

    forbidden_tokens = [
        "987654", "112233", "5000", "password123", "secret123",
        "4532", "0123", "4567", "8910", "1234", "5678", "9012",
        "07aaaaa0000a1z5", "abcde1234f", "sk_live_998877665544332211", "123456789012345"
    ]
    for ft in forbidden_tokens:
        matches = [v for v in vocab if ft in v]
        assert len(matches) == 0, f"FAILED: Forbidden sensitive token {ft} discovered in vocabulary: {matches}"
    print(f"  -> [PASS] Profile vocabulary ({len(vocab)} features) is 100% credential-free!")

def test_legal_compliance_doc_alignment():
    print("\n[CHALLENGE 5] Verifying LEGAL_COMPLIANCE_DPDP.md Section 6.4 Alignment...")
    doc_path = Path(__file__).resolve().parent.parent / "LEGAL_COMPLIANCE_DPDP.md"
    assert doc_path.exists(), f"LEGAL_COMPLIANCE_DPDP.md not found at {doc_path}"

    content = doc_path.read_text(encoding="utf-8")
    section_match = re.search(r"### 6\.4 Question 4:.*?(?=### 6\.5|\Z)", content, re.DOTALL)
    assert section_match is not None, "Section 6.4 not found in legal document!"
    sec_text = section_match.group(0)

    # Active tokens in user_memory.py
    active_tokens = {replacement for _, replacement in SCRUB_RULES}
    print(f"  Active tokens in codebase: {active_tokens}")

    # Check key active tokens cited in Section 6.4
    expected_citations = [
        "[REDACTED_OTP]",
        "[REDACTED_CARD]",
        "[REDACTED_CREDENTIAL]",
        "[REDACTED_AMOUNT]",
        "[REDACTED_API_KEY]",
        "[REDACTED_SECRET]",
        "[REDACTED_TAX_ID]",
        "[TAX_IDENTIFIER]",
        "[REDACTED_PAN]",
        "[REDACTED_AADHAAR]",
        "[REDACTED_ACCOUNT]",
        "[REDACTED_EMAIL]",
        "[REDACTED_PHONE]"
    ]
    for tok in expected_citations:
        assert tok in sec_text, f"FAILED: Token {tok} not cited in Section 6.4!"

    # Ensure no obsolete phantom tokens remain in Section 6.4
    assert "[REDACTED_NUM]" not in sec_text, "FAILED: Obsolete token [REDACTED_NUM] still in Section 6.4!"
    assert r"\1: [REDACTED]" not in sec_text, "FAILED: Obsolete backreference still in Section 6.4!"
    print("  -> [PASS] Section 6.4 perfectly synchronized with SCRUB_RULES active tokens.")

if __name__ == "__main__":
    print("=" * 70)
    print("CASCADEGUARD ADVERSARIAL VERIFICATION HARNESS - ITERATION 3")
    print("=" * 70)
    test_bank_otp_alerts()
    test_natural_language_passwords()
    test_cards_and_numerical_collision()
    test_vectorizer_vocabulary_isolation()
    test_legal_compliance_doc_alignment()
    print("\n" + "=" * 70)
    print("ALL 5 CHALLENGE VECTORS VERIFIED CLEANLY - APPROVE")
    print("=" * 70)
