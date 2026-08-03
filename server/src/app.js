const path = require("path");

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
const deviceModelRoutes = require("./routes/deviceModelRoutes");
const intakeRoutes = require("./routes/intakeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const statsRoutes = require("./routes/statsRoutes");
const staffRoutes = require("./routes/staffRoutes");

const {
  auditProtectedMutation,
} = require("./middleware/auditRequest");
const requireRole = require("./middleware/requireRole");
const protectedApi = require("./middleware/protectedApi");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const isProduction =
  process.env.NODE_ENV ===
  "production";

const clientDistPath =
  path.resolve(
    __dirname,
    "../../client/dist"
  );

app.disable("x-powered-by");
app.set("trust proxy", 1);

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

app.get("/api", (req, res) => {
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
app.use(
  "/api/staff",
  ...protectedApi,
  requireRole("admin"),
  auditProtectedMutation,
  staffRoutes
);
app.use("/api/clients", ...protectedApi, auditProtectedMutation, clientRoutes);
app.use("/api/devices", ...protectedApi, auditProtectedMutation, deviceRoutes);
app.use(
  "/api/device-models",
  ...protectedApi,
  auditProtectedMutation,
  deviceModelRoutes
);
app.use("/api/intake", ...protectedApi, auditProtectedMutation, intakeRoutes);
app.use("/api/orders", ...protectedApi, auditProtectedMutation, orderRoutes);
app.use("/api/inventory", ...protectedApi, auditProtectedMutation, inventoryRoutes);
app.use("/api/stats", ...protectedApi, auditProtectedMutation, statsRoutes);

if (isProduction) {
  app.use(
    express.static(
      clientDistPath
    )
  );

  app.use(
    (
      req,
      res,
      next
    ) => {
      if (
        req.method !== "GET" ||
        req.path.startsWith(
          "/api/"
        ) ||
        req.path === "/api"
      ) {
        next();
        return;
      }

      res.sendFile(
        path.join(
          clientDistPath,
          "index.html"
        ),
        (
          error
        ) => {
          if (error) {
            next(error);
          }
        }
      );
    }
  );
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
