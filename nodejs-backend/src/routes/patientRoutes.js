const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const patientController = require("../controllers/patientController");

const router = express.Router();

/**
 * @swagger
 * /patients/profile:
 *   get:
 *     summary: Get current patient profile
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 */
router.get("/profile", authMiddleware, patientController.getProfile);

/**
 * @swagger
 * /patients/profile:
 *   put:
 *     summary: Update patient profile
 *     tags: [Patients]
 */
router.put("/profile", authMiddleware, patientController.updateProfile);

/**
 * @swagger
 * /patients/medical-records:
 *   get:
 *     summary: Get patient medical records
 *     tags: [Patients]
 */
router.get(
  "/medical-records",
  authMiddleware,
  patientController.getMedicalRecords,
);

/**
 * @swagger
 * /patients/prescriptions:
 *   get:
 *     summary: Get patient prescriptions
 *     tags: [Patients]
 */
router.get(
  "/prescriptions",
  authMiddleware,
  patientController.getPrescriptions,
);

/**
 * @swagger
 * /patients/account:
 *   delete:
 *     summary: Delete patient account
 *     tags: [Patients]
 */
router.delete("/account", authMiddleware, patientController.deleteAccount);

module.exports = router;
