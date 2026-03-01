const express = require("express");
const { authLimiter } = require("../middlewares/rateLimiter");
const { validate, schemas } = require("../middlewares/validator");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * /auth/patient-login:
 *   post:
 *     summary: Patient login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/patient-login",
  // authLimiter, // Disabled for development
  validate(schemas.login),
  authController.patientLogin,
);

/**
 * @swagger
 * /auth/doctor-login:
 *   post:
 *     summary: Doctor login
 *     tags: [Authentication]
 */
router.post(
  "/doctor-login",
  // authLimiter, // Disabled for development
  validate(schemas.login),
  authController.patientLogin, // Doctors use same login for now
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Patient registration
 *     tags: [Authentication]
 */
router.post(
  "/register",
  // authLimiter, // Disabled for development
  validate(schemas.patientRegistration),
  authController.register,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Authentication]
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [Authentication]
 */
router.post(
  "/forgot-password",
  /* authLimiter, */ authController.forgotPassword,
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 */
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
