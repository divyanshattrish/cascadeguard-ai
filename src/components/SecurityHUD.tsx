import React from 'react';
import { 
  Activity, ShieldAlert, Cpu, Database, 
  Binary, Zap, FileText, Clock
} from 'lucide-react';
import { MessageAnalysis } from '../types';

interface SecurityHUDProps {
  latestAnalysis: MessageAnalysis | null;
  isDarkMode?: boolean;
}

export const SecurityHUD: React.FC<SecurityHUDProps> = ({ latestAnalysis, isDarkMode = false }) => {
  if (!latestAnalysis) {
    return (
      <div className={`border rounded-2xl p-6 text-center transition-all ${
        isDarkMode 
          ? 'bg-slate-900/60 border-slate-800 text-slate-500' 
          : 'bg-white border-slate-200 text-slate-600 shadow-sm'
      }`}>
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50 animate-pulse text-cyan-600" />
        <p className="text-sm font-medium">Awaiting incoming conversational stream for real-time edge stylometric analysis...</p>
      </div>
    );
  }

  const { overallRiskScore, threatLevel, stylometricDrift, forensicIntent, processingTimeMs } = latestAnalysis;
  const isCritical = threatLevel === 'CRITICAL_ATO';
  const isSuspicious = threatLevel === 'SUSPICIOUS';

  return (
    <div className={`border rounded-2xl p-5 shadow-sm space-y-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/70 border-slate-800 text-slate-100 shadow-xl' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Title & Edge Status */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-cyan-950 border-cyan-800/60 text-cyan-400' 
              : 'bg-cyan-50 border-cyan-200 text-cyan-700'
          }`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Security Inspector & Multi-Agent Telemetry
            </h3>
            <span className={`text-[11px] font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Parallel Dual-Engine On-Device Audit
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`font-mono text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
            isDarkMode 
              ? 'bg-slate-950 border-slate-800 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5 text-cyan-600" />
            <span>Audit Latency: <strong className={isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}>{processingTimeMs} ms</strong></span>
          </span>
          <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md uppercase border ${
            isCritical 
              ? (isDarkMode ? 'bg-red-950 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700')
              : isSuspicious 
                ? (isDarkMode ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700') 
                : (isDarkMode ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
          }`}>
            {threatLevel.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 3 Core Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gauge 1: Combined ATO Risk */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="font-semibold">Combined Risk Index</span>
            <ShieldAlert className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-emerald-500'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${
              isCritical ? 'text-red-500' : isSuspicious ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {overallRiskScore}%
            </span>
            <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>/ 100% Threshold</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden mt-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className={`h-full transition-all duration-500 ${
                isCritical ? 'bg-red-500' : isSuspicious ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${overallRiskScore}%` }}
            />
          </div>
        </div>

        {/* Gauge 2: Stylometric Drift (Agent 1) */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="font-semibold">Stylometric Drift (Agent 1)</span>
            <Binary className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {stylometricDrift.overallDrift}%
            </span>
            <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Divergence from Aman</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden mt-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${stylometricDrift.overallDrift}%` }}
            />
          </div>
        </div>

        {/* Gauge 3: Coercion & Urgency (Agent 2) */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="font-semibold">Coercion / Urgency (Agent 2)</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              {forensicIntent.financialCoercionScore}%
            </span>
            <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Pressure velocity</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden mt-3 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${forensicIntent.financialCoercionScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stylometric Vectors Breakdown */}
      <div className={`p-4 rounded-xl border ${
        isDarkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <h4 className={`text-xs font-bold uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-800'
        }`}>
          <FileText className="w-3.5 h-3.5 text-cyan-500" />
          Linguistic Stylometry Vector Decomposition
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className={`p-2.5 rounded-lg border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hinglish Depletion</div>
            <div className={`font-mono font-bold mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {stylometricDrift.languageMixDrift}%
            </div>
          </div>
          <div className={`p-2.5 rounded-lg border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Vocabulary Distance</div>
            <div className={`font-mono font-bold mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {stylometricDrift.lexicalDrift}%
            </div>
          </div>
          <div className={`p-2.5 rounded-lg border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Punctuation Variance</div>
            <div className={`font-mono font-bold mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {stylometricDrift.punctuationDrift}%
            </div>
          </div>
          <div className={`p-2.5 rounded-lg border ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Casing Pressure</div>
            <div className={`font-mono font-bold mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {stylometricDrift.casingDrift}%
            </div>
          </div>
        </div>

        {/* Anomaly observations */}
        {stylometricDrift.details.length > 0 && (
          <div className={`mt-3 pt-3 border-t space-y-1 ${
            isDarkMode ? 'border-slate-800/60' : 'border-slate-200'
          }`}>
            {stylometricDrift.details.map((detail, idx) => (
              <div key={idx} className={`text-xs flex items-start gap-1.5 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <span className="text-cyan-500 font-mono font-bold">›</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forensic Findings & Threat Feeds */}
      {forensicIntent.flaggedKeywords.length > 0 && (
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-rose-50/70 border-rose-200'
        }`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5 ${
            isDarkMode ? 'text-slate-300' : 'text-rose-900'
          }`}>
            <Database className="w-3.5 h-3.5 text-red-500" />
            Forensic Signals & NPCI / I4C Feed Match
          </h4>
          <div className="flex flex-wrap gap-2">
            {forensicIntent.flaggedKeywords.map((kw, i) => (
              <span key={i} className={`text-xs font-mono px-2.5 py-1 rounded-md border font-semibold ${
                isDarkMode 
                  ? 'bg-red-950/70 border-red-800 text-red-200' 
                  : 'bg-white border-rose-200 text-rose-800 shadow-2xs'
              }`}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
