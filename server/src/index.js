require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

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
  res.json({
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

app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/devices", require("./routes/deviceRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected...");

    await db.sync();
    console.log("✅ Database synchronized...");

    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Unable to connect to the database:",
      error.message
    );

    process.exit(1);
  }
};

startServer();