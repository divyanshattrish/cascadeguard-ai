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
  isDarkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrivacyAudit,
  onOpenContagionGraph,
  onResetDemo,
  isContagionActive,
  surfaceMode,
  onSelectSurfaceMode,
  isDarkMode = false
}) => {
  return (
    <header className={`border-b sticky top-0 z-40 px-4 lg:px-8 py-3.5 backdrop-blur-md transition-colors ${
      isDarkMode
        ? 'border-slate-800 bg-slate-950/90 text-white'
        : 'border-slate-200 bg-white/95 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className={`relative flex items-center justify-center w-11 h-11 rounded-2xl border shadow-lg ${
            isDarkMode
              ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border-cyan-500/40 text-cyan-400'
              : 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-400/40 text-white shadow-blue-500/20'
          }`}>
            <Shield className="w-6 h-6 animate-pulse-subtle" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-bold tracking-tight flex items-center gap-1.5 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                CascadeGuard{' '}
                <span className={`font-mono text-sm uppercase px-1.5 py-0.5 rounded border ${
                  isDarkMode
                    ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
                    : 'text-blue-700 bg-blue-50 border-blue-200'
                }`}>
                  AI
                </span>
              </h1>
              <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                isDarkMode
                  ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Edge Active
              </span>
            </div>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Autonomous Lateral Social Engineering & Account Takeover (ATO) Interceptor
            </p>
          </div>
        </div>

        {/* Center: Surface Switcher & Privacy Guarantee */}
        <div className="flex items-center gap-3">
          {/* Surface Toggle */}
          <div className={`flex items-center p-1 rounded-2xl border text-xs ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => onSelectSurfaceMode('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                surfaceMode === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>WhatsApp Web</span>
            </button>
            <button
              onClick={() => onSelectSurfaceMode('telegram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                surfaceMode === 'telegram'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Telegram Bot</span>
            </button>
          </div>

          <div 
            onClick={onOpenPrivacyAudit}
            className={`cursor-pointer group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs ${
              isDarkMode
                ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40 text-slate-300'
                : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700 shadow-sm'
            }`}
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>0 Bytes Egress</span>
              <span className="opacity-30">•</span>
              <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
              <span>DPDP §6(4)</span>
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContagionGraph}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              isContagionActive 
                ? (isDarkMode ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : 'bg-blue-50 border-blue-300 text-blue-700')
                : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm')
            }`}
          >
            <Network className="w-4 h-4 text-blue-600" />
            <span>Contagion Graph</span>
          </button>

          <button
            onClick={onResetDemo}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
            }`}
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
