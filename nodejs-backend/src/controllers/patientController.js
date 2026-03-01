const { PrismaClient } = require("@prisma/client");
const frappe = require("../services/FrappeAPIClient");

const prisma = new PrismaClient();

// Convert short blood group format to Frappe format
const toFrappeBloodGroup = (bg) => {
  if (!bg) return "";
  const map = {
    "A+": "A Positive",
    "A-": "A Negative",
    "B+": "B Positive",
    "B-": "B Negative",
    "O+": "O Positive",
    "O-": "O Negative",
    "AB+": "AB Positive",
    "AB-": "AB Negative",
  };
  return map[bg] || bg;
};

// Get patient profile
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Try to get additional data from Frappe if available
    let frappeData = {};
    if (user.frappePatientId) {
      try {
        frappeData = await frappe.getDocument("Patient", user.frappePatientId);
      } catch (e) {
        console.log("Could not fetch Frappe patient data");
      }
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.firstName || frappeData.first_name,
        last_name: user.lastName || frappeData.last_name,
        phone: user.phone || frappeData.mobile,
        date_of_birth: user.dateOfBirth || frappeData.dob,
        gender: user.gender || frappeData.sex,
        blood_group: user.bloodGroup || frappeData.blood_group,
        address: user.address,
        frappe_patient_id: user.frappePatientId,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// Update patient profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone,
      date_of_birth,
      gender,
      blood_group,
      address,
      emergency_contact,
      emergency_phone,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update local database
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName: first_name,
        lastName: last_name,
        phone: phone,
        dateOfBirth: date_of_birth ? new Date(date_of_birth) : undefined,
        gender: gender,
        bloodGroup: blood_group,
        address: address,
      },
    });

    // Sync with Frappe Healthcare - create patient if doesn't exist
    let frappePatientId = user.frappePatientId;

    if (!frappePatientId) {
      // Create new patient in Frappe
      try {
        const patientData = {
          doctype: "Patient",
          first_name: first_name || user.firstName,
          last_name: last_name || user.lastName || "",
          email: user.email,
          mobile: phone || user.phone,
          sex: gender || "Male",
          dob: date_of_birth,
          blood_group: toFrappeBloodGroup(blood_group),
          patient_name:
            `${first_name || user.firstName} ${last_name || user.lastName || ""}`.trim(),
          invite_user: 0, // Don't create website user - we manage auth separately
        };

        const frappePatient = await frappe.createDocument(
          "Patient",
          patientData,
        );
        frappePatientId = frappePatient.name;

        // Update user with Frappe Patient ID
        await prisma.user.update({
          where: { id: req.userId },
          data: { frappePatientId: frappePatientId },
        });

        console.log(
          `Created Frappe patient ${frappePatientId} for user ${user.email}`,
        );
      } catch (frappeError) {
        console.error("Failed to create patient in Frappe:", frappeError);
      }
    } else {
      // Update existing patient in Frappe
      try {
        await frappe.updateDocument("Patient", user.frappePatientId, {
          first_name: first_name,
          last_name: last_name,
          mobile: phone,
          dob: date_of_birth,
          sex: gender,
          blood_group: toFrappeBloodGroup(blood_group),
          patient_name: `${first_name} ${last_name || ""}`.trim(),
        });
      } catch (frappeError) {
        console.error("Failed to sync profile with Frappe:", frappeError);
      }
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        phone: updatedUser.phone,
        date_of_birth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        blood_group: updatedUser.bloodGroup,
        address: updatedUser.address,
        frappe_patient_id: frappePatientId,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// Get patient's medical records from Frappe Healthcare
exports.getMedicalRecords = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.frappePatientId) {
      return res.json({ success: true, data: [] });
    }

    // Fetch Patient Encounters from Frappe Healthcare
    let encounters = [];
    try {
      encounters = await frappe.getDocumentList("Patient Encounter", {
        filters: [["patient", "=", user.frappePatientId]],
        fields: ["name", "encounter_date", "practitioner", "practitioner_name"],
        order_by: "encounter_date desc",
        limit_page_length: 50,
      });
    } catch (e) {
      console.log("Could not fetch patient encounters:", e.message);
    }

    // Fetch Lab Tests
    let labTests = [];
    try {
      labTests = await frappe.getDocumentList("Lab Test", {
        filters: [["patient", "=", user.frappePatientId]],
        fields: [
          "name",
          "lab_test_name",
          "result_date",
          "practitioner_name",
          "status",
        ],
        order_by: "result_date desc",
        limit_page_length: 50,
      });
    } catch (e) {
      console.log("Could not fetch lab tests");
    }

    // Combine and format records
    const records = [
      ...encounters.map((e) => ({
        id: e.name,
        type: "Consultation",
        name: "Patient Encounter",
        date: e.encounter_date,
        doctor: e.practitioner_name || e.practitioner,
        status: "Completed",
        summary: "",
      })),
      ...labTests.map((l) => ({
        id: l.name,
        type: "Lab Report",
        name: l.lab_test_name,
        date: l.result_date,
        doctor: l.practitioner_name,
        status: l.status,
        summary: "",
      })),
    ];

    // Sort by date
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Get medical records error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medical records",
    });
  }
};

// Get patient's prescriptions from Frappe Healthcare
exports.getPrescriptions = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.frappePatientId) {
      return res.json({ success: true, data: [] });
    }

    // Fetch prescriptions from Patient Encounters
    let encounters = [];
    try {
      encounters = await frappe.getDocumentList("Patient Encounter", {
        filters: [["patient", "=", user.frappePatientId]],
        fields: ["name", "encounter_date", "practitioner_name"],
        order_by: "encounter_date desc",
        limit_page_length: 50,
      });
    } catch (e) {
      console.log(
        "Could not fetch patient encounters for prescriptions:",
        e.message,
      );
    }

    // Fetch detailed prescription items from encounters
    const prescriptions = [];
    for (const enc of encounters) {
      try {
        const fullEnc = await frappe.getDocument("Patient Encounter", enc.name);
        const drugPrescription = fullEnc.drug_prescription || [];

        if (drugPrescription.length > 0) {
          prescriptions.push({
            id: enc.name,
            date: enc.encounter_date,
            doctor: enc.practitioner_name,
            diagnosis: fullEnc.diagnosis || "General Consultation",
            status:
              new Date(enc.encounter_date) >
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ? "Active"
                : "Completed",
            medications: drugPrescription.map((med) => ({
              name: med.drug_code || med.drug_name,
              dosage: med.dosage,
              frequency: med.dosage_form,
              duration: `${med.period || 1} ${med.interval || "days"}`,
            })),
          });
        }
      } catch (e) {
        console.log("Could not fetch encounter details:", e.message);
      }
    }

    res.json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    console.error("Get prescriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
    });
  }
};

// Delete patient account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete appointments first (due to foreign key)
    await prisma.appointment.deleteMany({
      where: { userId: user.id },
    });

    // Delete user from local database
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Optionally disable patient in Frappe (not delete, for audit trail)
    if (user.frappePatientId) {
      try {
        await frappe.updateDocument("Patient", user.frappePatientId, {
          status: "Disabled",
        });
      } catch (frappeError) {
        console.error("Failed to disable patient in Frappe:", frappeError);
        // Continue anyway - local account is deleted
      }
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};
