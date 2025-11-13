const express = require("express");
const cors = require("cors");

const academyRoutes = require("./routes/academy");
const arenaRoutes = require("./routes/arena");

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use((req, _res, next) => {
    req.context = { startedAt: new Date().toISOString() };
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/academy", academyRoutes);
  app.use("/api/arena", arenaRoutes);

  return app;
};

const startServer = (port = process.env.PORT || 4000) => {
  const app = createApp();
  return app.listen(port, () => {
    console.log(`CodeSpark API rodando na porta ${port}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { createApp, startServer };
