import React from 'react';
import { 
  Network, Users, DollarSign, X, CheckCircle2,
  Lock, ShieldAlert
} from 'lucide-react';

interface ContagionGraphViewProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const ContagionGraphView: React.FC<ContagionGraphViewProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all border ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              isDarkMode 
                ? 'bg-cyan-950 border-cyan-800/80 text-cyan-400' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Network Contagion & Blast-Radius Engine
                <span className={`text-xs font-mono font-normal px-2 py-0.5 rounded border font-semibold ${
                  isDarkMode 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Containment Active
                </span>
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Visualizing lateral viral propagation across college peers & WhatsApp groups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b ${
          isDarkMode ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] flex items-center gap-1.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Prevented Financial Loss
            </div>
            <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
              ₹2,42,000
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] flex items-center gap-1.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Contacts Protected
            </div>
            <div className={`text-xl font-bold font-mono mt-1 ${isDarkMode ? 'text-cyan-400' : 'text-blue-700'}`}>
              112 Students
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] flex items-center gap-1.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Lateral Spread Status
            </div>
            <div className="text-xl font-bold font-mono text-rose-600 mt-1">
              0% (Contained)
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] flex items-center gap-1.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Egress Telemetry
            </div>
            <div className="text-xl font-bold font-mono text-amber-600 mt-1">
              0 Bytes (Local)
            </div>
          </div>
        </div>

        {/* Interactive SVG Network Graph */}
        <div className={`flex-1 overflow-auto p-6 flex items-center justify-center relative min-h-[380px] ${
          isDarkMode ? 'bg-[#080C14]' : 'bg-slate-100/90'
        }`}>
          <svg className="w-full h-[360px]" viewBox="0 0 800 380">
            <defs>
              <linearGradient id="grad-attacker" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="grad-compromised" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              <linearGradient id="grad-shielded" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="grad-quarantined" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
            </defs>

            {/* Connecting Edges */}
            <line x1="120" y1="190" x2="270" y2="190" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" />
            <text x="180" y="178" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">QR Phish</text>

            <line x1="270" y1="190" x2="480" y2="100" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="375" cy="145" r="9" fill="#0284c7" />
            <text x="375" y="148" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">🛡️</text>

            <line x1="270" y1="190" x2="480" y2="190" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="375" cy="190" r="9" fill="#0284c7" />
            <text x="375" y="193" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">🛡️</text>

            <line x1="270" y1="190" x2="480" y2="280" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="6 6" />
            <circle cx="375" cy="235" r="9" fill="#8b5cf6" />
            <text x="375" y="238" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">🔒</text>

            <line x1="480" y1="280" x2="680" y2="280" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeWidth="2" strokeDasharray="4 4" />
            <text x="580" y="270" fill={isDarkMode ? '#64748b' : '#64748b'} fontSize="10" fontFamily="monospace" textAnchor="middle">Blocked (Safe)</text>

            {/* Nodes */}
            <g transform="translate(100, 190)">
              <circle r="28" fill="url(#grad-attacker)" stroke="#fca5a5" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="16">👾</text>
              <text y="44" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Attacker</text>
              <text y="56" textAnchor="middle" fill={isDarkMode ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="monospace">Rogue Session</text>
            </g>

            <g transform="translate(270, 190)">
              <circle r="32" fill="url(#grad-compromised)" stroke="#fdba74" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">📱</text>
              <text y="48" textAnchor="middle" fill="#ea580c" fontSize="11" fontWeight="bold">Aman's Account</text>
              <text y="60" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">[QUARANTINED]</text>
            </g>

            <g transform="translate(480, 100)">
              <circle r="30" fill="url(#grad-shielded)" stroke="#7dd3fc" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">👩‍💻</text>
              <text y="46" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">Priya (Target)</text>
              <text y="58" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="monospace">Shielded (₹5k Saved)</text>
            </g>

            <g transform="translate(480, 190)">
              <circle r="30" fill="url(#grad-shielded)" stroke="#7dd3fc" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">👨‍🎓</text>
              <text y="46" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">Rahul (Contact)</text>
              <text y="58" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="monospace">APK Intercepted</text>
            </g>

            <g transform="translate(480, 280)">
              <circle r="32" fill="url(#grad-quarantined)" stroke="#c4b5fd" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">🎓</text>
              <text y="48" textAnchor="middle" fill="#7c3aed" fontSize="11" fontWeight="bold">CS Batch 2026</text>
              <text y="60" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="monospace">64 Students Muted</text>
            </g>

            <g transform="translate(680, 280)">
              <circle r="26" fill={isDarkMode ? '#1e293b' : '#ffffff'} stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="2" />
              <text y="4" textAnchor="middle" fill={isDarkMode ? '#fff' : '#0f172a'} fontSize="16">🏢</text>
              <text y="42" textAnchor="middle" fill={isDarkMode ? '#94a3b8' : '#475569'} fontSize="11" fontWeight="bold">Hostel Block C</text>
              <text y="54" textAnchor="middle" fill={isDarkMode ? '#64748b' : '#64748b'} fontSize="9" fontFamily="monospace">Safe / Insulated</text>
            </g>
          </svg>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Agent 4 Blast Radius Containment Engine: Lateral infection tree successfully severed.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
