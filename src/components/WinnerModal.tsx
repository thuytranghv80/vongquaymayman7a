import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Student } from '../data/students';
import { soundManager } from '../utils/audio';
import { Sparkles, ArrowRight, RotateCw, Trophy, Volume2 } from 'lucide-react';

interface WinnerModalProps {
  student: Student;
  onAcceptChallenge: () => void;
  onSpinNext: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  student,
  onAcceptChallenge,
  onSpinNext,
}) => {
  useEffect(() => {
    // Speak chosen student name aloud
    const timer = setTimeout(() => {
      soundManager.speakStudentName(student.name, student.id);
    }, 450);

    // Trigger celebratory confetti fireworks (2-3 seconds duration)
    const end = Date.now() + 2500;
    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    return () => {
      clearTimeout(timer);
      soundManager.stopSpeech();
    };
  }, [student.name]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border-2 border-amber-400/80 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-center overflow-hidden">
        {/* Glow backdrop behind card */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Floating trophy / badge */}
        <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 mb-2 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 p-0.5 shadow-lg flex items-center justify-center animate-bounce">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
            <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
          </div>
        </div>

        {/* Congratulatory Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 font-bold text-xs tracking-wider uppercase mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>CHÚC MỪNG BẠN!</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Student Name */}
        <div className="flex items-center justify-center gap-2 my-2">
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 tracking-tight drop-shadow-md animate-pulse">
            {student.name.toUpperCase()}
          </h2>
          <button
            type="button"
            onClick={() => soundManager.speakStudentName(student.name, student.id)}
            title="Đọc lại tên học sinh"
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-indigo-100/90 font-medium max-w-sm mx-auto leading-relaxed mb-4">
          Bạn đã được lựa chọn để chinh phục thử thách{' '}
          <span className="text-amber-300 font-bold">Bài 4: Giữ chữ tín</span> của lớp{' '}
          <span className="text-yellow-400 font-bold">7A1</span>!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onAcceptChallenge();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wide uppercase shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>NHẬN THỬ THÁCH</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onSpinNext();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600 text-slate-200 font-bold text-sm hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>QUAY TIẾP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
