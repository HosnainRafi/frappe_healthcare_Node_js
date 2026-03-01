const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const { validate, schemas } = require("../middlewares/validator");
const { bookingLimiter } = require("../middlewares/rateLimiter");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

/**
 * @swagger
 * /appointments/book:
 *   post:
 *     summary: Book an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/book",
  authMiddleware,
  bookingLimiter,
  validate(schemas.appointmentBooking),
  appointmentController.bookAppointment,
);

/**
 * @swagger
 * /appointments/my:
 *   get:
 *     summary: Get my appointments
 *     tags: [Appointments]
 */
router.get("/my", authMiddleware, appointmentController.getMyAppointments);

/**
 * @swagger
 * /appointments/slots:
 *   get:
 *     summary: Get available slots
 *     tags: [Appointments]
 */
router.get("/slots", appointmentController.getAvailableSlots);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   put:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 */
router.put("/:id/cancel", authMiddleware, appointmentController.cancelAppointment);

/**
 * @swagger
 * /appointments/{id}/reschedule:
 *   put:
 *     summary: Reschedule an appointment
 *     tags: [Appointments]
 */
router.put("/:id/reschedule", authMiddleware, appointmentController.rescheduleAppointment);

module.exports = router;
