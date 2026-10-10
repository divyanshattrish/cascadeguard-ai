import { ContagionNode, ContagionEdge } from '../types';

export const INITIAL_CONTAGION_NODES: ContagionNode[] = [
  {
    id: 'attacker',
    label: 'Attacker (Rogue Session)',
    role: 'attacker',
    status: 'active',
    preventedLoss: 0,
    x: 80,
    y: 190
  },
  {
    id: 'aman_compromised',
    label: "Aman's Hijacked Account",
    role: 'compromised',
    status: 'quarantined',
    preventedLoss: 0,
    x: 270,
    y: 190
  },
  {
    id: 'target_priya',
    label: 'Priya (Target Victim)',
    role: 'protected_contact',
    status: 'shielded',
    preventedLoss: 5000,
    x: 480,
    y: 90
  },
  {
    id: 'target_rahul',
    label: 'Rahul (Hostel Mate)',
    role: 'protected_contact',
    status: 'shielded',
    preventedLoss: 12000,
    x: 480,
    y: 190
  },
  {
    id: 'target_college_group',
    label: 'CS Batch 2026 (64 Students)',
    role: 'community_group',
    status: 'quarantined',
    membersCount: 64,
    preventedLoss: 150000,
    x: 480,
    y: 290
  },
  {
    id: 'target_hostel_group',
    label: 'Hostel Block C (48 Students)',
    role: 'community_group',
    status: 'quarantined',
    membersCount: 48,
    preventedLoss: 75000,
    x: 690,
    y: 290
  }
];

export const INITIAL_CONTAGION_EDGES: ContagionEdge[] = [
  {
    id: 'e1',
    source: 'attacker',
    target: 'aman_compromised',
    status: 'propagating',
    payloadSummary: 'Session Hijack via QR Phishing'
  },
  {
    id: 'e2',
    source: 'aman_compromised',
    target: 'target_priya',
    status: 'intercepted',
    payloadSummary: '₹5,000 Urgent Medical Scam (BLOCKED)'
  },
  {
    id: 'e3',
    source: 'aman_compromised',
    target: 'target_rahul',
    status: 'intercepted',
    payloadSummary: 'Fest Voting .APK Phishing (BLOCKED)'
  },
  {
    id: 'e4',
    source: 'aman_compromised',
    target: 'target_college_group',
    status: 'blocked',
    payloadSummary: 'Auto-Quarantine Alert to Group Admin'
  },
  {
    id: 'e5',
    source: 'target_college_group',
    target: 'target_hostel_group',
    status: 'blocked',
    payloadSummary: 'Lateral Spread Halted (Zero Contagion)'
  }
];
