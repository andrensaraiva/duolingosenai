export interface CharacterCustomization {
  color: 'pink' | 'blue' | 'purple' | 'orange';
  head: 'none' | 'antenna' | 'crown' | 'headphones' | 'cap';
  eyes: 'none' | 'sunglasses' | 'visor' | 'patch';
  tail: 'none' | 'fin-ring' | 'thruster' | 'ribbon';
}

export type ThemeId = 'cyber' | 'game' | 'sport';

export type TrackId = 'python' | 'design';

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
  activeTrack?: TrackId;
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
  trackId?: TrackId;
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

export type ResourceType = 'MATERIAL' | 'SEED' | 'ENERGY';

export interface ArenaNode {
  id: number;
  type: 'SOURCE' | 'PLOT';
  sourceType?: ResourceType;
  state: 'EMPTY' | 'BUILT' | 'SEEDED' | 'ACTIVE' | 'CONVERTED';
  level: number;
  label?: string;
  yieldRate?: number;
  comboLevel?: number;
}

export interface BotInstruction {
  id: string;
  command: 'GOTO' | 'HARVEST' | 'BUILD' | 'INSTALL' | 'UPGRADE' | 'CONVERT' | 'BREAK';
  target?: number;
  resource?: ResourceType;
}