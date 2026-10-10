import React from 'react';
import { Shield, Lock, EyeOff, RotateCcw, Network } from 'lucide-react';
import { SurfaceMode } from '../types';

interface HeaderProps {
  onOpenPrivacyAudit: () => void;
  onOpenContagionGraph: () => void;
  onResetDemo: () => void;
  isContagionActive: boolean;
  surfaceMode: SurfaceMode;
  onSelectSurfaceMode: (mode: SurfaceMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrivacyAudit,
  onOpenContagionGraph,
  onResetDemo,
  isContagionActive,
  surfaceMode,
  onSelectSurfaceMode
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Shield className="w-6 h-6 animate-pulse-subtle" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                CascadeGuard <span className="text-cyan-400 font-mono text-sm uppercase px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">AI</span>
              </h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Edge Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Autonomous Lateral Social Engineering & Account Takeover (ATO) Interceptor
            </p>
          </div>
        </div>

        {/* Center: Surface Switcher & Privacy Guarantee */}
        <div className="flex items-center gap-3">
          {/* Surface Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onSelectSurfaceMode('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                surfaceMode === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>WhatsApp Web</span>
            </button>
            <button
              onClick={() => onSelectSurfaceMode('telegram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                surfaceMode === 'telegram'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Telegram Bot</span>
            </button>
          </div>

          <div 
            onClick={onOpenPrivacyAudit}
            className="cursor-pointer group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs text-slate-300"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>0 Bytes Egress</span>
              <span className="text-slate-600">•</span>
              <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPDP 2023</span>
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContagionGraph}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
              isContagionActive 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Contagion Graph</span>
          </button>

          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs"
            title="Reset Simulator"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
