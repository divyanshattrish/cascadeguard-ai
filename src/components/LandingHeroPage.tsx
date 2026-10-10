import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Play,
  AlertTriangle,
  CheckCircle2,
  Mic,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  FileText,
  Scan,
  KeyRound,
  Network,
  X,
  Download,
  ChevronsLeftRight,
  MessageCircle,
  Send,
  HelpCircle,
  Check,
  ArrowUp,
  Radio,
  Flame,
  AlertOctagon
} from 'lucide-react';

interface ChatMsg {
  sender: 'bot' | 'user';
  text: string;
}

interface LandingHeroPageProps {
  onOpenDemo: (mode?: 'companion' | 'simulator' | 'lab') => void;
  onOpenFriendQuiz: () => void;
  onOpenContagionGraph: () => void;
  onOpenPrivacyAudit: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const LandingHeroPage: React.FC<LandingHeroPageProps> = ({
  onOpenDemo,
  onOpenFriendQuiz,
  onOpenContagionGraph,
  onOpenPrivacyAudit,
  isDarkMode = false,
  onToggleTheme
}) => {
  // ── Navigation & Global State ──
  const [activeTabNav, setActiveTabNav] = useState<'Home' | 'Features' | 'How It Works' | 'Live Sandbox' | 'Comparison' | 'FAQ'>('Home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── Device Mockup Interactive State ──
  const [isPaymentBlocked, setIsPaymentBlocked] = useState(false);
  const [isApkBlocked, setIsApkBlocked] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // ── Before / After Slider State ──
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // ── Live Threat Hotspot Inspector State ──
  const [activeHotspot, setActiveHotspot] = useState<number | null>(1);

  // ── FAQ Accordion State ──
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // ── Interactive Style / Security Quiz State ──
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // ── Floating AI Chat Widget State ──
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      sender: 'bot',
      text: '🛡️ Greetings! I am Sentinel AI, CascadeGuard\'s autonomous security advisor. Ask me anything about on-device stylometric drift, DPDP §6(4) compliance, or how we halt lateral account takeovers in <300ms.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // ── Scroll Progress & Back-to-Top Listener ──
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      const pct = (currentScroll / (totalScroll || 1)) * 100;
      setScrollProgress(pct);
      setShowBackToTop(currentScroll > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Chat Auto-Scroll ──
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Slider Mouse / Touch Handlers ──
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingSlider && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  // ── AI Chat Message Handler ──
  const handleSendChat = (presetText?: string) => {
    const textToSend = presetText || chatInput.trim();
    if (!textToSend) return;

    setChatMessages((prev: ChatMsg[]) => [...prev, { sender: 'user', text: textToSend }]);
    setChatInput('');
    setIsChatTyping(true);

    setTimeout(() => {
      let reply = "CascadeGuard's on-device N-gram engine compares sentence construction, casing frequency, and Hinglish vernacular ratios against calibrated volatile RAM centroids. When drift exceeds 50% alongside financial coercion triggers, autonomous containment engages.";

      const lower = textToSend.toLowerCase();
      if (lower.includes('dpdp') || lower.includes('privacy') || lower.includes('flush')) {
        reply = "Under Section 6(4) of the Digital Personal Data Protection Act 2023, data fiduciaries must erase personal data upon purpose completion. CascadeGuard never writes raw messages to disk or cloud. Vectors exist solely in volatile RAM, and the '/flush' command guarantees cryptographic non-recoverability with 0 bytes cloud egress.";
      } else if (lower.includes('quiz') || lower.includes('friend') || lower.includes('challenge')) {
        reply = "The Reverse Friend Quiz is a zero-knowledge identity challenge derived from private relational context (e.g. 'What was our hostel warden nickname?'). The correct answer is hashed with salted SHA-256 in ephemeral RAM. An imposter who stole the account session cannot answer it!";
      } else if (lower.includes('npci') || lower.includes('mule') || lower.includes('upi')) {
        reply = "CascadeGuard cross-checks extracted UPI VPAs against the I4C (Indian Cybercrime Coordination Centre) and NPCI Mule Registries in sub-millisecond local lookups. Flagged VPAs like 'aman.emergency@okhdfcbank' trigger an immediate payment lock!";
      } else if (lower.includes('latency') || lower.includes('speed') || lower.includes('fast')) {
        reply = "Analysis executes in 0.74ms on average (<1ms), far beneath the statutory 50ms statutory ceiling. Everything runs locally on device via optimized vectorized matrices!";
      }

      setChatMessages((prev: ChatMsg[]) => [...prev, { sender: 'bot', text: reply }]);
      setIsChatTyping(false);
    }, 1000);
  };

  // ── Quiz Flow ──
  const quizQuestions = [
    {
      q: "Q1. How do your team or college peer groups primarily communicate on messaging apps?",
      options: [
        { label: "Frequent Hinglish slang & colloquial shorthand ('bhai/yaar/kal scene...')", tag: "Vernacular Dependent" },
        { label: "Structured English with formal punctuation and formatting", tag: "Standard English" },
        { label: "Voice notes, screenshots, and mixed regional languages", tag: "Multimodal Flow" },
        { label: "High-volume community broadcast channels with shared links", tag: "High Blast Radius" }
      ]
    },
    {
      q: "Q2. If a known contact suddenly asks for ₹5,000 for a medical hospital emergency, what typically happens?",
      options: [
        { label: "Immediate GPay / UPI transfer without calling them on phone", tag: "Critical Coercion Vulnerability" },
        { label: "Pause and call their voice number to verify identity first", tag: "High Security Awareness" },
        { label: "Ask for proof or prescription before deciding", tag: "Moderate Vigilance" },
        { label: "Share the request in mutual group chats to raise funds", tag: "Lateral Multi-Victim Risk" }
      ]
    },
    {
      q: "Q3. How does your existing security setup detect Account Takeovers (ATO) across Telegram and WhatsApp?",
      options: [
        { label: "Zero protection — reliant entirely on user gut feeling and app spam buttons", tag: "Unprotected Surface" },
        { label: "Cloud SIEM requiring server-side message monitoring (violates privacy)", tag: "Cloud Privacy Tradeoff" },
        { label: "Periodic employee awareness workshops once a year", tag: "Human Error Vulnerable" },
        { label: "Two-factor authentication only (bypassed via session token hijacking)", tag: "Session Hijack Vulnerable" }
      ]
    },
    {
      q: "Q4. What is your regulatory requirement regarding chat message storage and data sovereignty?",
      options: [
        { label: "100% On-Device & Zero Cloud Egress (DPDP Act 2023 Sec 6(4) strict volatile RAM)", tag: "Sovereign Compliance" },
        { label: "Standard E2EE is sufficient, but audit logs must be cryptographic", tag: "Audited Compliance" },
        { label: "Must run offline without continuous internet access for defense environments", tag: "Air-Gapped Operational" },
        { label: "Instant memory purge capability on demand without remnant centroids", tag: "Volatile Ephemeral" }
      ]
    }
  ];

  const handleQuizSelect = (optionLabel: string) => {
    const updated = [...quizAnswers, optionLabel];
    setQuizAnswers(updated);
    if (quizStep + 1 < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#070C1A] text-slate-100' : 'bg-[#FAF9F6] text-slate-900'}`}>
      {/* ── Scroll Progress Bar ── */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 z-[100] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className={`fixed bottom-6 left-6 z-50 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce ${isDarkMode ? 'bg-slate-900/95 border-cyan-500/50 text-white' : 'bg-white/95 border-blue-500/50 text-slate-900 shadow-blue-500/10'}`}>
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-cyan-950 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Back to Top Floating Button ── */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-24 z-40 p-3 rounded-full border shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-slate-900/90 border-slate-700 text-cyan-400' : 'bg-white/90 border-slate-200 text-blue-600 shadow-slate-300/40'}`}
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* ── LIVE SECURITY THREAT TICKER MARQUEE ── */}
      <div className={`w-full overflow-hidden border-b py-2 text-[11px] font-mono relative z-30 transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-blue-50/70 border-blue-100 text-slate-600'}`}>
        <div className="flex whitespace-nowrap animate-marquee gap-10 items-center">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <strong className="text-red-500">11:42 AM:</strong> Intercepted Lateral Hospital Scam from Aman Sharma — ₹5,000 transfer quarantined
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <strong className="text-emerald-600">11:39 AM:</strong> Zero-Knowledge Reverse Friend Quiz deployed to verify compromised session
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <strong className="text-blue-600">11:35 AM:</strong> Edge Latency: 0.74ms (<strong>100% On-Device, 0 Bytes Cloud Egress</strong>)
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <strong className="text-amber-600">11:30 AM:</strong> DPDP Act §6(4) Volatile RAM purge executed — Centroid vectors reset
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <strong className="text-rose-500">11:24 AM:</strong> Malicious Fest Voting APK 'fest2024.apk' halted on Telegram TDLib surface
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <strong className="text-blue-600">11:15 AM:</strong> NPCI & I4C Mule VPA 'aman.emergency@okhdfcbank' confirmed in blacklist
          </span>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <div className={`relative overflow-hidden transition-colors ${isDarkMode ? 'bg-[#070C1A]' : 'bg-gradient-to-b from-[#FAF9F6] via-white to-[#F1F5F9]'}`}>
        {/* Ambient Gradient Glows */}
        <div className={`absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none ${isDarkMode ? 'bg-gradient-to-br from-cyan-600/15 via-blue-600/10 to-transparent' : 'bg-gradient-to-br from-blue-300/30 via-indigo-200/20 to-transparent'}`} />
        <div className={`absolute top-[20%] right-[-5%] w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none ${isDarkMode ? 'bg-gradient-to-bl from-purple-600/15 via-indigo-600/10 to-transparent' : 'bg-gradient-to-bl from-purple-200/30 via-sky-200/20 to-transparent'}`} />

        {/* ── TOP NAVBAR ── */}
        <header className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTabNav('Home')}>
              <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl border shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-indigo-600/30 border-cyan-400/50 text-cyan-400 shadow-cyan-500/20' : 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-400/30 text-white shadow-blue-500/20'}`}>
                <Shield className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <div className="flex flex-col text-left">
                <span className={`text-lg font-black tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  CASCADEGUARD <span className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}>AI</span>
                </span>
                <span className={`text-[9px] font-mono tracking-[0.22em] uppercase mt-0.5 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  DETECT • INTERCEPT • PROTECT
                </span>
              </div>
            </div>

            {/* Center Navigation Links */}
            <nav className={`hidden lg:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200/80 shadow-sm'}`}>
              {(['Home', 'Features', 'How It Works', 'Live Sandbox', 'Comparison', 'FAQ'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTabNav(tab);
                    if (tab === 'Live Sandbox') {
                      document.getElementById('live-sandbox-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (tab === 'How It Works') {
                      document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (tab === 'Features') {
                      document.getElementById('ecosystem-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (tab === 'Comparison') {
                      document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (tab === 'FAQ') {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTabNav === tab
                      ? (isDarkMode ? 'text-white' : 'text-blue-700 bg-blue-50')
                      : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  <span>{tab}</span>
                  {activeTabNav === tab && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Controls: Theme Toggle & Get Started CTA */}
            <div className="flex items-center gap-3">
              {/* Theme Pill Toggle */}
              <div
                onClick={onToggleTheme}
                className={`cursor-pointer flex items-center gap-1.5 p-1 rounded-full border transition-colors ${isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
                title="Toggle Light / Dark Mode"
              >
                <div className={`p-1 rounded-full transition-colors ${!isDarkMode ? 'bg-amber-100 text-amber-600' : 'text-slate-500'}`}>
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className={`w-4 h-2 rounded-full relative flex items-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${isDarkMode ? 'bg-cyan-400 translate-x-2' : 'bg-blue-600 translate-x-0'}`} />
                </div>
                <div className={`p-1 rounded-full transition-colors ${isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>
                  <Moon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Get Started Button */}
              <button
                onClick={() => onOpenDemo('companion')}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/25 transition-all active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO BANNER & MAIN DISPLAY ── */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* ── LEFT HERO COPY ── */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border shadow-sm ${isDarkMode ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-700 shadow-blue-500/5'}`}>
                <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>BUILT FOR INNOHACKS 4.0 & BUILD WITH BHARAT</span>
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Stop Account Takeovers{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Before
                </span>{' '}
                They Spread.
              </h1>

              <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                CascadeGuard AI is your on-device security assistant that detects and blocks social
                engineering, phishing, and suspicious payments — across WhatsApp Web, Telegram, and
                Android.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenDemo('companion')}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 transition-all active:scale-95"
                >
                  <span>Try Live Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenDemo('lab')}
                  className={`flex items-center gap-1.5 px-6 py-3.5 rounded-full border text-sm font-semibold transition-all active:scale-95 ${
                    isDarkMode 
                      ? 'bg-purple-950/60 hover:bg-purple-900/60 border-purple-500/40 text-purple-300' 
                      : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800 shadow-sm'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>🔬 Threat Lab</span>
                </button>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-full border text-sm font-semibold transition-all ${isDarkMode ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}
                >
                  <Play className={`w-4 h-4 ${isDarkMode ? 'fill-white' : 'fill-slate-700'}`} />
                  <span>Watch Video</span>
                </button>
              </div>

              <div className={`grid grid-cols-3 gap-3 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm sm:text-base font-mono">
                    <Zap className="w-4 h-4" />
                    <span>&lt; 300ms</span>
                  </div>
                  <span className={`text-[11px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Analysis Latency</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm sm:text-base font-mono">
                    <Shield className="w-4 h-4" />
                    <span>4</span>
                  </div>
                  <span className={`text-[11px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AI Agents</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-600 font-bold text-sm sm:text-base font-mono">
                    <Lock className="w-4 h-4" />
                    <span>100%</span>
                  </div>
                  <span className={`text-[11px] font-medium block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>On-Device & Private</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT DEVICE MOCKUPS ── */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-4">
                {/* ── LAPTOP DISPLAY MOCKUP ── */}
                <div className={`w-full md:w-[82%] rounded-2xl border shadow-2xl overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-slate-300/50'}`}>
                  <div className={`px-4 py-2 border-b flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <span className={`text-[10px] font-mono ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>CascadeGuard AI — Unified Hub</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                      <span>_</span>
                      <span>▢</span>
                      <span>✕</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 min-h-[340px]">
                    {/* Left Mini Sidebar */}
                    <div className={`col-span-2 border-r p-2.5 flex flex-col justify-between ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 px-1 py-1 text-blue-600">
                          <Shield className="w-4 h-4" />
                          <span className={`text-[9px] font-bold hidden sm:inline ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>CascadeGuard</span>
                        </div>
                        <div className="space-y-1">
                          <div className="px-2 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span className="hidden sm:inline">Dashboard</span>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Messages</div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Protection</div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Network</div>
                        </div>
                      </div>
                    </div>

                    {/* Center WhatsApp Chat List */}
                    <div className={`col-span-5 border-r p-3 flex flex-col justify-between text-left ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-[#F4F6F9] border-slate-200'}`}>
                      <div>
                        <div className={`flex items-center justify-between pb-2 border-b text-xs ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>WhatsApp Web</span>
                          </div>
                          <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>3 new messages</span>
                        </div>

                        <div className="mt-2 space-y-1.5">
                          {/* Compromised Aman */}
                          <div className={`p-2 rounded-xl border relative shadow-sm ${isDarkMode ? 'bg-slate-900 border-red-500/50' : 'bg-white border-red-400 shadow-red-500/5'}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 border border-red-300 font-bold text-[10px] flex items-center justify-center">
                                  AS
                                </div>
                                <div>
                                  <span className={`text-[11px] font-bold block leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Aman (Compromised)</span>
                                  <span className="text-[9px] text-red-600 font-mono block">
                                    Bro urgently send ₹5,000 to this UPI ID, I'm stuck!
                                  </span>
                                </div>
                              </div>
                              <span className="text-[9px] text-red-500 flex items-center gap-0.5">
                                11:42 AM <AlertTriangle className="w-2.5 h-2.5 text-red-500" />
                              </span>
                            </div>
                          </div>

                          <div className={`p-1.5 rounded-lg flex items-center justify-between text-[10px] ${isDarkMode ? 'bg-slate-900/40' : 'bg-white/80 border border-slate-100'}`}>
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[9px] flex items-center justify-center font-bold">PP</div>
                              <div>
                                <span className={`font-semibold block ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Priya</span>
                                <span className="text-slate-400 text-[9px]">Are you free today?</span>
                              </div>
                            </div>
                            <span className="text-[9px] text-slate-400">10:21 AM</span>
                          </div>

                          <div className={`p-1.5 rounded-lg flex items-center justify-between text-[10px] ${isDarkMode ? 'bg-slate-900/40' : 'bg-white/80 border border-slate-100'}`}>
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] flex items-center justify-center font-bold">CS</div>
                              <div>
                                <span className={`font-semibold block ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>CS Batch Group</span>
                                <span className="text-slate-400 text-[9px]">64 members</span>
                              </div>
                            </div>
                            <span className="text-[9px] text-slate-400">09:18 AM</span>
                          </div>
                        </div>
                      </div>

                      <div className={`pt-2 border-t flex items-center gap-1.5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div className={`flex-1 rounded-lg px-2.5 py-1 text-[10px] flex items-center justify-between ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400 border border-slate-200'}`}>
                          <span>Type a message...</span>
                          <Mic className="w-3 h-3 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    {/* Right Threat Analysis Panel */}
                    <div className={`col-span-5 p-3 flex flex-col justify-between text-left space-y-2.5 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
                      <div>
                        <div className={`flex items-center justify-between text-xs pb-1.5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Threat Analysis</span>
                          <span className="text-[9px] font-mono text-red-600 bg-red-100 px-1.5 py-0.5 rounded font-bold">
                            LIVE
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                          <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-red-500 bg-red-50 shadow-md shadow-red-500/10">
                            <div className="text-center">
                              <span className="text-lg font-black text-red-600 leading-none block">92</span>
                              <span className="text-[8px] font-mono text-red-600 uppercase tracking-widest font-bold">RISK</span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-1 text-[10px] font-mono">
                            <div className="flex justify-between items-center">
                              <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Stylometric Drift
                              </span>
                              <span className="text-red-600 font-bold">87%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Financial Coercion
                              </span>
                              <span className="text-orange-600 font-bold">92%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Urgency Score
                              </span>
                              <span className="text-amber-600 font-bold">78%</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 p-2 rounded-xl bg-red-50 border border-red-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-red-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-600" /> Suspicious Message
                            </span>
                            <span className="text-[8px] font-mono font-bold bg-red-600 text-white px-1 py-0.2 rounded">HIGH RISK</span>
                          </div>
                          <ul className="text-[9px] text-red-700/90 space-y-0.5 font-sans pl-1">
                            <li>✦ Unusual language style</li>
                            <li>✦ High urgency score</li>
                            <li>✦ Unknown UPI handle</li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <button
                          onClick={() => {
                            setIsPaymentBlocked(true);
                            showToast('🛑 [INTERLOCK ACTIVE]: UPI Payment of ₹5,000 to unverified VPA was blocked.');
                          }}
                          className={`w-full py-2 rounded-xl text-white font-bold text-[11px] transition-all shadow-md ${
                            isPaymentBlocked
                              ? 'bg-red-800 text-white'
                              : 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
                          }`}
                        >
                          {isPaymentBlocked ? '✓ Payment Interlocked' : '🚫 Block Payment'}
                        </button>
                        <button
                          onClick={onOpenFriendQuiz}
                          className={`w-full py-1.5 rounded-xl border font-medium text-[10px] transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'}`}
                        >
                          Verify with Friend Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SMARTPHONE TELEGRAM DISPLAY MOCKUP ── */}
                <div className={`w-56 md:w-52 rounded-[28px] border-4 shadow-xl overflow-hidden p-2 text-left relative flex-shrink-0 transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-slate-300/40'}`}>
                  <div className={`w-16 h-2.5 rounded-full mx-auto mb-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200 px-1 text-sky-600 text-xs font-bold">
                    <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px]">✈</span>
                    <span>Telegram</span>
                  </div>

                  <div className={`mt-2 p-2 rounded-xl border space-y-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={`text-[10px] block leading-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Vote for me in this college fest! Download this APK 👇
                    </span>
                    <div className={`p-1.5 rounded-lg border flex items-center justify-between text-[9px] ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-blue-600" />
                        <span className="font-mono font-bold">fest2024.apk</span>
                      </div>
                      <span className="text-[8px] text-slate-400">5.2 MB</span>
                    </div>
                  </div>

                  <div className="mt-2 p-2 rounded-xl bg-red-50 border border-red-200 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-red-700">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>Malicious APK Detected</span>
                    </div>
                    <ul className="text-[9px] text-red-700/90 space-y-0.5">
                      <li>✦ Unknown source</li>
                      <li>✦ Suspicious permissions</li>
                      <li>✦ Reported by community</li>
                    </ul>
                  </div>

                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsApkBlocked(true);
                        showToast('🛡️ [APK QUARANTINED]: fest2024.apk download halted & blacklisted on device.');
                      }}
                      className="w-full py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition-all"
                    >
                      {isApkBlocked ? '✓ Download Blocked' : 'Block Download'}
                    </button>
                    <button
                      onClick={() => onOpenDemo('companion')}
                      className={`w-full py-1 rounded-xl border text-[9px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
                    >
                      Report & Warn Others
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── SECTION 2: THREE SURFACE ECOSYSTEM CARDS ── */}
      <section id="ecosystem-section" className={`py-16 px-4 sm:px-6 lg:px-8 border-t transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-[#F8FAFC] border-slate-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Cross-Platform Surface Coverage</span>
            <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Protecting Every Vector You Use</h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Zero scraping, zero root privileges, 100% compliant with platform Terms of Service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => onOpenDemo('simulator')}
              className={`p-6 rounded-3xl border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-4 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                  <span className="text-2xl font-black">💬</span>
                </div>
                <div className="text-left">
                  <h3 className={`text-base font-bold transition-colors group-hover:text-emerald-600 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    WhatsApp Web Protection
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Real-time analysis using a passive browser extension. Zero clicks, zero WebSocket hooks.
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => onOpenDemo('companion')}
              className={`p-6 rounded-3xl border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-4 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shadow-lg shadow-sky-500/20 flex-shrink-0">
                  <span className="text-2xl font-black">✈</span>
                </div>
                <div className="text-left">
                  <h3 className={`text-base font-bold transition-colors group-hover:text-sky-600 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Telegram Ecosystem
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Open-source TDLib client and bot gateway. No scraping. Fully ToS compliant.
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => onOpenDemo('companion')}
              className={`p-6 rounded-3xl border shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-4 group ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#3DDC84] text-white flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0">
                  <span className="text-2xl font-black">🤖</span>
                </div>
                <div className="text-left">
                  <h3 className={`text-base font-bold transition-colors group-hover:text-emerald-600 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Android OS Companion
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Operates at notification layer. Detects suspicious links, APKs and payment intents.
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FOUR AI AGENTS WORKING TOGETHER ── */}
      <section id="how-it-works-section" className={`pb-20 pt-12 px-4 sm:px-6 lg:px-8 border-b transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-8">
            <div className="text-left space-y-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${isDarkMode ? 'bg-blue-950 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>HOW IT WORKS</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Four AI Agents Working Together
              </h2>
              <p className={`text-sm max-w-2xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                A parallel, on-device analysis engine that detects threats, verifies intent, and prevents
                the spread — in less than 300 milliseconds.
              </p>
            </div>

            <button
              onClick={onOpenContagionGraph}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold shadow-sm transition-all group ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800' : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'}`}
            >
              <span>See Full Architecture</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className={`p-6 rounded-3xl border space-y-4 hover:shadow-lg transition-all ${isDarkMode ? 'bg-sky-950/20 border-sky-900/40' : 'bg-sky-50/80 border-sky-100'}`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-sm font-black font-mono text-sky-500">01</span>
              </div>
              <div className="space-y-1.5">
                <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stylometric Profiler</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Analyzes writing style, Hinglish ratio, slang, punctuation and behavioral patterns.
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border space-y-4 hover:shadow-lg transition-all ${isDarkMode ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50/80 border-amber-100'}`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Scan className="w-6 h-6" />
                </div>
                <span className="text-sm font-black font-mono text-amber-500">02</span>
              </div>
              <div className="space-y-1.5">
                <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Forensic & Intent Scanner</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Detects financial coercion, UPI links, QR codes, malicious APKs and phishing content.
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border space-y-4 hover:shadow-lg transition-all ${isDarkMode ? 'bg-purple-950/20 border-purple-900/40' : 'bg-purple-50/80 border-purple-100'}`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <KeyRound className="w-6 h-6" />
                </div>
                <span className="text-sm font-black font-mono text-purple-500">03</span>
              </div>
              <div className="space-y-1.5">
                <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Autonomous Challenger</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Shows in-line warnings, blocks suspicious links and verifies contacts with a zero-knowledge friend quiz.
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border space-y-4 hover:shadow-lg transition-all ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/80 border-emerald-100'}`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Network className="w-6 h-6" />
                </div>
                <span className="text-sm font-black font-mono text-emerald-500">04</span>
              </div>
              <div className="space-y-1.5">
                <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Blast-Radius Containment</h4>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Maps real-time propagation, flags compromised accounts and alerts group admins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: BEFORE / AFTER THREAT CONTAINMENT SLIDER ── */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${isDarkMode ? 'bg-[#0B0F19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <ChevronsLeftRight className="w-3.5 h-3.5" />
            <span>Interactive Before & After Demonstration</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Before CascadeGuard. After CascadeGuard.
          </h2>
          <p className={`text-sm max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Drag the slider to see how lateral account takeover spreads unimpeded vs. how CascadeGuard's on-device sentinel halts the attack at the edge.
          </p>

          <div
            ref={sliderRef}
            onMouseDown={() => setIsDraggingSlider(true)}
            onMouseUp={() => setIsDraggingSlider(false)}
            onMouseLeave={() => setIsDraggingSlider(false)}
            onMouseMove={(e) => {
              if (isDraggingSlider) handleSliderMove(e.clientX);
            }}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsDraggingSlider(true)}
            onTouchEnd={() => setIsDraggingSlider(false)}
            className="relative w-full max-w-4xl mx-auto h-[440px] rounded-3xl overflow-hidden border-2 select-none cursor-ew-resize shadow-2xl mt-8 transition-colors bg-white border-slate-200"
          >
            {/* ── BEFORE (Left Side: Unprotected Compromise) ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-50/60 to-red-100/40 p-8 flex flex-col justify-between text-left">
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 font-bold text-xs">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <span>BEFORE: Unprotected Attack Contagion</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-sm space-y-2">
                  <span className="text-xs font-bold text-red-700">Aman Sharma (@aman_kiet) [Compromised Session]</span>
                  <p className="text-sm text-slate-800">
                    "Divyansh emergency hai! Chacha hospital me admit hue hain. ₹5,000 transfer karo mere UPI pe: aman.emergency@okhdfcbank right now!"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-red-100/80 border border-red-200 text-xs text-red-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-red-700">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span>Victim sends ₹5,000 to Mule VPA</span>
                  </div>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    Attacker harvests funds, then blasts malicious fest voting links to 64 peers in college groups. Contagion multiplies unchecked.
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-red-600 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Average Financial Loss: ₹5,000–₹50,000 • 3+ Compromised Peer Accounts</span>
              </div>
            </div>

            {/* ── AFTER (Right Side: CascadeGuard Edge Interlock) ── */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-cyan-50/60 to-teal-100/50 p-8 flex flex-col justify-between text-left transition-all duration-75"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>AFTER: Autonomous Interlock Engaged</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Aman Sharma (@aman_kiet)</span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      ⚡ 0.74ms INFERENCE
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    "Divyansh emergency hai! Chacha hospital me admit hue hain. ₹5,000 transfer karo..."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-100/80 border border-cyan-200 text-xs text-cyan-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-blue-800">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Autonomous Interlock: Payment Blocked & Quarantine</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-0.5">
                    <li>✦ 52% Stylometric Drift flagged (habitual Hinglish absent)</li>
                    <li>✦ NPCI / I4C Mule Registry blacklist match confirmed</li>
                    <li>✦ Zero-Knowledge challenge deployed (Warden nickname)</li>
                  </ul>
                </div>
              </div>

              <div className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Zero Financial Loss • Contagion Halted at Edge • 0 Bytes Cloud Egress</span>
              </div>
            </div>

            {/* ── DRAGGABLE DIVIDER HANDLE ── */}
            <div
              className="absolute top-0 bottom-0 w-[4px] bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-slate-900 shadow-xl border border-slate-200 flex items-center justify-center font-bold">
                <ChevronsLeftRight className="w-5 h-5 text-slate-800" />
              </div>
            </div>

            <div className="absolute bottom-4 left-4 z-10 bg-white/90 border border-red-200 px-3 py-1 rounded-full text-xs font-mono text-red-600 font-bold shadow-sm">
              ◄ Unprotected
            </div>
            <div className="absolute bottom-4 right-4 z-10 bg-white/90 border border-emerald-200 px-3 py-1 rounded-full text-xs font-mono text-emerald-700 font-bold shadow-sm">
              Protected ►
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: LIVE THREAT HOTSPOT INSPECTOR ── */}
      <section id="live-sandbox-section" className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${isDarkMode ? 'bg-[#070C1A] text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Scan className="w-3.5 h-3.5 text-blue-600" />
              <span>Interactive Forensic Hotspot Canvas</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Deconstruct an Intercepted Scam in Real Time
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Click the pulsing radar hotspots on the intercepted message below to inspect CascadeGuard's multi-tier forensic extraction pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            {/* Interactive Canvas */}
            <div className={`lg:col-span-7 rounded-3xl border p-6 relative shadow-xl space-y-4 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`flex items-center justify-between pb-3 border-b text-xs font-mono ${isDarkMode ? 'border-slate-800 text-cyan-400' : 'border-slate-200 text-blue-700'}`}>
                <div className="flex items-center gap-2 font-bold">
                  <Radio className="w-4 h-4 animate-pulse text-blue-600" />
                  <span>MTProto Inbound Message Stream [Chat ID: 1001]</span>
                </div>
                <span className="text-emerald-600 font-bold">Latency: 0.74ms</span>
              </div>

              {/* Message Box with Hotspots */}
              <div className={`relative p-6 rounded-2xl border text-left space-y-3 shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                {/* Hotspot 1: Sender Name */}
                <div className="flex items-center justify-between">
                  <div className="relative inline-flex items-center gap-2">
                    <span className="text-sm font-bold">Aman Sharma</span>
                    <button
                      onClick={() => setActiveHotspot(1)}
                      className="w-5 h-5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] flex items-center justify-center animate-ping shadow-md"
                      title="Inspect Stylometric Drift"
                    >
                      1
                    </button>
                    <span className="text-xs text-slate-400 font-mono">@aman_kiet</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">11:42 AM</span>
                </div>

                {/* Message Text with Hotspot 2 & 3 */}
                <p className="text-sm leading-relaxed font-sans">
                  "Divyansh emergency hai!{' '}
                  <span
                    onClick={() => setActiveHotspot(2)}
                    className="relative cursor-pointer bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 font-medium"
                  >
                    Chacha hospital me admit hue hain, operation start krna hai
                    <span className="inline-block ml-1 w-4 h-4 rounded-full bg-amber-500 text-white font-mono font-bold text-[9px] text-center">
                      2
                    </span>
                  </span>
                  . URGENTLY ₹5,000 transfer karo mere is UPI pe:{' '}
                  <span
                    onClick={() => setActiveHotspot(3)}
                    className="relative cursor-pointer bg-red-100 text-red-900 font-mono px-2 py-0.5 rounded border border-red-300 font-bold"
                  >
                    aman.emergency@okhdfcbank
                    <span className="inline-block ml-1 w-4 h-4 rounded-full bg-red-600 text-white font-mono font-bold text-[9px] text-center">
                      3
                    </span>
                  </span>{' '}
                  right now please!"
                </p>

                {/* Hotspot 4: Autonomous Interlock Action */}
                <div className={`pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveHotspot(4)}
                      className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20"
                    >
                      <span>Interlock Engaged</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-white text-red-600 font-mono text-[9px] flex items-center justify-center font-bold">
                        4
                      </span>
                    </button>
                    <button
                      onClick={onOpenFriendQuiz}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border ${isDarkMode ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}
                    >
                      Friend Quiz
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Status: QUARANTINED</span>
                </div>
              </div>

              {/* Hotspot Switcher Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { id: 1, title: 'Stylometry' },
                  { id: 2, title: 'Urgency' },
                  { id: 3, title: 'NPCI Mule' },
                  { id: 4, title: 'Interlock' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveHotspot(item.id)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      activeHotspot === item.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100')
                    }`}
                  >
                    #{item.id}: {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Inspector Drawer */}
            <div className={`lg:col-span-5 rounded-3xl border p-6 text-left space-y-4 shadow-xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
              {activeHotspot === 1 && (
                <div className="space-y-3">
                  <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-xs font-mono uppercase text-rose-600 font-bold">Hotspot 1 / Stylometric Profiler</span>
                    <span className="text-xs font-bold text-rose-600 font-mono">52% Drift</span>
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vernacular Hinglish Depletion Anomaly</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Aman Sharma's calibrated profile in ephemeral memory contains 40 indexed messages with a <strong>72% Hinglish ratio</strong> (frequent tokens: "bhai", "yaar", "canteen", "scene").
                  </p>
                  <div className={`p-3 rounded-xl border space-y-1.5 text-xs font-mono ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between text-slate-500">
                      <span>Baseline Caps Ratio:</span> <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>0.01</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Observed Message Caps:</span> <span className="text-rose-600 font-bold">0.45 (Spike)</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Cosine Similarity:</span> <span className="text-rose-600 font-bold">0.38 (Severe Anomaly)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeHotspot === 2 && (
                <div className="space-y-3">
                  <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-xs font-mono uppercase text-amber-600 font-bold">Hotspot 2 / Intent Scanner</span>
                    <span className="text-xs font-bold text-amber-600 font-mono">70% Urgency</span>
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Temporal Coercion & Panic Induction</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Detected multi-keyword medical urgency clusters designed to override deliberate judgment and trigger rushed peer transactions.
                  </p>
                  <div className={`p-3 rounded-xl border space-y-1 text-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-amber-50 border-amber-200'}`}>
                    <span className="font-bold text-amber-800 block mb-1">Flagged Keyword Clusters:</span>
                    <div className="flex flex-wrap gap-1">
                      {['emergency', 'hospital', 'admit', 'operation', 'right now'].map((w) => (
                        <span key={w} className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-300">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeHotspot === 3 && (
                <div className="space-y-3">
                  <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-xs font-mono uppercase text-red-600 font-bold">Hotspot 3 / Forensic Registry</span>
                    <span className="text-xs font-bold text-red-600 font-mono">I4C Flagged</span>
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>NPCI Mule Account Blacklist Match</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    The extracted VPA <strong>aman.emergency@okhdfcbank</strong> exists in the Indian Cybercrime Coordination Centre (I4C) high-risk mule database.
                  </p>
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1 text-xs text-red-900">
                    <span className="font-bold block text-red-700">Registry Threat Dossier:</span>
                    <p className="text-[11px] text-red-800 leading-relaxed">
                      Account flagged across 3 collegiate Telegram phishing campaigns in UP/NCR region within the past 48 hours.
                    </p>
                  </div>
                </div>
              )}

              {activeHotspot === 4 && (
                <div className="space-y-3">
                  <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <span className="text-xs font-mono uppercase text-blue-600 font-bold">Hotspot 4 / Autonomous Action</span>
                    <span className="text-xs font-bold text-blue-600 font-mono">Interlock Engaged</span>
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Instant Payment Locking & Reverse Challenge</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Before the victim can open GPay or PhonePe, CascadeGuard intercepts the clipboard and UPI intent, locking outbound money transfers.
                  </p>
                  <button
                    onClick={onOpenFriendQuiz}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Launch Zero-Knowledge Friend Quiz Challenge</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: ATO VULNERABILITY AUDIT QUIZ ── */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${isDarkMode ? 'bg-[#0B0F19] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Self-Service Risk Audit</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            What is Your Community's Lateral ATO Vulnerability?
          </h2>
          <p className={`text-sm max-w-lg mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Take this 2-minute diagnostic assessment to determine your exposure to session hijacking and peer social engineering.
          </p>

          <div className={`h-1.5 w-full max-w-md mx-auto rounded-full overflow-hidden border mt-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300"
              style={{ width: `${quizCompleted ? 100 : ((quizStep + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {!quizCompleted ? (
            <div className={`p-8 rounded-3xl border text-left space-y-6 max-w-2xl mx-auto mt-6 shadow-xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Question {quizStep + 1} of {quizQuestions.length}</span>
                <span className="text-blue-600 font-bold">Step {(quizStep + 1) * 25}%</span>
              </div>

              <h3 className={`text-lg font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {quizQuestions[quizStep].q}
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {quizQuestions[quizStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizSelect(opt.label)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between group ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/50' : 'bg-slate-50 hover:bg-blue-50/60 border-slate-200 hover:border-blue-400'}`}
                  >
                    <div>
                      <span className={`text-sm font-medium block ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-blue-900'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono mt-1 block">
                        Profile Factor: {opt.tag}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`p-8 rounded-3xl border text-left space-y-6 max-w-2xl mx-auto mt-6 shadow-xl ${isDarkMode ? 'bg-slate-950 border-emerald-500/50' : 'bg-white border-emerald-300'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-600 font-bold">Audit Complete</span>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  CRITICAL DEFENSE NEEDED
                </span>
              </div>

              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Diagnostic Verdict: <span className="text-rose-600">High Lateral Attack Propensity</span>
              </h3>

              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Your community relies heavily on vernacular shorthand and trusted peer goodwill. A single hijacked Telegram or WhatsApp session can compromise 15+ peers before an external admin detects it.
              </p>

              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recommended Safeguard Suite:</span>
                <ul className={`space-y-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Deploy CascadeGuard on-device MTProto daemon for zero-egress threat interception</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Calibrate 12+ contact baseline centroids in volatile RAM per DPDP Sec 6(4)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Configure Reverse Friend Quiz challenges with salted SHA-256</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onOpenDemo('companion')}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Launch Live Companion Defense
                </button>
                <button
                  onClick={handleResetQuiz}
                  className={`px-5 py-3 rounded-full border text-xs font-semibold ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 7: COMPARISON BENCHMARK TABLE ── */}
      <section id="comparison-section" className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${isDarkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Competitive Benchmark</span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              CascadeGuard AI vs. Alternative Security Approaches
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              How on-device stylometric interception compares against legacy endpoint tools and cloud SIEMs.
            </p>
          </div>

          <div className={`overflow-x-auto rounded-3xl border shadow-xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-white font-mono text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5">Feature & Guarantee</th>
                  <th className="p-4 sm:p-5 bg-blue-600 text-white font-bold">CascadeGuard AI</th>
                  <th className="p-4 sm:p-5">Traditional Antivirus</th>
                  <th className="p-4 sm:p-5">Cloud SIEM / DLP</th>
                  <th className="p-4 sm:p-5">WhatsApp/Telegram Native</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                <tr className="hover:bg-blue-50/20">
                  <td className={`p-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>On-Device Inference Speed</td>
                  <td className="p-4 bg-blue-50/70 font-bold text-blue-700 font-mono">&lt; 0.74 ms</td>
                  <td className="p-4 text-slate-500">500ms+ (Disk Scan)</td>
                  <td className="p-4 text-slate-500">2,500ms (Cloud RTT)</td>
                  <td className="p-4 text-slate-400">None (Passive)</td>
                </tr>
                <tr className="hover:bg-blue-50/20">
                  <td className={`p-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>DPDP Act 2023 Sec 6(4) Guarantee</td>
                  <td className="p-4 bg-blue-50/70 font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4" /> 100% Volatile RAM Purge
                  </td>
                  <td className="p-4 text-rose-500">✗ Disk Log Retention</td>
                  <td className="p-4 text-rose-500">✗ High Cloud Egress</td>
                  <td className="p-4 text-amber-600">Partial (Server Logs)</td>
                </tr>
                <tr className="hover:bg-blue-50/20">
                  <td className={`p-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Hinglish & Vernacular Stylometry</td>
                  <td className="p-4 bg-blue-50/70 font-bold text-blue-700">✓ Native Indian N-Grams</td>
                  <td className="p-4 text-slate-400">✗ English-only files</td>
                  <td className="p-4 text-slate-400">✗ Generic NLP</td>
                  <td className="p-4 text-slate-400">✗ None</td>
                </tr>
                <tr className="hover:bg-blue-50/20">
                  <td className={`p-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Autonomous UPI & Mule Registry Interlock</td>
                  <td className="p-4 bg-blue-50/70 font-bold text-emerald-700">✓ Sub-ms NPCI / I4C Checks</td>
                  <td className="p-4 text-slate-400">✗ None</td>
                  <td className="p-4 text-slate-400">✗ None</td>
                  <td className="p-4 text-slate-400">✗ None</td>
                </tr>
                <tr className="hover:bg-blue-50/20">
                  <td className={`p-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Reverse Friend Quiz (Zero-Knowledge)</td>
                  <td className="p-4 bg-blue-50/70 font-bold text-blue-700">✓ Salted SHA-256 Challenge</td>
                  <td className="p-4 text-slate-400">✗ None</td>
                  <td className="p-4 text-slate-400">✗ None</td>
                  <td className="p-4 text-slate-400">✗ None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: FAQ ACCORDION ── */}
      <section id="faq-section" className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${isDarkMode ? 'bg-[#070C1A] text-white border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Statutory & Technical Clarity</span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Answers to architecture, statutory privacy, and deployment considerations.
            </p>
          </div>

          <div className="space-y-3 text-left">
            {[
              {
                q: "How does CascadeGuard detect Hinglish stylometric drift without storing private chats?",
                a: "Under DPDP Act 2023 Sec 6(4), raw message text is never written to persistent disk or transmitted off device. The engine computes mathematical N-gram token counts and casing frequencies strictly in volatile RAM. These numerical vectors cannot be reverse-engineered back into original conversation text."
              },
              {
                q: "What is the statutory guarantee under DPDP Act 2023 Section 6(4)?",
                a: "Section 6(4) of the DPDP Act mandates that data fiduciaries must instantly erase personal data when its purpose has been served. When you click '/flush' or log out, all in-memory centroids and active interlocks are purged from volatile memory with 0 bytes cloud egress."
              },
              {
                q: "How does the Zero-Knowledge Reverse Friend Quiz work cryptographically?",
                a: "You define a personal challenge question for calibrated friends (e.g., 'What was our 1st-year hostel warden's nickname?'). Only the salted SHA-256 hash of the answer is saved in RAM. When an imposter takes over the session and attempts fraud, the challenge is issued. Neither Telegram servers nor the attacker can decrypt the answer."
              },
              {
                q: "Does CascadeGuard require root access or invasive device permissions?",
                a: "No. On Telegram, it connects via official open-source MTProto/TDLib user gateways. On WhatsApp Web, it functions through a passive browser extension with zero WebSocket hooks. On Android, it monitors notification layer intents without requiring root access."
              },
              {
                q: "Can CascadeGuard intercept malicious UPI QR codes embedded in screenshot images?",
                a: "Yes. CascadeGuard includes an on-device QR Code detonator powered by local OpenCV. It decodes UPI URI intents (`upi://pay?pa=...&pn=...&am=...`), extracts target VPAs, and validates them against the NPCI and I4C Mule Registries locally."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className={`w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base transition-colors ${isDarkMode ? 'text-white hover:text-cyan-300' : 'text-slate-900 hover:text-blue-600'}`}
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      openFaqIndex === i ? 'rotate-180 bg-blue-100 text-blue-700' : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
                    }`}
                  >
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </button>
                {openFaqIndex === i && (
                  <div className={`px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3 ${isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CALL TO ACTION ── */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b text-center transition-colors ${isDarkMode ? 'bg-gradient-to-b from-[#070C1A] to-slate-950 text-white border-slate-800' : 'bg-gradient-to-b from-white to-blue-50 text-slate-900 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Shield className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Shield Your Peer Network?
          </h2>
          <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Experience autonomous account takeover defense in less than 300 milliseconds with zero cloud egress.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenDemo('companion')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Launch Live Telegram Companion</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenDemo('simulator')}
              className={`px-8 py-4 rounded-full border font-bold text-sm transition-all ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm'}`}
            >
              Open Dual Chat Simulator
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-6 text-xs text-slate-500 font-mono">
            <span>🔒 DPDP Act 2023 Sec 6(4) Compliant</span>
            <span>⚡ Sub-1ms On-Device Vector Latency</span>
            <span>🛡️ NPCI / I4C Mule Threat Feeds Synced</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`py-10 px-4 border-t text-xs transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-400 border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>CascadeGuard AI</span>
            <span>• Autonomous Lateral Account Takeover Interceptor</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacyAudit} className="hover:text-blue-600 transition-colors flex items-center gap-1 font-mono">
              <Lock className="w-3 h-3 text-blue-600" />
              <span>DPDP Act 2023 Sec 6(4) Guaranteed (0 Bytes Cloud Egress)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ── FLOATING SENTINEL AI ASSISTANT WIDGET ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Chat Panel */}
        {isChatOpen && (
          <div className={`w-[360px] max-w-[calc(100vw-32px)] h-[480px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-slate-400/30'}`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  🛡️
                </div>
                <div className="text-left">
                  <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>CascadeGuard Sentinel AI</h4>
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • On-Device Security Architect
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs text-left">
              {chatMessages.map((msg: ChatMsg, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-blue-600 text-white rounded-br-none shadow-sm'
                      : (isDarkMode ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none')
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {isChatTyping && (
                <div className={`p-3 rounded-2xl border text-xs w-20 flex gap-1 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className={`px-3 py-1.5 border-t flex gap-1.5 overflow-x-auto text-[10px] ${isDarkMode ? 'border-slate-900 bg-slate-950' : 'border-slate-100 bg-slate-50'}`}>
              {['Hinglish Drift?', 'DPDP Sec 6(4)?', 'Friend Quiz?', 'Mule VPAs?'].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendChat(q)}
                  className={`px-2 py-1 rounded-lg border whitespace-nowrap transition-colors ${isDarkMode ? 'bg-slate-900 text-slate-300 hover:text-cyan-300 border-slate-800' : 'bg-white text-slate-700 hover:text-blue-600 border-slate-200 shadow-sm'}`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className={`p-3 border-t flex gap-2 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChat();
                }}
                placeholder="Ask about on-device security..."
                className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-blue-500 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
              />
              <button
                onClick={() => handleSendChat()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md shadow-blue-600/20"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Bubble Icon */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:scale-105 transition-transform flex items-center justify-center text-white shadow-2xl shadow-blue-500/30"
          title="Chat with Sentinel AI"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
        </button>
      </div>

      {/* ── VIDEO DEMO MODAL ── */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`rounded-2xl max-w-2xl w-full p-6 space-y-4 relative border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Play className="w-4 h-4 fill-blue-600" />
              <span>CascadeGuard AI — System Architecture & Interception Demo</span>
            </div>
            <div className={`aspect-video w-full rounded-xl border flex flex-col items-center justify-center text-center p-6 space-y-3 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10 animate-pulse">
                <Shield className="w-7 h-7" />
              </div>
              <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Autonomous Multi-Surface Interceptor</h4>
              <p className={`text-xs max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Demonstrating sub-300ms on-device stylometric drift detection, NPCI mule UPI intent blocking, and zero-knowledge reverse friend quiz verification.
              </p>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  onOpenDemo('companion');
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md"
              >
                Launch Interactive Live Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingHeroPage;
