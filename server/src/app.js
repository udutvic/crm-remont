const express = require("express");
const cors = require("cors");

const db = require("./config/database");

const clientRoutes = require("./routes/clientRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const statsRoutes = require("./routes/statsRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = [
  "https://crm-remont.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

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

app.use("/api/clients", clientRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;