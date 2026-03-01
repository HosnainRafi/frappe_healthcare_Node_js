require("dotenv").config();
require("express-async-errors");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const logger = require("./utils/logger");
const { errorHandler } = require("./middlewares/errorHandler");
const routes = require("./routes");
const { initializeRedis } = require("./config/redis");
const { initializeQueues } = require("./queues");
const { setupWebhooks } = require("./sync/webhookHandlers");

// Ensure logs directory exists
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/v1", routes);
app.use("/api", routes); // Alias for simpler API access

// Webhook Routes (separate from API)
app.use("/webhook", require("./routes/webhookRoutes"));

// Swagger API Documentation
if (process.env.NODE_ENV !== "production") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerSpec = require("./config/swagger");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Socket.io setup
global.io = io;
require("./socket/socketHandlers")(io);

// Initialize services
async function startServer() {
  try {
    // Initialize Redis
    await initializeRedis();
    logger.info("✓ Redis connected");

    // Initialize Bull queues
    await initializeQueues();
    logger.info("✓ Queues initialized");

    // Setup Frappe webhooks (if enabled)
    if (process.env.AUTO_SETUP_WEBHOOKS === "true") {
      await setupWebhooks();
      logger.info("✓ Frappe webhooks configured");
    }

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info("=".repeat(50));
      logger.info("🏥 Hospital Management System API");
      logger.info("=".repeat(50));
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Frappe URL: ${process.env.FRAPPE_URL}`);
      logger.info("=".repeat(50));
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

startServer();

module.exports = { app, server };
