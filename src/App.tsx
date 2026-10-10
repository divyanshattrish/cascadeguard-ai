import React, { useState } from 'react';
import { Header } from './components/Header';
import { DualChatSimulator } from './components/DualChatSimulator';
import { SecurityHUD } from './components/SecurityHUD';
import { ContagionGraphView } from './components/ContagionGraphView';
import { FriendQuizModal } from './components/FriendQuizModal';
import { PrivacyAuditModal } from './components/PrivacyAuditModal';
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
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [latestAnalysis, setLatestAnalysis] = useState<MessageAnalysis | null>(
    INITIAL_MESSAGES[0].analysis || null
  );
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isContagionGraphOpen, setIsContagionGraphOpen] = useState(false);
  const [isFriendQuizOpen, setIsFriendQuizOpen] = useState(false);
  const [isQuarantined, setIsQuarantined] = useState(false);
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('telegram'); // Default to Telegram as requested!

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
    // Add system notification message
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
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation & Status */}
      <Header
        onOpenPrivacyAudit={() => setIsPrivacyModalOpen(true)}
        onOpenContagionGraph={() => setIsContagionGraphOpen(true)}
        onResetDemo={handleResetDemo}
        isContagionActive={isContagionGraphOpen}
        surfaceMode={surfaceMode}
        onSelectSurfaceMode={setSurfaceMode}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Dual Chat Simulator (Attacker Console vs Protected Victim Client) */}
        <DualChatSimulator
          messages={messages}
          onSendMessage={handleSendMessage}
          onOpenFriendQuiz={() => setIsFriendQuizOpen(true)}
          onQuarantineSender={handleQuarantineSender}
          isQuarantined={isQuarantined}
          surfaceMode={surfaceMode}
        />

        {/* Security Inspector HUD & Agent Telemetry */}
        <SecurityHUD latestAnalysis={latestAnalysis} />
      </main>

      {/* Modals */}
      <ContagionGraphView
        isOpen={isContagionGraphOpen}
        onClose={() => setIsContagionGraphOpen(false)}
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
      />

      <PrivacyAuditModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};

export default App;
