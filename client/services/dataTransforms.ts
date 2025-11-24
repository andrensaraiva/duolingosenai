import { Lesson, LessonStep, LessonType, Mission, Challenge, ThemeId, User } from '../types';
import { INITIAL_USER } from './mockData';

const lessonPositions: Lesson['position'][] = ['center', 'left', 'right'];

const themeMap: Record<string, ThemeId> = {
  default: 'cyber',
  games: 'game',
  sports: 'sport',
};

const reverseThemeMap: Record<ThemeId, string> = {
  cyber: 'default',
  game: 'games',
  sport: 'sports',
};

const ensureContent = (...parts: Array<string | undefined>): string => {
  return parts.filter(Boolean).join('\n\n');
};

export const mapServerThemeToClient = (themeId?: string): ThemeId => {
  if (!themeId) return 'cyber';
  return themeMap[themeId] ?? 'cyber';
};

export const mapClientThemeToServer = (themeId: ThemeId): string => {
  return reverseThemeMap[themeId] ?? 'default';
};

export const buildLessonSummary = (node: any, index: number): Lesson => ({
  id: node.id,
  title: node.title,
  description: node.skill ?? node.title,
  xpReward: node.rewardXp ?? 0,
  locked: node.status === 'locked',
  completed: node.status === 'completed',
  position: lessonPositions[index % lessonPositions.length],
  steps: [],
});

export const buildLessonSteps = (lessonPayload: any, serverThemeId?: string): LessonStep[] => {
  if (!lessonPayload) return [];
  const themedCards =
    (serverThemeId && lessonPayload.themes?.[serverThemeId]?.cards) || lessonPayload.cards || [];

  return themedCards.map((card: any, index: number): LessonStep => {
    const id = `${lessonPayload.id ?? 'lesson'}-step-${index}`;
    if (card.type === 'quiz') {
      return {
        id,
        type: LessonType.QUIZ,
        content: card.prompt ?? card.title ?? 'Quiz',
        options: card.choices ?? [],
        correctAnswer: card.answer,
        explanation: card.feedback,
      };
    }

    if (card.type === 'arrange') {
      return {
        id,
        type: LessonType.CODE_ORDER,
        content: card.prompt ?? 'Organize os blocos',
        options: card.blocks ?? [],
        correctOrder: card.solution ?? [],
        explanation: card.feedback,
      };
    }

    return {
      id,
      type: LessonType.CONCEPT,
      content: ensureContent(card.title, card.body, card.snippet, card.explanation),
    };
  });
};

export const buildUserProfile = (profile: any, lessons: Lesson[], rotation?: any): User => {
  const completedLessons = lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id);
  const completedMissions = (rotation?.missions || [])
    .filter((mission: any) => mission.status === 'completed')
    .map((mission: any) => mission.id);
  const boosters = profile?.boosters ?? {};
  const inventory: string[] = [];
  Object.entries(boosters).forEach(([key, count]) => {
    const quantity = typeof count === 'number' ? count : 0;
    for (let index = 0; index < quantity; index += 1) {
      inventory.push(key);
    }
  });

  return {
    ...INITIAL_USER,
    codename: profile?.codename ?? INITIAL_USER.codename,
    xp: profile?.xp ?? 0,
    hearts: profile?.lives ?? INITIAL_USER.hearts,
    maxHearts: INITIAL_USER.maxHearts,
    streak: profile?.streak ?? INITIAL_USER.streak,
    coins: profile?.currency ?? INITIAL_USER.coins,
    completedLessons,
    completedMissions,
    inventory,
    activeTheme: mapServerThemeToClient(profile?.theme?.id),
  };
};

export const buildMissions = (rotation: any): Mission[] => {
  if (!rotation?.missions) return [];
  return rotation.missions.map((mission: any) => {
    const total = mission.total ?? mission.rewardXp ?? 1;
    const current = mission.status === 'completed' ? total : 0;
    return {
      id: mission.id,
      title: mission.title,
      description: mission.scenario ?? mission.prompt ?? '',
      reward: { type: 'XP', value: (mission.rewardXp ?? 0) + (mission.bonus?.xp ?? 0) },
      total,
      current,
      completed: mission.status === 'completed',
      expiry: rotation.expiresAt ?? Date.now(),
    };
  });
};

export const buildChallenges = (challengesPayload: any[] = []): Challenge[] => {
  return challengesPayload.map((challenge, index) => ({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    difficulty: index === 0 ? 'Medium' : index > 1 ? 'Hard' : 'Easy',
    multiplier: challenge.goals?.resources ? challenge.goals.resources / 10 : 1,
    bestScore: challenge.bestResult?.efficiency,
  }));
};
