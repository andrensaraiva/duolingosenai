export interface CharacterCustomization {
  color: 'pink' | 'blue' | 'purple' | 'orange';
  hat: 'none' | 'party' | 'cowboy' | 'astronaut' | 'crown';
  accessory: 'none' | 'glasses' | 'bowtie' | 'scarf';
}

export type ThemeId = 'cyber' | 'game' | 'sport';

export interface User {
  id: string;
  codename: string;
  xp: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  coins: number;
  completedLessons: string[]; // IDs
  completedMissions: string[]; // IDs
  inventory: string[]; // Booster IDs
  customization: CharacterCustomization;
  activeTheme: ThemeId;
}

export enum LessonType {
  CONCEPT = 'CONCEPT',
  QUIZ = 'QUIZ',
  CODE_ORDER = 'CODE_ORDER',
}

export interface LessonStep {
  id: string;
  type: LessonType;
  content: string; // Markdown or text
  options?: string[]; // For quiz or code blocks
  correctOrder?: string[]; // For code order
  correctAnswer?: string; // For quiz
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  steps: LessonStep[];
  locked: boolean;
  completed: boolean;
  position: 'left' | 'center' | 'right'; // Visual path position
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: { type: 'XP' | 'COIN' | 'BOOSTER'; value: number | string };
  total: number;
  current: number;
  completed: boolean;
  expiry: number; // Timestamp
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  multiplier: number;
  bestScore?: number;
}