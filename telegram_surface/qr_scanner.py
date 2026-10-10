"""
CascadeGuard AI - On-Device QR Code & Image UPI Intent Scanner
Decodes QR codes locally using OpenCV with zero cloud egress, extracting
UPI Intent parameters (pa, pn, am, cu) and checking target VPAs against blacklist registries.
"""

import os
from typing import Dict, Any, Optional
from urllib.parse import urlparse, parse_qs
import cv2
import numpy as np


class QRCodeUPIScanner:
    """Detects and decodes QR codes locally from images, extracting financial UPI targets."""

    def __init__(self):
        self.detector = cv2.QRCodeDetector()

    def scan_image(self, image_path_or_bytes: Any) -> Dict[str, Any]:
        """
        Scans an image from a file path or raw bytes, decodes any embedded QR code,
        and extracts UPI payload parameters.
        """
        result = {
            "has_qr": False,
            "raw_payload": None,
            "is_upi": False,
            "vpa": None,
            "payee_name": None,
            "amount": None,
            "is_blacklisted": False,
            "risk_score": 0,
            "reasons": []
        }

        try:
            # Load image into numpy array
            if isinstance(image_path_or_bytes, str):
                if not os.path.exists(image_path_or_bytes):
                    result["reasons"].append(f"Image file not found: {image_path_or_bytes}")
                    return result
                img = cv2.imread(image_path_or_bytes)
            elif isinstance(image_path_or_bytes, bytes):
                nparr = np.frombuffer(image_path_or_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            else:
                img = None

            if img is None:
                result["reasons"].append("Failed to decode image buffer.")
                return result

            # Detect and decode QR code
            decoded_text, points, _ = self.detector.detectAndDecode(img)

            if not decoded_text:
                # Try with grayscale enhancement
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                decoded_text, _, _ = self.detector.detectAndDecode(gray)

            if not decoded_text:
                return result

            result["has_qr"] = True
            result["raw_payload"] = decoded_text

            # Check if payload is a UPI Intent URL (upi://pay?...)
            if decoded_text.lower().startswith("upi://pay"):
                result["is_upi"] = True
                parsed = urlparse(decoded_text)
                qs = parse_qs(parsed.query)

                vpa = qs.get("pa", [None])[0]
                pn = qs.get("pn", [None])[0]
                am = qs.get("am", [None])[0]

                result["vpa"] = vpa
                result["payee_name"] = pn
                result["amount"] = am

                if vpa:
                    from engine import BLACKLISTED_VPAS
                    if vpa.lower() in BLACKLISTED_VPAS:
                        result["is_blacklisted"] = True
                        result["risk_score"] = 95
                        result["reasons"].append(f"CRITICAL: Scanned QR VPA ({vpa}) matches I4C/NPCI Mule Registry!")
                    else:
                        result["risk_score"] = 65
                        result["reasons"].append(f"Financial transfer QR code detected for VPA: {vpa}")
            elif decoded_text.lower().startswith(("http://", "https://")):
                result["reasons"].append(f"QR code contains web URL: {decoded_text}")
                result["risk_score"] = 50

        except Exception as e:
            result["reasons"].append(f"QR processing error: {e}")

        return result
