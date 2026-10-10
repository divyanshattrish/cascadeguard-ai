import { StylometricProfile } from '../types';
import { AMAN_BASELINE_PROFILE } from './baselineProfile';

export interface StylometryAnalysisOutput {
  overallDrift: number; // 0 to 100
  punctuationDrift: number;
  lexicalDrift: number;
  languageMixDrift: number;
  casingDrift: number;
  details: string[];
}

// Common Hinglish colloquial tokens
const HINGLISH_TOKENS = new Set([
  'bhai', 'yaar', 'oyee', 'sun', 'kaha', 'kaisa', 'kaise', 'chal', 'haan', 'nahi', 
  'bhejde', 'bhej', 'krde', 'krna', 'karega', 'aara', 'aa', 'raha', 'rha', 'scene',
  'notes', 'lab', 'hostel', 'canteen', 'mast', 'sahi', 'tera', 'mera', 'apna', 'hum',
  'toh', 'bhi', 'kuch', 'matlab', 'thik', 'theek', 'ab', 'kal', 'aaj', 'sham', 'subah'
]);

const FORMAL_ENGLISH_MARKERS = new Set([
  'kindly', 'immediately', 'urgent', 'request', 'assistance', 'hospital', 'emergency',
  'dear', 'regards', 'transfer', 'amount', 'account', 'blocked', 'critical', 'situation',
  'matter', 'please', 'transferring', 'admitted', 'condition'
]);

export function analyzeStylometricDrift(
  text: string, 
  baseline: StylometricProfile = AMAN_BASELINE_PROFILE
): StylometryAnalysisOutput {
  const details: string[] = [];
  const words = text.toLowerCase().match(/\b[a-zA-Z0-9']+\b/g) || [];
  const rawLength = text.length;

  if (words.length === 0) {
    return {
      overallDrift: 0,
      punctuationDrift: 0,
      lexicalDrift: 0,
      languageMixDrift: 0,
      casingDrift: 0,
      details: ["Message too short for statistical stylometric drift computation."]
    };
  }

  // 1. Punctuation Analysis
  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const commas = (text.match(/,/g) || []).length;
  const periods = (text.match(/\./g) || []).length;
  
  const punctRatio = (exclamations + questions + commas + periods) / Math.max(1, rawLength);
  const baselinePunct = Object.values(baseline.punctuationFrequency).reduce((a, b) => a + b, 0);
  
  const punctDiff = Math.abs(punctRatio - baselinePunct) * 100;
  const punctDrift = Math.min(100, Math.round(punctDiff * 8));

  if (exclamations >= 2 || (exclamations > 0 && baseline.punctuationFrequency.exclamation < 0.05)) {
    details.push(`High exclamation density (${exclamations}x) diverges from sender's relaxed baseline.`);
  }

  // 2. Casing & Caps Drift
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const upperRatio = upperCount / Math.max(1, rawLength);
  const casingDrift = Math.min(100, Math.round(Math.abs(upperRatio - baseline.allCapsRatio) * 220));

  if (upperRatio > 0.15) {
    details.push(`Unusual capitalized emphasis detected (${Math.round(upperRatio * 100)}% uppercase).`);
  }

  // 3. Hinglish vs Formal Language Drift
  let hinglishCount = 0;
  let formalCount = 0;
  
  for (const word of words) {
    if (HINGLISH_TOKENS.has(word)) hinglishCount++;
    if (FORMAL_ENGLISH_MARKERS.has(word)) formalCount++;
  }

  const currentHinglishRatio = hinglishCount / words.length;
  const hinglishDelta = baseline.hinglishRatio - currentHinglishRatio;
  const languageMixDrift = Math.min(100, Math.max(0, Math.round(hinglishDelta * 95)));

  if (currentHinglishRatio < 0.20 && baseline.hinglishRatio > 0.60) {
    details.push(`Absence of usual Hinglish vernacular slang (Baseline: ${Math.round(baseline.hinglishRatio * 100)}% -> Observed: ${Math.round(currentHinglishRatio * 100)}%).`);
  }

  // 4. Vocabulary / Lexical Cosine Drift
  let characteristicMatches = 0;
  for (const word of words) {
    if (baseline.characteristicKeywords.includes(word)) {
      characteristicMatches++;
    }
  }

  const vocabMatchRatio = characteristicMatches / Math.max(1, words.length);
  const lexicalDrift = Math.min(100, Math.max(15, Math.round((1 - vocabMatchRatio) * 90)));

  // 5. Greeting Check
  const firstWord = words[0] || '';
  const firstTwoWords = words.slice(0, 2).join(' ');
  const hasTypicalGreeting = baseline.typicalGreetings.some(g => 
    firstWord.includes(g) || firstTwoWords.includes(g)
  );

  if (!hasTypicalGreeting && words.length > 5) {
    details.push(`Sender did not use habitual greeting markers ("${baseline.typicalGreetings.slice(0, 3).join('", "')}")`);
  }

  // Aggregate Weighted Stylometric Drift
  const weightedOverall = Math.round(
    (punctDrift * 0.20) + 
    (casingDrift * 0.15) + 
    (languageMixDrift * 0.35) + 
    (lexicalDrift * 0.30)
  );

  const overallDrift = Math.min(99, Math.max(4, weightedOverall));

  if (overallDrift >= 70) {
    details.push(`Critical Stylometric Drift (${overallDrift}%): High probability of lateral account takeover.`);
  }

  return {
    overallDrift,
    punctuationDrift: Math.min(100, punctDrift),
    lexicalDrift: Math.min(100, lexicalDrift),
    languageMixDrift: Math.min(100, languageMixDrift),
    casingDrift: Math.min(100, casingDrift),
    details
  };
}
