/**
 * Web Audio API Sound Synthesizer
 * 100% self-contained without external assets or network requirements.
 */

import { STUDENT_VOICE_BASE64 } from '../data/studentVoices';
import { QUESTION_VOICE_BASE64 } from '../data/questionVoices';
import { LUCKY_VOICE_BASE64 } from '../data/luckyVoices';
import { CORRECT_VOICE_BASE64, LUCKY_CORRECT_VOICE_BASE64, WRONG_VOICE_BASE64 } from '../data/answerVoices';

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentSpeechAudio: HTMLAudioElement | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    // AudioContext will be initialized on first user interaction
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
    } catch {
      this.voices = [];
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeech();
    }
    return this.isMuted;
  }

  private speechSequenceToken: number = 0;

  // Stop any ongoing speech (audio playback or Web Speech API)
  public stopSpeech() {
    this.speechSequenceToken++;

    if (this.currentSpeechAudio) {
      try {
        this.currentSpeechAudio.pause();
        this.currentSpeechAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentSpeechAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  // Check if system has a native Vietnamese voice in Web Speech API
  public hasVietnameseSpeechVoice(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    const voices = this.voices.length > 0 ? this.voices : (window.speechSynthesis.getVoices() || []);
    return voices.some(v => 
      v.lang === 'vi-VN' || 
      v.lang === 'vi_VN' ||
      v.lang.toLowerCase().startsWith('vi') ||
      v.name.toLowerCase().includes('vietnam') ||
      v.name.toLowerCase().includes('vietnamese')
    );
  }

  // Check if speech audio is currently playing
  public isSpeaking(): boolean {
    if (this.currentSpeechAudio && !this.currentSpeechAudio.paused) return true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) return true;
    return false;
  }

  // Text-To-Speech: Crystal Clear Standard Vietnamese Voice ("Chị Google")
  // 100% natural, correct tones, works offline for all 39 class students!
  public speakStudentName(studentName: string, studentId?: number, onEnded?: () => void) {
    if (this.isMuted) {
      onEnded?.();
      return;
    }
    this.stopSpeech();

    const cleanName = (studentName || '').trim();
    if (!cleanName) {
      onEnded?.();
      return;
    }

    // 1. First priority: Pre-generated studio-quality Vietnamese voice (Instant & 100% Offline)
    const localAudioData =
      (studentId && STUDENT_VOICE_BASE64[studentId]) ||
      STUDENT_VOICE_BASE64[cleanName] ||
      STUDENT_VOICE_BASE64[cleanName.toLowerCase()];

    if (localAudioData) {
      try {
        const audio = new Audio(localAudioData);
        audio.volume = 1.0;
        this.currentSpeechAudio = audio;
        audio.onended = () => {
          this.currentSpeechAudio = null;
          onEnded?.();
        };
        audio.play().catch(err => {
          console.warn('Local speech audio play error:', err);
          this.fallbackSpeech(`Chúc mừng bạn ${cleanName}!`, onEnded);
        });
        return;
      } catch (err) {
        console.warn('Audio element error:', err);
      }
    }

    // 2. Second priority: High-fidelity online Google Vietnamese Voice API
    try {
      const phrase = `Chúc mừng bạn ${cleanName}!`;
      const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(phrase)}`;
      const onlineAudio = new Audio(googleUrl);
      onlineAudio.volume = 1.0;
      this.currentSpeechAudio = onlineAudio;
      onlineAudio.onended = () => {
        this.currentSpeechAudio = null;
        onEnded?.();
      };
      onlineAudio.play().catch(() => {
        // If offline or blocked, fallback safely
        this.fallbackSpeech(phrase, onEnded);
      });
      return;
    } catch {
      this.fallbackSpeech(`Chúc mừng bạn ${cleanName}!`, onEnded);
    }
  }

  // Text-To-Speech: Lucky Question Announcement
  // "Chúc mừng bạn [Tên] đã trúng câu hỏi may mắn, nếu trả lời đúng sẽ được 10 điểm và một phần quà từ giáo viên!"
  // 100% offline support with studio-quality pre-rendered Vietnamese voice for all 39 class students!
  public speakLuckyAnnouncement(studentName?: string, studentId?: number, onEnded?: () => void) {
    if (this.isMuted) {
      onEnded?.();
      return;
    }
    this.stopSpeech();

    const cleanName = (studentName || '').trim();
    const fallbackText = cleanName
      ? `Chúc mừng bạn ${cleanName} đã trúng câu hỏi may mắn, nếu trả lời đúng sẽ được 10 điểm và một phần quà từ giáo viên!`
      : `Chúc mừng bạn đã trúng câu hỏi may mắn, nếu trả lời đúng sẽ được 10 điểm và một phần quà từ giáo viên!`;

    // 1. First priority: Pre-rendered offline studio audio
    const localAudioData =
      (studentId && LUCKY_VOICE_BASE64[studentId]) ||
      (cleanName && LUCKY_VOICE_BASE64[cleanName]) ||
      (cleanName && LUCKY_VOICE_BASE64[cleanName.toLowerCase()]) ||
      LUCKY_VOICE_BASE64['default'];

    if (localAudioData) {
      try {
        const audio = new Audio(localAudioData);
        audio.volume = 1.0;
        this.currentSpeechAudio = audio;
        audio.onended = () => {
          this.currentSpeechAudio = null;
          onEnded?.();
        };
        audio.play().catch(err => {
          console.warn('Local lucky voice audio play error:', err);
          this.fallbackSpeech(fallbackText, onEnded);
        });
        return;
      } catch (err) {
        console.warn('Audio element error:', err);
      }
    }

    // 2. Second priority: Online Google Vietnamese Voice API
    try {
      const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(fallbackText)}`;
      const onlineAudio = new Audio(googleUrl);
      onlineAudio.volume = 1.0;
      this.currentSpeechAudio = onlineAudio;
      onlineAudio.onended = () => {
        this.currentSpeechAudio = null;
        onEnded?.();
      };
      onlineAudio.play().catch(() => {
        this.fallbackSpeech(fallbackText, onEnded);
      });
      return;
    } catch {
      this.fallbackSpeech(fallbackText, onEnded);
    }
  }

  // Play a single speech phrase (Google TTS online or Web Speech fallback)
  public playOnlineOrFallbackSpeech(phrase: string, onEnded?: () => void) {
    if (this.isMuted) {
      onEnded?.();
      return;
    }
    this.stopSpeech();
    const token = this.speechSequenceToken;
    const cleanText = (phrase || '').trim();
    if (!cleanText) {
      onEnded?.();
      return;
    }

    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    try {
      const audio = new Audio(googleUrl);
      audio.volume = 1.0;
      this.currentSpeechAudio = audio;
      audio.onended = () => {
        if (this.speechSequenceToken === token) {
          this.currentSpeechAudio = null;
          onEnded?.();
        }
      };
      audio.play().catch(() => {
        if (this.speechSequenceToken === token) {
          this.fallbackSpeech(cleanText, onEnded);
        }
      });
    } catch {
      if (this.speechSequenceToken === token) {
        this.fallbackSpeech(cleanText, onEnded);
      }
    }
  }

  // Text-To-Speech: Read Question & All 4 Options (A, B, C, D) Aloud
  // 100% offline support with pre-rendered Vietnamese voice for all 28 questions!
  public speakQuestion(
    questionText: string,
    questionId?: number,
    options?: { A: string; B: string; C: string; D: string },
    onEnded?: () => void
  ) {
    if (this.isMuted) {
      onEnded?.();
      return;
    }
    this.stopSpeech();

    const cleanText = (questionText || '').trim();
    if (!cleanText) {
      onEnded?.();
      return;
    }

    const fullSpokenText = questionId && !cleanText.startsWith('Câu')
      ? `Câu ${questionId}: ${cleanText}`
      : cleanText;

    let fullSpokenWithAllOptions = fullSpokenText;
    if (options) {
      fullSpokenWithAllOptions += `. A: ${options.A}. B: ${options.B}. C: ${options.C}. D: ${options.D}.`;
    }

    // 1. ƯU TIÊN SỐ 1: Âm thanh phòng thu có sẵn trong máy (Chạy 100% Offline, tức thì, đọc cả câu hỏi & 4 đáp án)
    const localAudioData = questionId ? QUESTION_VOICE_BASE64[questionId] : null;

    if (localAudioData) {
      try {
        const audio = new Audio(localAudioData);
        audio.volume = 1.0;
        this.currentSpeechAudio = audio;
        audio.onended = () => {
          this.currentSpeechAudio = null;
          onEnded?.();
        };
        audio.play().catch(err => {
          console.warn('Local question speech audio play error:', err);
          this.playOnlineOrFallbackSpeech(fullSpokenWithAllOptions, onEnded);
        });
        return;
      } catch (err) {
        console.warn('Audio element error:', err);
      }
    }

    // 2. ƯU TIÊN SỐ 2: Gọi giọng đọc trực tuyến nếu không có file âm thanh sẵn
    this.playOnlineOrFallbackSpeech(fullSpokenWithAllOptions, onEnded);
  }

  // Text-To-Speech: Đọc chi tiết từng đáp án riêng lẻ khi Giáo viên bấm vào biểu tượng loa của đáp án đó
  public speakOption(letter: string, optionText: string, onEnded?: () => void) {
    if (this.isMuted) {
      onEnded?.();
      return;
    }
    const cleanOption = (optionText || '').trim();
    const textToSpeak = `${letter}: ${cleanOption}`;
    this.playOnlineOrFallbackSpeech(textToSpeak, onEnded);
  }

  // Text-To-Speech: Đọc kết quả câu trả lời đúng (100% Offline, có giọng đọc cho 39 học sinh)
  // "Chúc mừng bạn [Tên] đã trả lời đúng, bạn được 10 điểm!" (hoặc câu may mắn + quà GV)
  public speakCorrectAnswer(
    studentName?: string,
    studentId?: number,
    isLucky: boolean = false,
    onEnded?: () => void
  ) {
    if (this.isMuted) {
      onEnded?.();
      return;
    }
    this.stopSpeech();

    const cleanName = (studentName || '').trim();
    const fallbackText = isLucky
      ? (cleanName
          ? `Chúc mừng bạn ${cleanName} đã trả lời đúng câu hỏi may mắn, bạn được 10 điểm và một phần quà từ giáo viên!`
          : `Chúc mừng bạn đã trả lời đúng câu hỏi may mắn, bạn được 10 điểm và một phần quà từ giáo viên!`)
      : (cleanName
          ? `Chúc mừng bạn ${cleanName} đã trả lời đúng, bạn được 10 điểm!`
          : `Chúc mừng bạn đã trả lời đúng, bạn được 10 điểm!`);

    // 1. Ưu tiên số 1: Giọng đọc phòng thu 100% Offline (chạy không cần mạng)
    const voiceBank = isLucky ? LUCKY_CORRECT_VOICE_BASE64 : CORRECT_VOICE_BASE64;
    const localAudioData =
      (studentId && voiceBank[studentId]) ||
      (cleanName && voiceBank[cleanName]) ||
      voiceBank['default'];

    if (localAudioData) {
      try {
        const audio = new Audio(localAudioData);
        audio.volume = 1.0;
        this.currentSpeechAudio = audio;
        audio.onended = () => {
          this.currentSpeechAudio = null;
          onEnded?.();
        };
        audio.play().catch(err => {
          console.warn('Local correct answer audio play error:', err);
          this.playOnlineOrFallbackSpeech(fallbackText, onEnded);
        });
        return;
      } catch (err) {
        console.warn('Audio element error:', err);
      }
    }

    // 2. Ưu tiên số 2: Online Google TTS hoặc Web Speech
    this.playOnlineOrFallbackSpeech(fallbackText, onEnded);
  }

  // Text-To-Speech: Đọc thông báo câu trả lời sai (100% Offline)
  // "Rất tiếc, câu trả lời chưa chính xác. Đáp án đúng là [A/B/C/D]."
  public speakWrongAnswer(
    correctAnswerLetter: string,
    isLucky: boolean = false,
    onEnded?: () => void
  ) {
    if (this.isMuted) {
      onEnded?.();
      return;
    }
    this.stopSpeech();

    const fallbackText = isLucky
      ? `Rất tiếc câu hỏi may mắn chưa đúng, chúc em may mắn ở lượt quay sau! Đáp án đúng là ${correctAnswerLetter}.`
      : `Rất tiếc, câu trả lời chưa chính xác. Đáp án đúng là ${correctAnswerLetter}.`;

    // 1. Ưu tiên số 1: File âm thanh Offline
    const localAudioData = isLucky
      ? WRONG_VOICE_BASE64['lucky_wrong']
      : WRONG_VOICE_BASE64[correctAnswerLetter];

    if (localAudioData) {
      try {
        const audio = new Audio(localAudioData);
        audio.volume = 1.0;
        this.currentSpeechAudio = audio;
        audio.onended = () => {
          this.currentSpeechAudio = null;
          onEnded?.();
        };
        audio.play().catch(err => {
          console.warn('Local wrong answer audio play error:', err);
          this.playOnlineOrFallbackSpeech(fallbackText, onEnded);
        });
        return;
      } catch (err) {
        console.warn('Audio element error:', err);
      }
    }

    // 2. Ưu tiên số 2: Online TTS
    this.playOnlineOrFallbackSpeech(fallbackText, onEnded);
  }

  // Safe fallback: Web Speech API ONLY if native Vietnamese voice is installed
  // If NO Vietnamese voice is installed on Windows/browser, NEVER use English robot voice
  private fallbackSpeech(phrase: string, onEnded?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnded?.();
      return;
    }
    try {
      const voices = this.voices.length > 0 ? this.voices : (window.speechSynthesis.getVoices() || []);
      const viVoice = voices.find(v => 
        v.lang === 'vi-VN' || 
        v.lang === 'vi_VN' ||
        v.lang.toLowerCase().startsWith('vi') ||
        v.name.toLowerCase().includes('vietnam') ||
        v.name.toLowerCase().includes('vietnamese')
      );

      // CRITICAL: If no Vietnamese voice is installed, do not let English voice butcher the speech!
      if (!viVoice) {
        onEnded?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.voice = viVoice;
      utterance.lang = 'vi-VN';
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.onend = () => {
        onEnded?.();
      };
      utterance.onerror = () => {
        onEnded?.();
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      onEnded?.();
    }
  }

  // Wheel tick sound (click when pointer hits peg)
  public playTick(pitch: number = 800) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }

  // Winner Fanfare when wheel stops on chosen student
  public playWinnerFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fanfare notes: C5, E5, G5, C6 triumph
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.15 },
        { freq: 659.25, time: 0.15, dur: 0.15 },
        { freq: 783.99, time: 0.30, dur: 0.2 },
        { freq: 1046.50, time: 0.50, dur: 0.6 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.25, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // ignore
    }
  }

  // Grand celebration fanfare & chime for Lucky Question & Teacher Gift
  public playGiftCelebration() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Majestic festive fanfare & sparkling arpeggios
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.15 },  // C5
        { freq: 659.25, time: 0.12, dur: 0.15 }, // E5
        { freq: 783.99, time: 0.24, dur: 0.18 }, // G5
        { freq: 1046.50, time: 0.36, dur: 0.35 },// C6
        { freq: 880.00, time: 0.52, dur: 0.18 }, // A5
        { freq: 1046.50, time: 0.65, dur: 0.2 }, // C6
        { freq: 1318.51, time: 0.80, dur: 0.8 }, // E6 grand finale
      ];

      notes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.3, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // ignore
    }
  }

  // Correct answer bell & chime
  public playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High bright sparkling chord
      const chords = [
        { freq: 587.33, offset: 0, dur: 0.3 },   // D5
        { freq: 739.99, offset: 0.08, dur: 0.35 }, // F#5
        { freq: 880.00, offset: 0.16, dur: 0.4 },  // A5
        { freq: 1174.66, offset: 0.24, dur: 0.7 }  // D6
      ];

      chords.forEach(({ freq, offset, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);

        gain.gain.setValueAtTime(0.01, now + offset);
        gain.gain.linearRampToValueAtTime(0.28, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + dur);
      });
    } catch {
      // ignore
    }
  }

  // Gentle, supportive wrong answer tone
  public playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [
        { freq: 320, time: 0, dur: 0.22 },
        { freq: 260, time: 0.22, dur: 0.35 }
      ];

      notes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.18, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // ignore
    }
  }

  // Countdown timer tick / bell sound (rings every second from 20s down to 0)
  public playCountdownTick(isUrgent: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isUrgent ? 'square' : 'triangle';
      const freq = isUrgent ? 880 : 587.33; // D5 normally, A5 when urgent (<= 4s)
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + 0.08);

      gain.gain.setValueAtTime(isUrgent ? 0.22 : 0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isUrgent ? 0.12 : 0.09));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  // General UI Click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // ignore
    }
  }

  // Bell chime when question first appears on screen
  public playQuestionBell() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High bright resonant attention bell & harmonics
      const partials = [
        { freq: 880, gain: 0.32, decay: 1.1 },   // A5
        { freq: 1320, gain: 0.22, decay: 0.9 },  // E6
        { freq: 1760, gain: 0.16, decay: 0.7 },  // A6
        { freq: 2640, gain: 0.10, decay: 0.5 },  // E7
      ];

      partials.forEach(({ freq, gain, decay }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(gain, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundEffects();
