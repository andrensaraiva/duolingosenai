import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Lesson, Mission, Challenge, CharacterCustomization, ThemeId } from '../types';
import { INITIAL_USER } from '../services/mockData';
import { api } from '../services/api';
import {
  buildChallenges,
  buildLessonSteps,
  buildLessonSummary,
  buildMissions,
  buildUserProfile,
  mapClientThemeToServer,
  mapServerThemeToClient,
} from '../services/dataTransforms';

interface AppDataContextType {
  user: User;
  lessons: Lesson[];
  missions: Mission[];
  challenges: Challenge[];
  activeLesson: Lesson | null;
  loading: boolean;
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  updateMissionProgress: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  updateCustomization: (customization: CharacterCustomization) => void;
  setTheme: (themeId: ThemeId) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const applyThemeClass = useCallback(
    (themeId: ThemeId) => {
      if (typeof document === 'undefined') return;
      document.body.classList.remove('theme-cyber', 'theme-game', 'theme-sport');
      document.body.classList.add(`theme-${themeId}`);
    },
    [],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [academyPayload, arenaPayload, missionsPayload] = await Promise.all([
        api.fetchAcademy(),
        api.fetchArena(),
        api.fetchMissions(),
      ]);

      const serverThemeId = academyPayload?.profile?.theme?.id;
      const clientTheme = mapServerThemeToClient(serverThemeId);
      const lessonNodes = (academyPayload?.path ?? []).filter((node: any) => node.type === 'lesson');
      const lessonSummaries = lessonNodes.map((node: any, index: number) => buildLessonSummary(node, index));

      const lessonDetails = await Promise.all(
        lessonSummaries.map(async (lesson) => {
          try {
            const payload = await api.fetchLesson(lesson.id);
            return buildLessonSteps({ ...payload, id: lesson.id }, serverThemeId);
          } catch (error) {
            console.error('Não foi possível carregar a lição', lesson.id, error);
            return [];
          }
        }),
      );

      const lessonsWithSteps = lessonSummaries.map((lesson, index) => ({
        ...lesson,
        steps: lessonDetails[index],
      }));

      const rotation = missionsPayload?.rotation;
      setLessons(lessonsWithSteps);
      setChallenges(buildChallenges(arenaPayload?.challenges ?? []));
      setMissions(buildMissions(rotation));
      setUser((prev) => ({
        ...buildUserProfile(academyPayload?.profile, lessonsWithSteps, rotation),
        customization: prev.customization,
      }));
      applyThemeClass(clientTheme);
    } catch (error) {
      console.error('Erro ao sincronizar dados do Botocode', error);
    } finally {
      setLoading(false);
    }
  }, [applyThemeClass]);

  // Apply Theme Effect
  useEffect(() => {
    applyThemeClass(user.activeTheme);
  }, [applyThemeClass, user.activeTheme]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const startLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && !lesson.locked) {
      setActiveLesson(lesson);
    }
  };

  const completeLesson = async (lessonId: string, earnedXp: number) => {
    try {
      await api.completeLesson(lessonId, {
        heartsLeft: user.hearts,
        streak: user.streak,
        earnedXp,
      });
      setActiveLesson(null);
      await loadData();
    } catch (error) {
      console.error('Falha ao concluir lição', error);
    }
  };

  const updateMissionProgress = (amount: number) => {
    if (!amount) return;
  };

  const loseHeart = () => {
    if (user.hearts > 0) {
      setUser(prev => ({ ...prev, hearts: prev.hearts - 1 }));
    }
  };

  const refillHearts = () => {
    setUser(prev => ({ ...prev, hearts: prev.maxHearts }));
  };

  const updateCustomization = (customization: CharacterCustomization) => {
    setUser(prev => ({ ...prev, customization }));
  };

  const setTheme = async (themeId: ThemeId) => {
    setUser(prev => ({ ...prev, activeTheme: themeId }));
    try {
      await api.changeTheme(mapClientThemeToServer(themeId));
      await loadData();
    } catch (error) {
      console.error('Não foi possível atualizar o tema', error);
    }
  };

  return (
    <AppDataContext.Provider value={{
      user,
      lessons,
      missions,
      challenges,
      activeLesson,
      loading,
      startLesson,
      completeLesson,
      updateMissionProgress,
      loseHeart,
      refillHearts,
      updateCustomization,
      setTheme
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};