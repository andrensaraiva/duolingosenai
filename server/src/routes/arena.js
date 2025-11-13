const express = require("express");
const {
  getChallengesWithStatus,
  simulateChallenge,
  recordChallengeResult,
  completeCheckpoint,
  getPathWithStatus,
  getProfile,
} = require("../progressStore");
const { arenaChallenges } = require("../data/arena");

const router = express.Router();

router.get("/challenges", (req, res) => {
  return res.json({
    challenges: getChallengesWithStatus(),
  });
});

router.post("/challenges/:challengeId/simulate", (req, res) => {
  try {
    const simulation = simulateChallenge(req.params.challengeId, req.body.code ?? "");
    return res.json({ simulation });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/challenges/:challengeId/submit", (req, res) => {
  try {
    const { code = "" } = req.body;
    const challenge = arenaChallenges.find((item) => item.id === req.params.challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Desafio não encontrado" });
    }

    const simulation = simulateChallenge(challenge.id, code);
    const meetsGoal =
      simulation.resourcesCollected >= challenge.goals.resources &&
      simulation.time <= challenge.goals.maxTime * 1.3;

    const bestResult = recordChallengeResult(challenge.id, code, simulation);

    let checkpoint;
    if (meetsGoal) {
      checkpoint = completeCheckpoint(challenge.checkpointId);
    }

    return res.json({
      message: meetsGoal
        ? "Resultado enviado! Checkpoint liberado."
        : "Resultado enviado, continue otimizando para liberar o checkpoint.",
      simulation,
      meetsGoal,
      bestResult,
      path: getPathWithStatus(),
      profile: getProfile(),
      checkpoint,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
