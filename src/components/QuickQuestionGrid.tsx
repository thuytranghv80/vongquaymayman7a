import React from 'react';
import { Question } from '../data/questions';
import { soundManager } from '../utils/audio';
import { CheckCircle2, Clock } from 'lucide-react';

interface QuickQuestionGridProps {
  questions: Question[];
  usedQuestionIds: Set<number>;
  onSelectQuestion: (question: Question) => void;
}

export const QuickQuestionGrid: React.FC<QuickQuestionGridProps> = ({
  questions,
  usedQuestionIds,
  onSelectQuestion,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
          <span>⚡ Chọn nhanh câu hỏi (1 – 28):</span>
        </span>
        <span className="text-xs text-slate-400">
          Đã dùng: <strong className="text-emerald-400">{usedQuestionIds.size}</strong>/28 câu
        </span>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
        {questions.map((q) => {
          const isUsed = usedQuestionIds.has(q.id);
          return (
            <button
              key={q.id}
              onClick={() => {
                soundManager.playClick();
                onSelectQuestion(q);
              }}
              title={`Câu ${q.id}: ${q.question}`}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer border ${
                isUsed
                  ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 border-slate-700 text-slate-200 shadow-sm hover:scale-105'
              }`}
            >
              <span>{String(q.id).padStart(2, '0')}</span>
              {isUsed && <span className="text-[9px] text-emerald-400 leading-none">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
