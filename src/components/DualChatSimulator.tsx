import React, { useState } from 'react';
import { 
  Send, ShieldCheck, ShieldAlert, Lock, HelpCircle, 
  CheckCircle2, AlertOctagon, Terminal, Sparkles
} from 'lucide-react';
import { ChatMessage, SurfaceMode } from '../types';

interface DualChatSimulatorProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onOpenFriendQuiz: () => void;
  onQuarantineSender: () => void;
  isQuarantined: boolean;
  surfaceMode: SurfaceMode;
}

const PRESET_SCENARIOS = [
  {
    id: 'hospital_scam',
    title: 'Hospital Emergency ₹5,000',
    tag: 'Classic ATO Coercion',
    color: 'border-red-500/40 bg-red-950/20 text-red-300',
    text: 'Priya urgent emergency hai! Chacha hospital me admit hue hain, operation start krna hai. URGENTLY ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga.'
  },
  {
    id: 'voting_apk',
    title: 'College Fest Voting APK',
    tag: 'Lateral Malware Phishing',
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    text: 'Hey Priya, please vote for our team in InnoHacks coding contest! Just download this campus voting app: InnoHacks_Vote_Secure.apk and login with your mobile number. Urgent hai!'
  },
  {
    id: 'fee_emergency',
    title: 'Semester Fee Deflection',
    tag: 'UPI Mule Account',
    color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
    text: 'Dear Priya, college exam registration portal is closing in 15 minutes. My UPI limit is exceeded. Please transfer ₹3,500 to fasthelp.medical@ybl immediately. Very critical situation.'
  },
  {
    id: 'legitimate_friend',
    title: 'Legitimate Friend Chat',
    tag: 'Authentic Baseline',
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    text: 'Oyee sun, kal ke lab notes hain tere paas? Bhai canteen me aa rha h kya 10 min me?'
  }
];

export const DualChatSimulator: React.FC<DualChatSimulatorProps> = ({
  messages,
  onSendMessage,
  onOpenFriendQuiz,
  onQuarantineSender,
  isQuarantined,
  surfaceMode
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handlePresetSelect = (text: string) => {
    setInputText(text);
  };

  const isTelegram = surfaceMode === 'telegram';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── LEFT COLUMN: Attacker Console / Hijacked Phone ── */}
      <div className="flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Hijacked Account Console
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Node: Aman Sharma ({isTelegram ? '@aman_kiet' : '+91 98721 04912'})
          </span>
        </div>

        {/* Attack Scenario Quick-Pickers */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Select Attack Preset (Live Pitch Demo):
            </span>
            <span className="text-[10px] text-slate-500 font-mono">One-click simulation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.text)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all hover:scale-[1.01] active:scale-[0.99] ${preset.color}`}
              >
                <div className="font-semibold text-white text-[12px] flex items-center justify-between">
                  <span>{preset.title}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{preset.tag}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Composition Area */}
        <div className="p-4 flex-1 flex flex-col justify-end bg-slate-900/40">
          <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
            <span>Compose Outgoing Message to Contact: <strong className="text-slate-200">Priya</strong></span>
            {isQuarantined && (
              <span className="text-[11px] text-red-400 font-mono font-semibold bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                ⚠️ Account Session Quarantined
              </span>
            )}
          </div>
          
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message here or click one of the presets above..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition-all resize-none font-sans"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 font-mono">
              Vector: {isTelegram ? 'Telegram MTProto Client (TDLib)' : 'WhatsApp Web Session (Chromium PID 4921)'}
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isQuarantined}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-lg ${
                isQuarantined 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20 hover:shadow-red-600/30 active:scale-95'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Victim Client with CascadeGuard (WhatsApp vs Telegram) ── */}
      <div className={`flex flex-col border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative transition-all ${
        isTelegram ? 'bg-[#17212b]' : 'bg-[#0b141a]'
      }`}>
        {/* App Bar (WhatsApp vs Telegram) */}
        <div className={`px-4 py-3 border-b flex items-center justify-between z-10 ${
          isTelegram 
            ? 'bg-[#242f3d] border-slate-700/60' 
            : 'bg-[#202c33] border-slate-700/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                isTelegram ? 'bg-sky-600' : 'bg-slate-700'
              }`}>
                AS
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                isTelegram ? 'bg-sky-400 border-[#242f3d]' : 'bg-emerald-500 border-[#202c33]'
              }`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Aman Sharma</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-normal ${
                  isTelegram 
                    ? 'bg-sky-950 text-sky-400 border-sky-800/60' 
                    : 'bg-cyan-950 text-cyan-400 border-cyan-800/60'
                }`}>
                  {isTelegram ? 'Telegram Surface' : 'Web Extension Shield'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isTelegram ? 'last seen just now • TDLib Protected' : 'online • end-to-end encrypted'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs border ${
              isTelegram 
                ? 'bg-[#1e2a38] border-sky-500/40 text-sky-300' 
                : 'bg-[#111b21] border-cyan-500/30 text-cyan-400'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono font-medium">CascadeGuard Active</span>
            </div>
          </div>
        </div>

        {/* Chat Stream Area */}
        <div className={`p-4 flex-1 overflow-y-auto space-y-4 min-h-[420px] max-h-[520px] ${
          isTelegram 
            ? 'bg-[#0e1621] bg-opacity-95' 
            : 'bg-[#0b141a] bg-opacity-95 bg-[radial-gradient(#111b21_1px,transparent_1px)] [background-size:16px_16px]'
        }`}>
          {messages.map((msg) => {
            const analysis = msg.analysis;
            const isCritical = analysis?.threatLevel === 'CRITICAL_ATO';
            const isSafe = analysis?.threatLevel === 'SAFE';

            return (
              <div key={msg.id} className="flex flex-col space-y-2">
                {/* 🛡️ IN-LINE CASCADEGUARD INTERCEPTION SHIELD */}
                {isCritical && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/80 via-red-900/60 to-slate-900 border border-red-500/60 shadow-lg shadow-red-950/40 animate-pulse-subtle">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-red-300 font-semibold text-xs tracking-wide">
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                        <span>CASCADEGUARD {isTelegram ? 'TELEGRAM INTERCEPTOR' : 'ATO INTERCEPTION SHIELD'}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900 text-red-200 border border-red-600 font-bold">
                        {analysis?.overallRiskScore}% RISK SCORE
                      </span>
                    </div>

                    <p className="text-xs text-red-200/90 mt-1.5 leading-relaxed font-sans">
                      <strong>Severe Lateral ATO Indicator:</strong> Stylometric drift: {analysis?.stylometricDrift.overallDrift}%. Coercive pattern detected. Direct payment link locked.
                    </p>

                    {/* Metric pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
                        Drift: {analysis?.stylometricDrift.overallDrift}%
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
                        Coercion: {analysis?.forensicIntent.financialCoercionScore}%
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
                        Latency: {analysis?.processingTimeMs}ms (Edge)
                      </span>
                    </div>

                    {/* Telegram-style or standard action buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-red-800/40">
                      <button
                        onClick={onOpenFriendQuiz}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/70 hover:bg-red-800 text-white text-xs font-medium transition-all shadow"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                        <span>Deploy "Friend Quiz" Challenge</span>
                      </button>

                      <button
                        onClick={onQuarantineSender}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-red-700/60 text-red-300 text-xs font-medium transition-all"
                      >
                        <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                        <span>{isTelegram ? 'Mute in Group' : 'Quarantine & Notify Admin'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* The Chat Bubble Itself */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-md relative text-sm ${
                    msg.sender === 'friend'
                      ? isTelegram
                        ? 'bg-[#182533] text-slate-100 self-start rounded-tl-sm border border-slate-700/40'
                        : 'bg-[#202c33] text-slate-100 self-start rounded-tl-sm border border-slate-700/40'
                      : isTelegram
                        ? 'bg-[#2b5278] text-white self-end rounded-tr-sm'
                        : 'bg-[#005c4b] text-white self-end rounded-tr-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* 🔒 TELEGRAM INLINE KEYBOARD / PAYMENT BARRIER */}
                  {analysis?.forensicIntent.extractedVPAs && analysis.forensicIntent.extractedVPAs.length > 0 && isCritical && (
                    <div className={`mt-3 p-3 rounded-xl border text-xs ${
                      isTelegram ? 'bg-[#101921] border-red-500/80' : 'bg-slate-950/90 border-2 border-red-500/80'
                    }`}>
                      <div className="flex items-center justify-between text-red-400 font-semibold mb-1">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-red-400" />
                          <span>{isTelegram ? 'TELEGRAM PAYMENT INTERLOCK' : 'PAYMENT INTERLOCK ENGAGED'}</span>
                        </span>
                        <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-800 font-mono">
                          LOCKED
                        </span>
                      </div>
                      
                      <div className="text-slate-300 text-[11px] mb-2 font-mono">
                        Target VPA: <span className="text-amber-400 font-bold">{analysis.forensicIntent.extractedVPAs[0]}</span>
                        {analysis.forensicIntent.isVpaBlacklisted && (
                          <span className="block text-red-400 mt-0.5">⚠️ Flagged in NPCI / I4C Mule Account Registry</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled
                          className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed border border-slate-700 flex items-center justify-center gap-1.5"
                          title="Payment disabled by CascadeGuard Security Interlock"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Direct UPI Pay (Disabled for Security)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Normal baseline safe indicator */}
                  {isSafe && msg.sender === 'friend' && (
                    <div className="mt-2 pt-1.5 border-t border-slate-700/40 flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Stylometry Match: 96% Authentic Aman Sharma</span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right mt-1.5">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quarantined Status Banner at bottom if quarantined */}
        {isQuarantined && (
          <div className="p-3 bg-red-950/90 border-t border-red-800/80 flex items-center justify-between text-xs text-red-200">
            <span className="flex items-center gap-2 font-semibold">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              Contact Quarantined: {isTelegram ? 'Telegram User Muted in Batch Group' : 'Rogue Web Session Halted Across College Group'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
