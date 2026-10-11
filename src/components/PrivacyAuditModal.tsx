import React from 'react';
import { EyeOff, X, CheckCircle, Terminal } from 'lucide-react';

interface PrivacyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const PrivacyAuditModal: React.FC<PrivacyAuditModalProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all border ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              isDarkMode 
                ? 'bg-emerald-950 border-emerald-800/80 text-emerald-400' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Privacy Architecture & DPDP Act 2023 Audit
                <span className={`text-xs font-mono font-normal px-2 py-0.5 rounded border font-semibold ${
                  isDarkMode 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  100% Compliant
                </span>
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Formal proof of on-device ephemeral execution & zero raw chat egress
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

        {/* Audit Content */}
        <div className={`p-6 overflow-y-auto space-y-6 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {/* Statutory Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>Zero Cloud Ingestion Guarantee</span>
              </div>
              <p className={`leading-relaxed text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Raw conversational strings are processed strictly inside volatile process RAM (Chromium V8 isolated sandbox). No socket connection or API calls transmit plaintext messages to OpenAI, Anthropic, or external cloud LLMs.
              </p>
              <div className={`mt-2 font-mono text-[10px] px-2 py-1 rounded border font-semibold ${
                isDarkMode ? 'bg-slate-900 text-cyan-400 border-slate-800' : 'bg-white text-blue-700 border-slate-200 shadow-2xs'
              }`}>
                Network Inspector: 0 POST /payloads to cloud
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>One-Way Mathematical Vectors</span>
              </div>
              <p className={`leading-relaxed text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Historical user baselines are saved as non-reversible statistical vectors (lexical diversity ratio, punctuation entropy, Hinglish percentage). Original text cannot be reverse-engineered from these mathematical digests.
              </p>
              <div className={`mt-2 font-mono text-[10px] px-2 py-1 rounded border font-semibold ${
                isDarkMode ? 'bg-slate-900 text-cyan-400 border-slate-800' : 'bg-white text-blue-700 border-slate-200 shadow-2xs'
              }`}>
                Storage: Non-reversible Float32 Arrays
              </div>
            </div>
          </div>

          {/* DPDP Act 2023 Provisions Compliance Table */}
          <div className={`rounded-2xl border overflow-hidden ${
            isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}>
            <div className={`px-4 py-3 border-b font-mono text-xs font-bold flex items-center gap-2 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Statutory Alignment Matrix (DPDP Act 2023, India)</span>
            </div>
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className={`border-b font-mono ${
                  isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500 bg-slate-50/50'
                }`}>
                  <th className="p-3">Statutory Principle</th>
                  <th className="p-3">Requirement</th>
                  <th className="p-3">CascadeGuard AI Implementation</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-sans ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                <tr>
                  <td className={`p-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Data Minimization</td>
                  <td className={`p-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Collect only strictly necessary data</td>
                  <td className="p-3 text-emerald-600 font-medium">Zero persistent chat storage. Ephemeral RAM disposal after &lt;300ms audit.</td>
                </tr>
                <tr>
                  <td className={`p-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Purpose Limitation</td>
                  <td className={`p-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Process data only for declared security purpose</td>
                  <td className="p-3 text-emerald-600 font-medium">Restricted purely to on-device lateral ATO anomaly scoring.</td>
                </tr>
                <tr>
                  <td className={`p-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Third-Party Egress</td>
                  <td className={`p-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>No unauthorized sharing of personal records</td>
                  <td className="p-3 text-emerald-600 font-medium">Only cryptographic hashes of malicious VPAs sent to I4C / NPCI threat feeds.</td>
                </tr>
                <tr>
                  <td className={`p-3 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>End-to-End Encryption</td>
                  <td className={`p-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Respect cryptographic transport secrecy</td>
                  <td className="p-3 text-emerald-600 font-medium">Operates "at the glass" on client device after legitimate decryption by user.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            Audited for InnoHacks 4.0 & Build with Bharat (2026)
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl font-medium text-xs transition-colors ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold'
            }`}
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
