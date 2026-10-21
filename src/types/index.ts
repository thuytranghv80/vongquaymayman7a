import { Student } from '../data/students';
import { Question } from '../data/questions';

export type ScreenMode = 'welcome' | 'wheel';

export type StageTheme = 'royal-blue' | 'ruby-gold' | 'emerald' | 'cosmic';

export interface GameSettings {
  allowRepeatStudents: boolean;
  timerDuration: number;
  enableTimer: boolean;
  soundEnabled: boolean;
  teacherControlMode: boolean; // if true, teacher clicks answer; if false, student clicks
}

export interface GameStatistics {
  totalSpins: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalScore: number;
}
