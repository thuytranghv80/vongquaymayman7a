import React from 'react';
import { soundManager } from '../utils/audio';
import {
  Sparkles,
  Play,
  HelpCircle,
  Trophy,
  Volume2,
  VolumeX,
  BookOpen,
  Compass,
  Monitor,
  Download,
  Gift
} from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: () => void;
  onOpenInstructions: () => void;
  onOpenScoreboard: () => void;
  onOpenQuestionBank: () => void;
  onOpenClassroomGuide: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onOpenInstructions,
  onOpenScoreboard,
  onOpenQuestionBank,
  onOpenClassroomGuide,
  soundMuted,
  onToggleSound,
}) => {
  return (
    <div className="relative min-h-screen sm:h-screen sm:max-h-screen w-full flex flex-col justify-between overflow-y-auto sm:overflow-hidden bg-gradient-to-b from-[#0a1846] via-[#0f296d] to-[#071330] px-4 py-3 sm:py-4 select-none">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-amber-500/15 to-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating subtle star sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-12 left-1/4 animate-pulse text-yellow-300 text-lg">✦</div>
        <div className="absolute top-1/3 right-1/4 animate-pulse text-amber-200 text-xl delay-300">★</div>
        <div className="absolute bottom-1/4 left-1/5 animate-pulse text-yellow-400 text-sm delay-700">✦</div>
        <div className="absolute bottom-1/3 right-1/5 animate-pulse text-indigo-300 text-base delay-500">★</div>
      </div>

      {/* Top Bar with sound and badges */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-400/40 text-indigo-200 text-xs sm:text-sm font-bold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            MÔN GIÁO DỤC CÔNG DÂN 7
          </div>
          <div className="hidden sm:inline-flex px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
            TRƯỜNG TH&THCS LÊ THỊ TUYẾT • LỚP 7A1 (39 HỌC SINH)
          </div>
        </div>

        {/* Audio Controls & Voice Preview */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => soundManager.speakStudentName("Nguyễn Minh Châu", 2)}
            className="hidden sm:flex px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Nghe thử giọng đọc xướng tên học sinh Tiếng Việt"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Thử giọng đọc 🔊</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {soundMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-rose-300">Tắt âm</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Bật âm</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Center Hero Stage */}
      <main className="relative z-10 my-auto w-full max-w-4xl mx-auto text-center py-2 sm:py-4">
        
        {/* Class Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-500/20 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-2 sm:mb-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-amber-300 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
            BÀI 4: GIỮ CHỮ TÍN
          </span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>

        {/* Primary Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-yellow-300 drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)] mb-2 pt-2 pb-1 leading-normal flex items-center justify-center">
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent inline-block pb-1">
            VÒNG QUAY MAY MẮN
          </span>
        </h1>

        {/* Subtitle */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-indigo-100/95 tracking-wide mb-2 sm:mb-3">
          LỚP 7A1 – CHINH PHỤC THỬ THÁCH BÀI 4: GIỮ CHỮ TÍN
        </h2>

        {/* Motto Slogan */}
        <div className="relative inline-block max-w-xl mx-auto px-5 py-2 rounded-2xl bg-slate-900/80 border border-amber-400/40 shadow-inner mb-3 sm:mb-4">
          <p className="text-amber-300 font-black text-sm sm:text-lg italic tracking-wide">
            “Tự tin – Trung thực – Giữ trọn niềm tin”
          </p>
        </div>

        {/* Special Feature Highlight: Lucky Question & Teacher Gift */}
        <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/50 shadow-md text-xs sm:text-sm text-yellow-200">
          <Gift className="w-4 h-4 text-amber-300 animate-bounce" />
          <span><strong>Mới:</strong> Cứ sau 2 học sinh, bạn thứ 3 nhận <strong>Câu Hỏi May Mắn (10 Điểm + Quà GV 🎁)</strong>!</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame();
            }}
            className="w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950 transition-transform group-hover:scale-110" />
            <span>BẮT ĐẦU TRÒ CHƠI</span>
          </button>

          <a
            href="/VongQuay_Lop7A1.html"
            download="VongQuay_Lop7A1.html"
            onClick={() => soundManager.playClick()}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105"
            title="Tải 1 file duy nhất về máy để gửi Zalo hoặc cắm USB mở dạy không cần mạng"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>TẢI VỀ MÁY (DÙNG OFFLINE)</span>
          </a>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenInstructions();
            }}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-2xl bg-indigo-900/70 hover:bg-indigo-800 border-2 border-indigo-500/50 hover:border-indigo-400 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <HelpCircle className="w-4 h-4 text-indigo-300" />
            <span>HƯỚNG DẪN CÁCH CHƠI</span>
          </button>
        </div>

        {/* Secondary Navigation Tools */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenClassroomGuide();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/60 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Monitor className="w-4 h-4 text-emerald-200" />
            <span>📥 Hướng Dẫn Mở Dạy Chiều Nay / Lấy Link</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenScoreboard();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Bảng Thành Tích Lớp 7A1</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenQuestionBank();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-indigo-300 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Ngân Hàng 28 Câu Hỏi (GV)</span>
          </button>
        </div>
      </main>

      {/* Footer presentation info */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4 gap-2">
        <div className="flex items-center gap-2 text-indigo-200">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Ứng dụng hỗ trợ giảng dạy môn Giáo dục công dân – Tối ưu cho Máy chiếu & Màn hình lớn</span>
        </div>
        <div className="font-semibold text-slate-400">
          Trường TH&THCS Lê Thị Tuyết • Lớp 7A1
        </div>
      </footer>
    </div>
  );
};
