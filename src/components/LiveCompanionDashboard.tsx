import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Zap,
  Trash2,
  QrCode,
  Users,
  Radio,
  Lock,
  CheckCircle2,
  Info,
  Search,
  Upload,
  Scan,
  HelpCircle,
  Key,
  RotateCcw,
  Copy,
  Check,
  X,
  Fingerprint,
  ChevronRight,
  Flame,
  AlertOctagon
} from 'lucide-react';
import {
  CompanionStatus,
  AuditedMessageEvent,
  CompanionContact,
  QRDetonationResult
} from '../types';
import companionSocket, {
  INITIAL_STATUS,
  INITIAL_MOCK_CONTACTS
} from '../services/companionSocket';

// SHA-256 Helper for Zero-Knowledge digest generation
async function computeSha256(str: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(str.trim().toLowerCase());
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface LiveCompanionDashboardProps {
  onOpenPrivacyModal?: () => void;
  onOpenContagionGraph?: () => void;
  isDarkMode?: boolean;
}

export const LiveCompanionDashboard: React.FC<LiveCompanionDashboardProps> = ({
  onOpenPrivacyModal,
  onOpenContagionGraph,
  isDarkMode = false
}) => {
  // ── Dashboard State ──
  const [status, setStatus] = useState<CompanionStatus>(INITIAL_STATUS);
  const [events, setEvents] = useState<AuditedMessageEvent[]>([]);
  const [contacts, setContacts] = useState<CompanionContact[]>(INITIAL_MOCK_CONTACTS);
  const [activeTab, setActiveTab] = useState<'feed' | 'contacts' | 'detonator'>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | 'critical' | 'suspicious' | 'safe'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'danger' | 'info' } | null>(null);

  // ── Challenge Configurator Modal State ──
  const [selectedContactForChallenge, setSelectedContactForChallenge] = useState<CompanionContact | null>(null);
  const [challengeQuestion, setChallengeQuestion] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeHashPreview, setChallengeHashPreview] = useState('');
  const [isSavingChallenge, setIsSavingChallenge] = useState(false);

  // ── Friend Quiz Interactive Challenge Modal State ──
  const [activeQuizEvent, setActiveQuizEvent] = useState<AuditedMessageEvent | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'success' | 'fail' | null>(null);

  // ── QR Detonator State ──
  const [qrInputPayload, setQrInputPayload] = useState(
    'upi://pay?pa=aman.emergency@okhdfcbank&pn=Aman%20Sharma&am=5000&cu=INR'
  );
  const [qrDetonationResult, setQrDetonationResult] = useState<QRDetonationResult | null>(null);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Subscribe to Companion Socket Stream ──
  useEffect(() => {
    // Initial fetch from socket service
    setStatus(companionSocket.getStatus());
    setContacts(companionSocket.getContacts());
    setEvents(companionSocket.getEventsHistory());

    const unsubscribe = companionSocket.subscribe((event) => {
      switch (event.event) {
        case 'INIT_STATE': {
          setStatus((prev) => ({
            ...prev,
            ...event.data,
            status: event.data.status || prev.status
          }));
          if (event.data.recent_events) {
            setEvents(event.data.recent_events);
          }
          break;
        }

        case 'MESSAGE_AUDITED': {
          setEvents((prev) => {
            const exists = prev.some((e) => e.id === event.data.id);
            if (exists) return prev;
            return [event.data, ...prev];
          });
          setStatus((prev) => ({
            ...prev,
            active_interlocks: event.data.result?.threat_level === 'CRITICAL_ATO' ? prev.active_interlocks + 1 : prev.active_interlocks,
            threats_neutralized: event.data.result?.threat_level === 'CRITICAL_ATO' ? prev.threats_neutralized + 1 : prev.threats_neutralized
          }));
          setToastMessage({
            title: `🚨 Intercepted ${event.data.result.threat_level}`,
            desc: `From ${event.data.sender_name}: ${event.data.result.flagged_reasons[0] || 'High risk pattern'}`,
            type: 'danger'
          });
          break;
        }

        case 'MEMORY_FLUSHED': {
          setEvents([]);
          setContacts([]);
          setStatus((prev) => ({
            ...prev,
            active_interlocks: 0,
            indexed_contacts: 0
          }));
          setToastMessage({
            title: '🗑️ Volatile Memory Purged (DPDP §6(4))',
            desc: `${event.data.centroids_purged} contact centroid profiles instantly erased from volatile RAM.`,
            type: 'success'
          });
          break;
        }

        case 'CONTACTS_UPDATED': {
          setContacts(event.data.contacts);
          setStatus((prev) => ({
            ...prev,
            indexed_contacts: event.data.contacts.length
          }));
          break;
        }

        case 'STATUS_CHANGE': {
          setStatus((prev) => ({
            ...prev,
            status: event.data.status,
            avg_latency_ms: event.data.latency_ms
          }));
          break;
        }

        case 'INTERLOCK_RESOLVED': {
          setEvents((prev) =>
            prev.map((e) =>
              e.chat_id === event.data.chat_id
                ? {
                    ...e,
                    containment_status:
                      event.data.action === 'block'
                        ? 'quarantined'
                        : event.data.action === 'dismiss'
                        ? 'dismissed'
                        : 'safe'
                  }
                : e
            )
          );
          break;
        }
      }
    });

    // Auto-detonate default initial QR sample for instant demo value
    const initialQR = companionSocket.detonateQRPayload(qrInputPayload);
    setQrDetonationResult(initialQR);

    return () => {
      unsubscribe();
    };
  }, []);

  // Update real-time SHA-256 preview when challenge answer changes
  useEffect(() => {
    if (!challengeAnswer.trim()) {
      setChallengeHashPreview('');
      return;
    }
    let isCancelled = false;
    computeSha256(challengeAnswer).then((h) => {
      if (!isCancelled) setChallengeHashPreview(h);
    });
    return () => {
      isCancelled = true;
    };
  }, [challengeAnswer]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // ── Actions ──

  const handleSimulateAttack = async () => {
    setIsSimulating(true);
    try {
      await companionSocket.simulateAttack();
      setToastMessage({
        title: '⚡ Simulated Attack Injected',
        desc: 'Simulated ATO scam from Aman Sharma requesting ₹5,000 processed.',
        type: 'danger'
      });
      setActiveTab('feed');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleFlushMemory = async () => {
    setIsFlushing(true);
    try {
      await companionSocket.flushMemory();
    } finally {
      setIsFlushing(false);
    }
  };

  const handleRestoreContacts = async () => {
    const restored = await companionSocket.restoreContacts();
    setContacts(restored);
    setToastMessage({
      title: '🔄 Baselines Restored',
      desc: '12 contact centroids recalibrated into ephemeral memory.',
      type: 'info'
    });
  };

  const handleOpenChallengeConfig = (contact: CompanionContact) => {
    setSelectedContactForChallenge(contact);
    setChallengeQuestion(
      contact.challenge_question ||
        'What was the nickname of our 1st-year hostel warden at KIET?'
    );
    setChallengeAnswer('');
  };

  const handleSaveChallenge = async () => {
    if (!selectedContactForChallenge || !challengeQuestion.trim() || !challengeAnswer.trim()) {
      return;
    }
    setIsSavingChallenge(true);
    try {
      await companionSocket.setContactChallenge(
        selectedContactForChallenge.user_id,
        challengeQuestion,
        challengeAnswer
      );
      setToastMessage({
        title: '🔒 Zero-Knowledge Challenge Saved',
        desc: `Salted SHA-256 registered for ${selectedContactForChallenge.name}.`,
        type: 'success'
      });
      setSelectedContactForChallenge(null);
    } finally {
      setIsSavingChallenge(false);
    }
  };

  const handleResolveInterlock = async (chatId: number, action: 'block' | 'dismiss' | 'verify') => {
    await companionSocket.resolveInterlock(chatId, action);
    const label = action === 'block' ? 'Quarantined & Blocked' : action === 'dismiss' ? 'Marked Safe / Dismissed' : 'Identity Verified';
    setToastMessage({
      title: `Shield Interlock Action: ${label}`,
      desc: `Chat ID ${chatId} containment state updated.`,
      type: action === 'block' ? 'danger' : 'success'
    });
  };

  const handleDetonateQR = (payloadToScan?: string) => {
    const raw = payloadToScan || qrInputPayload;
    setIsScanningQR(true);
    setTimeout(() => {
      const result = companionSocket.detonateQRPayload(raw);
      setQrDetonationResult(result);
      setIsScanningQR(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate scanning image QR
    setIsScanningQR(true);
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        // If file name has 'canteen', simulate safe, else simulate hospital mule
        const isCanteen = file.name.toLowerCase().includes('canteen') || file.name.toLowerCase().includes('safe');
        const simulatedPayload = isCanteen
          ? 'upi://pay?pa=canteen.kiet@okhdfcbank&pn=KIET%20Canteen&am=120&cu=INR'
          : 'upi://pay?pa=aman.emergency@okhdfcbank&pn=Aman%20Sharma&am=5000&cu=INR';

        setQrInputPayload(simulatedPayload);
        const result = companionSocket.detonateQRPayload(simulatedPayload);
        result.preview_url = reader.result as string;
        setQrDetonationResult(result);
        setIsScanningQR(false);
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // ── Filtered Feeds & Contacts ──
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (feedFilter === 'critical' && evt.result.threat_level !== 'CRITICAL_ATO') return false;
      if (feedFilter === 'suspicious' && evt.result.threat_level !== 'SUSPICIOUS') return false;
      if (feedFilter === 'safe' && evt.result.threat_level !== 'SAFE') return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          evt.sender_name.toLowerCase().includes(query) ||
          (evt.username && evt.username.toLowerCase().includes(query)) ||
          evt.text.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [events, feedFilter, searchTerm]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    const query = searchTerm.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.username.toLowerCase().includes(query) ||
        (c.challenge_question && c.challenge_question.toLowerCase().includes(query))
    );
  }, [contacts, searchTerm]);

  const criticalEventsCount = events.filter((e) => e.result.threat_level === 'CRITICAL_ATO').length;

  return (
    <div className={`space-y-6 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* ── Toast Notification Banner ── */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 flex items-start gap-3 ${
            toastMessage.type === 'danger'
              ? 'bg-red-950/90 border-red-500/60 text-red-200 shadow-red-500/20'
              : toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-500/20'
              : 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200 shadow-cyan-500/20'
          }`}
        >
          <div className="p-1.5 rounded-lg bg-black/40 mt-0.5">
            {toastMessage.type === 'danger' ? (
              <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Info className="w-5 h-5 text-cyan-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider">{toastMessage.title}</h4>
            <p className="text-xs opacity-90 mt-0.5">{toastMessage.desc}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Header: Active Connection, Edge Latency & DPDP Badges ── */}
      <section className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode
          ? 'glass-panel bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 border-slate-800/80 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
      }`}>
        {/* Glow ambient lines */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDarkMode ? 'bg-cyan-500/5' : 'bg-blue-500/10'}`} />
        <div className={`absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-2xl pointer-events-none ${isDarkMode ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`} />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Identity & MTProto State */}
          <div className="flex items-center gap-4">
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border shadow-inner ${
              isDarkMode
                ? 'bg-slate-900 border-cyan-500/30 text-cyan-400'
                : 'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              <Radio className="w-6 h-6 animate-pulse" />
              <div
                className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 ${
                  isDarkMode ? 'border-slate-950' : 'border-white'
                } ${
                  status.status === 'connected'
                    ? 'bg-emerald-400 animate-ping'
                    : 'bg-cyan-400 animate-pulse'
                }`}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-sm font-bold tracking-tight flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>{status.account_name}</span>
                  <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>(@{status.username})</span>
                </span>

                {/* Connection Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${
                    status.status === 'connected'
                      ? (isDarkMode ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800')
                      : (isDarkMode ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-800')
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                    }`}
                  />
                  {status.status === 'connected'
                    ? 'Telegram MTProto Live'
                    : 'Edge Sim Fallback (Offline Engine)'}
                </span>

                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  isDarkMode ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-200'
                }`}>
                  {status.dc_server}
                </span>
              </div>

              {/* Edge Latency & DPDP Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mt-2">
                {/* Edge Latency Badge (<1ms) */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono ${
                  isDarkMode
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm'
                }`}>
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold">{status.avg_latency_ms.toFixed(2)} ms</span>
                  <span className="text-[10px] opacity-80 uppercase tracking-wider">
                    Edge Latency (&lt;1ms)
                  </span>
                </div>

                {/* 0 Bytes Cloud Egress Indicator */}
                <div
                  onClick={onOpenPrivacyModal}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono transition-all ${
                    isDarkMode
                      ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
                      : 'bg-blue-50 border-blue-200 text-blue-800 hover:border-blue-300 shadow-sm'
                  } ${onOpenPrivacyModal ? 'cursor-pointer' : ''}`}
                  title="Click to view Zero-Knowledge DPDP compliance audit"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold">0 Bytes</span>
                  <span className="text-[10px] opacity-80 uppercase tracking-wider">
                    Cloud Egress (DPDP §6(4))
                  </span>
                </div>

                {/* In-Memory Centroids */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
                  <span>{status.indexed_contacts} Centroids in RAM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Contagion Graph Quick Action (if provided) */}
            {onOpenContagionGraph && (
              <button
                onClick={onOpenContagionGraph}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                  isDarkMode
                    ? 'bg-slate-900 hover:bg-cyan-950/60 border-slate-700/80 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300'
                    : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700'
                }`}
                title="Open Lateral Contagion Network Graph"
              >
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span>Contagion Graph</span>
              </button>
            )}

            {/* DPDP Flush Button */}
            <button
              onClick={handleFlushMemory}
              disabled={isFlushing}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-sm group ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-red-950/60 border-slate-700/80 hover:border-red-500/60 text-slate-200 hover:text-red-300'
                  : 'bg-white hover:bg-red-50 border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700'
              }`}
              title="DPDP Act 2023 Sec 6(4): Instantly purge all volatile in-memory centroids and interlocks"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              <span>/flush (DPDP Sec 6(4))</span>
            </button>

            {/* Attack Simulation Button */}
            <button
              onClick={handleSimulateAttack}
              disabled={isSimulating}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-500/25 active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>{isSimulating ? 'Injecting Attack...' : 'Simulate Attack'}</span>
            </button>

            {/* Shield Toggle */}
            <button
              onClick={() => companionSocket.setShieldActive(!status.is_shield_active)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                status.is_shield_active
                  ? (isDarkMode ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800')
                  : (isDarkMode ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800')
              }`}
              title="Toggle Autonomous Interlock Shield"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{status.is_shield_active ? 'Shield Active' : 'Shield Paused'}</span>
            </button>
          </div>
        </div>

        {/* ── Sub-Metrics Telemetry Grid ── */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t ${
          isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <div className={`p-3 rounded-2xl border ${
            isDarkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Avg Edge Latency
            </span>
            <div className="text-base font-bold font-mono text-emerald-600 mt-0.5 flex items-center gap-1.5">
              <span>{status.avg_latency_ms.toFixed(2)} ms</span>
              <span className="text-[10px] opacity-75 font-sans font-normal">(&lt;50ms cap)</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isDarkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Centroids in Ephemeral RAM
            </span>
            <div className="text-base font-bold font-mono text-blue-600 mt-0.5 flex items-center justify-between">
              <span>{status.indexed_contacts} Profiles</span>
              {status.indexed_contacts === 0 && (
                <button
                  onClick={handleRestoreContacts}
                  className="text-[10px] font-sans text-blue-600 underline hover:text-blue-800"
                >
                  Restore
                </button>
              )}
            </div>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isDarkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Threats Neutralized
            </span>
            <div className="text-base font-bold font-mono text-rose-600 mt-0.5">
              {status.threats_neutralized} Multi-Victim ATOs
            </div>
          </div>

          <div className={`p-3 rounded-2xl border ${
            isDarkMode ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[10px] font-mono uppercase tracking-wider block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Active Interlocks
            </span>
            <div className="text-base font-bold font-mono text-amber-600 mt-0.5 flex items-center gap-1.5">
              <span>{status.active_interlocks} Quarantines</span>
              {status.active_interlocks > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabbed Operations Navigation ── */}
      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-2xl border shadow-sm transition-colors ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5">
          {/* Tab 1: Live Threat Feed */}
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Threat Feed</span>
            {criticalEventsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white font-mono text-[10px] animate-pulse">
                {criticalEventsCount}
              </span>
            )}
          </button>

          {/* Tab 2: Contact Vault */}
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contacts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Contact Vault</span>
            <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
            }`}>
              {contacts.length}
            </span>
          </button>

          {/* Tab 3: QR Detonator */}
          <button
            onClick={() => setActiveTab('detonator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'detonator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR & Image Detonator</span>
          </button>
        </div>

        {/* Global Search / Filter Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'feed'
                ? 'Filter messages, VPAs...'
                : activeTab === 'contacts'
                ? 'Search contact names, handles...'
                : 'Search detonation history...'
            }
            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: LIVE THREAT FEED (INTERCEPT STREAM)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* Feed Filter Chips */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs flex items-center gap-1.5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span>Interception Stream ({filteredEvents.length}):</span>
              </span>

              <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setFeedFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    feedFilter === 'all'
                      ? (isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-sm')
                      : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFeedFilter('critical')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    feedFilter === 'critical'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${feedFilter === 'critical' ? 'bg-white' : 'bg-red-500'}`} />
                  Critical ATO
                </button>
                <button
                  onClick={() => setFeedFilter('suspicious')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    feedFilter === 'suspicious'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${feedFilter === 'suspicious' ? 'bg-white' : 'bg-amber-500'}`} />
                  Suspicious
                </button>
                <button
                  onClick={() => setFeedFilter('safe')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    feedFilter === 'safe'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${feedFilter === 'safe' ? 'bg-white' : 'bg-emerald-500'}`} />
                  Safe
                </button>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Continuous Stream Active
              </span>
            </div>
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className={`p-12 text-center rounded-3xl border space-y-4 shadow-sm ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  No Intercepted Threats in Memory
                </h3>
                <p className={`text-xs max-w-md mx-auto mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Telegram MTProto companion is passively monitoring inbound direct messages. Click{' '}
                  <strong className="text-red-500">"Simulate Attack"</strong> above to test lateral ATO
                  containment.
                </p>
              </div>
              <button
                onClick={handleSimulateAttack}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Simulate Inbound Hospital Scam</span>
              </button>
            </div>
          )}

          {/* Messages Feed Cards */}
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const isCritical = evt.result.threat_level === 'CRITICAL_ATO';
              const isSuspicious = evt.result.threat_level === 'SUSPICIOUS';
              const isQuarantined = evt.containment_status === 'quarantined';
              const isDismissed = evt.containment_status === 'dismissed';

              return (
                <div
                  key={evt.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                    isCritical
                      ? (isDarkMode
                        ? 'border-red-500/70 bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 shadow-xl shadow-red-500/10'
                        : 'border-rose-300 bg-gradient-to-br from-white via-rose-50/40 to-white shadow-md shadow-rose-500/5')
                      : isSuspicious
                      ? (isDarkMode
                        ? 'border-amber-500/50 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950'
                        : 'border-amber-300 bg-gradient-to-br from-white via-amber-50/30 to-white shadow-sm')
                      : (isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white shadow-sm')
                  }`}
                >
                  {/* Top Header Card */}
                  <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b ${
                    isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs uppercase border ${
                          isCritical
                            ? (isDarkMode ? 'bg-red-950 text-red-300 border-red-700/60' : 'bg-rose-100 text-rose-700 border-rose-300')
                            : isSuspicious
                            ? (isDarkMode ? 'bg-amber-950 text-amber-300 border-amber-700/60' : 'bg-amber-100 text-amber-800 border-amber-300')
                            : (isDarkMode ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' : 'bg-emerald-100 text-emerald-800 border-emerald-300')
                        }`}
                      >
                        {evt.avatar || evt.sender_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{evt.sender_name}</h4>
                          {evt.username && (
                            <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>@{evt.username}</span>
                          )}
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(evt.timestamp * 1000).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Telegram Direct Message Intercept</span>
                      </div>
                    </div>

                    {/* Threat Classification & Score */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                          isCritical
                            ? (isDarkMode ? 'bg-red-950/80 border-red-500 text-red-300 shadow-md shadow-red-500/20 animate-pulse' : 'bg-rose-100 border-rose-300 text-rose-800 shadow-sm animate-pulse')
                            : isSuspicious
                            ? (isDarkMode ? 'bg-amber-950/80 border-amber-500 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900')
                            : (isDarkMode ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-800')
                        }`}
                      >
                        {isCritical ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        ) : isSuspicious ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{evt.result.threat_level.replace('_', ' ')}</span>
                      </span>

                      {/* Score Badge */}
                      <div className={`px-2.5 py-1 rounded-xl border text-xs font-mono font-bold ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}>
                        {evt.result.overall_risk_score}% Risk
                      </div>
                    </div>
                  </div>

                  {/* Intercepted Text Bubble */}
                  <div className={`my-4 p-4 rounded-2xl border ${
                    isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 font-bold">
                      Intercepted Payload:
                    </span>
                    <p className="text-sm leading-relaxed font-sans">{evt.text}</p>
                  </div>

                  {/* Composite Risk Gauge Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Composite Threat Gauge</span>
                      <span
                        className={
                          isCritical
                            ? 'text-rose-600 font-bold'
                            : isSuspicious
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      >
                        {evt.result.overall_risk_score} / 100 Risk Index
                      </span>
                    </div>
                    <div className={`h-2.5 w-full rounded-full overflow-hidden border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCritical
                            ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-400'
                            : isSuspicious
                            ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${evt.result.overall_risk_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Forensic & Stylometric Breakdown Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
                    {/* Stylometric Drift */}
                    <div className={`p-3 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Stylometric Drift
                      </span>
                      <div className="text-xs font-bold text-rose-600 mt-1 flex items-center gap-1">
                        <span>{evt.result.stylometric_drift}% Drift</span>
                        <span className="text-[10px] text-slate-400 font-normal">vs Baseline</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                        Missing Hinglish & Casing Spike
                      </p>
                    </div>

                    {/* Urgency Score */}
                    <div className={`p-3 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Urgency Coercion
                      </span>
                      <div className="text-xs font-bold text-amber-600 mt-1">
                        {evt.result.urgency_score}% High Temporal Pressure
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">hospital, emergency, operation</p>
                    </div>

                    {/* Financial Coercion */}
                    <div className={`p-3 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Financial Coercion
                      </span>
                      <div className="text-xs font-bold text-red-600 mt-1">
                        {evt.result.financial_coercion_score}% Transfer Demand
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">₹5,000 transfer, GPay/UPI</p>
                    </div>

                    {/* Extracted Mule VPA */}
                    <div className={`p-3 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Mule VPA Registry
                      </span>
                      <div className="text-xs font-bold font-mono text-red-600 mt-1 truncate">
                        {evt.result.extracted_vpas[0] || 'None'}
                      </div>
                      {evt.result.is_vpa_blacklisted && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                          NPCI / I4C Mule Flagged
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flagged Reasons Accordion / Bullet List */}
                  {evt.result.flagged_reasons.length > 0 && (
                    <div className={`p-3.5 rounded-2xl border space-y-1 mb-4 ${
                      isDarkMode ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] font-mono uppercase tracking-wide block font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Forensic Reasoning Chain:
                      </span>
                      <ul className="space-y-1">
                        {evt.result.flagged_reasons.map((reason, i) => (
                          <li
                            key={i}
                            className={`text-xs flex items-start gap-2 leading-relaxed ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-700'
                            }`}
                          >
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Active Containment Status Overlay (if modified) */}
                  {isQuarantined && (
                    <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span className="font-semibold">
                          Contact Quarantined. Outbound payment intents muted across Telegram sessions.
                        </span>
                      </div>
                      <button
                        onClick={() => handleResolveInterlock(evt.chat_id, 'dismiss')}
                        className="text-[11px] text-rose-700 font-bold hover:underline"
                      >
                        Undo Quarantine
                      </button>
                    </div>
                  )}

                  {isDismissed && (
                    <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">
                          Interlock Dismissed by Operator. Marked as Verified / False Positive.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Live Interlock Action Buttons (For Critical ATO) */}
                  {isCritical && !isQuarantined && !isDismissed && (
                    <div className={`flex flex-wrap items-center gap-2.5 pt-3 border-t ${
                      isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
                    }`}>
                      {/* Button 1: Block & Quarantine Contact */}
                      <button
                        onClick={() => handleResolveInterlock(evt.chat_id, 'block')}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-500/25 active:scale-95"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Block & Quarantine Contact</span>
                      </button>

                      {/* Button 2: Deploy Zero-Knowledge Challenge */}
                      <button
                        onClick={() => {
                          setActiveQuizEvent(evt);
                          setSelectedQuizOption(null);
                          setQuizResult(null);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Deploy Zero-Knowledge Challenge</span>
                      </button>

                      {/* Button 3: Dismiss / Mark Safe */}
                      <button
                        onClick={() => handleResolveInterlock(evt.chat_id, 'dismiss')}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isDarkMode
                            ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Dismiss / Mark Safe</span>
                      </button>

                      <span className="text-[10px] font-mono text-slate-400 ml-auto">
                        Inference: {evt.result.processing_time_ms}ms on-device
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: CONTACT VAULT (CALIBRATED RAM CENTROIDS)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {/* Header Explanation */}
          <div className={`p-5 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl border ${
                isDarkMode ? 'bg-cyan-950 border-cyan-800/60 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  DPDP Act 2023 Sec 6(4) Volatile Vector Vault
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Zero raw messages persisted. Non-reversible N-gram stylometric centroids & salted SHA-256 digests in ephemeral RAM.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRestoreContacts}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>Reload Baselines ({contacts.length})</span>
              </button>
            </div>
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => {
              const hasChallenge = contact.has_custom_challenge;

              return (
                <div
                  key={contact.user_id}
                  className={`p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                    contact.drift_status === 'critical'
                      ? (isDarkMode ? 'border-red-500/50 bg-red-950/10' : 'border-rose-300 bg-rose-50/30 shadow-sm')
                      : (isDarkMode ? 'border-slate-800 hover:border-slate-700 bg-slate-950/80' : 'border-slate-200 hover:border-blue-300 bg-white shadow-sm hover:shadow-md')
                  }`}
                >
                  <div>
                    {/* Top Contact Info */}
                    <div className={`flex items-start justify-between gap-2 pb-3 border-b ${
                      isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs border ${
                          isDarkMode
                            ? 'bg-slate-900 border-slate-800 text-cyan-300'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                          {contact.avatar}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold leading-tight ${
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {contact.name}
                          </h4>
                          <span className={`text-xs font-mono ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>@{contact.username}</span>
                        </div>
                      </div>

                      {/* Drift Status Indicator */}
                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                          contact.drift_status === 'critical'
                            ? (isDarkMode ? 'bg-red-950 text-red-300 border-red-700' : 'bg-rose-100 text-rose-800 border-rose-300')
                            : (isDarkMode ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-300')
                        }`}
                      >
                        {contact.drift_status === 'critical' ? 'Drift Anomaly' : 'Calibrated'}
                      </span>
                    </div>

                    {/* Hinglish Vernacular Ratio Meter */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Hinglish Vernacular Ratio</span>
                        <span className="text-blue-600 font-mono font-bold">
                          {Math.round(contact.hinglish_ratio * 100)}%
                        </span>
                      </div>
                      <div className={`h-2 w-full rounded-full overflow-hidden border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                          style={{ width: `${Math.round(contact.hinglish_ratio * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Linguistic Profile Footprint */}
                    <div className={`grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center font-mono ${
                      isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
                    }`}>
                      <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                        <span className="text-[9px] text-slate-400 uppercase block">Samples</span>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {contact.samples_indexed} msgs
                        </span>
                      </div>
                      <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                        <span className="text-[9px] text-slate-400 uppercase block">Punctuation</span>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {contact.punctuation_density.toFixed(2)}
                        </span>
                      </div>
                      <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50'}`}>
                        <span className="text-[9px] text-slate-400 uppercase block">Caps Ratio</span>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {contact.caps_ratio.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Challenge Status Tag */}
                    <div className={`mt-3 p-2.5 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Key className={`w-3.5 h-3.5 ${hasChallenge ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span className={`text-[11px] font-semibold ${
                          hasChallenge ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-800') : 'text-slate-500'
                        }`}>
                          {hasChallenge ? 'Zero-Knowledge Challenge Active' : 'No Custom Challenge Set'}
                        </span>
                      </div>
                      {contact.challenge_question && (
                        <p className={`text-[10px] truncate mt-1 italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          "{contact.challenge_question}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button: Configure ZK Challenge */}
                  <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-slate-100'}`}>
                    <button
                      onClick={() => handleOpenChallengeConfig(contact)}
                      className={`w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all group ${
                        isDarkMode
                          ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                          : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 shadow-sm'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-45 transition-transform" />
                      <span>{hasChallenge ? 'Edit ZK Challenge' : 'Set ZK Challenge'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: QR CODE & SCREENSHOT SAFETY DETONATOR
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'detonator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 Cols): Dropzone, Image Upload & Presets */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-2xl border ${
                  isDarkMode ? 'bg-cyan-950 text-cyan-400 border-cyan-800/60' : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  <Scan className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    On-Device UPI QR Detonator
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Inspects suspicious QR codes with OpenCV & local NPCI registry checks.
                  </p>
                </div>
              </div>

              {/* Drag & Drop Visual Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all group relative overflow-hidden ${
                  isDarkMode
                    ? 'border-slate-700 hover:border-cyan-500/80 bg-slate-900/40 hover:bg-slate-900/80'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40'
                }`}
              >
                {/* Laser scan animation when scanning */}
                {isScanningQR && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse pointer-events-none" />
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className={`w-12 h-12 mx-auto rounded-2xl border flex items-center justify-center transition-colors ${
                  isDarkMode
                    ? 'bg-slate-800 group-hover:bg-cyan-950/80 border-slate-700 text-slate-400 group-hover:text-cyan-300'
                    : 'bg-white group-hover:bg-blue-100 border-slate-200 text-slate-600 group-hover:text-blue-700 shadow-sm'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>

                <div className="mt-3">
                  <span className={`text-xs font-bold block ${
                    isDarkMode ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-blue-700'
                  }`}>
                    Drop QR screenshot or click to browse
                  </span>
                  <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>PNG, JPG, WebP supported</span>
                </div>
              </div>

              {/* Quick 1-Click Test Presets */}
              <div className="space-y-2">
                <span className={`text-[11px] font-mono uppercase tracking-wider block font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Quick Detonation Presets:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      const payload =
                        'upi://pay?pa=aman.emergency@okhdfcbank&pn=Aman%20Sharma&am=5000&cu=INR';
                      setQrInputPayload(payload);
                      handleDetonateQR(payload);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isDarkMode
                        ? 'bg-slate-900 hover:bg-red-950/60 border-slate-800 hover:border-red-500/50'
                        : 'bg-slate-50 hover:bg-rose-50/70 border-slate-200 hover:border-rose-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Hospital Scam Mule QR (₹5,000)</span>
                      </div>
                      <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        pa=aman.emergency@okhdfcbank
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                  </button>

                  <button
                    onClick={() => {
                      const payload =
                        'upi://pay?pa=winprize.luck@paytm&pn=Lucky%20Draw%20Dept&am=2500&cu=INR';
                      setQrInputPayload(payload);
                      handleDetonateQR(payload);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isDarkMode
                        ? 'bg-slate-900 hover:bg-amber-950/60 border-slate-800 hover:border-amber-500/50'
                        : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Lottery Phishing QR (₹2,500)</span>
                      </div>
                      <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        pa=winprize.luck@paytm
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  </button>

                  <button
                    onClick={() => {
                      const payload =
                        'upi://pay?pa=canteen.kiet@okhdfcbank&pn=KIET%20Canteen&am=120&cu=INR';
                      setQrInputPayload(payload);
                      handleDetonateQR(payload);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isDarkMode
                        ? 'bg-slate-900 hover:bg-emerald-950/60 border-slate-800 hover:border-emerald-500/50'
                        : 'bg-slate-50 hover:bg-emerald-50/70 border-slate-200 hover:border-emerald-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Legitimate Canteen QR (₹120)</span>
                      </div>
                      <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        pa=canteen.kiet@okhdfcbank
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Raw URI Manual Input */}
              <div className="space-y-1.5 pt-1">
                <label className={`text-[11px] font-mono uppercase block font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Custom UPI / Web Payload URI:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qrInputPayload}
                    onChange={(e) => setQrInputPayload(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                    placeholder="upi://pay?pa=...&pn=..."
                  />
                  <button
                    onClick={() => handleDetonateQR()}
                    disabled={isScanningQR}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/25 active:scale-95"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Scan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Detonation Verdict HUD */}
          <div className="lg:col-span-7">
            {qrDetonationResult ? (
              <div
                className={`p-6 rounded-3xl border transition-all space-y-5 shadow-sm ${
                  qrDetonationResult.is_blacklisted || qrDetonationResult.risk_score >= 80
                    ? (isDarkMode ? 'border-red-500/80 bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 shadow-2xl shadow-red-500/20' : 'border-rose-300 bg-gradient-to-br from-white via-rose-50/40 to-white')
                    : qrDetonationResult.risk_score >= 40
                    ? (isDarkMode ? 'border-amber-500/60 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950' : 'border-amber-300 bg-gradient-to-br from-white via-amber-50/30 to-white')
                    : (isDarkMode ? 'border-emerald-500/60 bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950' : 'border-emerald-300 bg-gradient-to-br from-white via-emerald-50/30 to-white')
                }`}
              >
                {/* Header Verdict Card */}
                <div className={`flex items-start justify-between gap-4 pb-4 border-b ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider block font-bold ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Local QR Safety Verdict:
                    </span>
                    <h3
                      className={`text-lg font-bold mt-1 flex items-center gap-2 ${
                        qrDetonationResult.is_blacklisted || qrDetonationResult.risk_score >= 80
                          ? 'text-rose-600'
                          : qrDetonationResult.risk_score >= 40
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {qrDetonationResult.is_blacklisted ? (
                        <>
                          <AlertOctagon className="w-6 h-6 animate-pulse" />
                          <span>CRITICAL: Blacklisted Mule Target</span>
                        </>
                      ) : qrDetonationResult.risk_score >= 40 ? (
                        <>
                          <AlertTriangle className="w-6 h-6" />
                          <span>SUSPICIOUS: Unverified Payee</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-6 h-6" />
                          <span>AUTHENTIC: Verified Merchant Payee</span>
                        </>
                      )}
                    </h3>
                  </div>

                  {/* Risk Badge */}
                  <div className="text-right">
                    <span
                      className={`text-2xl font-black font-mono ${
                        qrDetonationResult.risk_score >= 80
                          ? 'text-rose-600'
                          : qrDetonationResult.risk_score >= 40
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {qrDetonationResult.risk_score}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">Threat Index</span>
                  </div>
                </div>

                {/* Decoded UPI Parameters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-2xl border ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Payee VPA (pa)
                    </span>
                    <div className={`text-xs font-bold font-mono mt-1 break-all ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {qrDetonationResult.vpa || 'None'}
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Payee Name (pn)
                    </span>
                    <div className={`text-xs font-bold mt-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {qrDetonationResult.payee_name || 'Unspecified'}
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Preset Amount (am)
                    </span>
                    <div className={`text-xs font-bold font-mono mt-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {qrDetonationResult.amount ? `₹${qrDetonationResult.amount}` : 'Open Amount'}
                    </div>
                  </div>
                </div>

                {/* NPCI / I4C Registry Match Banner */}
                {qrDetonationResult.is_blacklisted && (
                  <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
                      <span>NPCI & I4C Mule Registry Blacklist Match</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      This VPA has been flagged in active ATO lateral hospital coercion campaigns.
                      Immediate payment interlock engaged.
                    </p>
                  </div>
                )}

                {/* Reasons List */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`text-[10px] font-mono uppercase block font-bold ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Forensic Observations:
                  </span>
                  <ul className="space-y-1.5">
                    {qrDetonationResult.reasons.map((r, i) => (
                      <li key={i} className={`text-xs flex items-start gap-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <span className="text-blue-600 font-mono font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Raw Decoded Payload Snippet */}
                <div className={`p-3.5 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono uppercase font-bold ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Raw Decoded Intent String
                    </span>
                    <button
                      onClick={() => copyToClipboard(qrDetonationResult.raw_payload || '')}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-mono font-semibold"
                    >
                      {copiedText === qrDetonationResult.raw_payload ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className={`text-xs font-mono break-all whitespace-pre-wrap p-2.5 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    {qrDetonationResult.raw_payload}
                  </pre>
                </div>

                {/* DPDP Zero Egress Stamp */}
                <div className={`flex items-center justify-between text-[11px] font-mono pt-3 border-t ${
                  isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>100% On-Device Memory Inspection (0 Bytes Egress)</span>
                  </span>
                  <span>Scanned at {new Date(qrDetonationResult.scanned_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <div className={`p-12 text-center rounded-3xl border ${
                isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
              }`}>
                <Scan className="w-10 h-10 mx-auto opacity-40 mb-3" />
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Detonator Idle</h4>
                <p className="text-xs max-w-sm mx-auto mt-1">
                  Upload an image QR or select a preset to begin local on-device inspection.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL 1: ZERO-KNOWLEDGE CHALLENGE CONFIGURATOR
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedContactForChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`rounded-3xl border max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Set Zero-Knowledge Security Challenge
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    For {selectedContactForChallenge.name} (@{selectedContactForChallenge.username})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedContactForChallenge(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Under <strong>DPDP Act 2023 Sec 6(4)</strong>, only the salted SHA-256 cryptographic digest of the correct answer is indexed in ephemeral RAM. Plaintext answers are never stored or transmitted.
            </p>

            {/* Inspiration Suggestions */}
            <div className="space-y-1">
              <span className={`text-[10px] font-mono uppercase block font-bold ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Preset Inspiration:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What was the nickname of our 1st-year hostel warden at KIET?',
                  'Where did we go for tea during 3rd sem exams?',
                  'What is our secret project codename?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setChallengeQuestion(q)}
                    className={`text-[10px] px-2.5 py-1 rounded-xl border transition-colors text-left ${
                      isDarkMode
                        ? 'text-slate-300 bg-slate-950 hover:bg-slate-800 border-slate-800'
                        : 'text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border-slate-200'
                    }`}
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className={`text-[11px] font-mono uppercase block mb-1 font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Private Verification Question:
                </label>
                <input
                  type="text"
                  value={challengeQuestion}
                  onChange={(e) => setChallengeQuestion(e.target.value)}
                  placeholder="e.g. What was the nickname of our hostel warden?"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-mono uppercase block mb-1 font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Expected Secret Answer (Case-insensitive):
                </label>
                <input
                  type="text"
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  placeholder="e.g. Gabbar Sir"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* SHA-256 Digest Preview */}
              {challengeHashPreview && (
                <div className={`p-3 rounded-2xl border space-y-1 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 uppercase font-bold">
                    <Lock className="w-3 h-3" />
                    <span>Salted SHA-256 Digest (Ephemeral RAM):</span>
                  </div>
                  <pre className={`text-[11px] font-mono break-all p-2 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    {challengeHashPreview}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className={`flex justify-end gap-2 pt-2 border-t ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setSelectedContactForChallenge(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChallenge}
                disabled={!challengeQuestion.trim() || !challengeAnswer.trim() || isSavingChallenge}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/25"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSavingChallenge ? 'Hashing & Storing...' : 'Register Challenge'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL 2: INTERACTIVE FRIEND QUIZ CHALLENGE DISPATCHER
      ══════════════════════════════════════════════════════════════════════ */}
      {activeQuizEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`rounded-3xl border max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Autonomous Zero-Knowledge Challenge Interlock
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dispatched to {activeQuizEvent.sender_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveQuizEvent(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              CascadeGuard generated this verification challenge derived from your private local relational context. An imposter who took over the account cannot answer this without failing:
            </p>

            <div className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-blue-50 border-blue-200 text-slate-900'
            }`}>
              <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wide block mb-1 font-bold">
                Active Question:
              </span>
              <div className="text-sm font-semibold">
                {activeQuizEvent.result.friend_quiz?.question ||
                  'Security Interlock Challenge: What was the nickname of our 1st-year Hostel Warden at KIET?'}
              </div>
            </div>

            {/* Simulated Options */}
            <div className="space-y-2">
              <span className={`text-[11px] font-semibold block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Simulate Contact Response:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(
                  activeQuizEvent.result.friend_quiz?.options || [
                    'Gabbar Sir',
                    'Sharma Ji',
                    'Hitler Sir',
                    'Verma Ji'
                  ]
                ).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedQuizOption(opt)}
                    className={`p-3 rounded-2xl text-xs font-semibold text-left border transition-all ${
                      selectedQuizOption === opt
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                        : isDarkMode
                        ? 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Verdict Feedback */}
            {quizResult === 'success' && (
              <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct Answer! Account Identity Verified. Shield relaxed.</span>
              </div>
            )}

            {quizResult === 'fail' && (
              <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Wrong Answer! Attacker Imposter Confirmed. Lateral Quarantine Engaged.</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className={`flex justify-end gap-2 pt-2 border-t ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setActiveQuizEvent(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const correct =
                    activeQuizEvent.result.friend_quiz?.correctAnswer || 'Gabbar Sir';
                  if (selectedQuizOption === correct) {
                    setQuizResult('success');
                    setTimeout(() => {
                      handleResolveInterlock(activeQuizEvent.chat_id, 'verify');
                      setActiveQuizEvent(null);
                    }, 1200);
                  } else {
                    setQuizResult('fail');
                    setTimeout(() => {
                      handleResolveInterlock(activeQuizEvent.chat_id, 'block');
                      setActiveQuizEvent(null);
                    }, 1200);
                  }
                }}
                disabled={!selectedQuizOption}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-colors"
              >
                Verify Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCompanionDashboard;
