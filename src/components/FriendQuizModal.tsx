import React, { useState } from 'react';
import { HelpCircle, X, CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface FriendQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
  onVerifyFail: () => void;
  isDarkMode?: boolean;
}

export const FriendQuizModal: React.FC<FriendQuizModalProps> = ({
  isOpen,
  onClose,
  onVerifySuccess,
  onVerifyFail,
  isDarkMode = false
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);

  if (!isOpen) return null;

  const quiz = {
    question: "Security Interlock Challenge: What was the nickname of our 1st-year Hostel Warden at KIET?",
    options: ["Gabbar Sir", "Sharma Ji", "Hitler Sir", "Verma Ji"],
    correctAnswer: "Gabbar Sir"
  };

  const handleTest = () => {
    if (selectedOption === quiz.correctAnswer) {
      setResult('success');
      setTimeout(() => {
        onVerifySuccess();
      }, 1500);
    } else {
      setResult('fail');
      setTimeout(() => {
        onVerifyFail();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transition-all border ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-amber-950 text-amber-400 border-amber-800/60' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Autonomous Reverse-Challenge (Friend Quiz)
              </h3>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Zero-Knowledge Verification Protocol
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            CascadeGuard generated this verification challenge derived from private local relational context. An imposter who took over the account cannot answer this without failing:
          </p>

          <div className={`p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-mono uppercase tracking-wide block mb-1 font-bold ${
              isDarkMode ? 'text-cyan-400' : 'text-blue-700'
            }`}>
              Active Question
            </span>
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {quiz.question}
            </div>
          </div>

          <div className="space-y-2">
            <span className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Select Answer (Simulate Sender Response):
            </span>
            <div className="grid grid-cols-2 gap-2">
              {quiz.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                    selectedOption === opt
                      ? (isDarkMode ? 'border-cyan-500 bg-cyan-950/60 text-cyan-200' : 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20')
                      : (isDarkMode ? 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800 shadow-2xs')
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {result === 'success' && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
              isDarkMode 
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
            }`}>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Correct Answer! Account Identity Verified. Shield relaxed.</span>
            </div>
          )}

          {result === 'fail' && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
              isDarkMode 
                ? 'bg-red-950/80 border-red-700 text-red-300' 
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Wrong Answer! Attacker Imposter Confirmed. Permanent Quarantine Engaged.</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleTest}
              disabled={!selectedOption}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
