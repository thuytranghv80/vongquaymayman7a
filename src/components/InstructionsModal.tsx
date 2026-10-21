import React from 'react';
import { soundManager } from '../utils/audio';
import { HelpCircle, CheckCircle2, Trophy, Clock, X, Sparkles, Gift } from 'lucide-react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                HƯỚNG DẪN CÁCH CHƠI
              </h3>
              <p className="text-xs text-amber-300 font-semibold">
                Lớp 7A1 • Chinh Phục Thử Thách Giữ Chữ Tín
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

        {/* Rules content */}
        <div className="space-y-4 text-sm sm:text-base leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 font-black shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-amber-300 mb-0.5">Vòng Quay May Mắn (39 Học Sinh)</h4>
              <p className="text-slate-300 text-xs sm:text-sm">
                Giáo viên nhấn <strong className="text-amber-300">QUAY NGAY</strong>. Vòng quay với 39 học sinh lớp 7A1 sẽ quay và dừng ngẫu nhiên tại một học sinh may mắn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 font-black shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Nhận thử thách kiến thức</h4>
              <p className="text-slate-300 text-xs sm:text-sm">
                Học sinh được chọn sẽ nhận ngẫu nhiên 1 trong 28 câu hỏi trắc nghiệm về <strong>Bài 4: Giữ chữ tín</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 font-black shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Thời gian & Trả lời</h4>
              <p className="text-slate-300 text-xs sm:text-sm">
                Học sinh có <strong className="text-amber-300">20 giây</strong> để suy nghĩ và đưa ra đáp án A, B, C hoặc D (học sinh tự chọn hoặc giáo viên hỗ trợ bấm chọn).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 font-black shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Tính điểm & Vinh danh</h4>
              <p className="text-slate-300 text-xs sm:text-sm">
                Trả lời đúng được cộng ngay <strong className="text-emerald-400 font-black">+10 điểm</strong> vào bảng thành tích. Trả lời chưa chính xác được 0 điểm và tiếp tục cổ vũ các bạn.
              </p>
            </div>
          </div>

          {/* Rule 5: Lucky Question & Teacher Gift */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-amber-500/20 border-2 border-amber-400/60 shadow-md">
            <div className="p-2 rounded-xl bg-amber-500/30 text-amber-300 font-black shrink-0 flex items-center justify-center">
              <Gift className="w-5 h-5 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-yellow-300 mb-0.5 flex items-center gap-1.5">
                <span>⭐ CÂU HỎI MAY MẮN & PHẦN QUÀ GIÁO VIÊN ⭐</span>
              </h4>
              <p className="text-amber-100 text-xs sm:text-sm">
                Cứ sau <strong>2 bạn học sinh</strong> trả lời câu hỏi, bạn học sinh thứ 3 sẽ nhận được <strong className="text-yellow-300">CÂU HỎI MAY MẮN</strong>! Nếu bạn thứ 3 trả lời đúng sẽ được <strong className="text-emerald-400 font-bold">+10 điểm</strong> và nhận ngay <strong className="text-yellow-300 font-bold underline">1 PHẦN QUÀ ĐẶC BIỆT TỪ GIÁO VIÊN</strong>! 🎁🎉
              </p>
            </div>
          </div>
        </div>

        {/* Motto quote */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 text-center">
          <p className="text-amber-300 font-black text-sm sm:text-base italic flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            “Tự tin – Trung thực – Giữ trọn niềm tin”
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wide transition-all cursor-pointer shadow-lg"
          >
            ĐÃ HIỂU – BẮT ĐẦU NGAY
          </button>
        </div>
      </div>
    </div>
  );
};
