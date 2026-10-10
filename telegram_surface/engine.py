"""
CascadeGuard AI - Python Core Intelligence Engine
On-device stylometric profiling, adaptive per-user memory, URL link scanner, and forensic intent analysis.
"""

import re
import time
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from user_memory import UserAdaptiveMemory, HINGLISH_TOKENS
from url_scanner import URLSecurityScanner
from adversarial_normalizer import normalize_adversarial_text
from qr_scanner import QRCodeUPIScanner

# Simulated NPCI & I4C (Indian Cybercrime Coordination Centre) Mule VPA Blacklist
BLACKLISTED_VPAS = {
    'aman.emergency@okhdfcbank',
    'mule.account.i4c@upi',
    'fasthelp.medical@ybl',
    'quickrefund99@paytm',
    '9876543210@ibl',
    'festvoting.support@axl'
}

URGENCY_REGEX = re.compile(
    r'\b(emergency|hospital|accident|admitted|operation|icu|blood|immediately|urgent|urgently|right now|jaldi|turant|ab ke ab|police|arrest|khatre?|danger|trouble|help|madad|bacha|bachao|save me|fas gy[ae]|risk|serious)\b',
    re.IGNORECASE
)

FINANCIAL_REGEX = re.compile(
    r'(?:(?:₹|rs\.?|inr)?\s*\d{3,}[\d,]*)|(?:\b(?:transfer|send|gpay|phonepe|paytm|upi|bhejde?|bhejo|paise|rupaye|money|cash|fund|bucks|udhaar|required|chahiye|mang rha|pay|payment|borrow)\b)',
    re.IGNORECASE
)

AFFECTION_REGEX = re.compile(
    r'\b(babu|baby|shona|jaan|darling|sweetheart|honey)\b',
    re.IGNORECASE
)

VPA_REGEX = re.compile(r'[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}')
APK_REGEX = re.compile(r'\b[\w.-]+\.apk\b', re.IGNORECASE)


@dataclass
class BaselineProfile:
    name: str = "Aman Sharma"
    historical_samples: List[str] = field(default_factory=lambda: [
        "Oyee sun, kal ke lab notes hain tere paas?",
        "bhai canteen me aa rha h kya?",
        "haan chal 5 min me nikalte hain hostel se",
        "bhai prof ne attendance lagayi kya meri?",
        "mast scene hai bhai sham ko khelne chalenge",
        "yaar vo assignment submit krna tha portal pe, link bhejio",
        "haha sahi h bhai chal sham ko library chalte hai"
    ])
    hinglish_baseline_ratio: float = 0.72
    punctuation_baseline_density: float = 0.03
    typical_greetings: List[str] = field(default_factory=lambda: [
        "bhai", "oyee", "sun", "yaar", "bro", "kaha h"
    ])


@dataclass
class AnalysisResult:
    threat_level: str  # SAFE, SUSPICIOUS, CRITICAL_ATO
    overall_risk_score: int  # 0 to 100
    processing_time_ms: float
    stylometric_drift: int  # 0 to 100
    financial_coercion_score: int  # 0 to 100
    urgency_score: int  # 0 to 100
    extracted_vpas: List[str]
    is_vpa_blacklisted: bool
    extracted_apks: List[str]
    extracted_urls: List[str]
    is_url_malicious: bool
    is_url_unverified: bool = False
    flagged_reasons: List[str] = field(default_factory=list)
    contact_name: str = "Contact"
    samples_indexed: int = 0
    friend_quiz: Optional[Dict[str, Any]] = None


class CascadeGuardCore:
    def __init__(self):
        # Adaptive Per-User Memory Engine
        self.memory = UserAdaptiveMemory()
        # Forensic URL / Link Scanner
        self.url_scanner = URLSecurityScanner()
        # On-Device QR Code Scanner
        self.qr_scanner = QRCodeUPIScanner()

    def evaluate(self, text: str, user_id: int = 1001, sender_name: str = "Aman Sharma", image_path: Optional[str] = None) -> AnalysisResult:
        start_time = time.perf_counter()
        reasons = []

        # ── 1. Adaptive Per-User Stylometric Profiler (Agent 1) ──
        drift_data = self.memory.calculate_drift(user_id=user_id, text=text)
        overall_drift = drift_data["overall_drift"]
        contact_name = drift_data["contact_name"]
        samples_indexed = drift_data["samples_indexed"]

        if drift_data["casing_drift"] > 40:
            reasons.append(f"Uncharacteristic uppercase emphasis ({drift_data['casing_drift']}% casing drift).")
        if drift_data["hinglish_drift"] > 40:
            reasons.append(f"Sudden depletion of habitual Hinglish vocabulary ({drift_data['hinglish_drift']}% vernacular drift).")
        if drift_data["punctuation_drift"] > 40:
            reasons.append(f"Excessive punctuation variance diverges from {contact_name}'s baseline.")

        # ── 2. Adversarial Text De-Obfuscation (Homoglyphs, Leetspeak, Spaced Delimiters) ──
        normalized_text = normalize_adversarial_text(text)
        scan_text = f"{text} {normalized_text}" if normalized_text != text else text
        if normalized_text != text:
            reasons.append("Adversarial Obfuscation Normalized: Homoglyphs/leetspeak detected and decoded.")

        # ── 3. Forensic Intent & VPA Scanner (Agent 2) ──
        urgency_score = 0
        urgency_matches = list(set(URGENCY_REGEX.findall(scan_text)))
        if urgency_matches:
            urgency_score = min(100, len(urgency_matches) * 35)
            reasons.append(f"Urgency coercion markers detected: {', '.join(urgency_matches)}")

        financial_score = 0
        financial_matches = list(set(FINANCIAL_REGEX.findall(scan_text)))
        if financial_matches:
            financial_score = min(100, len(financial_matches) * 35)
            reasons.append(f"Financial transfer requests detected: {', '.join(financial_matches)}")

        affection_matches = list(set(AFFECTION_REGEX.findall(scan_text)))
        if affection_matches and (financial_matches or urgency_matches):
            reasons.append(f"Affective social engineering lure detected ('{', '.join(affection_matches)}')")

        # VPA extraction
        extracted_vpas = list(set(VPA_REGEX.findall(scan_text)))
        is_blacklisted = False

        # Optional QR Code Image Inspection
        if image_path:
            qr_res = self.qr_scanner.scan_image(image_path)
            if qr_res.get("has_qr"):
                if qr_res.get("is_upi") and qr_res.get("vpa"):
                    extracted_vpas.append(qr_res["vpa"])
                    financial_matches.append(f"QR_UPI:{qr_res['vpa']}")
                    financial_score = max(financial_score, 80)
                    if qr_res.get("is_blacklisted"):
                        is_blacklisted = True
                reasons.extend(qr_res.get("reasons", []))

        if extracted_vpas:
            financial_score = min(100, financial_score + 35)
            for vpa in extracted_vpas:
                if vpa.lower() in BLACKLISTED_VPAS:
                    is_blacklisted = True
                    reasons.append(f"CRITICAL: Target VPA {vpa} matches I4C / NPCI Mule Registry!")

        # APK extraction
        extracted_apks = list(set(APK_REGEX.findall(scan_text)))
        if extracted_apks:
            urgency_score = min(100, urgency_score + 40)
            reasons.append(f"Malicious APK vector detected: {', '.join(extracted_apks)}")

        # ── 4. Forensic URL & Phishing Link Scanner ──
        url_scan = self.url_scanner.scan_text(scan_text)
        extracted_urls = [u["url"] for u in url_scan.get("urls_scanned", [])]
        is_url_malicious = url_scan.get("is_malicious", False)
        is_url_unverified = url_scan.get("is_unverified", False)
        if url_scan.get("has_urls"):
            reasons.extend(url_scan.get("reasons", []))

        # ── 5. Multi-Turn Conversation Context Integration ──
        profile = self.memory.get_profile(user_id)
        past_turns = self.memory.get_context(user_id)
        past_urgency_found = any(turn.get("has_urgency") for turn in past_turns)
        past_financial_found = any(turn.get("has_financial") or turn.get("has_vpa") for turn in past_turns)

        # Check for multi-turn split attacks (urgency in Turn 1, financial in Turn 2)
        has_current_coercion = bool(urgency_matches) or bool(financial_matches) or bool(extracted_vpas)
        has_compound_coercion = False

        if urgency_matches and (financial_matches or extracted_vpas):
            has_compound_coercion = True
        elif has_current_coercion:
            if urgency_matches and past_financial_found:
                has_compound_coercion = True
                reasons.append("Multi-Turn Lateral Coercion: Split urgency & financial request decoupled across conversation turns!")
            elif (financial_matches or extracted_vpas) and past_urgency_found:
                has_compound_coercion = True
                reasons.append("Multi-Turn Lateral Coercion: Split urgency & financial request decoupled across conversation turns!")

        # ── 6. Master Risk Fusion Arbiter ──
        risk_score = int(
            (overall_drift * 0.35) +
            (financial_score * 0.35) +
            (urgency_score * 0.30)
        )

        # Elevate composite risks
        if has_compound_coercion:
            risk_score = max(risk_score, 88)

        if is_blacklisted:
            risk_score = max(risk_score, 95)
        if extracted_apks and overall_drift > 40:
            risk_score = max(risk_score, 90)
        if is_url_malicious:
            risk_score = max(risk_score, url_scan.get("max_risk_score", 90))
        elif is_url_unverified:
            risk_score = max(risk_score, 78)

        if risk_score >= 70:
            threat_level = "CRITICAL_ATO"
        elif risk_score >= 35:
            threat_level = "SUSPICIOUS"
        else:
            threat_level = "SAFE"

        # Continuous Context Recording (Ephemeral multi-turn memory)
        self.memory.add_context_turn(user_id, {
            "text": text,
            "timestamp": time.time(),
            "has_urgency": bool(urgency_matches),
            "has_financial": bool(financial_matches),
            "has_vpa": bool(extracted_vpas)
        })

        if threat_level == "SAFE":
            self.memory.record_safe_message(user_id=user_id, name=sender_name, text=text)

        if profile and profile.is_poisoning_flagged:
            reasons.append("Baseline Poisoning Blocked: Abnormal drift from anchor prevented baseline contamination.")

        # Dynamic Zero-Knowledge Friend Quiz Challenge
        friend_quiz = None
        if threat_level == "CRITICAL_ATO":
            if profile and profile.custom_challenge_question:
                friend_quiz = {
                    "question": f"Zero-Knowledge Challenge: {profile.custom_challenge_question}",
                    "is_custom": True,
                    "challenge_hash": profile.custom_challenge_hash
                }
            else:
                friend_quiz = {
                    "question": f"Zero-Knowledge Challenge: What was the nickname of our 1st-year hostel warden at KIET?",
                    "options": ["Gabbar Sir", "Sharma Ji", "Hitler Sir", "Verma Ji"],
                    "correct": "Gabbar Sir"
                }

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        return AnalysisResult(
            threat_level=threat_level,
            overall_risk_score=risk_score,
            processing_time_ms=elapsed_ms,
            stylometric_drift=overall_drift,
            financial_coercion_score=financial_score,
            urgency_score=urgency_score,
            extracted_vpas=extracted_vpas,
            is_vpa_blacklisted=is_blacklisted,
            extracted_apks=extracted_apks,
            extracted_urls=extracted_urls,
            is_url_malicious=is_url_malicious,
            is_url_unverified=is_url_unverified,
            flagged_reasons=reasons,
            contact_name=contact_name,
            samples_indexed=samples_indexed,
            friend_quiz=friend_quiz
        )
