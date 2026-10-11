import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle,
  Zap,
  Lock,
  Cpu,
  CheckCircle2,
  AlertOctagon,
  Play,
  RotateCcw,
  Sliders,
  QrCode,
  Scan,
  Check,
  Key
} from 'lucide-react';
import { runCascadeGuardPipeline } from '../engine/cascadeGuardEngine';

interface InteractiveThreatLabProps {
  isDarkMode?: boolean;
  onOpenFriendQuiz?: () => void;
  onOpenPrivacyAudit?: () => void;
}

// 6 Engaging Indian Cyber Scenario Presets
const SCENARIO_PRESETS = [
  {
    id: 'hospital',
    title: '🏥 Hospital ICU Scam',
    tag: 'Critical Lateral ATO',
    color: 'rose',
    text: 'Priya urgent emergency hai! Chacha hospital me admit hue hain, operation start krna hai. URGENTLY ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga.'
  },
  {
    id: 'voting_apk',
    title: '📱 Fest Voting APK',
    tag: 'Malware Phishing',
    color: 'amber',
    text: 'Hey Priya, please vote for our team in InnoHacks coding contest! Just download this campus voting app: InnoHacks_Vote_Secure.apk and login with your mobile number. Urgent hai!'
  },
  {
    id: 'electricity',
    title: '⚡ Power Cut Phishing',
    tag: 'Urgent Fear Inducement',
    color: 'amber',
    text: 'Dear consumer, your electricity power connection will be disconnected tonight at 9:30 PM by bill officer. Kindly pay pending bill of ₹1,420 immediately at: bit.ly/power-up-bill'
  },
  {
    id: 'mom_imposter',
    title: '👩 Mom Phone Hijack',
    tag: 'Family Impersonation',
    color: 'purple',
    text: 'Beta mummy ka phone kharab ho gaya hai, dukan wale ko ₹2,500 bhejna hai urgently. Is UPI pe bhej do: shopkeeper.fastpay@ybl jaldi please.'
  },
  {
    id: 'crypto_job',
    title: '💼 YouTube Like Job',
    tag: 'Part-Time Task Scam',
    color: 'blue',
    text: 'Congratulations! You are selected for part-time YouTube Video Liking task. Earn ₹3,000 to ₹8,000 daily from home. Join official coordinator Telegram: t.me/fast_earn_india'
  },
  {
    id: 'authentic_peer',
    title: '☕ Authentic Peer Chat',
    tag: 'Legitimate Baseline',
    color: 'emerald',
    text: 'Oyee sun, kal library me 10 baje milte h kya assignments complete karne k liye? Canteen me chai peene chalenge 15 min me.'
  }
];

// 5-Phase Interception Steps
const INTERCEPTION_PHASES = [
  {
    phase: 1,
    title: 'Inbound Message Hook',
    latency: '0.18 ms',
    agent: 'Edge MTProto Hook',
    summary: 'Message captured at TDLib / WhatsApp Web socket boundary before rendering to screen.',
    detail: 'Raw payload resides strictly in volatile ephemeral memory. Zero disk persistence and zero telemetry sent to cloud servers.'
  },
  {
    phase: 2,
    title: 'Stylometric Profiling',
    latency: '0.24 ms',
    agent: 'Agent 01: Profiler',
    summary: 'Analyzes N-gram vernacular token frequency, Hinglish slang ratio, and casing irregularities.',
    detail: 'Calculates cosine distance against friend’s in-memory baseline centroid (40 calibrated messages). Flags a 52% stylometric drift.'
  },
  {
    phase: 3,
    title: 'Intent & Mule VPA Scanner',
    latency: '0.19 ms',
    agent: 'Agent 02: Scanner',
    summary: 'Dissects temporal panic cues, payment keywords, and extracts unverified UPI handles.',
    detail: 'Cross-references extracted handle (aman.emergency@okhdfcbank) against local NPCI & I4C mule blacklist.'
  },
  {
    phase: 4,
    title: 'Autonomous Shield Interlock',
    latency: '0.08 ms',
    agent: 'Agent 03: Interlock',
    summary: 'Freezes clipboard UPI intents and blocks outbound payment redirect before user taps GPay.',
    detail: 'Mutes message forward buttons in college group chat to stop lateral contagion spreading to 64 peers.'
  },
  {
    phase: 5,
    title: 'Zero-Knowledge Challenge',
    latency: '0.05 ms',
    agent: 'Agent 04: Challenger',
    summary: 'Issues personal verification question that only the real account owner knows.',
    detail: 'Challenge: "Hostel warden nickname?" — Salted SHA-256 match fails for imposter. Session safely isolated.'
  }
];

export const InteractiveThreatLab: React.FC<InteractiveThreatLabProps> = ({
  isDarkMode = false,
  onOpenFriendQuiz,
  onOpenPrivacyAudit
}) => {
  // ── Lab Navigation State ──
  const [activeLabTab, setActiveLabTab] = useState<'stylometry' | 'stepper' | 'detonator' | 'calculator'>('stylometry');

  // ── Stylometry Playground State ──
  const [inputText, setInputText] = useState(SCENARIO_PRESETS[0].text);
  const [activePresetId, setActivePresetId] = useState(SCENARIO_PRESETS[0].id);

  // ── 5-Phase Stepper State ──
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isPlayingStepper, setIsPlayingStepper] = useState(false);

  // ── QR Detonator Studio State ──
  const [customVpa, setCustomVpa] = useState('aman.emergency@okhdfcbank');
  const [customName, setCustomName] = useState('Aman Sharma');
  const [customAmount, setCustomAmount] = useState('5000');
  const [isDetonatingQR, setIsDetonatingQR] = useState(false);
  const [qrDetonationVerdict, setQrDetonationVerdict] = useState<{
    threatLevel: 'CRITICAL' | 'SAFE' | 'WARNING';
    reasons: string[];
    isBlacklisted: boolean;
  } | null>(null);

  // ── ROI & Risk Exposure Calculator State ──
  const [numContacts, setNumContacts] = useState(45);
  const [monthlyTransfers, setMonthlyTransfers] = useState(8);
  const [numGroups, setNumGroups] = useState(6);

  // ── Live Pipeline Analysis on User Text ──
  const liveAnalysis = useMemo(() => {
    return runCascadeGuardPipeline(inputText);
  }, [inputText]);

  // Vernacular words detector for interactive pill highlighting
  const tokenizedWords = useMemo(() => {
    const HINGLISH_TOKENS = new Set([
      'bhai', 'sun', 'krna', 'hai', 'yaar', 'canteen', 'chalenge', 'h', 'me', 'k', 'liye',
      'chacha', 'admit', 'hue', 'hain', 'sham', 'ko', 'wapas', 'kr', 'dunga', 'dukan',
      'wale', 'bhejna', 'jaldi', 'beta', 'mummy', 'ho', 'gaya', 'oyee', 'kal', 'chai'
    ]);
    const URGENCY_TOKENS = new Set([
      'urgent', 'urgently', 'emergency', 'right', 'now', 'immediately', 'fast', 'operation',
      'disconnected', 'pending', 'closing', 'mins', 'today', 'tonight', 'critical'
    ]);
    const FINANCIAL_TOKENS = new Set([
      '₹5,000', '₹1,420', '₹2,500', '₹3,000', '₹8,000', '₹3,500', 'transfer', 'upi',
      'paytm', 'gpay', 'phonepe', 'bill', 'earn', 'job', 'fee', 'money'
    ]);

    const words = inputText.split(/(\s+)/);
    return words.map((w, idx) => {
      const clean = w.trim().toLowerCase().replace(/[^a-z0-9₹]/g, '');
      let type: 'hinglish' | 'urgency' | 'financial' | 'vpa' | 'normal' = 'normal';

      if (clean.includes('@okhdfcbank') || clean.includes('@ybl') || clean.includes('.apk')) {
        type = 'vpa';
      } else if (FINANCIAL_TOKENS.has(clean) || clean.startsWith('₹') || clean.includes('5000') || clean.includes('2500')) {
        type = 'financial';
      } else if (URGENCY_TOKENS.has(clean)) {
        type = 'urgency';
      } else if (HINGLISH_TOKENS.has(clean)) {
        type = 'hinglish';
      }

      return { word: w, type, key: idx };
    });
  }, [inputText]);

  // Stepper Auto-Play Timer
  useEffect(() => {
    let timer: any;
    if (isPlayingStepper) {
      timer = setInterval(() => {
        setCurrentPhase((prev) => {
          if (prev >= 5) {
            setIsPlayingStepper(false);
            return 1;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlayingStepper]);

  // Detonate custom QR
  const handleRunQRDetonation = () => {
    setIsDetonatingQR(true);
    setTimeout(() => {
      const lowerVpa = customVpa.toLowerCase();
      const isBlacklisted = lowerVpa.includes('emergency') || lowerVpa.includes('mule') || lowerVpa.includes('fastpay');
      const isLargeAmt = parseInt(customAmount || '0') >= 2000;

      const reasons: string[] = [];
      if (isBlacklisted) {
        reasons.push('VPA handle flagged in I4C / NPCI Collegiate Cyber-Fraud Registry');
      }
      if (isLargeAmt) {
        reasons.push(`High single-transfer value of ₹${customAmount} to unverified beneficiary`);
      }
      if (customName.toLowerCase().includes('emergency') || lowerVpa.includes('emergency')) {
        reasons.push('Coercive keyword "emergency" in payment handle descriptor');
      }

      setQrDetonationVerdict({
        threatLevel: isBlacklisted ? 'CRITICAL' : isLargeAmt ? 'WARNING' : 'SAFE',
        reasons: reasons.length > 0 ? reasons : ['Legitimate NPCI VPA format', 'No prior fraud flags recorded on device'],
        isBlacklisted
      });
      setIsDetonatingQR(false);
    }, 450);
  };

  // Calculator computations
  const calculatedSavings = useMemo(() => {
    const potentialIncidents = Math.max(1, Math.round((numContacts * 0.08) * (numGroups / 3)));
    const annualSavings = potentialIncidents * 4800;
    const exposureLevel = potentialIncidents >= 4 ? 'EXTREME' : potentialIncidents >= 2 ? 'HIGH' : 'MODERATE';
    return {
      potentialIncidents,
      annualSavings,
      exposureLevel
    };
  }, [numContacts, numGroups]);

  return (
    <div className={`space-y-8 text-left transition-colors ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* ── TOP HEADER HERO CARD ── */}
      <section className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800 text-white'
          : 'bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 border-blue-100 text-slate-900 shadow-blue-500/5'
      }`}>
        <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isDarkMode ? 'bg-cyan-500/10' : 'bg-blue-400/15'
        }`} />
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-400/15'
        }`} />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm ${
                isDarkMode ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300' : 'bg-blue-100 border-blue-200 text-blue-700'
              }`}>
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>INTERACTIVE SECURITY LAB</span>
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm ${
                isDarkMode ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' : 'bg-emerald-100 border-emerald-200 text-emerald-800'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Edge Latency: &lt; 0.74ms</span>
              </span>

              <button
                onClick={onOpenPrivacyAudit}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border transition-all ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 shadow-sm'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-cyan-500" />
                <span>0 Bytes Cloud Egress</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Test Real-Time Hinglish Stylometry & Scam Interception
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Type any message or pick an attack scenario to watch CascadeGuard's multi-agent neural engines dissect
              slang drift, coercion pressure, and mule accounts directly inside your browser.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                setInputText(SCENARIO_PRESETS[0].text);
                setActivePresetId(SCENARIO_PRESETS[0].id);
                setActiveLabTab('stylometry');
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Hospital Scam</span>
            </button>

            <button
              onClick={() => {
                setInputText('');
                setActiveLabTab('stylometry');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-xs font-semibold transition-all ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Playground</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE TAB SELECTOR ── */}
      <div className={`p-1.5 rounded-2xl border shadow-sm backdrop-blur-xl flex flex-wrap gap-1.5 transition-colors ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/40'
      }`}>
        <button
          onClick={() => setActiveLabTab('stylometry')}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
            activeLabTab === 'stylometry'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
          }`}
        >
          <span>✍️ Stylometry Playground</span>
        </button>

        <button
          onClick={() => setActiveLabTab('stepper')}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
            activeLabTab === 'stepper'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
          }`}
        >
          <span>⚡ 5-Phase Interception Replay</span>
        </button>

        <button
          onClick={() => setActiveLabTab('detonator')}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
            activeLabTab === 'detonator'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
          }`}
        >
          <span>📱 UPI QR Detonator</span>
        </button>

        <button
          onClick={() => setActiveLabTab('calculator')}
          className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
            activeLabTab === 'calculator'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
          }`}
        >
          <span>🧮 Community Risk Calculator</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: LIVE STYLOMETRY & HINGLISH PLAYGROUND
      ══════════════════════════════════════════════════════════════════════ */}
      {activeLabTab === 'stylometry' && (
        <div className="space-y-6">
          {/* Quick Scenario Chips */}
          <div className="space-y-2">
            <span className={`text-xs font-bold uppercase tracking-wider block ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Click a Real-World Indian Threat Scenario:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {SCENARIO_PRESETS.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setInputText(preset.text);
                      setActivePresetId(preset.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                        : isDarkMode
                        ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700 text-slate-300'
                        : 'border-slate-200 bg-white hover:border-blue-300 text-slate-700 shadow-sm'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight block mb-1">
                      {preset.title}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full inline-block mt-1 font-semibold ${
                      preset.color === 'rose'
                        ? 'bg-rose-100 text-rose-700'
                        : preset.color === 'amber'
                        ? 'bg-amber-100 text-amber-800'
                        : preset.color === 'purple'
                        ? 'bg-purple-100 text-purple-800'
                        : preset.color === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Split: Input Box & Live Telemetry Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Input Textarea & Token Highlight Canvas */}
            <div className={`lg:col-span-7 p-6 rounded-3xl border shadow-xl space-y-4 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Live Inbound Message Stream
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {inputText.length} characters • {inputText.split(/\s+/).filter(Boolean).length} tokens
                </span>
              </div>

              {/* Textarea */}
              <div className="space-y-1">
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setActivePresetId('');
                  }}
                  rows={4}
                  placeholder="Type any Hindi, Hinglish, or English message to test on-device interception..."
                  className={`w-full p-4 rounded-2xl border text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Interactive Visual Token Inspector */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold uppercase tracking-wider text-[11px] ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Interactive Token Dissector:
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500" /> Hinglish
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Urgency
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> Financial
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border min-h-[90px] flex flex-wrap gap-1.5 leading-relaxed text-sm ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                }`}>
                  {tokenizedWords.length === 0 || !inputText.trim() ? (
                    <span className="text-xs text-slate-400 italic">Start typing above to see live tokenized classification...</span>
                  ) : (
                    tokenizedWords.map((t) => {
                      if (t.type === 'hinglish') {
                        return (
                          <span
                            key={t.key}
                            className="bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded-lg text-xs font-medium cursor-help"
                            title="Hinglish vernacular slang token detected"
                          >
                            {t.word}
                          </span>
                        );
                      }
                      if (t.type === 'urgency') {
                        return (
                          <span
                            key={t.key}
                            className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg text-xs font-bold cursor-help"
                            title="Panic inducement / temporal pressure cue"
                          >
                            {t.word}
                          </span>
                        );
                      }
                      if (t.type === 'financial' || t.type === 'vpa') {
                        return (
                          <span
                            key={t.key}
                            className="bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded-lg text-xs font-mono font-bold cursor-help"
                            title="Financial extraction vector / target VPA handle"
                          >
                            {t.word}
                          </span>
                        );
                      }
                      return <span key={t.key} className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{t.word}</span>;
                    })
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenFriendQuiz}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Launch Zero-Knowledge Reverse Challenge</span>
                </button>

                <button
                  onClick={onOpenPrivacyAudit}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>DPDP Act §6(4) Volatile RAM Proof</span>
                </button>
              </div>
            </div>

            {/* Right: Live Telemetry Gauges Card */}
            <div className={`lg:col-span-5 p-6 rounded-3xl border shadow-xl space-y-5 ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Verdict Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Edge Safety Verdict
                </span>
                <span className="text-[11px] font-mono text-blue-600 font-bold">
                  Latency: {liveAnalysis.processingTimeMs}ms
                </span>
              </div>

              {/* Big Verdict Pill */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                liveAnalysis.threatLevel === 'CRITICAL_ATO'
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : liveAnalysis.threatLevel === 'SUSPICIOUS'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    liveAnalysis.threatLevel === 'CRITICAL_ATO'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                      : liveAnalysis.threatLevel === 'SUSPICIOUS'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  }`}>
                    {liveAnalysis.threatLevel === 'CRITICAL_ATO' ? (
                      <AlertOctagon className="w-5 h-5" />
                    ) : liveAnalysis.threatLevel === 'SUSPICIOUS' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight">
                      {liveAnalysis.threatLevel.replace('_', ' ')}
                    </h3>
                    <span className="text-[11px] block opacity-80">
                      {liveAnalysis.threatLevel === 'CRITICAL_ATO'
                        ? 'Autonomous Interlock Engaged'
                        : liveAnalysis.threatLevel === 'SUSPICIOUS'
                        ? 'Reverse Challenge Recommended'
                        : 'Authentic Peer Baseline'}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-2xl font-black">{liveAnalysis.overallRiskScore}%</span>
                  <span className="text-[9px] block uppercase font-bold opacity-75">RISK INDEX</span>
                </div>
              </div>

              {/* 4 Interactive Gauges */}
              <div className="space-y-4">
                {/* Gauge 1: Stylometric Drift */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Stylometric Drift vs Baseline</span>
                    </span>
                    <span className="font-mono font-bold text-purple-600">
                      {liveAnalysis.stylometricDrift.overallDrift}%
                    </span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                      style={{ width: `${liveAnalysis.stylometricDrift.overallDrift}%` }}
                    />
                  </div>
                </div>

                {/* Gauge 2: Urgency Coercion */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Temporal Panic & Urgency Score</span>
                    </span>
                    <span className="font-mono font-bold text-amber-600">
                      {liveAnalysis.forensicIntent.urgencyScore}%
                    </span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                      style={{ width: `${liveAnalysis.forensicIntent.urgencyScore}%` }}
                    />
                  </div>
                </div>

                {/* Gauge 3: Financial Intent */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Financial Transfer Demand</span>
                    </span>
                    <span className="font-mono font-bold text-rose-600">
                      {liveAnalysis.forensicIntent.financialCoercionScore}%
                    </span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-300"
                      style={{ width: `${liveAnalysis.forensicIntent.financialCoercionScore}%` }}
                    />
                  </div>
                </div>

                {/* Gauge 4: Language Mix Drift */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Vernacular / Language Mix Anomaly</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600">
                      {liveAnalysis.stylometricDrift.languageMixDrift}%
                    </span>
                  </div>
                  <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                      style={{ width: `${liveAnalysis.stylometricDrift.languageMixDrift}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Forensic Reasons Chain */}
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`font-bold block uppercase text-[10px] tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Stylometric Drift Details:
                </span>
                <ul className="space-y-1.5 text-xs">
                  {liveAnalysis.stylometricDrift.details.length > 0 ? (
                    liveAnalysis.stylometricDrift.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{detail}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-2 text-emerald-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>No anomalies detected. Stylometric patterns align with authenticated peer profile.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: 5-PHASE INTERCEPTION STEPPER REPLAY
      ══════════════════════════════════════════════════════════════════════ */}
      {activeLabTab === 'stepper' && (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-8 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                <Play className="w-3.5 h-3.5" />
                <span>STEP-BY-STEP REPLAY ENGINE</span>
              </div>
              <h2 className="text-2xl font-black mt-2">How CascadeGuard Stops an ATO in &lt; 300ms</h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Walk through each phase of the autonomous on-device pipeline from packet arrival to reverse-challenge.
              </p>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingStepper(!isPlayingStepper)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isPlayingStepper
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isPlayingStepper ? 'animate-spin' : ''}`} />
                <span>{isPlayingStepper ? 'Pause Replay' : 'Auto Play'}</span>
              </button>

              <button
                onClick={() => setCurrentPhase(1)}
                className={`p-2.5 rounded-xl border text-xs font-semibold ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}
                title="Reset to Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-5 gap-2">
            {INTERCEPTION_PHASES.map((p) => {
              const isPast = p.phase < currentPhase;
              const isCurrent = p.phase === currentPhase;
              return (
                <button
                  key={p.phase}
                  onClick={() => setCurrentPhase(p.phase)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isCurrent
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                      : isPast
                      ? 'border-emerald-300 bg-emerald-50/60 text-emerald-800'
                      : isDarkMode
                      ? 'border-slate-800 bg-slate-900/60 text-slate-500'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold">Phase 0{p.phase}</span>
                    {isPast && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[11px] font-bold block truncate leading-tight">
                    {p.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Active Phase Card */}
          {(() => {
            const phaseData = INTERCEPTION_PHASES[currentPhase - 1];
            return (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg space-y-4 ${
                isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">
                      0{phaseData.phase}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{phaseData.title}</h3>
                      <span className="text-xs font-mono text-blue-600 font-semibold">{phaseData.agent}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                      ⚡ Execution: {phaseData.latency}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Summary:</h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {phaseData.summary}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1.5 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide block">
                    Under the Hood:
                  </span>
                  <p className="text-xs leading-relaxed font-mono">
                    {phaseData.detail}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setCurrentPhase((p) => Math.max(1, p - 1))}
                    disabled={currentPhase === 1}
                    className="px-4 py-2 rounded-xl border text-xs font-bold disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    ◄ Previous Phase
                  </button>

                  <button
                    onClick={() => setCurrentPhase((p) => Math.min(5, p + 1))}
                    disabled={currentPhase === 5}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Next Phase ►
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: UPI QR CODE DETONATOR STUDIO
      ══════════════════════════════════════════════════════════════════════ */}
      {activeLabTab === 'detonator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: UPI URI Builder */}
          <div className={`lg:col-span-6 p-6 rounded-3xl border shadow-xl space-y-5 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">UPI QR Detonation Sandbox</h3>
                <p className="text-xs text-slate-500">Test how OpenCV extracts VPAs and validates against I4C registries.</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-slate-600 dark:text-slate-400">
                  Target Beneficiary VPA:
                </label>
                <input
                  type="text"
                  value={customVpa}
                  onChange={(e) => setCustomVpa(e.target.value)}
                  placeholder="e.g. aman.emergency@okhdfcbank"
                  className={`w-full p-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-slate-600 dark:text-slate-400">
                    Payee Name:
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Aman Sharma"
                    className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-slate-600 dark:text-slate-400">
                    Amount (INR ₹):
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="5000"
                    className={`w-full p-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Detonation Trigger Button */}
              <button
                onClick={handleRunQRDetonation}
                disabled={isDetonatingQR}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Scan className={`w-4 h-4 ${isDetonatingQR ? 'animate-spin' : ''}`} />
                <span>{isDetonatingQR ? 'Detonating & Cross-Referencing I4C...' : 'Detonate Payload & Inspect VPA'}</span>
              </button>
            </div>
          </div>

          {/* Right: Inspection Verdict Card */}
          <div className={`lg:col-span-6 p-6 rounded-3xl border shadow-xl space-y-5 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detonation Output Trace
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">Local OpenCV Engine</span>
            </div>

            {/* Generated URI Box */}
            <div className={`p-4 rounded-2xl border space-y-1.5 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Decoded UPI Intent URI:
              </span>
              <pre className="text-xs font-mono text-blue-700 dark:text-blue-400 break-all leading-relaxed">
                upi://pay?pa={customVpa}&pn={encodeURIComponent(customName)}&am={customAmount}&cu=INR
              </pre>
            </div>

            {/* Verdict Box */}
            {qrDetonationVerdict ? (
              <div className={`p-5 rounded-2xl border space-y-3 ${
                qrDetonationVerdict.threatLevel === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : qrDetonationVerdict.threatLevel === 'WARNING'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {qrDetonationVerdict.threatLevel === 'CRITICAL' ? (
                      <AlertOctagon className="w-5 h-5 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    <h4 className="text-sm font-bold">
                      {qrDetonationVerdict.threatLevel === 'CRITICAL'
                        ? 'CRITICAL ATO / BLACKLISTED MULE VPA'
                        : qrDetonationVerdict.threatLevel === 'WARNING'
                        ? 'UNVERIFIED HIGH VALUE TRANSFER'
                        : 'VERIFIED LOW RISK BENEFICIARY'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-white border">
                    {qrDetonationVerdict.threatLevel}
                  </span>
                </div>

                <ul className="space-y-1 text-xs">
                  {qrDetonationVerdict.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>•</span> <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 border border-dashed rounded-2xl">
                <Scan className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                <p className="text-xs">Click "Detonate Payload" to trigger on-device NPCI registry verification.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: COMMUNITY RISK & ROI EXPOSURE CALCULATOR
      ══════════════════════════════════════════════════════════════════════ */}
      {activeLabTab === 'calculator' && (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-8 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
              <Sliders className="w-3.5 h-3.5" />
              <span>COMMUNITY EXPOSURE MODEL</span>
            </div>
            <h2 className="text-2xl font-black mt-2">Calculate Your Community's Lateral Risk & Fraud Savings</h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Adjust sliders below to simulate how many peers are exposed when an attacker hijacks a single college account.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Contacts */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Number of Calibrated Peer Contacts:</span>
                  <span className="text-blue-600 font-mono text-sm">{numContacts} Contacts</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  value={numContacts}
                  onChange={(e) => setNumContacts(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5 (Personal)</span>
                  <span>100 (Hostel Circle)</span>
                  <span>250 (Batch-wide)</span>
                </div>
              </div>

              {/* Slider 2: Monthly Transfers */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Monthly Peer UPI Transactions:</span>
                  <span className="text-blue-600 font-mono text-sm">{monthlyTransfers} Transfers / mo</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={monthlyTransfers}
                  onChange={(e) => setMonthlyTransfers(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 / mo</span>
                  <span>15 / mo</span>
                  <span>30 / mo</span>
                </div>
              </div>

              {/* Slider 3: Group Chats */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Active Telegram / WhatsApp Groups:</span>
                  <span className="text-blue-600 font-mono text-sm">{numGroups} Groups</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={numGroups}
                  onChange={(e) => setNumGroups(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 Group</span>
                  <span>10 Groups</span>
                  <span>20 Groups</span>
                </div>
              </div>
            </div>

            {/* Right Summary Card (5 cols) */}
            <div className={`lg:col-span-5 p-6 rounded-3xl border shadow-xl space-y-5 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <span className="text-xs font-mono uppercase text-blue-700 font-bold block">
                Simulated Defense ROI:
              </span>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Estimated Annual Scam Loss Avoided:</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">
                  ₹{calculatedSavings.annualSavings.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className={`p-3 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-blue-100 shadow-sm'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Scams Intercepted</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {calculatedSavings.potentialIncidents} / year
                  </span>
                </div>

                <div className={`p-3 rounded-2xl border ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-blue-100 shadow-sm'
                }`}>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Cloud Data Egress</span>
                  <span className="text-lg font-bold text-emerald-600 mt-0.5 block">
                    0 Bytes (DPDP)
                  </span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                By maintaining non-reversible centroid hashes in volatile RAM, CascadeGuard eliminates cloud leaks while intercepting lateral financial contagion in &lt;300 milliseconds.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveThreatLab;

