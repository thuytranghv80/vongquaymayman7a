/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_STUDENTS, Student } from './data/students';
import { QUESTIONS_BANK, Question } from './data/questions';
import { ScreenMode, StageTheme } from './types';
import { soundManager } from './utils/audio';

import { WelcomeScreen } from './components/WelcomeScreen';
import { WheelCanvas } from './components/WheelCanvas';
import { QuestionModal } from './components/QuestionModal';
import { ScoreBoardModal } from './components/ScoreBoardModal';
import { TeacherBankModal } from './components/TeacherBankModal';
import { InstructionsModal } from './components/InstructionsModal';
import { QuickQuestionGrid } from './components/QuickQuestionGrid';
import { ClassroomGuideModal } from './components/ClassroomGuideModal';

import {
  Volume2,
  VolumeX,
  Trophy,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Maximize2,
  Minimize2,
  Users,
  CheckCircle2,
  Sparkles,
  Home,
  Monitor,
  Download,
  Palette,
  ChevronDown,
  Check,
  Gift,
  HelpCircle as QuestionIcon
} from 'lucide-react';

export interface ThemeDefinition {
  id: StageTheme;
  name: string;
  shortName: string;
  icon: string;
  dotColor: string;
  badge: string;
  bgClass: string;
  glowClass: string;
  spotlightLeft: string;
  spotlightRight: string;
  headerBg: string;
  headerBorder: string;
  footerBg: string;
  footerBorder: string;
  sloganColor: string;
  themeButtonClass: string;
}

export const THEMES: Record<StageTheme, ThemeDefinition> = {
  'royal-blue': {
    id: 'royal-blue',
    name: 'Sân Khấu Xanh Hoàng Gia & Ánh Vàng',
    shortName: 'Xanh Hoàng Gia',
    icon: '👑',
    dotColor: 'bg-blue-500',
    badge: 'bg-blue-500/20 text-blue-200 border-blue-400/40',
    bgClass: 'bg-gradient-to-b from-[#0a1846] via-[#0e276b] to-[#071330]',
    glowClass: 'bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.28)_0%,_rgba(37,99,235,0.26)_40%,_transparent_72%)]',
    spotlightLeft: 'bg-gradient-to-b from-amber-300/35 via-blue-400/20 to-transparent',
    spotlightRight: 'bg-gradient-to-b from-yellow-300/35 via-indigo-400/20 to-transparent',
    headerBg: 'bg-[#0a1945]/90 backdrop-blur-md',
    headerBorder: 'border-blue-400/30',
    footerBg: 'bg-[#060f29]/90 backdrop-blur-md',
    footerBorder: 'border-blue-900/50',
    sloganColor: 'text-amber-300',
    themeButtonClass: 'bg-blue-950/80 hover:bg-blue-900 border-blue-400/40 text-blue-200',
  },
  'ruby-gold': {
    id: 'ruby-gold',
    name: 'Sân Khấu Đỏ Lễ Hội Rực Rỡ',
    shortName: 'Đỏ Lễ Hội',
    icon: '🏮',
    dotColor: 'bg-rose-500',
    badge: 'bg-red-500/20 text-rose-200 border-rose-400/40',
    bgClass: 'bg-gradient-to-b from-[#460b16] via-[#6f1224] to-[#26050c]',
    glowClass: 'bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.32)_0%,_rgba(225,29,72,0.28)_40%,_transparent_72%)]',
    spotlightLeft: 'bg-gradient-to-b from-amber-300/35 via-rose-400/20 to-transparent',
    spotlightRight: 'bg-gradient-to-b from-yellow-300/35 via-red-400/20 to-transparent',
    headerBg: 'bg-[#350710]/90 backdrop-blur-md',
    headerBorder: 'border-rose-400/30',
    footerBg: 'bg-[#1e0409]/90 backdrop-blur-md',
    footerBorder: 'border-rose-900/50',
    sloganColor: 'text-amber-200',
    themeButtonClass: 'bg-rose-950/80 hover:bg-rose-900 border-rose-400/40 text-rose-200',
  },
  'emerald': {
    id: 'emerald',
    name: 'Sân Khấu Xanh Ngọc Bích Tri Thức',
    shortName: 'Xanh Ngọc Bích',
    icon: '🍃',
    dotColor: 'bg-emerald-500',
    badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    bgClass: 'bg-gradient-to-b from-[#053628] via-[#09523e] to-[#032118]',
    glowClass: 'bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.28)_0%,_rgba(16,185,129,0.28)_40%,_transparent_72%)]',
    spotlightLeft: 'bg-gradient-to-b from-amber-300/35 via-emerald-400/20 to-transparent',
    spotlightRight: 'bg-gradient-to-b from-teal-300/35 via-emerald-400/20 to-transparent',
    headerBg: 'bg-[#04281e]/90 backdrop-blur-md',
    headerBorder: 'border-emerald-400/30',
    footerBg: 'bg-[#021812]/90 backdrop-blur-md',
    footerBorder: 'border-emerald-900/50',
    sloganColor: 'text-emerald-200',
    themeButtonClass: 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-400/40 text-emerald-200',
  },
  'cosmic': {
    id: 'cosmic',
    name: 'Vũ Trụ Sao Lung Linh Tri Thức',
    shortName: 'Vũ Trụ Sao',
    icon: '🌌',
    dotColor: 'bg-purple-500',
    badge: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
    bgClass: 'bg-gradient-to-b from-[#18103d] via-[#281559] to-[#0e0926]',
    glowClass: 'bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.28)_0%,_rgba(99,102,241,0.30)_40%,_transparent_72%)]',
    spotlightLeft: 'bg-gradient-to-b from-pink-300/35 via-purple-400/20 to-transparent',
    spotlightRight: 'bg-gradient-to-b from-cyan-300/35 via-indigo-400/20 to-transparent',
    headerBg: 'bg-[#120a30]/90 backdrop-blur-md',
    headerBorder: 'border-purple-400/30',
    footerBg: 'bg-[#0a061d]/90 backdrop-blur-md',
    footerBorder: 'border-purple-900/50',
    sloganColor: 'text-amber-300',
    themeButtonClass: 'bg-purple-950/80 hover:bg-purple-900 border-purple-400/40 text-purple-200',
  },
};

export default function App() {
  // Navigation mode ('welcome' | 'wheel')
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('welcome');

  // Stage theme for the lucky wheel screen (persisted in localStorage)
  const [stageTheme, setStageTheme] = useState<StageTheme>(() => {
    try {
      const saved = localStorage.getItem('wheel_stage_theme');
      if (saved && (saved === 'royal-blue' || saved === 'ruby-gold' || saved === 'emerald' || saved === 'cosmic')) {
        return saved as StageTheme;
      }
    } catch {
      // ignore
    }
    return 'royal-blue';
  });

  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);

  const activeTheme = THEMES[stageTheme] || THEMES['royal-blue'];

  const handleSelectTheme = (newTheme: StageTheme) => {
    setStageTheme(newTheme);
    try {
      localStorage.setItem('wheel_stage_theme', newTheme);
    } catch {
      // ignore
    }
    setShowThemeMenu(false);
    soundManager.playClick();
  };

  // Master Audio state
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Fullscreen state for classroom projector
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 39 Students of Class 7A1
  const [students, setStudents] = useState<Student[]>(() => {
    return INITIAL_STUDENTS.map(s => ({
      ...s,
      participated: false,
      correctAnswers: 0,
      score: 0,
    }));
  });

  // Settings
  const [allowRepeatStudents, setAllowRepeatStudents] = useState<boolean>(false);
  const [showQuickGrid, setShowQuickGrid] = useState<boolean>(false);

  // Question bank state (28 questions)
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());

  // Active spin state
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);

  // Lucky Question Turn Tracking:
  // Quy tắc: Cứ sau 2 bạn trả lời (lượt 1 & 2), bạn thứ 3 là Câu hỏi may mắn!
  const [answeredStudentCount, setAnsweredStudentCount] = useState<number>(0);
  const [forceLuckyNext, setForceLuckyNext] = useState<boolean>(false);
  const [isCurrentQuestionLucky, setIsCurrentQuestionLucky] = useState<boolean>(false);

  // 0: lượt 1 (thường), 1: lượt 2 (thường), 2: lượt 3 (CÂU HỎI MAY MẮN)
  const luckyTurnStep = (answeredStudentCount % 3);
  const isNextTurnLucky = forceLuckyNext || (luckyTurnStep === 2);

  // Secondary Modals
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [showTeacherBank, setShowTeacherBank] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showClassroomGuide, setShowClassroomGuide] = useState<boolean>(false);
  const [showClassCompletedNotice, setShowClassCompletedNotice] = useState<boolean>(false);

  // Sync sound muted
  const handleToggleSound = useCallback(() => {
    const isMuted = soundManager.toggleMute();
    setSoundMuted(isMuted);
  }, []);

  // Fullscreen toggle & change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Remaining eligible students
  const eligibleStudents = useMemo(() => {
    if (allowRepeatStudents) return students;
    return students.filter(s => !s.participated);
  }, [students, allowRepeatStudents]);

  /**
   * CORE FLOW:
   * Khi vòng quay dừng lại đúng tên 1 học sinh bất kỳ:
   * -> Xác định câu hỏi may mắn (cứ sau 2 bạn trả lời, bạn thứ 3 là câu hỏi may mắn)
   * -> Chọn ngẫu nhiên ngay 1 câu hỏi trong 28 câu chưa dùng
   * -> Mở ngay lập tức màn hình câu hỏi & đáp án có tên học sinh đó!
   */
  const handleSelectStudent = (chosenStudent: Student) => {
    setSelectedStudent(chosenStudent);

    // Kiểm tra câu hỏi may mắn (cứ sau 2 bạn trả lời thì bạn thứ 3 là câu may mắn)
    const isLucky = forceLuckyNext || (answeredStudentCount % 3 === 2);
    setIsCurrentQuestionLucky(isLucky);
    if (forceLuckyNext) setForceLuckyNext(false);

    // Pick a random unused question among the 28 questions
    const availableQuestions = QUESTIONS_BANK.filter(q => !usedQuestionIds.has(q.id));
    let nextQuestion: Question;

    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      nextQuestion = availableQuestions[randomIndex];
    } else {
      // If all 28 questions have been used, pick randomly from full bank
      const randomIndex = Math.floor(Math.random() * QUESTIONS_BANK.length);
      nextQuestion = QUESTIONS_BANK[randomIndex];
    }

    setActiveQuestion(nextQuestion);
    // Open the question modal immediately without any intermediate click!
    setShowQuestionModal(true);
  };

  // When answer is submitted
  const handleAnswerSubmitted = (isCorrect: boolean) => {
    if (!activeQuestion) return;

    // Mark question as used
    setUsedQuestionIds(prev => new Set(prev).add(activeQuestion.id));

    // Update student score, gifts and status
    if (selectedStudent) {
      const wonGift = isCurrentQuestionLucky && isCorrect;

      setStudents(prev =>
        prev.map(s => {
          if (s.id === selectedStudent.id) {
            return {
              ...s,
              participated: true,
              correctAnswers: isCorrect ? s.correctAnswers + 1 : s.correctAnswers,
              score: isCorrect ? s.score + 10 : s.score,
              teacherGiftsCount: wonGift
                ? (s.teacherGiftsCount || 0) + 1
                : (s.teacherGiftsCount || 0),
            };
          }
          return s;
        })
      );

      // Check if all students completed
      const remainingAfterThis = students.filter(
        s => !s.participated && s.id !== selectedStudent.id
      );
      if (remainingAfterThis.length === 0 && !allowRepeatStudents) {
        setTimeout(() => {
          setShowClassCompletedNotice(true);
        }, 1500);
      }
    }

    // Tăng số lượt đã trả lời để chu kỳ 3 bạn (2 thường -> 1 may mắn) tiếp tục xoay vòng!
    setAnsweredStudentCount(prev => prev + 1);
  };

  // Close question modal and return to wheel ready for next spin
  const handleNextSpin = () => {
    soundManager.stopSpeech();
    setShowQuestionModal(false);
    setActiveQuestion(null);
    setSelectedStudent(null);
    setIsCurrentQuestionLucky(false);
  };

  // Direct select question if teacher wants to test a specific question
  const handleDirectSelectQuestion = (q: Question) => {
    const isLucky = forceLuckyNext || (answeredStudentCount % 3 === 2);
    setIsCurrentQuestionLucky(isLucky);
    if (forceLuckyNext) setForceLuckyNext(false);
    setActiveQuestion(q);
    setShowQuestionModal(true);
  };

  // Teacher manual adjustment for gifts in scoreboard
  const handleUpdateGifts = (studentId: number, delta: number) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const nextCount = Math.max(0, (s.teacherGiftsCount || 0) + delta);
          return { ...s, teacherGiftsCount: nextCount };
        }
        return s;
      })
    );
  };

  // Rename a student
  const handleRenameStudent = (studentId: number, newName: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, name: newName } : s))
    );
  };

  // Add a new student
  const handleAddStudent = (name: string) => {
    setStudents(prev => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 1,
        name,
        participated: false,
        correctAnswers: 0,
        score: 0,
      },
    ]);
  };

  // Reset student participation list
  const handleResetStudents = () => {
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        participated: false,
      }))
    );
    setShowClassCompletedNotice(false);
  };

  // Reset scores and participants completely
  const handleResetScores = () => {
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        participated: false,
        correctAnswers: 0,
        score: 0,
      }))
    );
  };

  // Adjust score manually (+/- 10)
  const handleUpdateScore = (studentId: number, delta: number) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const newScore = Math.max(0, s.score + delta);
          return {
            ...s,
            score: newScore,
            correctAnswers: delta > 0 ? s.correctAnswers + 1 : Math.max(0, s.correctAnswers - 1),
          };
        }
        return s;
      })
    );
  };

  // Toggle individual participated
  const handleToggleParticipated = (studentId: number) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, participated: !s.participated } : s))
    );
  };

  // Reset question pool for a new round
  const handleResetQuestions = () => {
    setUsedQuestionIds(new Set());
  };

  return (
    <div className={`min-h-screen ${activeTheme.bgClass} text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between transition-colors duration-500`}>
      
      {/* 1. Màn hình Chào Mừng */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onStartGame={() => setCurrentScreen('wheel')}
          onOpenInstructions={() => setShowInstructions(true)}
          onOpenScoreboard={() => setShowScoreboard(true)}
          onOpenQuestionBank={() => setShowTeacherBank(true)}
          onOpenClassroomGuide={() => setShowClassroomGuide(true)}
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* 2. Màn hình Vòng Quay May Mắn 39 Học Sinh (Sân khấu rực rỡ, không màn đen, vừa khít 1 màn hình) */}
      {currentScreen === 'wheel' && (
        <div className={`relative h-screen max-h-screen h-[100dvh] flex flex-col justify-between ${activeTheme.bgClass} overflow-hidden select-none transition-colors duration-500`}>
          
          {/* Top Stage Bar */}
          <header className={`relative z-30 w-full px-2.5 sm:px-4 py-1.5 sm:py-2 ${activeTheme.headerBg} border-b ${activeTheme.headerBorder} flex items-center justify-between gap-2 shadow-lg shrink-0 transition-colors duration-500`}>
            
            {/* Left: Brand & Home Button */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentScreen('welcome');
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white border border-white/10 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                title="Về màn hình chính"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Trang Chủ</span>
              </button>

              <div className="h-5 w-px bg-white/10 hidden sm:block shrink-0" />

              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm md:text-base font-black text-amber-300 leading-normal py-0.5 truncate drop-shadow-sm flex items-center gap-1">
                  <span className="text-yellow-300">VÒNG QUAY MAY MẮN</span>
                  <span className="text-amber-400 font-extrabold">– LỚP 7A1</span>
                </h1>
                <p className="text-[10px] sm:text-xs text-indigo-200/80 font-medium truncate">
                  Trường TH&THCS Lê Thị Tuyết • Bài 4: Giữ chữ tín ({students.length} học sinh)
                </p>
              </div>
            </div>

            {/* Right: Quick actions for teacher */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Theme Selector Popover / Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setShowThemeMenu(!showThemeMenu);
                  }}
                  className={`px-2 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${activeTheme.themeButtonClass}`}
                  title="Đổi màu nền sân khấu (Xanh Hoàng Gia / Đỏ Lễ Hội / Xanh Ngọc / Vũ Trụ)"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Nền:</span>
                  <span className="truncate max-w-[85px] sm:max-w-none">{activeTheme.shortName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-300" />
                </button>

                {/* Dropdown Menu */}
                {showThemeMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowThemeMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 z-50 w-64 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl p-2 backdrop-blur-xl text-xs space-y-1">
                      <div className="px-2.5 py-1.5 text-[11px] font-bold text-amber-300/90 uppercase tracking-wider">
                        🎨 Chọn màu nền sân khấu:
                      </div>
                      {(Object.keys(THEMES) as StageTheme[]).map(themeKey => {
                        const theme = THEMES[themeKey];
                        const isSelected = stageTheme === themeKey;
                        return (
                          <button
                            key={themeKey}
                            onClick={() => handleSelectTheme(themeKey)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 text-yellow-300 border border-amber-400/40 font-bold'
                                : 'hover:bg-slate-800 text-slate-300 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{theme.icon}</span>
                              <div>
                                <div className="font-bold text-xs">{theme.name}</div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-yellow-300" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Scoreboard button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowScoreboard(true);
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="hidden sm:inline">Bảng Điểm</span>
              </button>

              {/* Classroom Guide / Link */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowClassroomGuide(true);
                }}
                className="hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all items-center gap-1.5 cursor-pointer"
                title="Hướng dẫn mở dạy"
              >
                <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Chiếu Dạy</span>
              </button>

              {/* Direct Download HTML */}
              <a
                href="/VongQuay_Lop7A1.html"
                download="VongQuay_Lop7A1.html"
                onClick={() => soundManager.playClick()}
                className="px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Tải file VongQuay_Lop7A1.html về máy (Dùng offline / gửi Zalo)"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
                <span className="hidden sm:inline">Tải File</span>
              </a>

              {/* Question Bank button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowTeacherBank(true);
                }}
                className="hidden lg:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-slate-300 text-xs sm:text-sm font-semibold transition-colors items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                <span>28 Câu ({usedQuestionIds.size}/28)</span>
              </button>

              {/* Instructions */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowInstructions(true);
                }}
                className="p-1.5 sm:p-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Hướng dẫn cách chơi"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className="p-1.5 sm:p-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {soundMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 rounded-xl bg-black/40 hover:bg-black/60 text-amber-300 hover:text-white border border-amber-400/40 transition-colors cursor-pointer flex items-center gap-1"
                title={isFullscreen ? 'Thu nhỏ màn hình (F11)' : 'Toàn màn hình máy chiếu F11 (vừa khít 1 màn hình)'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span className="text-[10px] font-bold hidden sm:inline">{isFullscreen ? 'F11' : 'Toàn màn hình'}</span>
              </button>
            </div>
          </header>

          {/* Main Stage: Wheel - Guaranteed to fit 100% inside 1 viewport height without scrollbar */}
          <main className={`relative flex-1 flex flex-col items-center justify-center px-2 py-0.5 sm:py-1 min-h-0 ${showQuickGrid ? 'overflow-y-auto' : 'overflow-hidden'}`}>
            
            {/* Stage Spotlights & Radiant Atmosphere Backdrop */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {/* Left theater spotlight beam */}
              <div className={`absolute -top-12 left-[12%] w-72 sm:w-96 h-[85vh] ${activeTheme.spotlightLeft} transform -rotate-[22deg] origin-top filter blur-2xl opacity-75 pointer-events-none transition-all duration-700`} />
              {/* Right theater spotlight beam */}
              <div className={`absolute -top-12 right-[12%] w-72 sm:w-96 h-[85vh] ${activeTheme.spotlightRight} transform rotate-[22deg] origin-top filter blur-2xl opacity-75 pointer-events-none transition-all duration-700`} />
              {/* Glowing radial aura behind the wheel */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,900px)] h-[min(92vw,900px)] rounded-full ${activeTheme.glowClass} filter blur-3xl pointer-events-none transition-all duration-700`} />
              
              {/* Celebratory golden stars and sparkles floating on the stage */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-6 left-1/5 animate-pulse text-yellow-300 text-lg">✦</div>
                <div className="absolute top-1/4 right-1/6 animate-pulse text-amber-200 text-xl delay-300">★</div>
                <div className="absolute bottom-1/5 left-1/6 animate-pulse text-yellow-400 text-base delay-700">✦</div>
                <div className="absolute bottom-1/3 right-1/5 animate-pulse text-amber-300 text-lg delay-500">★</div>
                <div className="absolute top-1/2 left-1/12 animate-pulse text-yellow-200 text-sm delay-1000">✦</div>
                <div className="absolute top-2/3 right-1/12 animate-pulse text-amber-300 text-sm delay-200">★</div>
              </div>
            </div>

            {/* Status Information & Lucky Question Tracker */}
            <div className="relative z-10 mb-0.5 sm:mb-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs shrink-0 select-none">
              <span className="text-slate-200/90 flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Chưa quay:</span>
                <strong className="text-yellow-300 font-bold">{eligibleStudents.length}</strong>/{students.length} bạn
              </span>
              <span className="text-slate-400/50 hidden xs:inline">•</span>
              <span className="text-slate-200/90 flex items-center gap-1.5 font-medium text-[11px] sm:text-xs">
                <QuestionIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đã trả lời:</span>
                <strong className="text-emerald-300 font-bold">{usedQuestionIds.size}</strong>/28 câu
              </span>
              <span className="text-slate-400/50 hidden xs:inline">•</span>

              {/* Interactive Lucky Question Cycle Indicator */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setForceLuckyNext(prev => !prev);
                }}
                title="Quy tắc: Cứ sau 2 bạn trả lời câu hỏi, bạn thứ 3 là CÂU HỎI MAY MẮN (Nhận 10 điểm + Quà GV). Bấm vào đây để bật/tắt câu may mắn ngay cho lượt tiếp theo!"
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border cursor-pointer transition-all ${
                  isNextTurnLucky
                    ? 'bg-gradient-to-r from-amber-500/35 via-rose-500/25 to-amber-500/35 border-amber-400 text-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.35)] animate-pulse'
                    : 'bg-black/40 border-white/10 text-slate-300 hover:border-amber-400/40 hover:text-white'
                }`}
              >
                <Gift className={`w-3.5 h-3.5 ${isNextTurnLucky ? 'text-yellow-300 animate-bounce' : 'text-amber-400/70'}`} />
                <span className="text-[11px] font-semibold">
                  {isNextTurnLucky ? (
                    <span className="font-extrabold text-yellow-300">
                      LƯỢT NÀY: CÂU HỎI MAY MẮN! 🎁
                    </span>
                  ) : (
                    <span>
                      Tiến độ: Lượt {luckyTurnStep + 1}/3 {luckyTurnStep === 1 ? '(Lượt sau là May Mắn!)' : '(Câu thường)'}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1 ml-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${luckyTurnStep >= 0 ? 'bg-amber-400' : 'bg-slate-600'}`} />
                  <span className={`w-1.5 h-1.5 rounded-full ${luckyTurnStep >= 1 ? 'bg-amber-400' : 'bg-slate-600'}`} />
                  <span className={`w-2 h-2 rounded-full ${isNextTurnLucky ? 'bg-rose-400 ring-2 ring-yellow-300' : 'bg-slate-600'}`} />
                </div>
              </button>
            </div>

            {/* Central Wheel of 39 Students */}
            <div className="relative z-10 flex flex-col items-center justify-center shrink-0 max-h-full">
              <WheelCanvas
                students={students}
                onSelectStudent={handleSelectStudent}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                allowRepeat={allowRepeatStudents}
              />
            </div>

            {/* Teacher Controls Bar */}
            <div className="relative z-10 mt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs shrink-0">
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 cursor-pointer select-none text-[11px] sm:text-xs text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={allowRepeatStudents}
                  onChange={e => setAllowRepeatStudents(e.target.checked)}
                  className="rounded border-slate-500 text-amber-400 focus:ring-0"
                />
                <span>Quay lại HS đã tham gia</span>
              </label>

              <button
                onClick={() => {
                  if (window.confirm('Đặt lại trạng thái tham gia của tất cả học sinh để bắt đầu vòng mới?')) {
                    handleResetStudents();
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-slate-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Đặt lại danh sách</span>
              </button>

              <button
                onClick={() => setShowQuickGrid(!showQuickGrid)}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-amber-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-[11px] sm:text-xs"
              >
                <span>{showQuickGrid ? 'Ẩn dãy câu 1-28' : '⚡ Hiện dãy câu 1-28'}</span>
              </button>
            </div>

            {/* Optional Quick Question 1-28 Grid */}
            {showQuickGrid && (
              <div className="relative z-10 mt-2 w-full max-w-2xl shrink-0">
                <QuickQuestionGrid
                  questions={QUESTIONS_BANK}
                  usedQuestionIds={usedQuestionIds}
                  onSelectQuestion={handleDirectSelectQuestion}
                />
              </div>
            )}
          </main>

          {/* Bottom Slogan Bar */}
          <footer className={`relative z-10 py-1 sm:py-1.5 px-3 ${activeTheme.footerBg} border-t ${activeTheme.footerBorder} text-center shrink-0 transition-colors duration-500`}>
            <p className={`${activeTheme.sloganColor} font-bold text-[11px] sm:text-xs tracking-wide`}>
              ★ TỰ TIN – TRUNG THỰC – GIỮ TRỌN NIỀM TIN ★ TRƯỜNG TH&THCS LÊ THỊ TUYẾT • LỚP 7A1 ★
            </p>
          </footer>
        </div>
      )}

      {/* 3. Màn hình Câu Hỏi & Đáp Án (Hiện ra NGAY LẬP TỨC khi vòng quay dừng ở tên học sinh) */}
      {showQuestionModal && activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          questionIndex={activeQuestion.id}
          totalQuestions={QUESTIONS_BANK.length}
          student={selectedStudent}
          studentsList={students}
          isLuckyQuestion={isCurrentQuestionLucky}
          onAnswerSubmitted={handleAnswerSubmitted}
          onNextSpin={handleNextSpin}
          onClose={handleNextSpin}
        />
      )}

      {/* 4. Scoreboard & Leaderboard Modal */}
      {showScoreboard && (
        <ScoreBoardModal
          students={students}
          onUpdateScore={handleUpdateScore}
          onResetScores={handleResetScores}
          onToggleParticipated={handleToggleParticipated}
          onRenameStudent={handleRenameStudent}
          onAddStudent={handleAddStudent}
          onUpdateGifts={handleUpdateGifts}
          onClose={() => setShowScoreboard(false)}
        />
      )}

      {/* 5. Teacher Question Bank Modal */}
      {showTeacherBank && (
        <TeacherBankModal
          questions={QUESTIONS_BANK}
          usedQuestionIds={usedQuestionIds}
          onResetQuestions={handleResetQuestions}
          onClose={() => setShowTeacherBank(false)}
        />
      )}

      {/* 6. Instructions Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}

      {/* 7. Classroom Guide Modal */}
      {showClassroomGuide && (
        <ClassroomGuideModal onClose={() => setShowClassroomGuide(false)} />
      )}

      {/* 8. Notice: All students completed round */}
      {showClassCompletedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500 shadow-2xl text-center text-slate-100">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              HOÀN THÀNH VÒNG QUAY!
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Cả {students.length} học sinh lớp 7A1 đã hoàn thành lượt tham gia! Bạn có muốn bắt đầu một vòng quay mới không?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleResetStudents}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase transition-all cursor-pointer"
              >
                Bắt đầu vòng quay mới
              </button>
              <button
                onClick={() => {
                  setAllowRepeatStudents(true);
                  setShowClassCompletedNotice(false);
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors cursor-pointer"
              >
                Bật chọn lại tự do
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
