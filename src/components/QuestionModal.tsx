import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Question } from '../data/questions';
import { Student } from '../data/students';
import { soundManager } from '../utils/audio';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Info,
  Award,
  X,
  Volume2,
  VolumeX,
  Gift,
} from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  student?: Student | null;
  studentsList?: Student[];
  isLuckyQuestion?: boolean;
  onSelectStudentForScore?: (studentId: number) => void;
  onAnswerSubmitted: (isCorrect: boolean) => void;
  onNextSpin: () => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  questionIndex,
  totalQuestions,
  student,
  studentsList = [],
  isLuckyQuestion = false,
  onSelectStudentForScore,
  onAnswerSubmitted,
  onNextSpin,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showRevealAnswer, setShowRevealAnswer] = useState<boolean>(false);

  // Timer states (default 20 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isTimerEnabled, setIsTimerEnabled] = useState<boolean>(true);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  // Teacher manual override / mode
  const [teacherMode, setTeacherMode] = useState<boolean>(false);

  // Speech states (reading student name & reading question aloud)
  const [isReadingQuestion, setIsReadingQuestion] = useState<boolean>(false);
  const [autoReadQuestion, setAutoReadQuestion] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vongquay_auto_read_question');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Read question & 4 options aloud handler
  const handleReadQuestion = () => {
    soundManager.stopSpeech();
    setIsReadingQuestion(true);
    soundManager.speakQuestion(question.question, question.id, question.options, () => {
      setIsReadingQuestion(false);
    });
  };

  const handleStopQuestionSpeech = () => {
    soundManager.stopSpeech();
    setIsReadingQuestion(false);
  };

  const handleToggleAutoRead = () => {
    const next = !autoReadQuestion;
    setAutoReadQuestion(next);
    try {
      localStorage.setItem('vongquay_auto_read_question', String(next));
    } catch {
      // ignore
    }
  };

  // Play question bell / lucky fanfare chime & read student name and question aloud when question modal opens
  useEffect(() => {
    if (isLuckyQuestion) {
      soundManager.playGiftCelebration();
    } else {
      soundManager.playQuestionBell();
    }

    // Start countdown sound right from second 20
    const initialTickTimer = setTimeout(() => {
      soundManager.playCountdownTick(false);
    }, 400);

    let hasStartedQuestionSpeech = false;
    let questionTimer: NodeJS.Timeout | null = null;
    let speechTimer: NodeJS.Timeout | null = null;

    const startReadingQuestion = () => {
      if (hasStartedQuestionSpeech) return;
      hasStartedQuestionSpeech = true;
      if (questionTimer) {
        clearTimeout(questionTimer);
        questionTimer = null;
      }
      if (autoReadQuestion) {
        setIsReadingQuestion(true);
        soundManager.speakQuestion(question.question, question.id, question.options, () => {
          setIsReadingQuestion(false);
        });
      }
    };

    // Speech sequence:
    // If lucky question: First speak full lucky question announcement, then read question!
    if (isLuckyQuestion) {
      speechTimer = setTimeout(() => {
        soundManager.speakLuckyAnnouncement(student?.name, student?.id, () => {
          // As soon as lucky announcement finishes naturally (full ~8.7s), read question & options A, B, C, D!
          startReadingQuestion();
        });
      }, 500);

      // Fallback timer: In case audio onended is delayed or fails, wait 15 seconds (full announcement is ~8.7s)
      questionTimer = setTimeout(() => {
        startReadingQuestion();
      }, 15000);
    } else if (student?.name) {
      // Regular question with student: First speak student name, then read question!
      speechTimer = setTimeout(() => {
        soundManager.speakStudentName(student.name, student.id, () => {
          startReadingQuestion();
        });
      }, 450);

      // Fallback timer: In case student audio onended event is delayed, start after 5s
      questionTimer = setTimeout(() => {
        startReadingQuestion();
      }, 5000);
    } else {
      // Direct question mode (no student): read question immediately after a short 500ms chime delay
      questionTimer = setTimeout(() => {
        startReadingQuestion();
      }, 500);
    }

    return () => {
      clearTimeout(initialTickTimer);
      if (speechTimer) clearTimeout(speechTimer);
      if (questionTimer) clearTimeout(questionTimer);
      soundManager.stopSpeech();
      setIsReadingQuestion(false);
    };
  }, [question.id, student?.name, autoReadQuestion, isLuckyQuestion]);

  // Countdown timer effect:
  // Ticks every second from 20s down to 0 ONLY AFTER reading finishes, ensuring students have full 20s!
  useEffect(() => {
    if (!isTimerEnabled || isSubmitted || !isTimerRunning || isTimeOut || isReadingQuestion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsTimeOut(true);
          soundManager.playWrong();
          return 0;
        }

        const nextTime = prev - 1;
        // Bell tick sound played on every second from 20s down to 1s!
        soundManager.playCountdownTick(nextTime <= 4);
        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerEnabled, isSubmitted, isTimerRunning, isTimeOut, isReadingQuestion]);

  // Handle selecting an option
  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;

    soundManager.stopSpeech();
    setIsReadingQuestion(false);

    soundManager.playClick();
    setSelectedOption(opt);
    setIsSubmitted(true);
    setIsTimerRunning(false);

    const isCorrect = opt === question.correctAnswer;

    if (isCorrect) {
      if (isLuckyQuestion) {
        soundManager.playGiftCelebration();
        // Grand triple-burst confetti explosion for Lucky Question victory!
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#EF4444', '#FBBF24'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#F59E0B', '#FBBF24', '#10B981', '#3B82F6'],
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#F59E0B', '#FBBF24', '#10B981', '#EC4899'],
          });
        }, 250);

        // Đọc to kết quả đúng câu hỏi may mắn (100% Offline)
        setTimeout(() => {
          soundManager.speakCorrectAnswer(student?.name, student?.id, true);
        }, 500);
      } else {
        soundManager.playCorrect();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });

        // Đọc to kết quả đúng câu hỏi thường (100% Offline)
        setTimeout(() => {
          soundManager.speakCorrectAnswer(student?.name, student?.id, false);
        }, 400);
      }
    } else {
      soundManager.playWrong();

      // Đọc to kết quả sai và thông báo đáp án đúng (100% Offline)
      setTimeout(() => {
        soundManager.speakWrongAnswer(question.correctAnswer, isLuckyQuestion);
      }, 450);
    }

    onAnswerSubmitted(isCorrect);
  };

  const handleAddExtraTime = () => {
    setTimeLeft(15);
    setIsTimeOut(false);
    setIsTimerRunning(true);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-3xl my-auto rounded-2xl sm:rounded-3xl bg-slate-900 overflow-hidden flex flex-col text-slate-100 transition-all ${
        isLuckyQuestion
          ? 'border-4 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.45)] ring-2 ring-yellow-300/60'
          : 'border-2 border-indigo-500/40 shadow-2xl'
      }`}>
        
        {/* Top Lucky Question Mega Banner */}
        {isLuckyQuestion && (
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-500 py-1.5 px-3 sm:px-4 text-center text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg animate-pulse select-none">
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>⭐ CÂU HỎI MAY MẮN ⭐ TRẢ LỜI ĐÚNG NHẬN 10 ĐIỂM + 1 PHẦN QUÀ TỪ GIÁO VIÊN! 🎁</span>
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
        )}

        {/* Compact Header Bar */}
        <div className={`px-4 sm:px-5 py-2.5 sm:py-3 border-b flex items-center justify-between gap-3 ${
          isLuckyQuestion
            ? 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-amber-500/40'
            : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-indigo-500/30'
        }`}>
          <div className="flex items-center gap-2.5">
            {isLuckyQuestion ? (
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" />
                <span>CÂU {String(questionIndex).padStart(2, '0')} • MAY MẮN 🎁</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-xs sm:text-sm tracking-wide">
                CÂU {String(questionIndex).padStart(2, '0')}/{String(totalQuestions).padStart(2, '0')}
              </span>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-200">
              <span>Học sinh:</span>
              {student ? (
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-sm ${isLuckyQuestion ? 'text-yellow-300' : 'text-amber-300'}`}>{student.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isLuckyQuestion) {
                        soundManager.speakLuckyAnnouncement(student.name, student.id);
                      } else {
                        soundManager.speakStudentName(student.name, student.id);
                      }
                    }}
                    title={isLuckyQuestion ? `Nghe thông báo câu hỏi may mắn cho ${student.name}` : `Đọc tên ${student.name}`}
                    className="p-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-200 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : studentsList.length > 0 && onSelectStudentForScore ? (
                <select
                  onChange={(e) => onSelectStudentForScore(Number(e.target.value))}
                  defaultValue=""
                  className="bg-slate-800 text-amber-300 font-semibold px-2 py-0.5 rounded border border-slate-700 text-xs cursor-pointer focus:outline-none"
                >
                  <option value="" disabled>-- Chọn học sinh ghi điểm --</option>
                  {studentsList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              ) : (
                <span className="font-bold text-amber-300">Toàn lớp 7A1</span>
              )}
            </div>
          </div>

          {/* Timer and Controls */}
          <div className="flex items-center gap-2">
            {isTimerEnabled && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-bold text-xs sm:text-sm border transition-all ${
                  isReadingQuestion
                    ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300'
                    : timeLeft <= 5
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-amber-300'
                }`}
                title={isReadingQuestion ? 'Thời gian 20 giây sẽ đếm ngược sau khi máy đọc xong câu hỏi' : 'Thời gian suy nghĩ'}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{String(timeLeft).padStart(2, '0')}s</span>
                {isReadingQuestion && (
                  <span className="text-[10px] text-indigo-300 font-sans hidden sm:inline">(Đang đọc)</span>
                )}
              </div>
            )}

            {!isSubmitted && (
              <div className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  title={isTimerRunning ? 'Tạm dừng' : 'Tiếp tục'}
                  className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setTimeLeft(20);
                    setIsTimeOut(false);
                    setIsTimerRunning(true);
                  }}
                  title="Đặt lại 20s"
                  className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setTeacherMode(!teacherMode)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                teacherMode
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Chế độ GV nghe HS trả lời rồi bấm chọn"
            >
              GV Bấm
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Content Area (Compact, fits all screens without scrolling) */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center">
          
          {/* Compact Student Celebration Banner */}
          {student && (
            <div className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-400/50 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-center animate-fade-in">
              <span className="text-[11px] sm:text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Chúc mừng bạn đã được chọn vào thử thách:
              </span>
              <span className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 uppercase tracking-wide">
                {student.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (isLuckyQuestion) {
                    soundManager.speakLuckyAnnouncement(student.name, student.id);
                  } else {
                    soundManager.speakStudentName(student.name, student.id);
                  }
                }}
                title={isLuckyQuestion ? "Bấm để máy đọc lại: trúng câu hỏi may mắn, nhận 10 điểm và 1 phần quà từ giáo viên" : "Bấm để máy đọc lại tên học sinh"}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 ml-1 rounded-lg bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/60 text-amber-200 hover:text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{isLuckyQuestion ? 'Đọc thông báo quà GV' : 'Đọc tên'}</span>
              </button>
            </div>
          )}

          <div className="mb-2.5 bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-indigo-500/30 shadow-md">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center justify-between gap-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Thử thách câu hỏi Bài 4: Giữ chữ tín</span>
              </span>

              {/* Read Question Controls */}
              <div className="flex items-center gap-1.5">
                <label 
                  title="Tự động đọc câu hỏi và 4 đáp án mỗi khi mở câu hỏi mới"
                  className="hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/80 border border-slate-700 text-[10px] sm:text-[11px] text-slate-300 cursor-pointer select-none hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={autoReadQuestion}
                    onChange={handleToggleAutoRead}
                    className="w-3 h-3 rounded border-slate-600 text-amber-400 focus:ring-0 cursor-pointer"
                  />
                  <span>Tự đọc</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (isReadingQuestion) {
                      handleStopQuestionSpeech();
                    } else {
                      handleReadQuestion();
                    }
                  }}
                  title={isReadingQuestion ? 'Bấm để dừng đọc câu hỏi và 4 đáp án' : 'Bấm để máy đọc to câu hỏi và toàn bộ 4 đáp án A, B, C, D'}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer border ${
                    isReadingQuestion
                      ? 'bg-amber-500/25 border-amber-400 text-amber-200 animate-pulse ring-1 ring-amber-400/50'
                      : 'bg-indigo-600/35 hover:bg-indigo-600/55 border-indigo-400/60 text-indigo-200 hover:text-white'
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isReadingQuestion ? 'text-amber-300 animate-bounce' : 'text-indigo-300'}`} />
                  <span>{isReadingQuestion ? 'Đang đọc... (Bấm dừng)' : '🔊 Đọc câu hỏi & 4 đáp án'}</span>
                </button>
              </div>
            </div>

            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug drop-shadow-sm">
              {question.question}
            </h3>
          </div>

          {/* Timeout Alert */}
          {isTimeOut && !isSubmitted && (
            <div className="mb-2 p-2 rounded-xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-between gap-2 text-amber-200 text-xs">
              <span className="font-bold">ĐÃ HẾT 20 GIÂY!</span>
              <div className="flex gap-2">
                <button
                  onClick={handleAddExtraTime}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  +15s
                </button>
                <button
                  onClick={() => setShowRevealAnswer(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-xs"
                >
                  Hiện đáp án
                </button>
              </div>
            </div>
          )}

          {/* 4 Options Grid (2 Columns, Tight & Clean) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {(['A', 'B', 'C', 'D'] as const).map(letter => {
              const optionText = question.options[letter];
              const isSelected = selectedOption === letter;
              const isActualCorrect = letter === question.correctAnswer;

              let cardStyle =
                'bg-slate-800/80 border-slate-700/80 hover:border-amber-400/60 hover:bg-slate-800 text-slate-100 shadow-sm';
              let badgeStyle = 'bg-slate-700 border-slate-600 text-slate-200';

              if (isSubmitted || showRevealAnswer) {
                if (isActualCorrect) {
                  cardStyle =
                    'bg-emerald-950/80 border-2 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-black border-emerald-300';
                } else if (isSelected && !isActualCorrect) {
                  cardStyle =
                    'bg-rose-950/80 border-2 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(239,68,68,0.25)]';
                  badgeStyle = 'bg-rose-500 text-white font-black border-rose-400';
                } else {
                  cardStyle = 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60';
                  badgeStyle = 'bg-slate-800 border-slate-700 text-slate-500';
                }
              }

              return (
                <div
                  key={letter}
                  onClick={() => {
                    if (!isSubmitted || teacherMode) {
                      handleSelectOption(letter);
                    }
                  }}
                  className={`text-left p-2 sm:p-2.5 rounded-xl border transition-all flex items-start gap-2 cursor-pointer group ${cardStyle}`}
                >
                  {/* Option Badge */}
                  <div
                    className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg border flex items-center justify-center font-black text-xs group-hover:scale-105 ${badgeStyle}`}
                  >
                    {letter}
                  </div>

                  {/* Option Text */}
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-snug pt-0.5">
                    {optionText}
                  </div>

                  {/* Individual Option Speaker Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.speakOption(letter, optionText);
                    }}
                    title={`Bấm để nghe đọc đáp án ${letter}`}
                    className="shrink-0 p-1 rounded-md bg-slate-700/60 hover:bg-amber-500/30 text-slate-300 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Status Indicator */}
                  {(isSubmitted || showRevealAnswer) && isActualCorrect && (
                    <div className="shrink-0 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {isSubmitted && isSelected && !isActualCorrect && (
                    <div className="shrink-0 text-rose-400">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Compact Result Feedback */}
          {isSubmitted && (
            <div
              className={`mt-3 p-3.5 rounded-2xl border flex flex-col gap-2.5 text-xs sm:text-sm animate-fade-in ${
                isCorrect
                  ? isLuckyQuestion
                    ? 'bg-gradient-to-r from-amber-950/95 via-yellow-950/90 to-amber-950/95 border-2 border-amber-400 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.35)] ring-1 ring-yellow-300'
                    : 'bg-emerald-950/70 border-emerald-400 text-emerald-100 shadow-sm'
                  : 'bg-rose-950/60 border-rose-500 text-rose-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {isCorrect ? (
                    isLuckyQuestion ? (
                      <div className="w-9 h-9 rounded-xl bg-amber-500/25 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0 shadow-sm animate-bounce">
                        <Gift className="w-5 h-5 text-yellow-300" />
                      </div>
                    ) : (
                      <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                    )
                  ) : (
                    <HelpCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-black text-sm sm:text-base flex items-center gap-2">
                      {isCorrect ? (
                        isLuckyQuestion ? (
                          <span className="text-yellow-300 flex items-center gap-1.5 drop-shadow">
                            <span>🎁 XUẤT SẮC TRẢ LỜI ĐÚNG CÂU HỎI MAY MẮN! (+10 ĐIỂM)</span>
                          </span>
                        ) : (
                          'CHÍNH XÁC! (+10 ĐIỂM)'
                        )
                      ) : (
                        'CHƯA CHÍNH XÁC!'
                      )}
                    </div>
                    <div className="opacity-95 text-xs sm:text-sm mt-0.5">
                      {isCorrect ? (
                        isLuckyQuestion ? (
                          <span className="text-amber-200 font-medium">
                            {student ? `Chúc mừng em ${student.name} đã được ` : 'Chúc mừng học sinh đã được '}
                            <strong className="text-yellow-300 font-extrabold">10 ĐIỂM</strong> và nhận{' '}
                            <strong className="text-amber-300 font-extrabold underline decoration-wavy">1 PHẦN QUÀ TỪ GIÁO VIÊN</strong>! 🎉🎁
                          </span>
                        ) : (
                          student ? `${student.name} đã làm rất tốt!` : 'Lớp 7A1 đã trả lời đúng!'
                        )
                      ) : (
                        isLuckyQuestion
                          ? `Rất tiếc câu hỏi may mắn chưa đúng, chúc em may mắn ở lượt quay sau! Đáp án đúng là ${question.correctAnswer}.`
                          : `Đáp án đúng là ${question.correctAnswer}.`
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCorrect) {
                        soundManager.speakCorrectAnswer(student?.name, student?.id, isLuckyQuestion);
                      } else {
                        soundManager.speakWrongAnswer(question.correctAnswer, isLuckyQuestion);
                      }
                    }}
                    title="Bấm để máy đọc lại lời khen hoặc đáp án"
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Đọc lại</span>
                  </button>

                  {question.explanation && (
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      {showExplanation ? 'Ẩn giải thích' : 'Xem giải thích'}
                    </button>
                  )}
                </div>
              </div>

              {/* Special Teacher Gift Reminder Banner */}
              {isCorrect && isLuckyQuestion && (
                <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-between gap-2 text-xs sm:text-sm text-yellow-200 shadow-inner">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>
                      <strong>Giáo viên:</strong> Xin mời Thầy/Cô trao phần quà khen thưởng cho em{' '}
                      <strong className="text-white underline">{student?.name || 'học sinh'}</strong>! 🎁
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs shrink-0 shadow-md">
                    +1 PHẦN QUÀ
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Compact Explanation Box */}
          {showExplanation && question.explanation && (
            <div className="mt-2 p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-100 text-xs leading-relaxed">
              <strong className="text-amber-300">Ý nghĩa: </strong>
              {question.explanation}
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
          {!isSubmitted && (
            <button
              onClick={() => setShowRevealAnswer(!showRevealAnswer)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showRevealAnswer ? 'Ẩn đáp án' : 'GV xem đáp án'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onNextSpin();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>QUAY TIẾP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
