export type ThreatLevel = 'SAFE' | 'SUSPICIOUS' | 'CRITICAL_ATO';
export type SurfaceMode = 'whatsapp' | 'telegram';

export interface ChatMessage {
  id: string;
  sender: 'friend' | 'user';
  senderName: string;
  avatar: string;
  text: string;
  timestamp: string;
  vpaDetected?: string;
  apkDetected?: string;
  paymentLocked?: boolean;
  analysis?: MessageAnalysis;
}

export interface StylometricProfile {
  name: string;
  sampleMessageCount: number;
  averageWordLength: number;
  punctuationFrequency: {
    exclamation: number;
    question: number;
    ellipsis: number;
    comma: number;
  };
  hinglishRatio: number;
  slangFrequency: number;
  allCapsRatio: number;
  typicalGreetings: string[];
  characteristicKeywords: string[];
}

export interface MessageAnalysis {
  timestamp: number;
  processingTimeMs: number;
  threatLevel: ThreatLevel;
  overallRiskScore: number; // 0 to 100
  stylometricDrift: {
    overallDrift: number; // 0 to 100
    punctuationDrift: number;
    lexicalDrift: number;
    languageMixDrift: number;
    casingDrift: number;
    details: string[];
  };
  forensicIntent: {
    financialCoercionScore: number; // 0 to 100
    urgencyScore: number; // 0 to 100
    extractedVPAs: string[];
    extractedUrls: string[];
    extractedAPKs: string[];
    isVpaBlacklisted: boolean;
    flaggedKeywords: string[];
  };
  actionsTaken: {
    shieldDeployed: boolean;
    paymentLocked: boolean;
    challengeQuizSuggested: boolean;
    adminQuarantineAlertIssued: boolean;
  };
  reverseChallengeQuiz?: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
}

export interface ContagionNode {
  id: string;
  label: string;
  role: 'attacker' | 'compromised' | 'protected_contact' | 'vulnerable_contact' | 'community_group';
  status: 'active' | 'quarantined' | 'shielded' | 'targeted';
  membersCount?: number;
  preventedLoss?: number;
  x: number;
  y: number;
}

export interface ContagionEdge {
  id: string;
  source: string;
  target: string;
  status: 'intercepted' | 'propagating' | 'blocked';
  payloadSummary: string;
}
