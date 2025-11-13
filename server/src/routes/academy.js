const express = require("express");
const {
  getPathWithStatus,
  getLesson,
  completeLesson,
  completeCheckpoint,
  getProfile,
} = require("../progressStore");

const router = express.Router();

router.get("/path", (req, res) => {
  return res.json({
    path: getPathWithStatus(),
    profile: getProfile(),
  });
});

router.get("/lessons/:lessonId", (req, res) => {
  const lesson = getLesson(req.params.lessonId);
  if (!lesson) {
    return res.status(404).json({ message: "Lição não encontrada" });
  }

  return res.json(lesson);
});

router.post("/lessons/:lessonId/complete", (req, res) => {
  try {
    const data = completeLesson(req.params.lessonId, req.body ?? {});
    return res.json({
      message: "Lição concluída",
      path: getPathWithStatus(),
      profile: getProfile(),
      progress: data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/checkpoints/:checkpointId/complete", (req, res) => {
  try {
    const data = completeCheckpoint(req.params.checkpointId);
    return res.json({
      message: "Checkpoint liberado",
      path: getPathWithStatus(),
      profile: getProfile(),
      progress: data,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
