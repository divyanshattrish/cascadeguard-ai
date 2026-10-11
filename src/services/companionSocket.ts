/**
 * CascadeGuard AI — Resilient Companion WebSocket & REST Client
 * Connects to the local Telethon MTProto companion at ws://localhost:5001/ws
 * and http://localhost:5001/api, with transparent offline mock telemetry fallback.
 */

import {
  CompanionStatus,
  AuditedMessageEvent,
  CompanionContact,
  CompanionSocketEvent,
  QRDetonationResult
} from '../types';

export const WS_URL = 'ws://localhost:5001/ws';
export const API_URL = 'http://localhost:5001/api';

// Blacklisted NPCI & I4C Mule Registry for local detonation
export const KNOWN_MULE_VPAS = new Set([
  'aman.emergency@okhdfcbank',
  'mule.account.i4c@upi',
  'fasthelp.medical@ybl',
  'quickrefund99@paytm',
  '9876543210@ibl',
  'festvoting.support@axl',
  'winprize.luck@paytm'
]);

export const INITIAL_MOCK_CONTACTS: CompanionContact[] = [
  {
    user_id: 1001,
    name: 'Aman Sharma',
    username: 'aman_kiet',
    avatar: 'AS',
    samples_indexed: 40,
    hinglish_ratio: 0.72,
    punctuation_density: 0.02,
    caps_ratio: 0.01,
    has_custom_challenge: true,
    challenge_question: 'What was the nickname of our 1st-year hostel warden at KIET?',
    challenge_answer_hash: 'e89a3f2b1c4d9e0f',
    is_poisoning_flagged: false,
    last_updated: Date.now() - 3600000,
    drift_status: 'critical' // Anomaly detected during simulated attack
  },
  {
    user_id: 1002,
    name: 'Ayush Srivastav',
    username: 'ayush_dev',
    avatar: 'AS',
    samples_indexed: 65,
    hinglish_ratio: 0.58,
    punctuation_density: 0.04,
    caps_ratio: 0.03,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 7200000,
    drift_status: 'nominal'
  },
  {
    user_id: 1003,
    name: 'Naresh Ji',
    username: 'naresh_kiet_admin',
    avatar: 'NJ',
    samples_indexed: 88,
    hinglish_ratio: 0.84,
    punctuation_density: 0.02,
    caps_ratio: 0.01,
    has_custom_challenge: true,
    challenge_question: 'Where is the departmental backup keys drawer located?',
    challenge_answer_hash: '90ab45cd8ef12345',
    is_poisoning_flagged: false,
    last_updated: Date.now() - 14400000,
    drift_status: 'nominal'
  },
  {
    user_id: 1004,
    name: 'Priya Patel',
    username: 'priya_p',
    avatar: 'PP',
    samples_indexed: 52,
    hinglish_ratio: 0.63,
    punctuation_density: 0.03,
    caps_ratio: 0.02,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 28800000,
    drift_status: 'nominal'
  },
  {
    user_id: 1005,
    name: 'Rohan Verma',
    username: 'rohan_v',
    avatar: 'RV',
    samples_indexed: 34,
    hinglish_ratio: 0.79,
    punctuation_density: 0.02,
    caps_ratio: 0.01,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 43200000,
    drift_status: 'nominal'
  },
  {
    user_id: 1006,
    name: 'Sneha Gupta',
    username: 'sneha_g',
    avatar: 'SG',
    samples_indexed: 46,
    hinglish_ratio: 0.44,
    punctuation_density: 0.05,
    caps_ratio: 0.04,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 50400000,
    drift_status: 'nominal'
  },
  {
    user_id: 1007,
    name: 'Vikram Malhotra',
    username: 'vikram_m',
    avatar: 'VM',
    samples_indexed: 91,
    hinglish_ratio: 0.69,
    punctuation_density: 0.03,
    caps_ratio: 0.02,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 64800000,
    drift_status: 'nominal'
  },
  {
    user_id: 1008,
    name: 'Ananya Singh',
    username: 'ananya_s',
    avatar: 'AS',
    samples_indexed: 38,
    hinglish_ratio: 0.51,
    punctuation_density: 0.04,
    caps_ratio: 0.03,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 72000000,
    drift_status: 'nominal'
  },
  {
    user_id: 1009,
    name: 'Kabir Mehta',
    username: 'kabir_m',
    avatar: 'KM',
    samples_indexed: 72,
    hinglish_ratio: 0.81,
    punctuation_density: 0.02,
    caps_ratio: 0.01,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 86400000,
    drift_status: 'nominal'
  },
  {
    user_id: 1010,
    name: 'Pooja Desai',
    username: 'pooja_d',
    avatar: 'PD',
    samples_indexed: 29,
    hinglish_ratio: 0.39,
    punctuation_density: 0.04,
    caps_ratio: 0.05,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 93600000,
    drift_status: 'nominal'
  },
  {
    user_id: 1011,
    name: 'Rahul Joshi',
    username: 'rahul_j',
    avatar: 'RJ',
    samples_indexed: 55,
    hinglish_ratio: 0.76,
    punctuation_density: 0.03,
    caps_ratio: 0.02,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 100800000,
    drift_status: 'nominal'
  },
  {
    user_id: 1012,
    name: 'Tanya Saxena',
    username: 'tanya_saxena',
    avatar: 'TS',
    samples_indexed: 41,
    hinglish_ratio: 0.67,
    punctuation_density: 0.03,
    caps_ratio: 0.02,
    has_custom_challenge: false,
    is_poisoning_flagged: false,
    last_updated: Date.now() - 108000000,
    drift_status: 'nominal'
  }
];

export const INITIAL_STATUS: CompanionStatus = {
  status: 'mock',
  account_name: 'Divyansh Attrish',
  username: 'divyanshattrish',
  active_interlocks: 1,
  indexed_contacts: 12,
  avg_latency_ms: 0.74,
  uptime_sec: 1420,
  dpdp_egress_bytes: 0,
  threats_neutralized: 1,
  is_shield_active: true,
  dc_server: 'Telegram MTProto DC4 (Singapore / Bombay)'
};

// Simulated Critical ATO Interception Event
export const createAtoScamEvent = (overrides?: Partial<AuditedMessageEvent>): AuditedMessageEvent => ({
  id: `evt_ato_${Date.now()}`,
  timestamp: Date.now() / 1000,
  chat_id: 1001,
  sender_name: 'Aman Sharma',
  username: 'aman_kiet',
  avatar: 'AS',
  text: 'Divyansh emergency hai! Chacha hospital me admit hue hain, operation start krna hai. URGENTLY ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga.',
  result: {
    threat_level: 'CRITICAL_ATO',
    overall_risk_score: 95,
    processing_time_ms: 0.74,
    stylometric_drift: 52,
    financial_coercion_score: 100,
    urgency_score: 70,
    extracted_vpas: ['aman.emergency@okhdfcbank'],
    is_vpa_blacklisted: true,
    extracted_urls: [],
    extracted_apks: [],
    flagged_reasons: [
      'Sudden depletion of habitual Hinglish vocabulary (52% vernacular drift)',
      'Uncharacteristic uppercase emphasis (45% casing drift)',
      'Urgency coercion markers detected: emergency, hospital, operation',
      'Direct financial transfer demand: ₹5,000, transfer',
      'CRITICAL: Target VPA matches I4C / NPCI Mule Registry (aman.emergency@okhdfcbank)!'
    ],
    interlocked: true,
    friend_quiz: {
      question: 'Security Interlock Challenge: What was the nickname of our 1st-year Hostel Warden at KIET?',
      options: ['Gabbar Sir', 'Sharma Ji', 'Hitler Sir', 'Verma Ji'],
      correctAnswer: 'Gabbar Sir'
    }
  },
  containment_status: 'interlocked',
  ...overrides
});

type EventSubscriber = (event: CompanionSocketEvent) => void;

class CompanionSocketService {
  private socket: WebSocket | null = null;
  private subscribers: Set<EventSubscriber> = new Set();
  private isExplicitlyClosed = false;
  private reconnectInterval = 5000;
  private reconnectTimer: number | null = null;
  private pingTimer: number | null = null;
  private initialSimTimer: number | null = null;
  private currentStatus: CompanionStatus = { ...INITIAL_STATUS };
  private contacts: CompanionContact[] = [...INITIAL_MOCK_CONTACTS];
  private eventsHistory: AuditedMessageEvent[] = [];

  constructor() {
    // Start connection attempt immediately
    this.connect();
  }

  public connect(): void {
    this.isExplicitlyClosed = false;

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        this.currentStatus.status = 'connected';
        this.notifyStatusChange('connected');
        this.clearTimers();
        this.startHeartbeat();
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.handleInboundEvent(parsed);
        } catch {
          // Ignore parse errors on ping/pong raw messages
        }
      };

      this.socket.onerror = () => {
        // Fallback smoothly to mock mode without crashing
        this.handleFallback();
      };

      this.socket.onclose = () => {
        if (!this.isExplicitlyClosed) {
          this.handleFallback();
          this.scheduleReconnect();
        }
      };
    } catch {
      this.handleFallback();
      this.scheduleReconnect();
    }
  }

  private handleFallback(): void {
    if (this.currentStatus.status !== 'mock') {
      this.currentStatus.status = 'mock';
      this.notifyStatusChange('mock');
    }

    // Emit initial state if not already emitted
    this.emitEvent({
      event: 'INIT_STATE',
      data: {
        ...this.currentStatus,
        recent_events: this.eventsHistory
      }
    });

    // Per requirements: Emit simulated ATO event after 3 seconds in mock mode
    if (!this.initialSimTimer && this.eventsHistory.length === 0) {
      this.initialSimTimer = window.setTimeout(() => {
        const atoEvent = createAtoScamEvent();
        this.eventsHistory.unshift(atoEvent);
        this.emitEvent({
          event: 'MESSAGE_AUDITED',
          data: atoEvent
        });
        this.initialSimTimer = null;
      }, 3000);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isExplicitlyClosed && this.currentStatus.status === 'mock') {
        this.connect();
      }
    }, this.reconnectInterval);
  }

  private startHeartbeat(): void {
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.pingTimer = window.setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ command: 'ping', timestamp: Date.now() }));
      }
    }, 10000);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private handleInboundEvent(payload: any): void {
    if (!payload || !payload.event) return;

    switch (payload.event) {
      case 'INIT_STATE': {
        this.currentStatus = {
          ...this.currentStatus,
          status: 'connected',
          account_name: payload.data?.account_name || this.currentStatus.account_name,
          username: payload.data?.username || this.currentStatus.username,
          indexed_contacts: payload.data?.indexed_contacts ?? this.currentStatus.indexed_contacts,
          avg_latency_ms: payload.data?.avg_latency_ms ?? 0.68
        };
        if (payload.data?.recent_events) {
          this.eventsHistory = payload.data.recent_events;
        }
        this.emitEvent({
          event: 'INIT_STATE',
          data: { ...this.currentStatus, recent_events: this.eventsHistory }
        });
        break;
      }

      case 'MESSAGE_AUDITED': {
        const auditedEvent = payload.data as AuditedMessageEvent;
        this.eventsHistory.unshift(auditedEvent);
        if (this.eventsHistory.length > 50) this.eventsHistory.pop();
        if (auditedEvent.result?.threat_level === 'CRITICAL_ATO') {
          this.currentStatus.threats_neutralized += 1;
        }
        this.emitEvent({
          event: 'MESSAGE_AUDITED',
          data: auditedEvent
        });
        break;
      }

      case 'MEMORY_FLUSHED': {
        this.eventsHistory = [];
        this.currentStatus.active_interlocks = 0;
        this.currentStatus.indexed_contacts = 0;
        this.contacts = [];
        this.emitEvent({
          event: 'MEMORY_FLUSHED',
          data: payload.data
        });
        this.emitEvent({
          event: 'CONTACTS_UPDATED',
          data: { contacts: [] }
        });
        break;
      }

      case 'PONG': {
        this.currentStatus.avg_latency_ms = Number((0.45 + Math.random() * 0.4).toFixed(2));
        this.emitEvent({
          event: 'PONG',
          timestamp: payload.timestamp || Date.now()
        });
        break;
      }

      default:
        this.emitEvent(payload);
    }
  }

  private emitEvent(event: CompanionSocketEvent): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('Companion socket subscriber error:', err);
      }
    });
  }

  private notifyStatusChange(status: CompanionStatus['status']): void {
    this.emitEvent({
      event: 'STATUS_CHANGE',
      data: {
        status,
        latency_ms: this.currentStatus.avg_latency_ms
      }
    });
  }

  // ── Public Subscriber API ──

  public subscribe(callback: EventSubscriber): () => void {
    this.subscribers.add(callback);

    // Replay initial state immediately to new subscriber
    callback({
      event: 'INIT_STATE',
      data: {
        ...this.currentStatus,
        recent_events: this.eventsHistory
      }
    });

    return () => {
      this.subscribers.delete(callback);
    };
  }

  // ── Action Controls ──

  public async simulateAttack(): Promise<AuditedMessageEvent> {
    const isLive = this.socket && this.socket.readyState === WebSocket.OPEN;

    if (isLive) {
      try {
        this.socket?.send(JSON.stringify({ command: 'simulate' }));
        const res = await fetch(`${API_URL}/simulate`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch {
        // Fallback to local simulation if network call fails
      }
    }

    // Local / Mock simulation
    const atoEvent = createAtoScamEvent({
      id: `evt_sim_${Date.now()}`,
      timestamp: Date.now() / 1000
    });

    this.eventsHistory.unshift(atoEvent);
    this.currentStatus.active_interlocks += 1;
    this.currentStatus.threats_neutralized += 1;

    // Mark contact drift status to critical
    this.contacts = this.contacts.map((c) =>
      c.user_id === 1001 ? { ...c, drift_status: 'critical' } : c
    );

    this.emitEvent({
      event: 'MESSAGE_AUDITED',
      data: atoEvent
    });

    this.emitEvent({
      event: 'CONTACTS_UPDATED',
      data: { contacts: this.contacts }
    });

    return atoEvent;
  }

  public async flushMemory(): Promise<{ centroids_purged: number }> {
    const isLive = this.socket && this.socket.readyState === WebSocket.OPEN;
    const purgeCount = this.contacts.length || 12;

    if (isLive) {
      try {
        this.socket?.send(JSON.stringify({ command: 'flush' }));
        const res = await fetch(`${API_URL}/flush`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch {
        // Fallback to local purge
      }
    }

    // Local in-memory flush (DPDP Act §6(4))
    this.eventsHistory = [];
    this.contacts = [];
    this.currentStatus.active_interlocks = 0;
    this.currentStatus.indexed_contacts = 0;

    this.emitEvent({
      event: 'MEMORY_FLUSHED',
      data: {
        centroids_purged: purgeCount,
        profiles_cleared: purgeCount,
        timestamp: Date.now() / 1000
      }
    });

    this.emitEvent({
      event: 'CONTACTS_UPDATED',
      data: { contacts: [] }
    });

    return { centroids_purged: purgeCount };
  }

  public async restoreContacts(): Promise<CompanionContact[]> {
    this.contacts = [...INITIAL_MOCK_CONTACTS];
    this.currentStatus.indexed_contacts = this.contacts.length;
    this.emitEvent({
      event: 'CONTACTS_UPDATED',
      data: { contacts: this.contacts }
    });
    return this.contacts;
  }

  public async setContactChallenge(
    userId: number,
    question: string,
    answer: string
  ): Promise<{ status: string; question: string }> {
    // Generate SHA-256 hash preview
    const encoder = new TextEncoder();
    const data = encoder.encode(answer.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const answerHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const isLive = this.socket && this.socket.readyState === WebSocket.OPEN;

    if (isLive) {
      try {
        const res = await fetch(`${API_URL}/contacts/${userId}/challenge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, answer })
        });
        if (res.ok) {
          const resData = await res.json();
          this.updateLocalContactChallenge(userId, question, answerHash);
          return resData;
        }
      } catch {
        // Continue to local update
      }
    }

    this.updateLocalContactChallenge(userId, question, answerHash);
    return {
      status: 'success',
      question
    };
  }

  private updateLocalContactChallenge(userId: number, question: string, hash: string): void {
    this.contacts = this.contacts.map((c) => {
      if (c.user_id === userId) {
        return {
          ...c,
          has_custom_challenge: true,
          challenge_question: question,
          challenge_answer_hash: hash,
          last_updated: Date.now()
        };
      }
      return c;
    });

    this.emitEvent({
      event: 'CONTACTS_UPDATED',
      data: { contacts: this.contacts }
    });
  }

  public async resolveInterlock(
    chatId: number,
    action: 'block' | 'dismiss' | 'verify'
  ): Promise<void> {
    const isLive = this.socket && this.socket.readyState === WebSocket.OPEN;

    if (isLive) {
      try {
        await fetch(`${API_URL}/interlocks/${chatId}/resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, action })
        });
      } catch {
        // local update fallback
      }
    }

    // Update in-memory event list status
    this.eventsHistory = this.eventsHistory.map((evt) => {
      if (evt.chat_id === chatId) {
        const statusMap: Record<string, AuditedMessageEvent['containment_status']> = {
          block: 'quarantined',
          dismiss: 'dismissed',
          verify: 'safe'
        };
        return {
          ...evt,
          containment_status: statusMap[action] || 'dismissed'
        };
      }
      return evt;
    });

    if (this.currentStatus.active_interlocks > 0 && action !== 'verify') {
      this.currentStatus.active_interlocks = Math.max(0, this.currentStatus.active_interlocks - 1);
    }

    this.emitEvent({
      event: 'INTERLOCK_RESOLVED',
      data: { chat_id: chatId, action }
    });
  }

  public detonateQRPayload(payload: string): QRDetonationResult {
    const timestamp = Date.now();
    let isUpi = false;
    let vpa: string | null = null;
    let payeeName: string | null = null;
    let amount: string | null = null;
    let isBlacklisted = false;
    let riskScore = 10;
    const reasons: string[] = [];

    if (payload.toLowerCase().startsWith('upi://pay')) {
      isUpi = true;
      try {
        const url = new URL(payload);
        vpa = url.searchParams.get('pa');
        payeeName = url.searchParams.get('pn');
        amount = url.searchParams.get('am');

        if (vpa) {
          if (KNOWN_MULE_VPAS.has(vpa.toLowerCase())) {
            isBlacklisted = true;
            riskScore = 95;
            reasons.push(`CRITICAL: Payee VPA (${vpa}) matches I4C / NPCI Mule Registry!`);
            reasons.push('High-risk lateral transfer target flagged in multi-victim hospital scam chain.');
          } else {
            riskScore = 45;
            reasons.push(`Unverified Personal UPI VPA detected: ${vpa}`);
          }
        }

        if (amount && Number(amount) >= 2000) {
          riskScore = Math.min(100, riskScore + 20);
          reasons.push(`Substantial money request (₹${amount}) flagged for secondary identity confirmation.`);
        }
      } catch {
        reasons.push('Malformed UPI URI parameter structure.');
        riskScore = 60;
      }
    } else if (payload.startsWith('http://') || payload.startsWith('https://')) {
      reasons.push(`External web link payload: ${payload}`);
      if (payload.includes('login') || payload.includes('telegram') || payload.includes('.ru')) {
        riskScore = 90;
        reasons.push('Credential harvesting pattern detected in QR destination URI.');
      } else {
        riskScore = 55;
      }
    } else {
      reasons.push(`Raw arbitrary text payload: "${payload.slice(0, 50)}..."`);
      riskScore = 20;
    }

    return {
      has_qr: true,
      raw_payload: payload,
      is_upi: isUpi,
      vpa,
      payee_name: payeeName,
      amount,
      currency: 'INR',
      is_blacklisted: isBlacklisted,
      risk_score: riskScore,
      reasons,
      scanned_at: timestamp
    };
  }

  public getStatus(): CompanionStatus {
    return { ...this.currentStatus };
  }

  public getContacts(): CompanionContact[] {
    return [...this.contacts];
  }

  public getEventsHistory(): AuditedMessageEvent[] {
    return [...this.eventsHistory];
  }

  public setShieldActive(active: boolean): void {
    this.currentStatus.is_shield_active = active;
    this.emitEvent({
      event: 'STATUS_CHANGE',
      data: {
        status: this.currentStatus.status,
        latency_ms: this.currentStatus.avg_latency_ms
      }
    });
  }

  public disconnect(): void {
    this.isExplicitlyClosed = true;
    this.clearTimers();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.subscribers.clear();
  }
}

// Global Singleton Instance
export const companionSocket = new CompanionSocketService();
export default companionSocket;

