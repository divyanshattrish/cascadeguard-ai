import React from 'react';
import { 
  Activity, ShieldAlert, Cpu, Database, 
  Binary, Zap, FileText, Clock
} from 'lucide-react';
import { MessageAnalysis } from '../types';

interface SecurityHUDProps {
  latestAnalysis: MessageAnalysis | null;
}

export const SecurityHUD: React.FC<SecurityHUDProps> = ({ latestAnalysis }) => {
  if (!latestAnalysis) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-500">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
        <p className="text-sm">Awaiting incoming conversational stream for real-time edge stylometric analysis...</p>
      </div>
    );
  }

  const { overallRiskScore, threatLevel, stylometricDrift, forensicIntent, processingTimeMs } = latestAnalysis;
  const isCritical = threatLevel === 'CRITICAL_ATO';
  const isSuspicious = threatLevel === 'SUSPICIOUS';

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Title & Edge Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              Security Inspector & Multi-Agent Telemetry
            </h3>
            <span className="text-[11px] text-slate-400 font-sans">
              Parallel Dual-Engine On-Device Audit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audit Latency: <strong className="text-cyan-400">{processingTimeMs} ms</strong></span>
          </span>
          <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md uppercase border ${
            isCritical 
              ? 'bg-red-950 border-red-700 text-red-300' 
              : isSuspicious 
                ? 'bg-amber-950 border-amber-700 text-amber-300' 
                : 'bg-emerald-950 border-emerald-700 text-emerald-300'
          }`}>
            {threatLevel.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 3 Core Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gauge 1: Combined ATO Risk */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Combined Risk Index</span>
            <ShieldAlert className={`w-4 h-4 ${isCritical ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${
              isCritical ? 'text-red-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {overallRiskScore}%
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100% Threshold</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full transition-all duration-500 ${
                isCritical ? 'bg-red-500' : isSuspicious ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${overallRiskScore}%` }}
            />
          </div>
        </div>

        {/* Gauge 2: Stylometric Drift (Agent 1) */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Stylometric Drift (Agent 1)</span>
            <Binary className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">
              {stylometricDrift.overallDrift}%
            </span>
            <span className="text-xs text-slate-500 font-mono">Divergence from Aman</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${stylometricDrift.overallDrift}%` }}
            />
          </div>
        </div>

        {/* Gauge 3: Coercion & Urgency (Agent 2) */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Coercion / Urgency (Agent 2)</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              {forensicIntent.financialCoercionScore}%
            </span>
            <span className="text-xs text-slate-500 font-mono">Pressure velocity</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${forensicIntent.financialCoercionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stylometric Vectors Breakdown */}
      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          Linguistic Stylometry Vector Decomposition
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">Hinglish Depletion</div>
            <div className="text-slate-100 font-mono font-bold mt-1">
              {stylometricDrift.languageMixDrift}%
            </div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">Vocabulary Distance</div>
            <div className="text-slate-100 font-mono font-bold mt-1">
              {stylometricDrift.lexicalDrift}%
            </div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">Punctuation Variance</div>
            <div className="text-slate-100 font-mono font-bold mt-1">
              {stylometricDrift.punctuationDrift}%
            </div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px]">Casing Pressure</div>
            <div className="text-slate-100 font-mono font-bold mt-1">
              {stylometricDrift.casingDrift}%
            </div>
          </div>
        </div>

        {/* Anomaly observations */}
        {stylometricDrift.details.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1">
            {stylometricDrift.details.map((detail, idx) => (
              <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-cyan-400 font-mono">›</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forensic Findings & Threat Feeds */}
      {forensicIntent.flaggedKeywords.length > 0 && (
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-red-400" />
            Forensic Signals & NPCI / I4C Feed Match
          </h4>
          <div className="flex flex-wrap gap-2">
            {forensicIntent.flaggedKeywords.map((kw, i) => (
              <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-md bg-red-950/70 border border-red-800 text-red-200">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
