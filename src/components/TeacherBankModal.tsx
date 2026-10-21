import React, { useState } from 'react';
import { Question } from '../data/questions';
import { soundManager } from '../utils/audio';
import { BookOpen, CheckCircle, Search, X, RotateCcw } from 'lucide-react';

interface TeacherBankModalProps {
  questions: Question[];
  usedQuestionIds: Set<number>;
  onResetQuestions: () => void;
  onClose: () => void;
}

export const TeacherBankModal: React.FC<TeacherBankModalProps> = ({
  questions,
  usedQuestionIds,
  onResetQuestions,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = questions.filter(
    q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toString().includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-6 py-5 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                NGÂN HÀNG 28 CÂU HỎI & ĐÁP ÁN (DÀNH CHO GIÁO VIÊN)
              </h3>
              <p className="text-xs text-indigo-300">
                Bài 4: Giữ chữ tín • Môn Giáo dục công dân 7 • Đã dùng: {usedQuestionIds.size}/28 câu
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-3 bg-slate-900 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi hoặc số câu..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Bạn có muốn đặt lại ngân hàng câu hỏi để sử dụng lại từ đầu?')) {
                  onResetQuestions();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bắt đầu vòng câu hỏi mới</span>
            </button>
          </div>
        </div>

        {/* Scrollable Questions List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {filteredQuestions.map(q => {
            const isUsed = usedQuestionIds.has(q.id);
            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isUsed
                    ? 'bg-slate-900/80 border-slate-800 opacity-75'
                    : 'bg-slate-800/60 border-slate-700/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-black text-xs border border-indigo-400/40">
                      CÂU {String(q.id).padStart(2, '0')}
                    </span>
                    {isUsed ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        ✓ Đã sử dụng
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                        Sẵn sàng
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-xs">
                    ĐÁP ÁN ĐÚNG: {q.correctAnswer}
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white mb-3 whitespace-pre-line">
                  {q.question}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {(['A', 'B', 'C', 'D'] as const).map(letter => {
                    const isCorrect = letter === q.correctAnswer;
                    return (
                      <div
                        key={letter}
                        className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-semibold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {letter}
                        </span>
                        <span>{q.options[letter]}</span>
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-3 text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/20">
                    <span className="font-bold text-amber-300">Ý nghĩa: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
