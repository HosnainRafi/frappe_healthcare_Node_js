const Joi = require("joi");
const { AppError } = require("./errorHandler");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(new AppError(errorMessage, 400));
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  patientRegistration: Joi.object({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().optional().max(50),
    email: Joi.string().email().required(),
    mobile: Joi.string()
      .optional()
      .pattern(/^[0-9]{10,15}$/),
    password: Joi.string().required().min(8),
    dob: Joi.date().optional().max("now"),
    gender: Joi.string().optional().valid("Male", "Female", "Other"),
    bloodGroup: Joi.string()
      .optional()
      .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  appointmentBooking: Joi.object({
    practitioner: Joi.string().required(),
    appointment_date: Joi.date().required().min("now"),
    appointment_time: Joi.string()
      .required()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    department: Joi.string().optional().allow(""),
    notes: Joi.string().optional().allow("").max(500),
  }),

  updateAppointmentStatus: Joi.object({
    status: Joi.string()
      .required()
      .valid("Confirmed", "Cancelled", "Completed", "No Show"),
  }),
};

module.exports = { validate, schemas };
