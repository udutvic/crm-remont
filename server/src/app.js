const express = require("express");
const cors = require("cors");

const db = require("./config/database");
const {
  isAllowedOrigin,
} = require("./config/http");

const auditRoutes = require("./routes/auditRoutes");
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const intakeRoutes = require("./routes/intakeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const statsRoutes = require("./routes/statsRoutes");

const {
  auditProtectedMutation,
} = require("./middleware/auditRequest");
const requireRole = require("./middleware/requireRole");
const protectedApi = require("./middleware/protectedApi");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin(
      origin,
      callback
    ) {
      if (
        isAllowedOrigin(
          origin
        )
      ) {
        callback(
          null,
          true
        );

        return;
      }

      callback(
        new Error(
          "Origin is not allowed by CORS."
        )
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "CRM Remont API is running!",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await db.authenticate();

    res.status(200).json({
      status: "ok",
      api: "running",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      api: "running",
      database: "disconnected",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use(
  "/api/audit",
  ...protectedApi,
  requireRole("admin"),
  auditRoutes
);
app.use("/api/clients", ...protectedApi, auditProtectedMutation, clientRoutes);
app.use("/api/devices", ...protectedApi, auditProtectedMutation, deviceRoutes);
app.use("/api/intake", ...protectedApi, auditProtectedMutation, intakeRoutes);
app.use("/api/orders", ...protectedApi, auditProtectedMutation, orderRoutes);
app.use("/api/stats", ...protectedApi, auditProtectedMutation, statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;