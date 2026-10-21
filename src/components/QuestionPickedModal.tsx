import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Question } from '../data/questions';
import { soundManager } from '../utils/audio';
import { Sparkles, ArrowRight, RotateCw, BookOpen, HelpCircle } from 'lucide-react';

interface QuestionPickedModalProps {
  question: Question;
  onOpenQuestion: () => void;
  onSpinNext: () => void;
}

export const QuestionPickedModal: React.FC<QuestionPickedModalProps> = ({
  question,
  onOpenQuestion,
  onSpinNext,
}) => {
  useEffect(() => {
    // Joyful confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border-2 border-amber-400/80 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Floating icon */}
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 p-0.5 shadow-lg flex items-center justify-center animate-bounce">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Congratulatory Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 font-bold text-xs tracking-wider uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>VÒNG QUAY ĐÃ DỪNG LẠI TẠI</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Question Number Banner */}
        <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 tracking-tight my-2 drop-shadow-md animate-pulse">
          CÂU HỎI {String(question.id).padStart(2, '0')}
        </h2>

        {/* Question content preview */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-indigo-100 font-semibold text-sm sm:text-base mb-6 leading-relaxed shadow-inner">
          "{question.question}"
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenQuestion();
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>MỞ CÂU HỎI & ĐÁP ÁN</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onSpinNext();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600 text-slate-300 font-bold text-xs hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>QUAY CÂU KHÁC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
