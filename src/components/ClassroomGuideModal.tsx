import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Monitor,
  WifiOff,
  Maximize2,
  Volume2,
  Sparkles,
  Download,
  Share2,
  ArrowRight
} from 'lucide-react';

interface ClassroomGuideModalProps {
  onClose: () => void;
}

export const ClassroomGuideModal: React.FC<ClassroomGuideModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const appUrl = 'https://ais-pre-wzjzn565wyqao45jcyyg4d-453075460569.asia-southeast1.run.app';

  const handleCopyLink = () => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = appUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenNewTab = () => {
    soundManager.playClick();
    window.open(appUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/95 to-slate-900 border-2 border-amber-400/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 sm:p-7 text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400">
                <Monitor className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                HƯỚNG DẪN MỞ DẠY CHIỀU NAY TRÊN LỚP
              </h3>
              <p className="text-xs text-amber-300/90 font-medium">
                Dành cho Thầy/Cô Lớp 7A1 • Đơn giản, dễ hiểu, làm được ngay
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1 text-sm text-slate-200 leading-relaxed custom-scrollbar flex-1">
          
          {/* Important Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Thầy/Cô không cần tải phần mềm hay cài đặt gì phức tạp cả!</strong>
              Ứng dụng đã được đưa lên mạng và sẵn sàng 100%. Thầy/Cô chỉ cần mở bằng đường link trên máy tính máy chiếu là dạy được ngay.
            </div>
          </div>

          {/* Section 1: DOWNLOAD FILE DIRECTLY (Recommended - 100% works without accounts or internet) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-950/70 to-slate-900 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="flex items-center gap-2 text-emerald-300 font-black text-sm sm:text-base mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">★</span>
              <span>CÁCH 1 (KHUYÊN DÙNG NHẤT): TẢI FILE VỀ MÁY / GỬI TỆP QUA ZALO</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 mb-3 leading-relaxed">
              Đây là cách <strong>chắc chắn 100% mở được ở mọi máy tính</strong> mà không cần tài khoản, không lo bị Zalo chặn link, và không cần mạng internet:
            </p>

            {/* Big Download Button */}
            <div className="my-3 flex flex-col items-center">
              <a
                href="/VongQuay_Lop7A1.html"
                download="VongQuay_Lop7A1.html"
                onClick={() => soundManager.playClick()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer text-center"
              >
                <Download className="w-5 h-5 text-slate-950" />
                <span>BẤM VÀO ĐÂY ĐỂ TẢI FILE VỀ MÁY (.HTML)</span>
              </a>
              <span className="text-[11px] text-emerald-300/80 mt-1.5 italic">
                (Tệp nhẹ chưa tới 1MB, chứa đầy đủ 39 học sinh + 28 câu hỏi + chuông 20s)
              </span>
            </div>

            {/* Step by step for file */}
            <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-emerald-500/30 mt-3">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">• Bước 1:</span>
                <span>Bấm nút <strong>"BẤM VÀO ĐÂY ĐỂ TẢI FILE VỀ MÁY"</strong> ở trên. File <code>VongQuay_Lop7A1.html</code> sẽ tải về máy tính (thư mục <em>Downloads / Tải về</em>).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">• Bước 2:</span>
                <span>Mở Zalo lên, chọn nút <strong>Gửi tệp tin</strong> (hình kẹp giấy) hoặc kéo file vừa tải thả vào ô chat Zalo (mục <em>Cloud của tôi</em>). Hoặc Thầy/Cô chép file vào USB.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">• Bước 3:</span>
                <span>Chiều nay lên lớp, mở máy tính lớp học lên ➔ Mở file đó trong Zalo hoặc từ USB ➔ Nhấp đúp chuột là file tự mở bằng Google Chrome hoặc Cốc Cốc, chạy mượt mà ngay lập tức!</span>
              </div>
            </div>
          </div>

          {/* Section 2: Explanation about Zalo link issue */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
            <strong className="block font-bold text-amber-300 mb-1">
              ⚠️ Vì sao Thầy/Cô gửi đường link qua Zalo bấm vào lại không đúng?
            </strong>
            <p className="leading-relaxed text-slate-300 text-xs">
              Vì Zalo sử dụng trình duyệt nội bộ trên điện thoại và hệ thống máy chủ Google chặn mở qua trình duyệt nhỏ của Zalo. Do đó, <strong>gửi tệp file <code>VongQuay_Lop7A1.html</code> qua Zalo</strong> (như gửi file Word / PowerPoint) là cách tốt nhất, không bao giờ bị lỗi!
            </p>
          </div>

          {/* Section 2: Create desktop shortcut */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-indigo-500/40">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">2</span>
              <span>CÁCH TẠO BIỂU TƯỢNG (ICON) NGOÀI MÀN HÌNH ĐỂ BẤM LÀ MỞ NGAY:</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              Nếu Thầy/Cô dùng Laptop cá nhân mang đến lớp, có thể tạo biểu tượng ngoài màn hình Desktop như một phần mềm:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 pl-1">
              <li>Khi đang mở trang web trên <strong>Google Chrome</strong> hoặc <strong>Cốc Cốc</strong>.</li>
              <li>Bấm vào dấu <strong>3 chấm (⋮)</strong> ở góc trên cùng bên phải trình duyệt.</li>
              <li>Chọn <strong>"Lưu và chia sẻ"</strong> (hoặc <em>Công cụ khác</em>) ➔ Chọn <strong>"Tạo lối tắt..." (Create shortcut)</strong>.</li>
              <li>Tích chọn <em>"Mở dưới dạng cửa sổ"</em> ➔ Bấm <strong>Tạo</strong>.</li>
            </ol>
            <p className="text-[11px] text-indigo-200 mt-2 italic">
              ➜ Ngay lập tức trên màn hình máy tính sẽ có biểu tượng "Vòng Quay May Mắn 7A1", bấm đúp chuột vào là mở dạy ngay!
            </p>
          </div>

          {/* Section 3: In case classroom has no internet */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm mb-2">
              <WifiOff className="w-5 h-5 text-rose-400 shrink-0" />
              <span>NẾU PHÒNG HỌC KHÔNG CÓ MẠNG INTERNET (OFFLINE):</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Cách đơn giản nhất:</strong> Thầy/Cô dùng điện thoại di động bật <strong>"Điểm phát sóng di động (Phát Wifi 4G)"</strong> trong khoảng 10 giây để máy tính lớp học kết nối và tải trang web một lần. Sau khi trang đã tải xong, vòng quay và câu hỏi sẽ hoạt động suốt cả buổi dạy mà <em>không hề tốn dung lượng</em>!
              </p>
              <p>
                <strong>Cách lưu trang web:</strong> Khi đang ở nhà có mạng, mở trang web trên Chrome, nhấn phím <strong>Ctrl + S</strong> (Lưu trang web), chọn lưu vào USB. Chiều đến lớp chỉ cần cắm USB và nhấp đúp vào file đó để mở bằng Chrome.
              </p>
            </div>
          </div>

          {/* Tips for teaching */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-400/30 flex flex-col gap-2 text-xs">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Mẹo nhỏ khi trình chiếu trên lớp chiều nay:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl">
                <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Bật loa máy tính:</strong> Để cả lớp nghe chuông đếm ngược 20 giây và âm thanh chúc mừng sống động.</span>
              </div>
              <div className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl">
                <Maximize2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Bấm phím F11:</strong> Giúp vòng quay phóng to tràn viền máy chiếu như trên gameshow truyền hình.</span>
              </div>
            </div>
          </div>

          {/* Test Voice Section */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-400/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-amber-300 text-xs sm:text-sm">Giọng đọc xướng tên học sinh Tiếng Việt chuẩn:</div>
                <div className="text-[11px] text-slate-300">Đã cập nhật giọng chuẩn trong trẻo, đọc đúng chuẩn từng tên học sinh 7A1!</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => soundManager.speakStudentName("Võ Công Bửu Ân", 1)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bấm nghe thử giọng mẫu</span>
            </button>
          </div>

        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleCopyLink}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép link!' : 'Sao chép link ngay'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Đã hiểu, sẵn sàng dạy học!
          </button>
        </div>

      </div>
    </div>
  );
};
