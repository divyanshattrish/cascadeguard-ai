import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingHeroPage } from './components/LandingHeroPage';
import { DualChatSimulator } from './components/DualChatSimulator';
import { SecurityHUD } from './components/SecurityHUD';
import { LiveCompanionDashboard } from './components/LiveCompanionDashboard';
import { ContagionGraphView } from './components/ContagionGraphView';
import { FriendQuizModal } from './components/FriendQuizModal';
import { PrivacyAuditModal } from './components/PrivacyAuditModal';
import { InteractiveThreatLab } from './components/InteractiveThreatLab';
import { ChatMessage, MessageAnalysis, SurfaceMode } from './types';
import { runCascadeGuardPipeline } from './engine/cascadeGuardEngine';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-0',
    sender: 'friend',
    senderName: 'Aman Sharma',
    avatar: 'AS',
    text: 'bhai sun, kal library me milte h kya assignments complete karne k liye? 📚',
    timestamp: 'Yesterday 7:42 PM',
    analysis: runCascadeGuardPipeline('bhai sun, kal library me milte h kya assignments complete karne k liye? 📚')
  }
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'companion' | 'simulator' | 'lab'>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // Default to clean modern light theme as requested!
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [latestAnalysis, setLatestAnalysis] = useState<MessageAnalysis | null>(
    INITIAL_MESSAGES[0].analysis || null
  );
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isContagionGraphOpen, setIsContagionGraphOpen] = useState(false);
  const [isFriendQuizOpen, setIsFriendQuizOpen] = useState(false);
  const [isQuarantined, setIsQuarantined] = useState(false);
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('telegram');

  const handleSendMessage = (text: string) => {
    const analysis = runCascadeGuardPipeline(text);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'friend',
      senderName: 'Aman Sharma',
      avatar: 'AS',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      analysis
    };

    setMessages((prev) => [...prev, newMsg]);
    setLatestAnalysis(analysis);
  };

  const handleQuarantineSender = () => {
    setIsQuarantined(true);
    const quarantineNotice: ChatMessage = {
      id: `notice-${Date.now()}`,
      sender: 'user',
      senderName: 'CascadeGuard Engine',
      avatar: 'CG',
      text: surfaceMode === 'telegram'
        ? '🛑 [TELEGRAM AUTO-CONTAINMENT]: Aman Sharma\'s session muted in College Group. Lateral contagion halted.'
        : '🛡️ [AUTO-CONTAINMENT ALERT]: Aman Sharma\'s account session quarantined. Signal dispatched to CS Batch 2026 Admin.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, quarantineNotice]);
  };

  const handleResetDemo = () => {
    setMessages(INITIAL_MESSAGES);
    setLatestAnalysis(INITIAL_MESSAGES[0].analysis || null);
    setIsQuarantined(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 ${
      isDarkMode ? 'bg-[#070C1A] text-slate-100' : 'bg-[#FAF9F6] text-slate-900'
    }`}>
      {/* ── PERSISTENT TOP APP VIEW SWITCHER ── */}
      <div className={`border-b sticky top-0 z-50 backdrop-blur-xl px-4 lg:px-8 py-2.5 transition-colors ${
        isDarkMode ? 'bg-slate-950/95 border-slate-800 text-white shadow-lg shadow-black/40' : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Quick View Tabs */}
          <div className={`flex items-center gap-1.5 p-1 rounded-full border w-full sm:w-auto shadow-inner transition-colors ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'landing'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <span>🏠 Product Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('companion')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all relative ${
                activeTab === 'companion'
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md shadow-emerald-600/30'
                  : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🛡️ Live Telegram Companion</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                  : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <span>📱 Dual Chat Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'lab'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <span>🔬 Interactive Threat Lab</span>
            </button>
          </div>

          {/* Right Controls: Theme Toggle & Sentinel Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-400'
                  : 'bg-white border-slate-200 text-blue-700 hover:border-blue-400 shadow-sm'
              }`}
              title="Toggle Light / Dark Mode"
            >
              <span>{isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            </button>

            <div className={`hidden md:flex items-center gap-3 text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Edge Sentinel Active</span>
              </span>
              <span className="opacity-30">•</span>
              <span className="text-blue-600 font-semibold">&lt; 300ms Autonomous Interceptor</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── VIEW 1: LANDING HERO PAGE ── */}
      {activeTab === 'landing' && (
        <LandingHeroPage
          onOpenDemo={(mode) => setActiveTab((mode as any) || 'companion')}
          onOpenFriendQuiz={() => setIsFriendQuizOpen(true)}
          onOpenContagionGraph={() => setIsContagionGraphOpen(true)}
          onOpenPrivacyAudit={() => setIsPrivacyModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* ── VIEW 2: LIVE TELEGRAM COMPANION DASHBOARD ── */}
      {activeTab === 'companion' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
          <LiveCompanionDashboard
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            onOpenContagionGraph={() => setIsContagionGraphOpen(true)}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* ── VIEW 3: DUAL CHAT SIMULATOR SANDBOX ── */}
      {activeTab === 'simulator' && (
        <div>
          <Header
            onOpenPrivacyAudit={() => setIsPrivacyModalOpen(true)}
            onOpenContagionGraph={() => setIsContagionGraphOpen(true)}
            onResetDemo={handleResetDemo}
            isContagionActive={isContagionGraphOpen}
            surfaceMode={surfaceMode}
            onSelectSurfaceMode={setSurfaceMode}
            isDarkMode={isDarkMode}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
            <DualChatSimulator
              messages={messages}
              onSendMessage={handleSendMessage}
              onOpenFriendQuiz={() => setIsFriendQuizOpen(true)}
              onQuarantineSender={handleQuarantineSender}
              isQuarantined={isQuarantined}
              surfaceMode={surfaceMode}
              isDarkMode={isDarkMode}
            />
            <SecurityHUD latestAnalysis={latestAnalysis} isDarkMode={isDarkMode} />
          </main>
        </div>
      )}

      {/* ── VIEW 4: INTERACTIVE THREAT & STYLOMETRY LAB ── */}
      {activeTab === 'lab' && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
          <InteractiveThreatLab
            isDarkMode={isDarkMode}
            onOpenFriendQuiz={() => setIsFriendQuizOpen(true)}
            onOpenPrivacyAudit={() => setIsPrivacyModalOpen(true)}
          />
        </div>
      )}

      {/* ── MODALS ── */}
      <ContagionGraphView
        isOpen={isContagionGraphOpen}
        onClose={() => setIsContagionGraphOpen(false)}
        isDarkMode={isDarkMode}
      />

      <FriendQuizModal
        isOpen={isFriendQuizOpen}
        onClose={() => setIsFriendQuizOpen(false)}
        onVerifySuccess={() => {
          setIsFriendQuizOpen(false);
          setIsQuarantined(false);
        }}
        onVerifyFail={() => {
          setIsFriendQuizOpen(false);
          handleQuarantineSender();
        }}
        isDarkMode={isDarkMode}
      />

      <PrivacyAuditModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;
