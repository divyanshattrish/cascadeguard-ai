"""
CascadeGuard AI - Adversarial Text Normalizer & Anti-Evasion De-obfuscator
Defeats Unicode homoglyph substitution, leetspeak obfuscation, and interstitial delimiters
before intent regex and forensic keyword extraction.
"""

import re
import unicodedata
from typing import Dict, Tuple

# Cyrillic & Greek homoglyphs mapped to visual Latin equivalents
HOMOGLYPH_MAP: Dict[str, str] = {
    # Cyrillic lowercase
    'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x',
    'і': 'i', 'ї': 'i', 'ј': 'j', 'ѕ': 's', 'ԁ': 'd', 'ԛ': 'q', 'ԝ': 'w',
    # Cyrillic uppercase
    'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H', 'О': 'O',
    'Р': 'P', 'С': 'C', 'Т': 'T', 'Х': 'X', 'У': 'Y',
    # Greek
    'α': 'a', 'β': 'b', 'ε': 'e', 'ι': 'i', 'κ': 'k', 'ο': 'o', 'ρ': 'p',
    'τ': 't', 'υ': 'u', 'χ': 'x'
}

# Standard Leetspeak mapping
LEET_MAP: Dict[str, str] = {
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '@': 'a',
    '$': 's',
    '5': 's',
    '7': 't',
    '+': 't',
    '!': 'i'
}

# Regex to detect interstitial spacing/punctuation (e.g., e.m.e.r.g.e.n.c.y, t-r-a-n-s-f-e-r)
INTERSTITIAL_SPLIT_REGEX = re.compile(r'(?<=\b[a-zA-Z0-9])[.\-_*~ ](?=[a-zA-Z0-9]\b)')


def normalize_homoglyphs(text: str) -> str:
    """Replaces Unicode Cyrillic/Greek lookalikes with standard Latin characters."""
    # First canonical decomposition
    normalized = unicodedata.normalize('NFKD', text)
    # Then character-by-character homoglyph translation
    chars = [HOMOGLYPH_MAP.get(c, c) for c in normalized]
    return "".join(chars)


def deobfuscate_leetspeak(text: str) -> str:
    """Translates common leetspeak substitutions within alphabetic word contexts."""
    # Only replace numbers/symbols if they appear flanked by or part of words
    words = text.split()
    converted_words = []
    for word in words:
        # If word is an isolated amount or phone number, keep it as digits
        if word.isdigit() or (word.startswith(('₹', 'rs', 'rs.', 'inr')) and word[2:].isdigit()):
            converted_words.append(word)
            continue

        # If word has mixed letters and digits (e.g., em3rgency, h0spital)
        if any(c.isalpha() for c in word) and any(c in LEET_MAP for c in word):
            deobf = "".join(LEET_MAP.get(c, c) for c in word)
            converted_words.append(deobf)
        else:
            converted_words.append(word)

    return " ".join(converted_words)


def collapse_interstitial_delimiters(text: str) -> str:
    """
    Collapses single-character delimited words:
    't.r.a.n.s.f.e.r' -> 'transfer'
    'p-a-i-s-e' -> 'paise'
    'e m e r g e n c y' -> 'emergency'
    """
    # Pattern for single letters separated by non-word chars or spaces
    # E.g. t.r.a.n.s.f.e.r
    def _rejoin_spaced(match):
        return match.group(0).replace('.', '').replace('-', '').replace('_', '').replace(' ', '')

    collapsed = re.sub(r'\b(?:[a-zA-Z][.\-_ ]){3,}[a-zA-Z]\b', _rejoin_spaced, text)
    return collapsed


def normalize_adversarial_text(text: str) -> str:
    """
    Master anti-evasion normalization pipeline.
    Transforms obfuscated, homoglyphic, or leetspeak payloads into canonical text.
    """
    if not text:
        return ""

    # 1. Homoglyph normalization
    s1 = normalize_homoglyphs(text)
    # 2. Interstitial delimiter collapse
    s2 = collapse_interstitial_delimiters(s1)
    # 3. Leetspeak translation
    s3 = deobfuscate_leetspeak(s2)

    return s3
