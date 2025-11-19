const { academyPath, lessonContent } = require("./data/academy");
const { arenaChallenges } = require("./data/arena");
const { missionsCatalog, boosterCatalog, missionModifiers } = require("./data/missions");
const { themeOptions, defaultThemeId } = require("./data/themes");

const MAX_LIVES = 3;
const ROTATION_DURATION_MS = 24 * 60 * 60 * 1000;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const progressState = {
  completedLessons: new Set(),
  completedCheckpoints: new Set(),
  completedMissions: new Set(),
  xp: 0,
  bestChallengeResults: {},
  lives: MAX_LIVES,
  streak: 1,
  currency: 0,
  boostersInventory: {
    turboFarm: 0,
    heartShield: 0,
    insightRadar: 0,
  },
  activeBoosters: {},
  weeklyStats: {
    weekStart: Date.now(),
    missionsCompleted: 0,
    goal: 5,
  },
  dailyRotation: {
    missions: [],
    generatedAt: 0,
    expiresAt: 0,
    completed: new Set(),
  },
  selectedTheme: defaultThemeId,
};

const themeMap = themeOptions.reduce((acc, theme) => {
  acc[theme.id] = theme;
  return acc;
}, {});

const cloneTheme = (theme) => {
  if (!theme) return null;
  return {
    ...theme,
    hero: {
      academy: { ...(theme.hero?.academy ?? {}) },
      arena: { ...(theme.hero?.arena ?? {}) },
      missions: { ...(theme.hero?.missions ?? {}) },
    },
    tokens: { ...(theme.tokens ?? {}) },
  };
};

const getActiveThemeId = () => {
  const hasTheme = themeMap[progressState.selectedTheme];
  return hasTheme ? progressState.selectedTheme : defaultThemeId;
};

const getActiveTheme = () => {
  const theme = themeMap[getActiveThemeId()];
  return cloneTheme(theme ?? themeMap[defaultThemeId]);
};

const getThemeOptions = () => themeOptions.map((theme) => cloneTheme(theme));

const setTheme = (themeId) => {
  if (!themeMap[themeId]) {
    throw new Error("Tema não encontrado");
  }
  progressState.selectedTheme = themeId;
  return getActiveTheme();
};

const applyThemeToNode = (node) => {
  if (!node) return null;
  const themeId = getActiveThemeId();
  const overrides = node.themes?.[themeId];
  const { themes, ...rest } = node;
  if (!overrides) {
    return { ...rest };
  }
  return { ...rest, ...overrides };
};

const applyThemeToLesson = (lesson) => {
  if (!lesson) return null;
  const themeId = getActiveThemeId();
  const { themes, cards = [], ...rest } = lesson;
  const overrides = themes?.[themeId] ?? {};
  const clonedCards = cards.map((card) => ({ ...card }));
  let themedCards = clonedCards;
  if (Array.isArray(overrides.cards) && overrides.cards.length === clonedCards.length) {
    themedCards = clonedCards.map((card, index) => ({ ...card, ...(overrides.cards[index] ?? {}) }));
  }
  const { cards: _ignoredCards, ...lessonOverrides } = overrides;
  return { ...rest, ...lessonOverrides, cards: themedCards };
};

const applyThemeToChallenge = (challenge) => {
  if (!challenge) return null;
  const themeId = getActiveThemeId();
  const overrides = challenge.themes?.[themeId];
  const { themes, ...rest } = challenge;
  if (!overrides) {
    return { ...rest };
  }
  return { ...rest, ...overrides };
};

const applyThemeToMission = (mission) => {
  if (!mission) return null;
  const themeId = getActiveThemeId();
  const overrides = mission.themes?.[themeId];
  const { themes, ...rest } = mission;
  if (!overrides) {
    return { ...rest };
  }
  return { ...rest, ...overrides };
};

const shuffle = (input) => {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const createDailyRotation = () => {
  const now = Date.now();
  const selectedMissions = shuffle(missionsCatalog).slice(0, 3).map((mission) => {
    const modifier = missionModifiers[Math.floor(Math.random() * missionModifiers.length)];
    return {
      missionId: mission.id,
      modifier,
      bonus: {
        xp: modifier?.bonusXp ?? 4,
        currency: modifier?.bonusCurrency ?? 3,
      },
    };
  });

  progressState.dailyRotation = {
    missions: selectedMissions,
    generatedAt: now,
    expiresAt: now + ROTATION_DURATION_MS,
    completed: new Set(),
  };
};

const ensureDailyRotation = () => {
  const now = Date.now();
  if (
    !progressState.dailyRotation.missions.length ||
    !progressState.dailyRotation.expiresAt ||
    now >= progressState.dailyRotation.expiresAt
  ) {
    createDailyRotation();
  }
};

const ensureWeeklyWindow = () => {
  const now = Date.now();
  const weekStart = progressState.weeklyStats.weekStart;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  if (!weekStart || now - weekStart > oneWeek) {
    progressState.weeklyStats = {
      weekStart: now,
      missionsCompleted: 0,
      goal: 5,
    };
  }
};

const cleanupActiveBoosters = () => {
  const now = Date.now();
  const { activeBoosters } = progressState;
  if (activeBoosters.turboFarm && activeBoosters.turboFarm.expiresAt <= now) {
    delete activeBoosters.turboFarm;
  }
};

const getLessonReward = (lessonId) => {
  const node = academyPath.find((item) => item.id === lessonId);
  return node?.rewardXp ?? 0;
};

const getCheckpointReward = (checkpointId) => {
  const node = academyPath.find((item) => item.id === checkpointId);
  return node?.rewardXp ?? 0;
};

const getWeeklyStats = () => {
  ensureWeeklyWindow();
  const { missionsCompleted, goal } = progressState.weeklyStats;
  return { missionsCompleted, goal };
};

const serializeMission = (mission, statusOverride = null) => {
  const themedMission = applyThemeToMission(mission) ?? mission;
  const { answer, acceptedAnswers, ...rest } = themedMission;
  return {
    ...rest,
    status: statusOverride ?? (progressState.completedMissions.has(mission.id) ? "completed" : "available"),
  };
};

const getMissionsWithStatus = () => missionsCatalog.map(serializeMission);

const getDailyRotation = () => {
  ensureDailyRotation();
  const rotation = progressState.dailyRotation;
  const missions = rotation.missions
    .map((slot) => {
      const mission = missionsCatalog.find((item) => item.id === slot.missionId);
      if (!mission) return null;
      const status = rotation.completed.has(slot.missionId) ? "completed" : "available";
      return {
        ...serializeMission(mission, status),
        modifier: slot.modifier,
        bonus: slot.bonus,
      };
    })
    .filter(Boolean);

  return {
    missions,
    generatedAt: rotation.generatedAt,
    expiresAt: rotation.expiresAt,
    remainingSeconds: Math.max(0, Math.floor((rotation.expiresAt - Date.now()) / 1000)),
    completed: rotation.completed.size,
    total: missions.length,
  };
};

const getPathWithStatus = () => {
  let nextAvailable = true;

  return academyPath.map((node) => {
    const isCompleted =
      node.type === "lesson"
        ? progressState.completedLessons.has(node.id)
        : progressState.completedCheckpoints.has(node.id);

    let status;
    if (isCompleted) {
      status = "completed";
      nextAvailable = true;
    } else if (nextAvailable) {
      status = "available";
      nextAvailable = false;
    } else {
      status = "locked";
    }

    const themedNode = applyThemeToNode(node) ?? node;

    return {
      ...themedNode,
      status,
    };
  });
};

const getLesson = (lessonId) => {
  const lesson = lessonContent[lessonId];
  if (!lesson) {
    return null;
  }
  const pathNode = applyThemeToNode(academyPath.find((item) => item.id === lessonId));
  const themedLesson = applyThemeToLesson(lesson);
  return {
    id: lessonId,
    title: pathNode?.title ?? "",
    skill: pathNode?.skill ?? "",
    durationMinutes: themedLesson?.durationMinutes ?? lesson.durationMinutes,
    cards: themedLesson?.cards ?? lesson.cards,
    rewardXp: pathNode?.rewardXp ?? 0,
  };
};

const completeLesson = (lessonId, stats = {}) => {
  if (!academyPath.find((node) => node.id === lessonId && node.type === "lesson")) {
    throw new Error("Lesson not found");
  }

  const wasCompleted = progressState.completedLessons.has(lessonId);
  progressState.completedLessons.add(lessonId);

  if (!wasCompleted) {
    progressState.xp += getLessonReward(lessonId);
  }

  if (typeof stats.heartsLeft === "number") {
    progressState.lives = clamp(stats.heartsLeft, 0, MAX_LIVES);
  }

  if (typeof stats.streak === "number") {
    progressState.streak = Math.max(1, stats.streak);
  } else if (!wasCompleted) {
    progressState.streak += 1;
  }

  return {
    xp: progressState.xp,
    completedLessons: Array.from(progressState.completedLessons),
    lives: progressState.lives,
    streak: progressState.streak,
  };
};

const completeMission = (missionId, choice) => {
  ensureWeeklyWindow();
  ensureDailyRotation();
  const mission = missionsCatalog.find((item) => item.id === missionId);
  if (!mission) {
    throw new Error("Missão não encontrada");
  }

  const rotation = progressState.dailyRotation;
  const rotationEntry = rotation.missions.find((item) => item.missionId === missionId);
  if (!rotationEntry) {
    throw new Error("Missão fora da rotação diária. Aguarde o próximo reset.");
  }

  if (rotation.completed.has(missionId)) {
    throw new Error("Missão diária já concluída. Concentre-se nas demais até o reset.");
  }

  const acceptedAnswers = mission.acceptedAnswers ?? (mission.answer ? [mission.answer] : []);
  if (!choice || !acceptedAnswers.includes(choice)) {
    throw new Error("Resposta incorreta. Revise o conceito e tente novamente.");
  }

  rotation.completed.add(missionId);
  progressState.completedMissions.add(missionId);

  const baseXp = mission.rewardXp;
  const baseCurrency = mission.rewardCurrency;
  const bonusXp = rotationEntry.bonus?.xp ?? 0;
  const bonusCurrency = rotationEntry.bonus?.currency ?? 0;
  const totalXp = baseXp + bonusXp;
  const totalCurrency = baseCurrency + bonusCurrency;

  progressState.xp += totalXp;
  progressState.currency += totalCurrency;
  const boosterKey = mission.rewardBooster;
  progressState.boostersInventory[boosterKey] = (progressState.boostersInventory[boosterKey] || 0) + 1;
  progressState.weeklyStats.missionsCompleted += 1;

  return {
    mission: serializeMission(mission, "completed"),
    modifier: rotationEntry.modifier,
    reward: {
      xp: totalXp,
      currency: totalCurrency,
      booster: boosterKey,
      bonus: rotationEntry.bonus,
    },
    profile: getProfile(),
    weekly: getWeeklyStats(),
    rotation: getDailyRotation(),
  };
};

const completeCheckpoint = (checkpointId) => {
  if (!academyPath.find((node) => node.id === checkpointId && node.type === "checkpoint")) {
    throw new Error("Checkpoint not found");
  }

  const wasCompleted = progressState.completedCheckpoints.has(checkpointId);
  progressState.completedCheckpoints.add(checkpointId);

  if (!wasCompleted) {
    progressState.xp += getCheckpointReward(checkpointId);
    progressState.lives = MAX_LIVES;
  }

  return {
    xp: progressState.xp,
    completedCheckpoints: Array.from(progressState.completedCheckpoints),
    lives: progressState.lives,
  };
};

const consumeBooster = (boosterType) => {
  const inventory = progressState.boostersInventory[boosterType] ?? 0;
  if (inventory <= 0) {
    throw new Error("Booster indisponível");
  }

  progressState.boostersInventory[boosterType] = inventory - 1;
  let effect = null;
  const now = Date.now();

  switch (boosterType) {
    case "turboFarm": {
      const duration = (boosterCatalog.turboFarm?.durationMinutes ?? 15) * 60 * 1000;
      progressState.activeBoosters.turboFarm = {
        expiresAt: now + duration,
      };
      effect = { type: "turboFarm", expiresAt: progressState.activeBoosters.turboFarm.expiresAt };
      break;
    }
    case "heartShield": {
      progressState.lives = clamp(progressState.lives + 1, 0, MAX_LIVES);
      effect = { type: "heartShield", lives: progressState.lives };
      break;
    }
    case "insightRadar": {
      progressState.activeBoosters.insightRadar = { charges: 1 };
      effect = { type: "insightRadar" };
      break;
    }
    default:
      throw new Error("Booster desconhecido");
  }

  return {
    effect,
    profile: getProfile(),
  };
};

const getCheckpointStatus = (checkpointId) => {
  return getPathWithStatus().find((node) => node.id === checkpointId)?.status ?? "locked";
};

const getChallengesWithStatus = () => {
  return arenaChallenges.map((challenge) => {
    const checkpointStatus = getCheckpointStatus(challenge.checkpointId);

    const bestResult = progressState.bestChallengeResults[challenge.id];
    const themedChallenge = applyThemeToChallenge(challenge) ?? challenge;

    return {
      ...themedChallenge,
      status: "available",
      bestResult,
      ranking: bestResult ? generateRanking(bestResult) : null,
      checkpointStatus,
    };
  });
};

const generateRanking = (bestResult) => {
  if (!bestResult) {
    return null;
  }

  const base = 5000;
  const boost = Math.max(0, 120 - bestResult.time) * 5;
  const position = Math.max(1, Math.round(base - boost));
  return {
    position,
    totalPlayers: 15000,
  };
};

const analyzeCode = (code = "") => {
  const cleaned = code || "";
  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const assignments = (cleaned.match(/^\s*[a-zA-Z_][\w]*\s*=/gm) || []).length;
  const conditionals = (cleaned.match(/\bif\b/g) || []).length + (cleaned.match(/\belse\b/g) || []).length;
  const loops = (cleaned.match(/\bfor\b/g) || []).length + (cleaned.match(/\bwhile\b/g) || []).length;
  const functions = (cleaned.match(/\bdef\b/g) || []).length;
  const listComprehensions = (cleaned.match(/\[[^\]]+\bfor\b/g) || []).length;
  const comments = (cleaned.match(/#/g) || []).length;
  const datasets = (cleaned.match(/\[[^\]]*\]|{[^}]*}/g) || []).length;

  return {
    lines,
    assignments,
    conditionals,
    loops,
    functions,
    listComprehensions,
    comments,
    datasets,
  };
};

const stageVectors = {
  entrada: [
    { x: 1, y: 0 },
    { x: 1, y: 0 },
  ],
  processamento: [
    { x: 0, y: 1 },
    { x: 0, y: 1 },
  ],
  resposta: [
    { x: 1, y: 1 },
    { x: 0, y: -1 },
  ],
};

const buildPath = (analysis, pipelineStages = []) => {
  const positions = [{ x: 0, y: 0, stageId: null }];
  let current = { x: 0, y: 0 };
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];
  const totalSteps = Math.max(
    6,
    analysis.lines.length + analysis.assignments + analysis.conditionals + analysis.loops * 2 + analysis.listComprehensions * 3
  );

  const pushStep = (delta, stageId = null) => {
    current = { x: current.x + delta.x, y: current.y + delta.y };
    positions.push({ ...current, stageId });
  };

  for (let index = 0; index < totalSteps; index += 1) {
    const delta = directions[index % directions.length];
    pushStep(delta);
  }

  pipelineStages.forEach((stage) => {
    const vectors = stageVectors[stage.category] ?? [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];
    const stageLength = Math.max(
      2,
      Math.round(2 + (stage.effects.resources ?? 0) / 1.5 + (stage.effects.efficiency ?? 0) / 4)
    );
    for (let index = 0; index < stageLength; index += 1) {
      const delta = vectors[index % vectors.length];
      pushStep(delta, stage.id);
    }
  });

  return positions;
};

const simulateChallenge = (challengeId, code = "", options = {}) => {
  const challenge = arenaChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const params = options.params ?? {};
  const requestedSensors = typeof params.sensorCount === "number" ? params.sensorCount : challenge.goals.resources;
  const targetResources = Math.max(challenge.goals.resources, requestedSensors);
  const requestedMaxTime = typeof params.maxTime === "number" ? params.maxTime : challenge.goals.maxTime;
  const targetMaxTime = Math.max(15, Math.min(challenge.goals.maxTime, requestedMaxTime));
  const anomalyThreshold = typeof params.anomalyThreshold === "number" ? params.anomalyThreshold : 30;

  const blueprint = challenge.blueprint ?? {};
  const moduleMap = (blueprint.modules ?? []).reduce((acc, module) => {
    acc[module.id] = module;
    return acc;
  }, {});
  const rawLayout = Array.isArray(options.layout) ? options.layout : [];
  const layoutLimit = blueprint.maxPipelineLength && blueprint.maxPipelineLength > 0 ? blueprint.maxPipelineLength : rawLayout.length;
  const selectedModules = rawLayout
    .slice(0, layoutLimit || rawLayout.length)
    .map((moduleId) => moduleMap[moduleId])
    .filter(Boolean);

  const analysis = analyzeCode(code);

  const automationScore =
    analysis.assignments * 4 +
    analysis.conditionals * 6 +
    analysis.loops * 9 +
    analysis.functions * 5 +
    analysis.listComprehensions * 10 +
    analysis.datasets * 3 +
    analysis.comments;

  const pipelineStages = selectedModules.map((module) => ({
    id: module.id,
    label: module.label,
    category: module.category,
    effects: {
      resources: module.resourceBoost ?? 0,
      efficiency: module.efficiencyBoost ?? 0,
      time: module.timeImpact ?? 0,
    },
  }));

  let pipelineResourceBonus = 0;
  let pipelineEfficiencyBonus = 0;
  let pipelineTimeImpact = 0;

  pipelineStages.forEach((stage) => {
    pipelineResourceBonus += stage.effects.resources;
    pipelineEfficiencyBonus += stage.effects.efficiency;
    pipelineTimeImpact += stage.effects.time;
  });

  if (selectedModules.length) {
    const diversity = new Set(selectedModules.map((module) => module.category)).size;
    pipelineEfficiencyBonus += Number((diversity * 0.8).toFixed(2));
  }

  const path = buildPath(analysis, pipelineStages);

  const baseResources = Math.max(1, Math.round(automationScore / 6));
  let resourcesCollected = baseResources + pipelineResourceBonus;
  resourcesCollected = Math.min(targetResources, Math.max(1, resourcesCollected));

  let time = Math.max(
    15,
    targetMaxTime - analysis.loops * 4 - analysis.conditionals * 2 - analysis.functions + pipelineTimeImpact
  );
  time = Number(time.toFixed(1));

  const thresholdBonus = anomalyThreshold < 25 ? (25 - anomalyThreshold) * 0.2 : 0;
  const thresholdPenalty = anomalyThreshold > 45 ? (anomalyThreshold - 45) * 0.25 : 0;

  let efficiency = (resourcesCollected / time) * 140 + pipelineEfficiencyBonus + thresholdBonus - thresholdPenalty;
  efficiency = Number(Math.min(135, Math.max(10, efficiency)).toFixed(1));

  let hint = null;
  if (progressState.activeBoosters.insightRadar?.charges) {
    progressState.activeBoosters.insightRadar.charges -= 1;
    hint = "Radar sinalizou: use loops e condicionais extras para otimizar o tempo.";
    if (progressState.activeBoosters.insightRadar.charges <= 0) {
      delete progressState.activeBoosters.insightRadar;
    }
  }

  if (!hint && !selectedModules.length) {
    hint = "Monte pelo menos um estágio no Flow Builder para liberar mais recursos.";
  }

  const pipeline = {
    layout: pipelineStages,
    bonus: {
      resources: pipelineResourceBonus,
      efficiency: Number(pipelineEfficiencyBonus.toFixed(1)),
      time: pipelineTimeImpact,
    },
  };

  return {
    challengeId,
    time,
    resourcesCollected,
    efficiency,
    path,
    loopsUsed: analysis.loops,
    insights: {
      assignments: analysis.assignments,
      conditionals: analysis.conditionals,
      loops: analysis.loops,
    },
    paramsUsed: {
      targetResources,
      targetMaxTime,
      anomalyThreshold,
    },
    pipeline,
    hint,
  };
};

const recordChallengeResult = (challengeId, code, simulation) => {
  const existing = progressState.bestChallengeResults[challengeId];
  if (!existing || simulation.time < existing.time) {
    progressState.bestChallengeResults[challengeId] = {
      ...simulation,
      code,
      submittedAt: new Date().toISOString(),
    };
  }

  return progressState.bestChallengeResults[challengeId];
};

const getProfile = () => {
  cleanupActiveBoosters();
  return {
    xp: progressState.xp,
    completedLessons: progressState.completedLessons.size,
    completedCheckpoints: progressState.completedCheckpoints.size,
    lives: progressState.lives,
    streak: progressState.streak,
    currency: progressState.currency,
    boosters: { ...progressState.boostersInventory },
    activeBoosters: { ...progressState.activeBoosters },
    weekly: getWeeklyStats(),
    theme: getActiveTheme(),
  };
};

module.exports = {
  getPathWithStatus,
  getLesson,
  completeLesson,
  completeCheckpoint,
  getChallengesWithStatus,
  simulateChallenge,
  recordChallengeResult,
  getMissionsWithStatus,
  getDailyRotation,
  completeMission,
  consumeBooster,
  getProfile,
  getThemeOptions,
  setTheme,
  getActiveTheme,
};
