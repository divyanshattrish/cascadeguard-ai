import React, { useState } from 'react';
import { HelpCircle, X, CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface FriendQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
  onVerifyFail: () => void;
}

export const FriendQuizModal: React.FC<FriendQuizModalProps> = ({
  isOpen,
  onClose,
  onVerifySuccess,
  onVerifyFail
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Autonomous Reverse-Challenge (Friend Quiz)
              </h3>
              <p className="text-[11px] text-slate-400">Zero-Knowledge Verification Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            CascadeGuard generated this verification challenge derived from private local relational context. An imposter who took over the account cannot answer this without failing:
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wide block mb-1">
              Active Question
            </span>
            <div className="text-sm font-semibold text-white">
              {quiz.question}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-medium">Select Answer (Simulate Sender Response):</span>
            <div className="grid grid-cols-2 gap-2">
              {quiz.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                    selectedOption === opt
                      ? 'border-cyan-500 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {result === 'success' && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Correct Answer! Account Identity Verified. Shield relaxed.</span>
            </div>
          )}

          {result === 'fail' && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Wrong Answer! Attacker Imposter Confirmed. Permanent Quarantine Engaged.</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleTest}
              disabled={!selectedOption}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
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
