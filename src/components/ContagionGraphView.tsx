import React from 'react';
import { 
  Network, Users, DollarSign, X, CheckCircle2,
  Lock, ShieldAlert
} from 'lucide-react';

interface ContagionGraphViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContagionGraphView: React.FC<ContagionGraphViewProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/80 text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Network Contagion & Blast-Radius Engine
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Containment Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing lateral viral propagation across college peers & WhatsApp groups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-950/60 border-b border-slate-800/60">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Prevented Financial Loss
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              ₹2,42,000
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Contacts Protected
            </div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
              112 Students
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Lateral Spread Status
            </div>
            <div className="text-xl font-bold font-mono text-red-400 mt-1">
              0% (Contained)
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Egress Telemetry
            </div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">
              0 Bytes (Local)
            </div>
          </div>
        </div>

        {/* Interactive SVG Network Graph */}
        <div className="flex-1 overflow-auto p-6 bg-[#080C14] flex items-center justify-center relative min-h-[380px]">
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
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
              <linearGradient id="grad-quarantined" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
            </defs>

            {/* Connecting Edges */}
            <line x1="120" y1="190" x2="270" y2="190" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" />
            <text x="180" y="178" fill="#ef4444" fontSize="10" fontFamily="monospace" textAnchor="middle">QR Phish</text>

            <line x1="270" y1="190" x2="480" y2="100" stroke="#06b6d4" strokeWidth="2.5" />
            <circle cx="375" cy="145" r="9" fill="#06b6d4" />
            <text x="375" y="148" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">🛡️</text>

            <line x1="270" y1="190" x2="480" y2="190" stroke="#06b6d4" strokeWidth="2.5" />
            <circle cx="375" cy="190" r="9" fill="#06b6d4" />
            <text x="375" y="193" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">🛡️</text>

            <line x1="270" y1="190" x2="480" y2="280" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="6 6" />
            <circle cx="375" cy="235" r="9" fill="#8b5cf6" />
            <text x="375" y="238" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">🔒</text>

            <line x1="480" y1="280" x2="680" y2="280" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <text x="580" y="270" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">Blocked (Safe)</text>

            {/* Nodes */}
            <g transform="translate(100, 190)">
              <circle r="28" fill="url(#grad-attacker)" stroke="#fca5a5" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="16">👾</text>
              <text y="44" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">Attacker</text>
              <text y="56" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Rogue Session</text>
            </g>

            <g transform="translate(270, 190)">
              <circle r="32" fill="url(#grad-compromised)" stroke="#fdba74" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">📱</text>
              <text y="48" textAnchor="middle" fill="#fb923c" fontSize="11" fontWeight="bold">Aman's Account</text>
              <text y="60" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="monospace">[QUARANTINED]</text>
            </g>

            <g transform="translate(480, 100)">
              <circle r="30" fill="url(#grad-shielded)" stroke="#67e8f9" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">👩‍💻</text>
              <text y="46" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Priya (Target)</text>
              <text y="58" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace">Shielded (₹5k Saved)</text>
            </g>

            <g transform="translate(480, 190)">
              <circle r="30" fill="url(#grad-shielded)" stroke="#67e8f9" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">👨‍🎓</text>
              <text y="46" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">Rahul (Contact)</text>
              <text y="58" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace">APK Intercepted</text>
            </g>

            <g transform="translate(480, 280)">
              <circle r="32" fill="url(#grad-quarantined)" stroke="#c4b5fd" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="18">🎓</text>
              <text y="48" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="bold">CS Batch 2026</text>
              <text y="60" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="monospace">64 Students Muted</text>
            </g>

            <g transform="translate(680, 280)">
              <circle r="26" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#fff" fontSize="16">🏢</text>
              <text y="42" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Hostel Block C</text>
              <text y="54" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Safe / Insulated</text>
            </g>
          </svg>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Agent 4 Blast Radius Containment Engine: Lateral infection tree successfully severed.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
