import { StylometricProfile } from '../types';

export const AMAN_BASELINE_PROFILE: StylometricProfile = {
  name: "Aman Sharma",
  sampleMessageCount: 142,
  averageWordLength: 4.2,
  punctuationFrequency: {
    exclamation: 0.02,
    question: 0.05,
    ellipsis: 0.01,
    comma: 0.01
  },
  hinglishRatio: 0.72, // 72% Hinglish vernacular usage
  slangFrequency: 0.45,
  allCapsRatio: 0.01,
  typicalGreetings: ["bhai", "oyee", "sun", "yaar", "bro", "kaha h"],
  characteristicKeywords: [
    "bhai", "yaar", "canteen", "assignment", "kal", "scene", "notes",
    "bhej de", "chal", "mast", "kiet", "hostel", "class", "prof", "attendance"
  ]
};

// Historical sample messages to demonstrate local zero-knowledge vector indexing
export const AMAN_HISTORICAL_CHATS = [
  "Oyee sun, kal ke lab notes hain tere paas?",
  "bhai canteen me aa rha h kya?",
  "haan chal 5 min me nikalte hain hostel se",
  "bhai prof ne attendance lagayi kya meri?",
  "mast scene hai bhai sham ko khelne chalenge",
  "yaar vo assignment submit krna tha portal pe, link bhejio",
  "haha sahi h bhai"
];
