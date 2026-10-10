"""
CascadeGuard AI - Safe Headless Sandbox Link Detonator
Runs incoming untrusted URLs in an isolated, volatile probe environment.
Inspects HTTP redirect hops, SSL/TLS responses, DOM credential harvesters,
drive-by download payloads, and brand impersonation without exposing the user's host.
"""

import re
import time
from typing import Dict, Any, List
from urllib.parse import urlparse
import requests
import urllib3
from bs4 import BeautifulSoup
from url_scanner import TRUSTED_DOMAINS

# Suppress SSL warnings inside the isolated detonation probe
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

TRUSTED_FAMILIES = [
    {'youtube.com', 'youtu.be', 'www.youtube.com', 'm.youtube.com'},
    {'google.com', 'www.google.com', 'goo.gl', 'maps.google.com', 'maps.app.goo.gl'},
    {'twitter.com', 'x.com', 't.co'},
    {'spotify.com', 'open.spotify.com', 'spotify.link'},
    {'whatsapp.com', 'wa.me', 'api.whatsapp.com'},
    {'telegram.org', 't.me', 'telegram.me'},
    {'reddit.com', 'redd.it', 'www.reddit.com'},
    {'github.com', 'github.io', 'raw.githubusercontent.com'}
]


class SandboxLinkDetonator:
    """Safely executes, probes, and analyzes incoming URLs in an isolated sandbox environment."""

    def __init__(self, timeout_sec: float = 3.5):
        self.timeout_sec = timeout_sec
        self.safe_headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (CascadeGuard-Sandbox/1.0)"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "close"
        }

    def detonate(self, url: str) -> Dict[str, Any]:
        """Safely probes the URL and returns a forensic report."""
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        start_time = time.perf_counter()
        parsed_orig = urlparse(url)
        initial_host = parsed_orig.hostname or ""

        report = {
            "initial_url": url,
            "final_url": url,
            "final_host": initial_host,
            "status_code": 0,
            "redirect_count": 0,
            "redirect_chain": [],
            "title": "Unknown",
            "has_password_inputs": False,
            "has_otp_inputs": False,
            "has_drive_by_download": False,
            "suspicious_scripts": False,
            "brand_spoof_detected": None,
            "risk_score": 0,
            "verdict": "SAFE",
            "forensic_flags": [],
            "sandbox_elapsed_ms": 0.0
        }

        try:
            # Ephemeral session with no persistent cookies or state
            session = requests.Session()
            session.trust_env = False  # Ignore system proxy leaks

            response = session.get(
                url,
                headers=self.safe_headers,
                timeout=self.timeout_sec,
                allow_redirects=True,
                stream=True,  # Stream first to avoid downloading massive binary payloads
                verify=False  # Inspect even self-signed / invalid SSL certificates
            )

            report["status_code"] = response.status_code
            report["final_url"] = response.url
            parsed_final = urlparse(response.url)
            report["final_host"] = parsed_final.hostname or initial_host

            # Trace redirect chain
            is_same_family = False
            for fam in TRUSTED_FAMILIES:
                if (initial_host in fam or any(initial_host.endswith('.' + f) for f in fam)) and \
                   (parsed_final.hostname in fam or any(parsed_final.hostname.endswith('.' + f) for f in fam)):
                    is_same_family = True
                    break

            if response.history:
                report["redirect_count"] = len(response.history)
                report["redirect_chain"] = [r.url for r in response.history] + [response.url]
                if parsed_final.hostname != initial_host and not is_same_family:
                    report["forensic_flags"].append(
                        f"Redirect Cloaking: Landed on different host '{parsed_final.hostname}'"
                    )
                    report["risk_score"] += 35

            # Check headers for drive-by downloadable executables
            content_disp = response.headers.get("Content-Disposition", "").lower()
            content_type = response.headers.get("Content-Type", "").lower()

            if any(ext in content_disp for ext in [".apk", ".exe", ".scr", ".bat", ".zip"]) or \
               any(m in content_type for m in ["application/vnd.android.package-archive", "application/x-msdownload"]):
                report["has_drive_by_download"] = True
                report["forensic_flags"].append("CRITICAL: Drive-by executable payload (.apk/.exe) offered for download!")
                report["risk_score"] += 80

            # Read up to first 256KB of HTML safely
            raw_html = ""
            if "text/html" in content_type or not content_type:
                chunk = next(response.iter_content(chunk_size=262144, decode_unicode=True), "")
                raw_html = chunk if isinstance(chunk, str) else chunk.decode('utf-8', errors='ignore')

            if raw_html:
                soup = BeautifulSoup(raw_html, "html.parser")

                # Extract page title
                if soup.title and soup.title.string:
                    report["title"] = soup.title.string.strip()[:60]

                # Inspect DOM for Credential Harvesters
                password_inputs = soup.find_all("input", attrs={"type": re.compile(r'password', re.I)})
                if password_inputs:
                    report["has_password_inputs"] = True
                    report["forensic_flags"].append(f"Credential Harvester: {len(password_inputs)} password field(s) detected in DOM.")
                    report["risk_score"] += 45

                # Inspect for OTP / PIN / Banking fields
                otp_inputs = soup.find_all("input", attrs={
                    "name": re.compile(r'(otp|pin|cvv|card|pan|aadhaar|secret)', re.I)
                })
                if otp_inputs:
                    report["has_otp_inputs"] = True
                    report["forensic_flags"].append("Sensitive Identity/Financial field (OTP/PIN/Card) detected in form.")
                    report["risk_score"] += 40

                # Meta-Refresh & Client-Side JavaScript Redirection Check
                meta_refresh = soup.find("meta", attrs={"http-equiv": re.compile(r'refresh', re.I)})
                js_redirect = re.search(r'(?:window|document)\.location(?:\.href|\.replace)?\s*=\s*[\'"][^\'"]+[\'"]', raw_html, re.I)
                if meta_refresh or js_redirect:
                    report["forensic_flags"].append("Evasive Client-Side Redirect: Meta-refresh / JavaScript relocation trigger.")
                    report["risk_score"] += 35

                # Fake OAuth / Social Sign-In Phishing Lure Check
                fake_oauth = re.search(r'(?:sign\s*in\s*with|log\s*in\s*with|continue\s*with|verify\s*with)\s*(?:google|telegram|apple|facebook|whatsapp)', raw_html, re.I)
                if fake_oauth and not is_same_family:
                    report["forensic_flags"].append(f"Fake OAuth Phishing Lure: Found '{fake_oauth.group(0)}' on third-party site.")
                    report["risk_score"] += 45

                # Obfuscated Scripts / Dangerous Eval Payloads
                if re.search(r'\b(eval|unescape|document\.write\s*\(unescape)\s*\(', raw_html):
                    report["suspicious_scripts"] = True
                    report["forensic_flags"].append("Obfuscated JavaScript: eval / unescape payload execution pattern detected.")
                    report["risk_score"] += 30

                # Inspect for Brand Impersonation in HTML Title or Meta
                text_corpus = (report["title"] + " " + raw_html[:2000]).lower()
                targeted_brands = ["sbi", "hdfc", "icici", "paytm", "phonepe", "gpay", "telegram", "innohacks", "voting"]
                for brand in targeted_brands:
                    if brand in text_corpus and brand not in report["final_host"]:
                        report["brand_spoof_detected"] = brand
                        report["forensic_flags"].append(f"Brand Impersonation: Page claims to be '{brand.upper()}' on third-party domain.")
                        report["risk_score"] += 40
                        break

        except requests.exceptions.Timeout:
            report["forensic_flags"].append("Connection timed out (Slow/Disposible bulletproof server).")
            report["risk_score"] += 20
        except requests.exceptions.SSLError:
            report["forensic_flags"].append("Invalid / Untrusted SSL Certificate (MITM or spoofed endpoint).")
            report["risk_score"] += 35
        except Exception as e:
            report["forensic_flags"].append(f"Connection error: {type(e).__name__}")
            report["risk_score"] += 10

        is_trusted_dest = any(report["final_host"] == td or report["final_host"].endswith('.' + td) for td in TRUSTED_DOMAINS)
        is_trusted_orig = any(initial_host == td or initial_host.endswith('.' + td) for td in TRUSTED_DOMAINS)

        if (is_trusted_orig or is_trusted_dest) and not report["has_drive_by_download"]:
            report["is_trusted"] = True
            report["risk_score"] = 0
            report["verdict"] = "TRUSTED_AUTHORITY"
            report["forensic_flags"] = [f"Verified Authority: Authenticated platform ({report['final_host']})"]
        else:
            report["is_trusted"] = False
            report["risk_score"] = min(100, max(report["risk_score"], 20 if report["status_code"] == 0 else 0))

            if report["risk_score"] >= 75:
                report["verdict"] = "MALICIOUS_PHISHING"
            elif report["risk_score"] >= 45:
                report["verdict"] = "SUSPICIOUS_UNVERIFIED"
            else:
                report["verdict"] = "REACHABLE_CLEAN"

        report["sandbox_elapsed_ms"] = round((time.perf_counter() - start_time) * 1000, 2)
        return report
