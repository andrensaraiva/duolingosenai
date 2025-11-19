const express = require("express");
const {
  getMissionsWithStatus,
  completeMission,
  consumeBooster,
  getProfile,
  getDailyRotation,
} = require("../progressStore");

const router = express.Router();

router.get("/", (_req, res) => {
  return res.json({
    rotation: getDailyRotation(),
    catalog: getMissionsWithStatus(),
    profile: getProfile(),
  });
});

router.post("/:missionId/complete", (req, res) => {
  try {
    const { choice } = req.body ?? {};
    const data = completeMission(req.params.missionId, choice);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/boosters/:boosterType/use", (req, res) => {
  try {
    const data = consumeBooster(req.params.boosterType);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
