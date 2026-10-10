export interface ForensicAnalysisOutput {
  financialCoercionScore: number; // 0 to 100
  urgencyScore: number; // 0 to 100
  extractedVPAs: string[];
  extractedUrls: string[];
  extractedAPKs: string[];
  isVpaBlacklisted: boolean;
  flaggedKeywords: string[];
}

// Simulated NPCI & I4C (Indian Cybercrime Coordination Centre) Mule Account Registry
const BLACKLISTED_MULE_VPAS = new Set([
  'aman.emergency@okhdfcbank',
  'mule.account.i4c@upi',
  'fasthelp.medical@ybl',
  'quickrefund99@paytm',
  '9876543210@ibl',
  'festvoting.support@axl'
]);

const URGENCY_TRIGGERS = [
  { pattern: /\b(emergency|hospital|accident|admitted|operation|icu|blood)\b/i, weight: 35, label: "Medical/Critical Emergency Claim" },
  { pattern: /\b(immediately|urgent|right now|jaldi|turant|ab ke ab|urgent hai)\b/i, weight: 25, label: "High Temporal Pressure / Coercion" },
  { pattern: /\b(blocked|police|fir|arrest|legal|court)\b/i, weight: 30, label: "Authority / Threat Coercion" },
  { pattern: /\b(within \d+ min|last chance|time limit)\b/i, weight: 20, label: "Artificial Deadline" }
];

const FINANCIAL_TRIGGERS = [
  { pattern: /(?:₹|rs\.?|inr)\s*\d+[\d,]*/i, weight: 30, label: "Direct Monetary Demand" },
  { pattern: /\b(transfer|send|gpay|phonepe|paytm|upi|bhejde|paise|rupaye)\b/i, weight: 25, label: "Payment Channel Instruction" },
  { pattern: /\b(return in \d+ (?:days?|hours?)|kal wapas|evening me deta hu)\b/i, weight: 20, label: "Unverified Repayment Guarantee" },
  { pattern: /\b(limit over|server down|bank issue)\b/i, weight: 15, label: "Payment Channel Deflection Excuse" }
];

const MALICIOUS_APK_PATTERNS = [
  /\b[\w.-]+\.apk\b/i,
  /\b(?:install|download|vote for me|fest pass|survey app)\b/i
];

const URL_PATTERNS = /https?:\/\/[^\s]+/gi;
const VPA_PATTERNS = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/gi;

export function analyzeForensicIntent(text: string): ForensicAnalysisOutput {
  const flaggedKeywords: string[] = [];
  let urgencyScore = 0;
  let financialCoercionScore = 0;

  // 1. Urgency Detection
  for (const trigger of URGENCY_TRIGGERS) {
    if (trigger.pattern.test(text)) {
      urgencyScore += trigger.weight;
      flaggedKeywords.push(trigger.label);
    }
  }

  // 2. Financial Coercion Detection
  for (const trigger of FINANCIAL_TRIGGERS) {
    if (trigger.pattern.test(text)) {
      financialCoercionScore += trigger.weight;
      flaggedKeywords.push(trigger.label);
    }
  }

  // 3. Extract VPAs
  const vpaMatches = text.match(VPA_PATTERNS) || [];
  const extractedVPAs = Array.from(new Set(vpaMatches));

  let isVpaBlacklisted = false;
  if (extractedVPAs.length > 0) {
    financialCoercionScore += 25;
    for (const vpa of extractedVPAs) {
      if (BLACKLISTED_MULE_VPAS.has(vpa.toLowerCase())) {
        isVpaBlacklisted = true;
        flaggedKeywords.push(`VPA Blacklist Match: ${vpa} flagged on I4C / NPCI Mule Threat Feed`);
        financialCoercionScore += 35;
      }
    }
  }

  // 4. Extract URLs
  const urlMatches = text.match(URL_PATTERNS) || [];
  const extractedUrls = Array.from(new Set(urlMatches));

  // 5. Extract APK Mentions
  const extractedAPKs: string[] = [];
  for (const pat of MALICIOUS_APK_PATTERNS) {
    const match = text.match(pat);
    if (match) {
      extractedAPKs.push(match[0]);
      flaggedKeywords.push(`Malicious Payload Vector: ${match[0]}`);
      urgencyScore += 25;
    }
  }

  urgencyScore = Math.min(100, Math.max(0, urgencyScore));
  financialCoercionScore = Math.min(100, Math.max(0, financialCoercionScore));

  return {
    financialCoercionScore,
    urgencyScore,
    extractedVPAs,
    extractedUrls,
    extractedAPKs,
    isVpaBlacklisted,
    flaggedKeywords: Array.from(new Set(flaggedKeywords))
  };
}
