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

export interface CompanionStatus {
  status: 'connected' | 'mock' | 'reconnecting' | 'disconnected';
  account_name: string;
  username: string;
  active_interlocks: number;
  indexed_contacts: number;
  avg_latency_ms: number;
  uptime_sec: number;
  dpdp_egress_bytes: number;
  threats_neutralized: number;
  is_shield_active: boolean;
  dc_server: string;
}

export interface AuditedMessageResult {
  threat_level: ThreatLevel;
  overall_risk_score: number; // 0-100
  processing_time_ms: number;
  stylometric_drift: number; // 0-100
  financial_coercion_score: number; // 0-100
  urgency_score: number; // 0-100
  extracted_vpas: string[];
  is_vpa_blacklisted: boolean;
  extracted_urls: string[];
  extracted_apks: string[];
  is_url_malicious?: boolean;
  flagged_reasons: string[];
  interlocked: boolean;
  friend_quiz?: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
}

export interface AuditedMessageEvent {
  id: string;
  timestamp: number;
  chat_id: number;
  sender_name: string;
  username?: string;
  avatar?: string;
  text: string;
  result: AuditedMessageResult;
  containment_status?: 'interlocked' | 'quarantined' | 'dismissed' | 'safe';
}

export interface CompanionContact {
  user_id: number;
  name: string;
  username: string;
  avatar: string;
  samples_indexed: number;
  hinglish_ratio: number;
  punctuation_density: number;
  caps_ratio: number;
  has_custom_challenge: boolean;
  challenge_question?: string;
  challenge_answer_hash?: string;
  is_poisoning_flagged: boolean;
  last_updated?: number;
  drift_status?: 'nominal' | 'elevated' | 'critical';
}

export interface QRDetonationResult {
  has_qr: boolean;
  raw_payload: string | null;
  is_upi: boolean;
  vpa: string | null;
  payee_name: string | null;
  amount: string | null;
  currency?: string;
  is_blacklisted: boolean;
  risk_score: number;
  reasons: string[];
  scanned_at: number;
  preview_url?: string;
}

export type CompanionSocketEvent =
  | { event: 'INIT_STATE'; data: Partial<CompanionStatus> & { recent_events?: AuditedMessageEvent[] } }
  | { event: 'MESSAGE_AUDITED'; data: AuditedMessageEvent }
  | { event: 'MEMORY_FLUSHED'; data: { centroids_purged: number; profiles_cleared?: number; timestamp: number } }
  | { event: 'PONG'; timestamp: number }
  | { event: 'INTERLOCK_RESOLVED'; data: { chat_id: number; action: string } }
  | { event: 'CONTACTS_UPDATED'; data: { contacts: CompanionContact[] } }
  | { event: 'STATUS_CHANGE'; data: { status: CompanionStatus['status']; latency_ms: number } };

