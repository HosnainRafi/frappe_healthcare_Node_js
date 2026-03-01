const rateLimit = require("express-rate-limit");

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// Booking limiter (prevent spam bookings)
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 bookings per minute
  message: "Too many booking requests, please slow down.",
});

module.exports = {
  apiLimiter,
  authLimiter,
  bookingLimiter,
};
