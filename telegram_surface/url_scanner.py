"""
CascadeGuard AI - Forensic URL & Phishing Link Scanner
Real-time client-side analysis of incoming links for credential harvesting,
typo-squatting, URL shortener cloaking, brand spoofing, and conversational context fusion.
"""

import re
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse

# High-risk / disposable TLDs frequently abused in rapid phishing campaigns
HIGH_RISK_TLDS = {
    'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'click', 'icu',
    'rest', 'cam', 'surf', 'ru', 'cn', 'work', 'download', 'live', 'fit'
}

# URL shorteners used to cloak malicious destinations
URL_SHORTENERS = {
    'bit.ly', 'tinyurl.com', 'is.gd', 'cutt.ly', 'rb.gy', 
    'ow.ly', 'buff.ly', 'shorte.st', 'bc.vc'
}

# Targeted financial, campus, and credential brands commonly spoofed in India
SPOOF_TARGETS = [
    'sbi', 'hdfc', 'icici', 'paytm', 'phonepe', 'gpay', 'bhim',
    'aadhaar', 'pan-card', 'incometax', 'whatsapp', 'telegram',
    'innohacks', 'kiet', 'voting', 'contest', 'fest-pass', 'free-recharge'
]

# Legitimate authoritative root domains for those brands
LEGITIMATE_DOMAINS = {
    'sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'icicibank.com',
    'paytm.com', 'phonepe.com', 'google.com', 'whatsapp.com',
    'telegram.org', 't.me', 'kiet.edu', 'incometax.gov.in', 'uidai.gov.in'
}

import os
import json

TOP_10K_FILE = os.path.join(os.path.dirname(__file__), "top_10k_domains.json")
TOP_10K_SET = set()
if os.path.exists(TOP_10K_FILE):
    try:
        with open(TOP_10K_FILE, "r", encoding="utf-8") as f:
            TOP_10K_SET = set(json.load(f))
    except Exception:
        pass

# Globally trusted domains & official shorteners exempt from Zero-Trust interlock
TRUSTED_DOMAINS = {
    # Media & Social
    'google.com', 'youtube.com', 'youtu.be', 'github.com', 'wikipedia.org',
    'linkedin.com', 'lnkd.in', 'instagram.com', 'twitter.com', 'x.com', 't.co',
    'facebook.com', 'telegram.org', 't.me', 'whatsapp.com', 'wa.me',
    'reddit.com', 'redd.it', 'discord.com', 'discord.gg',
    # Entertainment & Commerce
    'spotify.com', 'spotify.link', 'netflix.com', 'amazon.in', 'amazon.com', 'flipkart.com',
    # Tech & Dev Platforms
    'microsoft.com', 'apple.com', 'cloudflare.com', 'medium.com', 'dev.to',
    'stackoverflow.com', 'leetcode.com', 'hackerrank.com', 'codechef.com',
    'geeksforgeeks.org', 'pypi.org', 'npmjs.com', 'notion.so', 'figma.com',
    'coursera.org', 'udemy.com', 'canva.com', 'zoom.us', 'slack.com', 'drive.google.com'
} | TOP_10K_SET

# Authoritative institutional domain suffixes
TRUSTED_SUFFIXES = (
    '.gov.in', '.nic.in', '.edu', '.ac.in', '.edu.in', '.gov', '.mil'
)

# Suspicious path triggers
SUSPICIOUS_PATH_PATTERNS = [
    re.compile(r'/(?:login|verify|signin|auth|claim|reward|free|gift|contest|vote|airdrop|otp)', re.IGNORECASE),
    re.compile(r'\.(?:apk|exe|scr|bat|cmd|vbs|zip)$', re.IGNORECASE)
]

# Known malware & phishing test domains (Simulated Threat Feed)
KNOWN_MALICIOUS_DOMAINS = {
    'fest-voting-portal.xyz',
    'free-recharge-2026.top',
    'telegram-nitro-gift.click',
    'sbi-kyc-update-portal.online',
    'kiet-fest-pass-free.buzz',
    'claim-5000-rupees.icu',
    'callbomberz.in'
}

# Conversational context lure keywords (raises link suspicion)
CONTEXT_LURE_PATTERNS = re.compile(
    r'\b(vote|voting|contest|poll|register|registration|form|link pe click|otp|code|gift|claim|free recharge|pass|ticket|winner|prize|bonus|earn|hack|bypass|download this app|install apk|hurry|deadline|fast|urgent)\b',
    re.IGNORECASE
)

# Conversational benign keywords (lowers suspicion for clean content)
CONTEXT_BENIGN_PATTERNS = re.compile(
    r'\b(gaana|song|video|track|playlist|meme|funny|movie|trailer|news|article|read this|notes|assignment|repo|code|library|paper|research|recipe)\b',
    re.IGNORECASE
)


def levenshtein_distance(s1: str, s2: str) -> int:
    """Computes basic Levenshtein distance for typo-squatting detection."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]


class URLSecurityScanner:
    """Analyzes URLs extracted from chat messages with high precision and conversational context."""

    def __init__(self):
        self.url_pattern = re.compile(
            r'https?://[^\s<>"]+|www\.[^\s<>"]+',
            re.IGNORECASE
        )

    def extract_urls(self, text: str) -> List[str]:
        """Extracts all full and naked URLs from conversational text."""
        return self.url_pattern.findall(text)

    def is_trusted_domain(self, hostname: str) -> bool:
        """Determines if the hostname belongs to an authenticated top platform or institutional TLD in O(1) time."""
        hostname = (hostname or '').lower()
        # Public URL shorteners are explicitly excluded from blind trust (must be uncloaked!)
        if hostname in URL_SHORTENERS or any(hostname.endswith('.' + s) for s in URL_SHORTENERS):
            return False
        if hostname in TRUSTED_DOMAINS:
            return True
        # Check root domain and subdomains in O(1) hash map
        parts = hostname.split('.')
        if len(parts) >= 2 and '.'.join(parts[-2:]) in TRUSTED_DOMAINS:
            return True
        if len(parts) >= 3 and '.'.join(parts[-3:]) in TRUSTED_DOMAINS:
            return True
        if any(hostname.endswith(sfx) for sfx in TRUSTED_SUFFIXES):
            return True
        return False

    def scan_url(self, url: str) -> Dict[str, Any]:
        """Performs deep heuristic, reputation, and typo-squatting analysis on a single URL."""
        if not url.startswith(('http://', 'https://')):
            test_url = 'http://' + url
        else:
            test_url = url

        parsed = urlparse(test_url)
        hostname = (parsed.hostname or '').lower()
        path = parsed.path.lower()
        query = parsed.query.lower()

        reasons = []
        risk_score = 0
        is_spoofed = False
        is_unverified = False

        is_shortener = hostname in URL_SHORTENERS or any(hostname.endswith('.' + s) for s in URL_SHORTENERS)
        is_trusted = False if is_shortener else self.is_trusted_domain(hostname)

        # 1. Known Blacklist Feed Check
        if hostname in KNOWN_MALICIOUS_DOMAINS:
            risk_score = 100
            reasons.append(f"Domain '{hostname}' blacklisted in Global Threat Feed!")

        # 2. URL Shortener Cloaking Check (Triggers sandbox detonation!)
        elif is_shortener:
            risk_score = 75
            is_unverified = True
            reasons.append(f"Public URL Shortener cloaking ({hostname}): True destination masked. Sandboxed uncloaking required.")

        # 3. High-Risk Disposable TLD Check
        tld = hostname.split('.')[-1] if '.' in hostname else ''
        if tld in HIGH_RISK_TLDS:
            risk_score = max(risk_score, 80)
            reasons.append(f"High-abuse disposable TLD (.{tld}) linked to fast-flux phishing.")

        # 4. Brand Spoofing & Typo-squatting (Levenshtein Distance)
        if not is_trusted:
            for brand in SPOOF_TARGETS:
                if brand in hostname:
                    is_legit = any(hostname == ld or hostname.endswith('.' + ld) for ld in LEGITIMATE_DOMAINS)
                    if not is_legit:
                        is_spoofed = True
                        risk_score = max(risk_score, 85)
                        reasons.append(f"Brand Impersonation: '{brand}' targeted outside legitimate domain.")
                else:
                    # Typo-squatting fuzzing (distance <= 1 on core domain token)
                    tokens = hostname.split('.')
                    main_token = tokens[0] if len(tokens) > 1 else hostname
                    if len(brand) >= 4 and levenshtein_distance(main_token, brand) == 1:
                        is_spoofed = True
                        risk_score = max(risk_score, 90)
                        reasons.append(f"Typo-Squatting detected: '{main_token}' mimics '{brand}'.")

        # 5. Suspicious Path or Downloadable Payload Pattern
        for pat in SUSPICIOUS_PATH_PATTERNS:
            if pat.search(path) or pat.search(query):
                risk_score = max(risk_score, 75)
                reasons.append(f"Credential lure / payload trigger detected in path: '{path}'")
                break

        # 6. Raw IP Address Hostname Check
        if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', hostname):
            risk_score = max(risk_score, 85)
            reasons.append("Raw numeric IP address used instead of authenticated domain.")

        # 7. Zero-Trust Policy for Unknown External Domains
        if not is_trusted and risk_score == 0:
            is_unverified = True
            risk_score = 65
            reasons.append(f"Unverified external domain '{hostname}': Zero-Trust evaluation engaged.")

        risk_score = min(100, risk_score)

        if is_trusted and risk_score < 75:
            risk_score = 0
            status = "TRUSTED"
        elif risk_score >= 75:
            status = "MALICIOUS"
        elif is_unverified or risk_score >= 50:
            status = "UNVERIFIED"
        else:
            status = "NEUTRAL"

        return {
            "url": url,
            "hostname": hostname,
            "risk_score": risk_score,
            "status": status,
            "is_trusted": is_trusted,
            "is_malicious": status == "MALICIOUS",
            "is_unverified": is_unverified,
            "is_shortener": is_shortener,
            "is_spoofed": is_spoofed,
            "reasons": reasons
        }

    def scan_text(self, text: str) -> Dict[str, Any]:
        """Extracts and scans all URLs within a text message, applying conversational context fusion."""
        urls = self.extract_urls(text)
        if not urls:
            return {
                "has_urls": False,
                "urls_scanned": [],
                "max_risk_score": 0,
                "is_malicious": False,
                "is_unverified": False,
                "context_modifier": 0,
                "summary": "No URLs detected."
            }

        scan_results = [self.scan_url(u) for u in urls]
        base_max_risk = max((r["risk_score"] for r in scan_results), default=0)

        # Conversational Context Multiplier
        lure_matches = CONTEXT_LURE_PATTERNS.findall(text)
        benign_matches = CONTEXT_BENIGN_PATTERNS.findall(text)
        context_modifier = 0
        context_reasons = []

        if lure_matches:
            context_modifier += min(35, len(lure_matches) * 15)
            context_reasons.append(f"Conversational lure / urgency markers detected: {', '.join(set(lure_matches))}")
        elif benign_matches and not any(r["is_malicious"] for r in scan_results):
            context_modifier -= 25  # Casual sharing discount

        adjusted_risk = max(0, min(100, base_max_risk + context_modifier))

        all_reasons = []
        for r in scan_results:
            all_reasons.extend(r["reasons"])
        all_reasons.extend(context_reasons)

        is_malicious = adjusted_risk >= 75 or any(r["is_malicious"] for r in scan_results)
        is_unverified = any(r["is_unverified"] for r in scan_results) and not is_malicious

        return {
            "has_urls": True,
            "urls_scanned": scan_results,
            "base_risk_score": base_max_risk,
            "max_risk_score": adjusted_risk,
            "is_malicious": is_malicious,
            "is_unverified": is_unverified,
            "context_modifier": context_modifier,
            "reasons": list(set(all_reasons))
        }
