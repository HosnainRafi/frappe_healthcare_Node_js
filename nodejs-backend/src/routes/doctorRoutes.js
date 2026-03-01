const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get list of doctors
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 */
router.get("/", doctorController.getAllDoctors);

/**
 * @swagger
 * /doctors/departments:
 *   get:
 *     summary: Get list of departments/specializations
 *     tags: [Doctors]
 */
router.get("/departments", doctorController.getDepartments);

/**
 * @swagger
 * /doctors/specializations:
 *   get:
 *     summary: Get list of specializations
 *     tags: [Doctors]
 */
router.get("/specializations", doctorController.getDepartments);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor details
 *     tags: [Doctors]
 */
router.get("/:id", doctorController.getDoctorById);

/**
 * @swagger
 * /doctors/{id}/slots:
 *   get:
 *     summary: Get available time slots for doctor
 *     tags: [Doctors]
 */
router.get("/:id/slots", doctorController.getAvailableSlots);

module.exports = router;
