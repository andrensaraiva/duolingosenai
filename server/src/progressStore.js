const { academyPath, lessonContent } = require("./data/academy");
const { arenaChallenges } = require("./data/arena");

const MAX_LIVES = 3;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const progressState = {
  completedLessons: new Set(),
  completedCheckpoints: new Set(),
  xp: 0,
  bestChallengeResults: {},
  lives: MAX_LIVES,
  streak: 1,
};

const getLessonReward = (lessonId) => {
  const node = academyPath.find((item) => item.id === lessonId);
  return node?.rewardXp ?? 0;
};

const getCheckpointReward = (checkpointId) => {
  const node = academyPath.find((item) => item.id === checkpointId);
  return node?.rewardXp ?? 0;
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

    return {
      ...node,
      status,
    };
  });
};

const getLesson = (lessonId) => {
  const lesson = lessonContent[lessonId];
  if (!lesson) {
    return null;
  }
  const pathNode = academyPath.find((item) => item.id === lessonId);
  return {
    id: lessonId,
    title: pathNode?.title ?? "",
    skill: pathNode?.skill ?? "",
    durationMinutes: lesson.durationMinutes,
    cards: lesson.cards,
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

const getCheckpointStatus = (checkpointId) => {
  return getPathWithStatus().find((node) => node.id === checkpointId)?.status ?? "locked";
};

const getChallengesWithStatus = () => {
  return arenaChallenges.map((challenge) => {
    const checkpointStatus = getCheckpointStatus(challenge.checkpointId);

    const bestResult = progressState.bestChallengeResults[challenge.id];

    return {
      ...challenge,
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

const buildPath = (analysis) => {
  const positions = [{ x: 0, y: 0 }];
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

  for (let index = 0; index < totalSteps; index += 1) {
    const delta = directions[index % directions.length];
    current = { x: current.x + delta.x, y: current.y + delta.y };
    positions.push({ ...current });
  }

  return positions;
};

const simulateChallenge = (challengeId, code = "") => {
  const challenge = arenaChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const analysis = analyzeCode(code);
  const path = buildPath(analysis);

  const automationScore =
    analysis.assignments * 4 +
    analysis.conditionals * 6 +
    analysis.loops * 9 +
    analysis.functions * 5 +
    analysis.listComprehensions * 10 +
    analysis.datasets * 3 +
    analysis.comments;

  const resourcesCollected = Math.min(
    challenge.goals.resources,
    Math.max(1, Math.round(automationScore / 6))
  );

  const time = Math.max(
    20,
    challenge.goals.maxTime - analysis.loops * 4 - analysis.conditionals * 2 - analysis.functions
  );

  const efficiency = Number(
    Math.min(120, (resourcesCollected / time) * 140).toFixed(1)
  );

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

const getProfile = () => ({
  xp: progressState.xp,
  completedLessons: progressState.completedLessons.size,
  completedCheckpoints: progressState.completedCheckpoints.size,
  lives: progressState.lives,
  streak: progressState.streak,
});

module.exports = {
  getPathWithStatus,
  getLesson,
  completeLesson,
  completeCheckpoint,
  getChallengesWithStatus,
  simulateChallenge,
  recordChallengeResult,
  getProfile,
};
