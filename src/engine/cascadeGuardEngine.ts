import { MessageAnalysis, ThreatLevel } from '../types';
import { analyzeStylometricDrift } from './stylometryEngine';
import { analyzeForensicIntent } from './forensicScanner';
import { AMAN_BASELINE_PROFILE } from './baselineProfile';

// Sample Zero-Knowledge Friend Quiz templates for authentic account verification
const FRIEND_QUIZ_TEMPLATES = [
  {
    question: "Security Interlock Quiz: What was the nickname of our 1st-year Hostel Warden at KIET?",
    options: ["Gabbar Sir", "Sharma Ji", "Hitler Sir", "Verma Ji"],
    correctAnswer: "Gabbar Sir"
  },
  {
    question: "Security Interlock Quiz: Where did we eat Maggie after the last semester exam?",
    options: ["Maggi Point at Gate 2", "Hostel Night Canteen", "Sharma Dhaba", "Tapri near Library"],
    correctAnswer: "Maggi Point at Gate 2"
  },
  {
    question: "Security Interlock Quiz: What was our project title in the Web Tech Lab?",
    options: ["Smart Attendance App", "Hostel Food Rating", "Campus Lost & Found", "E-Library Portal"],
    correctAnswer: "Campus Lost & Found"
  }
];

export function runCascadeGuardPipeline(messageText: string): MessageAnalysis {
  const startTime = performance.now();

  // Run Agent 1: Stylometry
  const stylometricDrift = analyzeStylometricDrift(messageText, AMAN_BASELINE_PROFILE);

  // Run Agent 2: Forensic Intent
  const forensicIntent = analyzeForensicIntent(messageText);

  // Risk Fusion Equation:
  // Risk = 0.40 * StylometricDrift + 0.35 * FinancialCoercion + 0.25 * UrgencyScore
  let combinedRisk = Math.round(
    (stylometricDrift.overallDrift * 0.40) +
    (forensicIntent.financialCoercionScore * 0.35) +
    (forensicIntent.urgencyScore * 0.25)
  );

  // If a known blacklisted mule UPI ID is detected, bump directly to Critical
  if (forensicIntent.isVpaBlacklisted) {
    combinedRisk = Math.max(combinedRisk, 95);
  }

  // If APK malware vector is present with high urgency, bump to Critical
  if (forensicIntent.extractedAPKs.length > 0 && stylometricDrift.overallDrift > 60) {
    combinedRisk = Math.max(combinedRisk, 90);
  }

  // Determine Threat Level
  let threatLevel: ThreatLevel = 'SAFE';
  if (combinedRisk >= 75) {
    threatLevel = 'CRITICAL_ATO';
  } else if (combinedRisk >= 40) {
    threatLevel = 'SUSPICIOUS';
  }

  // Agent 3 & 4: Autonomous Enforcement
  const isThreat = threatLevel === 'CRITICAL_ATO';
  const actionsTaken = {
    shieldDeployed: isThreat,
    paymentLocked: isThreat && forensicIntent.extractedVPAs.length > 0,
    challengeQuizSuggested: isThreat,
    adminQuarantineAlertIssued: isThreat
  };

  const reverseChallengeQuiz = isThreat 
    ? FRIEND_QUIZ_TEMPLATES[Math.floor(Math.random() * FRIEND_QUIZ_TEMPLATES.length)]
    : undefined;

  const endTime = performance.now();
  const processingTimeMs = Math.round(Math.max(12, endTime - startTime));

  return {
    timestamp: Date.now(),
    processingTimeMs,
    threatLevel,
    overallRiskScore: combinedRisk,
    stylometricDrift,
    forensicIntent,
    actionsTaken,
    reverseChallengeQuiz
  };
}
