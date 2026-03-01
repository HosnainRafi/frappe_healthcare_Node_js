const express = require("express");
const authRoutes = require("./authRoutes");
const patientRoutes = require("./patientRoutes");
const doctorRoutes = require("./doctorRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const { apiLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

// Apply rate limiting to all API routes
router.use(apiLimiter);

// Mount routes
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);

// Health check (no rate limit)
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
