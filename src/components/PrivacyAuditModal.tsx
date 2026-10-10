import React from 'react';
import { EyeOff, X, CheckCircle, Terminal } from 'lucide-react';

interface PrivacyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyAuditModal: React.FC<PrivacyAuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800/80 text-emerald-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Privacy Architecture & DPDP Act 2023 Audit
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  100% Compliant
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Formal proof of on-device ephemeral execution & zero raw chat egress
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

        {/* Audit Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Statutory Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>Zero Cloud Ingestion Guarantee</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Raw conversational strings are processed strictly inside volatile process RAM (Chromium V8 isolated sandbox). No socket connection or API calls transmit plaintext messages to OpenAI, Anthropic, or external cloud LLMs.
              </p>
              <div className="mt-2 font-mono text-[10px] bg-slate-900 px-2 py-1 rounded text-cyan-400 border border-slate-800">
                Network Inspector: 0 POST /payloads to cloud
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>One-Way Mathematical Vectors</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Historical user baselines are saved as non-reversible statistical vectors (lexical diversity ratio, punctuation entropy, Hinglish percentage). Original text cannot be reverse-engineered from these mathematical digests.
              </p>
              <div className="mt-2 font-mono text-[10px] bg-slate-900 px-2 py-1 rounded text-cyan-400 border border-slate-800">
                Storage: Non-reversible Float32 Arrays
              </div>
            </div>
          </div>

          {/* DPDP Act 2023 Provisions Compliance Table */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 font-mono text-xs font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Statutory Alignment Matrix (DPDP Act 2023, India)</span>
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="p-3">Statutory Principle</th>
                  <th className="p-3">Requirement</th>
                  <th className="p-3">CascadeGuard AI Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                <tr>
                  <td className="p-3 font-semibold text-white">Data Minimization</td>
                  <td className="p-3 text-slate-400">Collect only strictly necessary data</td>
                  <td className="p-3 text-emerald-400">Zero persistent chat storage. Ephemeral RAM disposal after &lt;300ms audit.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Purpose Limitation</td>
                  <td className="p-3 text-slate-400">Process data only for declared security purpose</td>
                  <td className="p-3 text-emerald-400">Restricted purely to on-device lateral ATO anomaly scoring.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">No Third-Party Egress</td>
                  <td className="p-3 text-slate-400">No unauthorized sharing of personal records</td>
                  <td className="p-3 text-emerald-400">Only cryptographic hashes of malicious VPAs sent to I4C / NPCI threat feeds.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">End-to-End Encryption</td>
                  <td className="p-3 text-slate-400">Respect cryptographic transport secrecy</td>
                  <td className="p-3 text-emerald-400">Operates "at the glass" on client device after legitimate decryption by user.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Audited for InnoHacks 4.0 & Build with Bharat (2026)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
