const express = require("express");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const { AppError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");

const router = express.Router();
const prisma = new PrismaClient();

// Verify webhook signature
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers["x-webhook-signature"];
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    throw new AppError("Missing webhook signature", 401);
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  if (signature !== expectedSignature) {
    throw new AppError("Invalid webhook signature", 401);
  }

  next();
};

// Patient updated webhook
router.post(
  "/patient-updated",
  verifyWebhookSignature,
  async (req, res, next) => {
    try {
      const { event, doctype, doc_name, data } = req.body;

      logger.info(`Webhook received: ${event} for ${doctype} ${doc_name}`);

      // TODO: Implement patient cache update logic
      // Update patient cache in PostgreSQL
      // Invalidate Redis cache
      // Emit Socket.io event if needed

      res.json({ success: true, message: "Webhook processed" });
    } catch (error) {
      next(error);
    }
  },
);

// Appointment created webhook
router.post(
  "/appointment-created",
  verifyWebhookSignature,
  async (req, res, next) => {
    try {
      const { event, doctype, doc_name, data } = req.body;

      logger.info(`Webhook received: ${event} for ${doctype} ${doc_name}`);

      // TODO: Implement appointment queue logic
      // Add to appointment queue
      // Send notification to patient
      // Emit Socket.io event for real-time updates

      res.json({ success: true, message: "Webhook processed" });
    } catch (error) {
      next(error);
    }
  },
);

// Appointment updated webhook
router.post(
  "/appointment-updated",
  verifyWebhookSignature,
  async (req, res, next) => {
    try {
      const { event, doctype, doc_name, data } = req.body;

      logger.info(`Webhook received: ${event} for ${doctype} ${doc_name}`);

      // Sync appointment status from Frappe to local database
      if (doctype === "Patient Appointment" && doc_name) {
        const updated = await prisma.appointment.updateMany({
          where: { frappeAppointmentId: doc_name },
          data: {
            status: data?.status || "Open",
            practitioner: data?.practitioner,
            appointmentDate: data?.appointment_date
              ? new Date(data.appointment_date)
              : undefined,
            appointmentTime: data?.appointment_time,
          },
        });

        logger.info(
          `Updated ${updated.count} local appointments for ${doc_name}`,
        );

        // TODO: Send notification to patient about status change
        // TODO: Emit Socket.io event for real-time updates
      }

      res.json({ success: true, message: "Webhook processed" });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
