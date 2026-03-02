const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const patientController = require("../controllers/patientController");
const medicalHistoryController = require("../controllers/medicalHistoryController");

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
 * /patients/medical-history:
 *   get:
 *     summary: Get patient medical history from Frappe Healthcare
 *     tags: [Patients]
 */
router.get(
  "/medical-history",
  authMiddleware,
  medicalHistoryController.getMedicalHistory,
);

/**
 * @swagger
 * /patients/medical-history:
 *   post:
 *     summary: Add a medical history entry (syncs to Frappe)
 *     tags: [Patients]
 */
router.post(
  "/medical-history",
  authMiddleware,
  medicalHistoryController.addMedicalHistory,
);

/**
 * @swagger
 * /patients/medical-history/{id}:
 *   delete:
 *     summary: Delete a medical history entry
 *     tags: [Patients]
 */
router.delete(
  "/medical-history/:id",
  authMiddleware,
  medicalHistoryController.deleteMedicalHistory,
);

/**
 * @swagger
 * /patients/lab-results:
 *   get:
 *     summary: Get patient lab test results from Frappe
 *     tags: [Patients]
 */
router.get(
  "/lab-results",
  authMiddleware,
  medicalHistoryController.getLabResults,
);

/**
 * @swagger
 * /patients/vital-signs:
 *   get:
 *     summary: Get patient vital signs from Frappe
 *     tags: [Patients]
 */
router.get(
  "/vital-signs",
  authMiddleware,
  medicalHistoryController.getVitalSigns,
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
