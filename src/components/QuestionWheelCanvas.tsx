import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Question } from '../data/questions';
import { soundManager } from '../utils/audio';

interface QuestionWheelCanvasProps {
  questions: Question[];
  usedQuestionIds: Set<number>;
  onSelectQuestion: (question: Question) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  allowRepeatQuestions?: boolean;
  onSpinStart?: () => void;
}

// Vibrant 7-color palette for 28 questions
const QUESTION_COLORS = [
  '#2563EB', // Blue
  '#D97706', // Amber Gold
  '#059669', // Emerald Green
  '#DC2626', // Crimson Red
  '#7C3AED', // Royal Purple
  '#EA580C', // Bright Orange
  '#0891B2', // Cyan
];

const LED_COLORS = ['#FEF08A', '#F59E0B', '#EF4444', '#10B981', '#38BDF8'];

export const QuestionWheelCanvas: React.FC<QuestionWheelCanvasProps> = ({
  questions,
  usedQuestionIds,
  onSelectQuestion,
  isSpinning,
  setIsSpinning,
  allowRepeatQuestions = false,
  onSpinStart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastSliceIndexRef = useRef<number>(-1);

  const spinStateRef = useRef<{
    startTime: number;
    duration: number;
    startAngle: number;
    targetAngle: number;
    chosenQuestion: Question | null;
    isPaused: boolean;
    pauseStartTime: number;
    totalPausedTime: number;
  }>({
    startTime: 0,
    duration: 6500,
    startAngle: 0,
    targetAngle: 0,
    chosenQuestion: null,
    isPaused: false,
    pauseStartTime: 0,
    totalPausedTime: 0,
  });

  const [isPaused, setIsPaused] = useState(false);
  const [pointerBounce, setPointerBounce] = useState(0);

  const numSlices = questions.length; // 28
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Draw 28-question wheel with gorgeous metallic gold bezel
  const drawWheel = useCallback((currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Geometry dimensions (Canvas 680x680)
    const outerRimRadius = 330;      // Outermost golden crown rim
    const outerBezelInner = 310;     // Inner step of outer gold bezel (20px width)
    const ledTrackRadius = 297;      // Center line of 32 LED lights
    const innerBezelRadius = 284;    // Inner gold separation ring (outer boundary)
    const sliceRadius = 280;         // Outer edge of rotating slices
    const innerRadius = 55;          // Center hub

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // ----------------------------------------------------
    // 1. NỀN VIỀN SÂN KHẤU (DEEP STAGE SHADOW BASE)
    // ----------------------------------------------------
    ctx.beginPath();
    ctx.arc(cx, cy, outerRimRadius + 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#060913';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
    ctx.shadowBlur = 35;
    ctx.fill();
    ctx.shadowBlur = 0;

    // ----------------------------------------------------
    // 2. VẼ 28 NAN QUẠT CÂU HỎI (ROTATING SLICES)
    // ----------------------------------------------------
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(currentAngle);

    questions.forEach((q, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const baseColor = QUESTION_COLORS[i % QUESTION_COLORS.length];
      const isUsed = usedQuestionIds.has(q.id);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, sliceRadius, startAngle, endAngle);
      ctx.closePath();

      if (isUsed && !allowRepeatQuestions) {
        ctx.fillStyle = '#1e293b';
      } else {
        ctx.fillStyle = baseColor;
      }
      ctx.fill();

      // Divider line
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.stroke();

      // Label
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const label = `Câu ${String(q.id).padStart(2, '0')}`;
      const isDimmed = isUsed && !allowRepeatQuestions;

      ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = isDimmed ? '#94a3b8' : '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const textX = sliceRadius - 16;
      ctx.fillText(label, textX, 0);

      if (isUsed) {
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#34D399';
        ctx.fillText('✓', sliceRadius - 5, 0);
      }

      ctx.restore();
    });

    ctx.restore();

    // ----------------------------------------------------
    // 3. ĐỘ SÂU 3D VÀNH TRONG (SUNKEN INSET SHADOW ONTO SLICES)
    // ----------------------------------------------------
    const insetShadow = ctx.createRadialGradient(cx, cy, sliceRadius - 12, cx, cy, sliceRadius);
    insetShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    insetShadow.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.beginPath();
    ctx.arc(cx, cy, sliceRadius, 0, 2 * Math.PI);
    ctx.fillStyle = insetShadow;
    ctx.fill();

    // ----------------------------------------------------
    // 4. CHỐT ĐỊNH VỊ KIM LOẠI 3D (BOUNDARY STUDS AT EACH SLICE)
    // ----------------------------------------------------
    for (let i = 0; i < numSlices; i++) {
      const pegAngle = currentAngle + i * sliceAngle;
      const pegX = cx + Math.cos(pegAngle) * (sliceRadius + 2);
      const pegY = cy + Math.sin(pegAngle) * (sliceRadius + 2);

      // Peg base drop shadow
      ctx.beginPath();
      ctx.arc(pegX + 0.8, pegY + 0.8, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#451A03';
      ctx.fill();

      // Shiny golden head
      const pegGrad = ctx.createRadialGradient(pegX - 0.8, pegY - 0.8, 0.4, pegX, pegY, 2.5);
      pegGrad.addColorStop(0, '#FFFFFF');
      pegGrad.addColorStop(0.35, '#FEF08A');
      pegGrad.addColorStop(0.8, '#D97706');
      pegGrad.addColorStop(1, '#78350F');
      ctx.beginPath();
      ctx.arc(pegX, pegY, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = pegGrad;
      ctx.fill();
    }

    // ----------------------------------------------------
    // 5. VÀNH VÀNG NGĂN CÁCH TRONG (INNER GOLDEN SEPARATION BEZEL)
    // ----------------------------------------------------
    const innerGoldGrad = ctx.createLinearGradient(cx - innerBezelRadius, cy - innerBezelRadius, cx + innerBezelRadius, cy + innerBezelRadius);
    innerGoldGrad.addColorStop(0, '#78350F');
    innerGoldGrad.addColorStop(0.25, '#FEF08A');
    innerGoldGrad.addColorStop(0.65, '#F59E0B');
    innerGoldGrad.addColorStop(1, '#92400E');

    ctx.beginPath();
    ctx.arc(cx, cy, (innerBezelRadius + sliceRadius) / 2, 0, 2 * Math.PI);
    ctx.lineWidth = innerBezelRadius - sliceRadius;
    ctx.strokeStyle = innerGoldGrad;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, innerBezelRadius, 0, 2 * Math.PI);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#FEF08A';
    ctx.stroke();

    // ----------------------------------------------------
    // 6. RÃNH ĐÈN LED NHUNG KIM LOẠI (DARK VELVET LED RUNWAY)
    // ----------------------------------------------------
    const trackGrad = ctx.createRadialGradient(cx, cy, innerBezelRadius, cx, cy, outerBezelInner);
    trackGrad.addColorStop(0, '#060913');
    trackGrad.addColorStop(0.5, '#131C30');
    trackGrad.addColorStop(1, '#070B16');

    ctx.beginPath();
    ctx.arc(cx, cy, (outerBezelInner + innerBezelRadius) / 2, 0, 2 * Math.PI);
    ctx.lineWidth = outerBezelInner - innerBezelRadius;
    ctx.strokeStyle = trackGrad;
    ctx.stroke();

    // Subtle luxury horology pinstripes
    ctx.beginPath();
    ctx.arc(cx, cy, 290, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 304, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    // Precision ticks
    for (let m = 0; m < 72; m++) {
      const mAngle = (m / 72) * Math.PI * 2;
      const mx1 = cx + Math.cos(mAngle) * 296;
      const my1 = cy + Math.sin(mAngle) * 296;
      const mx2 = cx + Math.cos(mAngle) * 298;
      const my2 = cy + Math.sin(mAngle) * 298;

      ctx.beginPath();
      ctx.moveTo(mx1, my1);
      ctx.lineTo(mx2, my2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = m % 2 === 0 ? 'rgba(251, 191, 36, 0.35)' : 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();
    }

    // ----------------------------------------------------
    // 7. 32 ĐÈN LED CABOCHON PHA LÊ (3D CRYSTAL CASINO BULBS)
    // ----------------------------------------------------
    const numLeds = 32;
    const chaseOffset = isSpinning ? Math.floor(Date.now() / 75) : 0;

    for (let l = 0; l < numLeds; l++) {
      const ledAngle = (l / numLeds) * Math.PI * 2;
      const lx = cx + Math.cos(ledAngle) * ledTrackRadius;
      const ly = cy + Math.sin(ledAngle) * ledTrackRadius;

      const isLit = isSpinning
        ? (l + chaseOffset) % 3 !== 0
        : l % 2 === 0;

      const bulbColor = LED_COLORS[l % LED_COLORS.length];

      // Chrome/Gold bulb socket ring
      ctx.beginPath();
      ctx.arc(lx, ly, 7.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#D97706';
      ctx.stroke();

      // Inner bevel socket ring
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, 2 * Math.PI);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FEF08A';
      ctx.stroke();

      // Glowing Glass Bulb Dome
      ctx.beginPath();
      ctx.arc(lx, ly, 5.2, 0, 2 * Math.PI);

      if (isLit) {
        const bulbGrad = ctx.createRadialGradient(lx - 1.5, ly - 1.5, 0.8, lx, ly, 5.5);
        bulbGrad.addColorStop(0, '#FFFFFF');
        bulbGrad.addColorStop(0.3, bulbColor);
        bulbGrad.addColorStop(0.85, '#B45309');
        bulbGrad.addColorStop(1, '#451A03');

        ctx.fillStyle = bulbGrad;
        ctx.shadowColor = bulbColor;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(lx - 1.6, ly - 1.6, 1.6, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      } else {
        const dormantGrad = ctx.createRadialGradient(lx - 1.2, ly - 1.2, 0.5, lx, ly, 5.2);
        dormantGrad.addColorStop(0, '#FEF08A');
        dormantGrad.addColorStop(0.4, '#B45309');
        dormantGrad.addColorStop(1, '#451A03');

        ctx.fillStyle = dormantGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lx - 1.5, ly - 1.5, 1.2, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fill();
      }
    }

    // ----------------------------------------------------
    // 8. VÀNH VÀNG ĐÚC 3D ĐA TẦNG NGOẠI CÙNG (MASTER GOLD BEZEL)
    // ----------------------------------------------------
    const goldGradOuter = ctx.createLinearGradient(cx - outerRimRadius, cy - outerRimRadius, cx + outerRimRadius, cy + outerRimRadius);
    goldGradOuter.addColorStop(0, '#451A03');
    goldGradOuter.addColorStop(0.12, '#92400E');
    goldGradOuter.addColorStop(0.25, '#F59E0B');
    goldGradOuter.addColorStop(0.38, '#FEF08A');
    goldGradOuter.addColorStop(0.50, '#FBBF24');
    goldGradOuter.addColorStop(0.62, '#78350F');
    goldGradOuter.addColorStop(0.75, '#FEF08A');
    goldGradOuter.addColorStop(0.88, '#F59E0B');
    goldGradOuter.addColorStop(1, '#451A03');

    // Solid gold bevel band
    ctx.beginPath();
    ctx.arc(cx, cy, (outerRimRadius + outerBezelInner) / 2, 0, 2 * Math.PI);
    ctx.lineWidth = outerRimRadius - outerBezelInner;
    ctx.strokeStyle = goldGradOuter;
    ctx.stroke();

    // Outermost Crown Highlight Ring (Razor-sharp clarity)
    ctx.beginPath();
    ctx.arc(cx, cy, outerRimRadius, 0, 2 * Math.PI);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FFFBEB';
    ctx.shadowColor = 'rgba(254, 240, 138, 0.7)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Middle specular chamfer groove
    ctx.beginPath();
    ctx.arc(cx, cy, (outerRimRadius + outerBezelInner) / 2, 0, 2 * Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.stroke();

    // Inner gold bevel shadow step (separates bezel from LED track)
    ctx.beginPath();
    ctx.arc(cx, cy, outerBezelInner, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#451A03';
    ctx.stroke();

    // ----------------------------------------------------
    // 9. TRỤ TÂM VÒNG QUAY (METALLIC GOLD EMBOSSED CENTER HUB)
    // ----------------------------------------------------
    const hubGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, innerRadius);
    hubGrad.addColorStop(0, '#FEF08A');
    hubGrad.addColorStop(0.35, '#F59E0B');
    hubGrad.addColorStop(0.75, '#B45309');
    hubGrad.addColorStop(1, '#451A03');

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = hubGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FEF08A';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius - 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#0B1120';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FDE047';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FBBF24';
    ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
    ctx.fillText('28 CÂU', cx, cy - 6);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '700 9px "Be Vietnam Pro", sans-serif';
    ctx.fillText('HỎI & ĐÁP', cx, cy + 9);

    ctx.restore();
  }, [questions, numSlices, sliceAngle, usedQuestionIds, allowRepeatQuestions, isSpinning]);

  const easeOutCubic = (t: number) => {
    return 1 - Math.pow(1 - t, 4);
  };

  const spinStep = useCallback((timestamp: number) => {
    const state = spinStateRef.current;
    if (state.isPaused) {
      animFrameRef.current = requestAnimationFrame(spinStep);
      return;
    }

    const elapsed = timestamp - state.startTime - state.totalPausedTime;
    const progress = Math.min(elapsed / state.duration, 1);
    const easedProgress = easeOutCubic(progress);

    const currentAngle = state.startAngle + (state.targetAngle - state.startAngle) * easedProgress;
    rotationRef.current = currentAngle;

    const normalizedAngle = ((3 * Math.PI / 2 - currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const currentSliceIndex = Math.floor(normalizedAngle / sliceAngle) % numSlices;

    if (currentSliceIndex !== lastSliceIndexRef.current) {
      lastSliceIndexRef.current = currentSliceIndex;
      soundManager.playTick(620 + Math.random() * 200);
      setPointerBounce(1);
      setTimeout(() => setPointerBounce(0), 40);
    }

    drawWheel(currentAngle);

    if (progress < 1) {
      animFrameRef.current = requestAnimationFrame(spinStep);
    } else {
      setIsSpinning(false);
      setIsPaused(false);
      if (state.chosenQuestion) {
        soundManager.playWinnerFanfare();
        onSelectQuestion(state.chosenQuestion);
      }
    }
  }, [drawWheel, numSlices, onSelectQuestion, setIsSpinning, sliceAngle]);

  const startSpin = useCallback(() => {
    if (isSpinning) return;

    const availableQuestions = allowRepeatQuestions
      ? questions
      : questions.filter(q => !usedQuestionIds.has(q.id));

    if (availableQuestions.length === 0) {
      return;
    }

    onSpinStart?.();

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const chosen = availableQuestions[randomIndex];
    const chosenIndex = questions.findIndex(q => q.id === chosen.id);

    const currentAngle = rotationRef.current;
    const targetSliceCenter = (chosenIndex + 0.5) * sliceAngle;
    const pointerAngle = 3 * Math.PI / 2;

    let desiredLandingAngle = (pointerAngle - targetSliceCenter) % (2 * Math.PI);
    if (desiredLandingAngle < 0) desiredLandingAngle += 2 * Math.PI;

    let currentMod = currentAngle % (2 * Math.PI);
    if (currentMod < 0) currentMod += 2 * Math.PI;

    let delta = desiredLandingAngle - currentMod;
    if (delta <= 0) {
      delta += 2 * Math.PI;
    }

    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const totalTarget = currentAngle + fullSpins * (2 * Math.PI) + delta;
    const duration = 6500 + Math.random() * 800;

    spinStateRef.current = {
      startTime: performance.now(),
      duration,
      startAngle: currentAngle,
      targetAngle: totalTarget,
      chosenQuestion: chosen,
      isPaused: false,
      pauseStartTime: 0,
      totalPausedTime: 0,
    };

    setIsSpinning(true);
    setIsPaused(false);

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(spinStep);
  }, [allowRepeatQuestions, isSpinning, numSlices, onSpinStart, questions, setIsSpinning, sliceAngle, spinStep, usedQuestionIds]);

  const togglePause = useCallback(() => {
    if (!isSpinning) return;
    const state = spinStateRef.current;
    if (state.isPaused) {
      const pauseDuration = performance.now() - state.pauseStartTime;
      state.totalPausedTime += pauseDuration;
      state.isPaused = false;
      setIsPaused(false);
    } else {
      state.isPaused = true;
      state.pauseStartTime = performance.now();
      setIsPaused(true);
    }
  }, [isSpinning]);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* 3D Pointer needle */}
      <div
        className="absolute -top-3 sm:-top-4 z-30 transition-transform duration-75 pointer-events-none filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.95)]"
        style={{
          transform: `translateY(${pointerBounce ? '5px' : '0px'})`,
        }}
      >
        <svg width="48" height="60" viewBox="0 0 48 60" fill="none">
          <path
            d="M24 58L44 14C36 18 30 14 24 4C18 14 12 18 4 14L24 58Z"
            fill="url(#pointerGoldQNew)"
            stroke="#FEF08A"
            strokeWidth="2.5"
          />
          <circle cx="24" cy="22" r="6" fill="#2563EB" stroke="#FEF08A" strokeWidth="2" />
          <circle cx="22.2" cy="20.2" r="1.8" fill="#FFFFFF" />
          <defs>
            <linearGradient id="pointerGoldQNew" x1="4" y1="4" x2="44" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFBEB" />
              <stop offset="0.25" stopColor="#FEF08A" />
              <stop offset="0.6" stopColor="#D97706" />
              <stop offset="1" stopColor="#78350F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Wheel Outer Ring Frame */}
      <div className="relative rounded-full filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] drop-shadow-[0_0_40px_rgba(245,158,11,0.35)] transition-transform">
        <canvas
          ref={canvasRef}
          width={680}
          height={680}
          className="w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] lg:w-[620px] lg:h-[620px] max-w-full aspect-square block transition-transform"
        />

        <button
          onClick={startSpin}
          disabled={isSpinning}
          title="Nhấn để quay câu hỏi"
          className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed group transition-transform active:scale-95"
        >
          <span className="sr-only">Quay Câu Hỏi</span>
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl px-2">
        <button
          onClick={startSpin}
          disabled={isSpinning}
          className={`px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl font-black text-lg sm:text-xl tracking-wider uppercase transition-all duration-300 shadow-xl flex items-center gap-3 ${
            isSpinning
              ? 'bg-slate-700/80 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 animate-pulse'
          }`}
        >
          <span className="text-2xl">❓</span>
          <span>QUAY CÂU HỎI</span>
        </button>

        {isSpinning && (
          <button
            onClick={togglePause}
            className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-amber-300 font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2"
          >
            <span>{isPaused ? '▶ TIẾP TỤC' : '⏸ TẠM DỪNG'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
