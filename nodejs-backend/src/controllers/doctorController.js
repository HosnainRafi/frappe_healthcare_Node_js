const { PrismaClient } = require("@prisma/client");
const frappe = require("../services/FrappeAPIClient");

const prisma = new PrismaClient();

// Get all doctors from Frappe Healthcare
exports.getAllDoctors = async (req, res) => {
  try {
    const { department, limit = 50 } = req.query;

    // Fetch Healthcare Practitioners from Frappe
    let filters = [];
    if (department) {
      filters.push(["department", "=", department]);
    }

    const practitioners = await frappe.getDocumentList(
      "Healthcare Practitioner",
      {
        fields: [
          "name",
          "practitioner_name",
          "department",
          "image",
          "mobile_phone",
          "status",
        ],
        filters: filters,
        limit_page_length: parseInt(limit),
      },
    );

    // Transform data for frontend
    const doctors = practitioners.map((p) => ({
      name: p.practitioner_name || p.name,
      id: p.name,
      department: p.department || "General Medicine",
      image: p.image,
      phone: p.mobile_phone,
      available: p.status !== "Disabled",
    }));

    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const practitioner = await frappe.getDocument(
      "Healthcare Practitioner",
      id,
    );

    if (!practitioner) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Get practitioner schedule
    let schedule = [];
    try {
      const schedules = await frappe.getDocumentList("Practitioner Schedule", {
        filters: [["practitioner", "=", id]],
        fields: ["*"],
      });
      schedule = schedules;
    } catch (e) {
      console.log("No schedule found for practitioner");
    }

    // Extract education/qualifications from child table
    const education = [];
    if (practitioner.education) {
      practitioner.education.forEach((q) => {
        const parts = [];
        if (q.qualification) parts.push(q.qualification);
        if (q.institute) parts.push(q.institute);
        if (q.year_of_passing) parts.push(`(${q.year_of_passing})`);
        education.push(parts.join(" - ") || q.qualification || q.name);
      });
    }

    // Extract schedule time entries from the schedule child table
    const scheduleEntries = [];
    if (practitioner.practitioner_schedules) {
      practitioner.practitioner_schedules.forEach((s) => {
        scheduleEntries.push({
          day: s.schedule || s.day,
          schedule_name: s.schedule,
        });
      });
    }

    // If we got Practitioner Schedule documents, parse their time slots
    if (schedule.length > 0) {
      schedule.forEach((s) => {
        if (s.time_slots) {
          s.time_slots.forEach((slot) => {
            scheduleEntries.push({
              day: slot.day,
              time: `${slot.from_time || ""} - ${slot.to_time || ""}`.trim(),
            });
          });
        }
      });
    }

    res.json({
      success: true,
      data: {
        name: practitioner.practitioner_name || practitioner.name,
        id: practitioner.name,
        department: practitioner.department,
        designation: practitioner.designation,
        image: practitioner.image,
        phone: practitioner.mobile_phone,
        email: practitioner.email,
        address: practitioner.address || "",
        description: practitioner.bio || practitioner.description || "",
        gender: practitioner.gender,
        status: practitioner.status,
        education: education,
        schedule: scheduleEntries,
        op_consulting_charge: practitioner.op_consulting_charge,
        practitioner_schedules: practitioner.practitioner_schedules || [],
      },
    });
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
};

// Get all departments/specializations
exports.getDepartments = async (req, res) => {
  try {
    const departments = await frappe.getDocumentList("Medical Department", {
      fields: ["name", "department"],
      limit_page_length: 100,
    });

    res.json({
      success: true,
      data: departments.map((d) => d.department || d.name),
    });
  } catch (error) {
    console.error("Get departments error:", error);
    // Return default departments if Frappe fails
    res.json({
      success: true,
      data: [
        "Cardiology",
        "Neurology",
        "Pediatrics",
        "Orthopedics",
        "Dermatology",
        "General Medicine",
      ],
    });
  }
};

// Get available slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Try to get available slots from Frappe Healthcare
    try {
      const response = await frappe.call(
        "healthcare.healthcare.utils.get_available_slots",
        {
          practitioner: id,
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
      // Generate default slots if API fails
      const defaultSlots = [];
      for (let hour = 9; hour <= 17; hour++) {
        if (hour !== 13) {
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
