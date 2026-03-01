const { PrismaClient } = require("@prisma/client");
const frappe = require("../services/FrappeAPIClient");

const prisma = new PrismaClient();

// Book a new appointment - Creates Patient Appointment in Frappe Healthcare
exports.bookAppointment = async (req, res) => {
  try {
    const {
      practitioner,
      appointment_date,
      appointment_time,
      department,
      notes,
    } = req.body;

    // Get user and their Frappe Patient ID
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id || req.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.frappePatientId) {
      return res.status(400).json({
        success: false,
        message:
          "Patient profile not linked to healthcare system. Please update your profile first.",
      });
    }

    // Create appointment in Frappe Healthcare
    const appointmentData = {
      doctype: "Patient Appointment",
      patient: user.frappePatientId,
      patient_name: `${user.firstName} ${user.lastName || ""}`.trim(),
      practitioner: practitioner,
      appointment_date: appointment_date,
      appointment_time: appointment_time,
      appointment_type: "Consultation",
      appointment_for: "Patient",
      notes: notes || "",
      status: "Open",
    };

    // Only include department if provided (must exist in Frappe)
    // Department is optional for Patient Appointment

    let frappeAppointment;
    try {
      frappeAppointment = await frappe.createDocument(
        "Patient Appointment",
        appointmentData,
      );
    } catch (frappeError) {
      console.error("Failed to create appointment in Frappe:", frappeError);
      return res.status(500).json({
        success: false,
        message: "Failed to book appointment in healthcare system",
        error: frappeError.message,
      });
    }

    // Store appointment reference locally for quick access
    const localAppointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        frappeAppointmentId: frappeAppointment.name,
        practitioner: practitioner,
        appointmentDate: new Date(appointment_date),
        appointmentTime: appointment_time,
        department: department,
        status: "Open",
        notes: notes,
      },
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: {
        id: localAppointment.id,
        frappe_id: frappeAppointment.name,
        practitioner: practitioner,
        date: appointment_date,
        time: appointment_time,
        department: department,
        status: "Open",
      },
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

// Get patient's appointments from Frappe Healthcare
exports.getMyAppointments = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.frappePatientId) {
      return res.json({ success: true, data: [] });
    }

    // Fetch appointments from Frappe Healthcare
    const appointments = await frappe.getDocumentList("Patient Appointment", {
      filters: [["patient", "=", user.frappePatientId]],
      fields: [
        "name",
        "patient_name",
        "practitioner",
        "practitioner_name",
        "appointment_date",
        "appointment_time",
        "department",
        "status",
        "notes",
      ],
      order_by: "appointment_date desc",
      limit_page_length: 100,
    });

    res.json({
      success: true,
      data: appointments.map((apt) => ({
        name: apt.name,
        patient_name: apt.patient_name,
        practitioner: apt.practitioner,
        practitioner_name: apt.practitioner_name,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        department: apt.department,
        status: apt.status,
        notes: apt.notes,
      })),
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

// Get available slots for booking
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctor, date } = req.query;

    if (!doctor || !date) {
      return res.status(400).json({
        success: false,
        message: "Doctor and date are required",
      });
    }

    // Try to get available slots from Frappe Healthcare
    try {
      const response = await frappe.call(
        "healthcare.healthcare.utils.get_available_slots",
        {
          practitioner: doctor,
          date: date,
        },
      );

      const slots = response.message || [];
      res.json({
        success: true,
        data: slots.map((slot) => ({
          time: slot.from_time || slot.time,
          available: !slot.booked,
        })),
      });
    } catch (frappeError) {
      // Generate default time slots if Frappe API fails
      const defaultSlots = [];
      for (let hour = 9; hour <= 17; hour++) {
        if (hour !== 13) {
          // Skip lunch hour
          defaultSlots.push({
            time: `${hour.toString().padStart(2, "0")}:00`,
            available: true,
          });
          defaultSlots.push({
            time: `${hour.toString().padStart(2, "0")}:30`,
            available: true,
          });
        }
      }
      res.json({
        success: true,
        data: defaultSlots,
      });
    }
  } catch (error) {
    console.error("Get slots error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available slots",
    });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Update in Frappe Healthcare
    try {
      await frappe.updateDocument("Patient Appointment", id, {
        status: "Cancelled",
        notes: reason ? `Cancelled: ${reason}` : "Cancelled by patient",
      });
    } catch (frappeError) {
      console.error("Failed to cancel in Frappe:", frappeError);
      return res.status(500).json({
        success: false,
        message: "Failed to cancel appointment",
      });
    }

    // Update local record if exists
    await prisma.appointment.updateMany({
      where: { frappeAppointmentId: id },
      data: { status: "Cancelled" },
    });

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};

// Reschedule an appointment
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, appointment_time } = req.body;

    // Update in Frappe Healthcare
    try {
      await frappe.updateDocument("Patient Appointment", id, {
        appointment_date: appointment_date,
        appointment_time: appointment_time,
        status: "Open",
      });
    } catch (frappeError) {
      console.error("Failed to reschedule in Frappe:", frappeError);
      return res.status(500).json({
        success: false,
        message: "Failed to reschedule appointment",
      });
    }

    // Update local record if exists
    await prisma.appointment.updateMany({
      where: { frappeAppointmentId: id },
      data: {
        appointmentDate: new Date(appointment_date),
        appointmentTime: appointment_time,
        status: "Open",
      },
    });

    res.json({
      success: true,
      message: "Appointment rescheduled successfully",
    });
  } catch (error) {
    console.error("Reschedule appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reschedule appointment",
    });
  }
};
