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
  isDarkMode?: boolean;
}

const PRESET_SCENARIOS = [
  {
    id: 'hospital_scam',
    title: 'Hospital Emergency ₹5,000',
    tag: 'Classic ATO Coercion',
    colorDark: 'border-red-500/40 bg-red-950/20 text-red-300 hover:bg-red-950/40',
    colorLight: 'border-red-300 bg-red-50/80 text-red-900 hover:bg-red-100',
    text: 'Priya urgent emergency hai! Chacha hospital me admit hue hain, operation start krna hai. URGENTLY ₹5,000 transfer karo mere is UPI pe: aman.emergency@okhdfcbank right now please! Shaam ko return kr dunga.'
  },
  {
    id: 'voting_apk',
    title: 'College Fest Voting APK',
    tag: 'Lateral Malware Phishing',
    colorDark: 'border-amber-500/40 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40',
    colorLight: 'border-amber-300 bg-amber-50/80 text-amber-900 hover:bg-amber-100',
    text: 'Hey Priya, please vote for our team in InnoHacks coding contest! Just download this campus voting app: InnoHacks_Vote_Secure.apk and login with your mobile number. Urgent hai!'
  },
  {
    id: 'fee_emergency',
    title: 'Semester Fee Deflection',
    tag: 'UPI Mule Account',
    colorDark: 'border-purple-500/40 bg-purple-950/20 text-purple-300 hover:bg-purple-950/40',
    colorLight: 'border-purple-300 bg-purple-50/80 text-purple-900 hover:bg-purple-100',
    text: 'Dear Priya, college exam registration portal is closing in 15 minutes. My UPI limit is exceeded. Please transfer ₹3,500 to fasthelp.medical@ybl immediately. Very critical situation.'
  },
  {
    id: 'legitimate_friend',
    title: 'Legitimate Friend Chat',
    tag: 'Authentic Baseline',
    colorDark: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40',
    colorLight: 'border-emerald-300 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100',
    text: 'Oyee sun, kal ke lab notes hain tere paas? Bhai canteen me aa rha h kya 10 min me?'
  }
];

export const DualChatSimulator: React.FC<DualChatSimulatorProps> = ({
  messages,
  onSendMessage,
  onOpenFriendQuiz,
  onQuarantineSender,
  isQuarantined,
  surfaceMode,
  isDarkMode = false
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
      <div className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border ${
        isDarkMode 
          ? 'bg-slate-900/70 border-slate-800 shadow-xl' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Terminal Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          isDarkMode 
            ? 'bg-slate-950 border-slate-800/80' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className={`font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isDarkMode ? 'text-red-400' : 'text-red-700'
            }`}>
              <Terminal className="w-3.5 h-3.5" />
              Hijacked Account Console
            </span>
          </div>
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
            isDarkMode 
              ? 'text-slate-400 bg-slate-900 border-slate-800' 
              : 'text-slate-700 bg-white border-slate-200 shadow-2xs'
          }`}>
            Node: Aman Sharma ({isTelegram ? '@aman_kiet' : '+91 98721 04912'})
          </span>
        </div>

        {/* Attack Scenario Quick-Pickers */}
        <div className={`p-4 border-b ${
          isDarkMode ? 'bg-slate-950/50 border-slate-800/60' : 'bg-slate-50/70 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-800'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              Select Attack Preset (Live Pitch Demo):
            </span>
            <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>One-click simulation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.text)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  isDarkMode ? preset.colorDark : preset.colorLight
                }`}
              >
                <div className={`font-semibold text-[12px] flex items-center justify-between ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  <span>{preset.title}</span>
                </div>
                <div className={`text-[10px] mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>{preset.tag}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Composition Area */}
        <div className={`p-4 flex-1 flex flex-col justify-end ${
          isDarkMode ? 'bg-slate-900/40' : 'bg-white'
        }`}>
          <div className="text-xs mb-2 flex items-center justify-between">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              Compose Outgoing Message to Contact: <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-900'}>Priya</strong>
            </span>
            {isQuarantined && (
              <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                isDarkMode 
                  ? 'text-red-400 bg-red-950/60 border-red-800/50' 
                  : 'text-red-700 bg-red-50 border-red-200'
              }`}>
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
              className={`w-full rounded-xl p-3 text-sm transition-all resize-none font-sans border ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30' 
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-200'
              }`}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              Vector: {isTelegram ? 'Telegram MTProto Client (TDLib)' : 'WhatsApp Web Session (Chromium PID 4921)'}
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isQuarantined}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md ${
                isQuarantined 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300' 
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
      <div className={`flex flex-col rounded-2xl overflow-hidden shadow-lg relative transition-all border ${
        isTelegram 
          ? (isDarkMode ? 'bg-[#17212b] border-slate-800' : 'bg-[#eef2f5] border-slate-200')
          : (isDarkMode ? 'bg-[#0b141a] border-slate-800' : 'bg-[#efeae2] border-slate-200')
      }`}>
        {/* App Bar (WhatsApp vs Telegram) */}
        <div className={`px-4 py-3 border-b flex items-center justify-between z-10 ${
          isTelegram 
            ? (isDarkMode ? 'bg-[#242f3d] border-slate-700/60 text-white' : 'bg-[#517da2] border-sky-700 text-white')
            : (isDarkMode ? 'bg-[#202c33] border-slate-700/50 text-white' : 'bg-[#008069] border-emerald-700 text-white')
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                isTelegram ? 'bg-sky-600' : 'bg-slate-700'
              }`}>
                AS
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                isTelegram ? 'bg-sky-300 border-[#517da2]' : 'bg-emerald-400 border-[#008069]'
              }`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Aman Sharma</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border font-normal bg-white/20 text-white border-white/30">
                  {isTelegram ? 'Telegram Surface' : 'Web Extension Shield'}
                </span>
              </div>
              <div className="text-[11px] text-white/80">
                {isTelegram ? 'last seen just now • TDLib Protected' : 'online • end-to-end encrypted'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border bg-white/20 border-white/30 text-white font-medium backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono font-medium">CascadeGuard Active</span>
            </div>
          </div>
        </div>

        {/* Chat Stream Area */}
        <div className={`p-4 flex-1 overflow-y-auto space-y-4 min-h-[420px] max-h-[520px] ${
          isTelegram 
            ? (isDarkMode ? 'bg-[#0e1621] bg-opacity-95' : 'bg-[#e7ebf0]') 
            : (isDarkMode ? 'bg-[#0b141a] bg-opacity-95' : 'bg-[#efeae2]')
        }`}>
          {messages.map((msg) => {
            const analysis = msg.analysis;
            const isCritical = analysis?.threatLevel === 'CRITICAL_ATO';
            const isSafe = analysis?.threatLevel === 'SAFE';

            return (
              <div key={msg.id} className="flex flex-col space-y-2">
                {/* 🛡️ IN-LINE CASCADEGUARD INTERCEPTION SHIELD */}
                {isCritical && (
                  <div className={`p-3.5 rounded-xl border shadow-md transition-all ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-red-950/80 via-red-900/60 to-slate-900 border-red-500/60 shadow-red-950/40 text-red-200' 
                      : 'bg-red-50/95 border-red-300 text-red-900'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className={`flex items-center gap-2 font-semibold text-xs tracking-wide ${
                        isDarkMode ? 'text-red-300' : 'text-red-700'
                      }`}>
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                        <span>CASCADEGUARD {isTelegram ? 'TELEGRAM INTERCEPTOR' : 'ATO INTERCEPTION SHIELD'}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                        isDarkMode 
                          ? 'bg-red-900 text-red-200 border-red-600' 
                          : 'bg-red-100 text-red-700 border-red-300'
                      }`}>
                        {analysis?.overallRiskScore}% RISK SCORE
                      </span>
                    </div>

                    <p className={`text-xs mt-1.5 leading-relaxed font-sans ${
                      isDarkMode ? 'text-red-200/90' : 'text-red-800'
                    }`}>
                      <strong>Severe Lateral ATO Indicator:</strong> Stylometric drift: {analysis?.stylometricDrift.overallDrift}%. Coercive pattern detected. Direct payment link locked.
                    </p>

                    {/* Metric pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-red-950/80 border-red-800 text-red-300' 
                          : 'bg-white border-red-200 text-red-800 font-semibold'
                      }`}>
                        Drift: {analysis?.stylometricDrift.overallDrift}%
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-red-950/80 border-red-800 text-red-300' 
                          : 'bg-white border-red-200 text-red-800 font-semibold'
                      }`}>
                        Coercion: {analysis?.forensicIntent.financialCoercionScore}%
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-red-950/80 border-red-800 text-red-300' 
                          : 'bg-white border-red-200 text-red-800 font-semibold'
                      }`}>
                        Latency: {analysis?.processingTimeMs}ms (Edge)
                      </span>
                    </div>

                    {/* Telegram-style or standard action buttons */}
                    <div className={`flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t ${
                      isDarkMode ? 'border-red-800/40' : 'border-red-200'
                    }`}>
                      <button
                        onClick={onOpenFriendQuiz}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-200" />
                        <span>Deploy "Friend Quiz" Challenge</span>
                      </button>

                      <button
                        onClick={onQuarantineSender}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          isDarkMode 
                            ? 'bg-slate-900/90 hover:bg-slate-800 border-red-700/60 text-red-300' 
                            : 'bg-white hover:bg-red-50 border-red-300 text-red-700 shadow-xs'
                        }`}
                      >
                        <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
                        <span>{isTelegram ? 'Mute in Group' : 'Quarantine & Notify Admin'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* The Chat Bubble Itself */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm relative text-sm ${
                    msg.sender === 'friend'
                      ? isDarkMode
                        ? (isTelegram ? 'bg-[#182533] text-slate-100 self-start rounded-tl-sm border border-slate-700/40' : 'bg-[#202c33] text-slate-100 self-start rounded-tl-sm border border-slate-700/40')
                        : 'bg-white text-slate-900 self-start rounded-tl-sm border border-slate-200'
                      : isDarkMode
                        ? (isTelegram ? 'bg-[#2b5278] text-white self-end rounded-tr-sm' : 'bg-[#005c4b] text-white self-end rounded-tr-sm')
                        : (isTelegram ? 'bg-[#effdde] text-slate-900 self-end rounded-tr-sm border border-emerald-200' : 'bg-[#d9fdd3] text-slate-900 self-end rounded-tr-sm border border-emerald-200')
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* 🔒 TELEGRAM INLINE KEYBOARD / PAYMENT BARRIER */}
                  {analysis?.forensicIntent.extractedVPAs && analysis.forensicIntent.extractedVPAs.length > 0 && isCritical && (
                    <div className={`mt-3 p-3 rounded-xl border text-xs ${
                      isDarkMode 
                        ? 'bg-slate-950/90 border-red-500/80 text-slate-200' 
                        : 'bg-white border-2 border-red-400 text-slate-900 shadow-xs'
                    }`}>
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="flex items-center gap-1.5 text-red-600">
                          <Lock className="w-4 h-4 text-red-500" />
                          <span>{isTelegram ? 'TELEGRAM PAYMENT INTERLOCK' : 'PAYMENT INTERLOCK ENGAGED'}</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold ${
                          isDarkMode ? 'bg-red-950 text-red-300 border-red-800' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          LOCKED
                        </span>
                      </div>
                      
                      <div className={`text-[11px] mb-2 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Target VPA: <span className="text-amber-600 font-bold">{analysis.forensicIntent.extractedVPAs[0]}</span>
                        {analysis.forensicIntent.isVpaBlacklisted && (
                          <span className="block text-red-600 mt-0.5 font-semibold">⚠️ Flagged in NPCI / I4C Mule Account Registry</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-not-allowed border flex items-center justify-center gap-1.5 ${
                            isDarkMode 
                              ? 'bg-slate-800 text-slate-500 border-slate-700' 
                              : 'bg-slate-100 text-slate-400 border-slate-300'
                          }`}
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
                    <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Stylometry Match: 96% Authentic Aman Sharma</span>
                    </div>
                  )}

                  <div className={`text-[10px] text-right mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quarantined Status Banner at bottom if quarantined */}
        {isQuarantined && (
          <div className={`p-3 border-t flex items-center justify-between text-xs ${
            isDarkMode ? 'bg-red-950/90 border-red-800/80 text-red-200' : 'bg-red-50 border-red-200 text-red-800 font-semibold'
          }`}>
            <span className="flex items-center gap-2 font-semibold">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              Contact Quarantined: {isTelegram ? 'Telegram User Muted in Batch Group' : 'Rogue Web Session Halted Across College Group'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
