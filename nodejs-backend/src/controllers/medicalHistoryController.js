const { PrismaClient } = require("@prisma/client");
const frappe = require("../services/FrappeAPIClient");

const prisma = new PrismaClient();

// ========================================
// GET /patients/medical-history
// Fetch all medical history entries for the patient from Frappe
// ========================================
exports.getMedicalHistory = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.frappePatientId) {
      return res.json({
        success: true,
        data: { records: [], conditions: [], all: [], patientInfo: {} },
      });
    }

    // Fetch Patient Medical Record entries from Frappe Healthcare
    let medicalRecords = [];
    try {
      medicalRecords = await frappe.getDocumentList("Patient Medical Record", {
        filters: [["patient", "=", user.frappePatientId]],
        fields: [
          "name",
          "patient",
          "status",
          "subject",
          "communication_date",
          "reference_doctype",
          "reference_name",
          "creation",
        ],
        order_by: "communication_date desc",
        limit_page_length: 100,
      });
    } catch (e) {
      console.log("Could not fetch Patient Medical Records:", e.message);
    }

    // Fetch the patient document itself for the text fields:
    // medical_history, allergies, medication, surgical_history (all TEXT fields in Frappe)
    let patientInfo = {};
    let patientConditions = [];
    try {
      const patientDoc = await frappe.getDocument(
        "Patient",
        user.frappePatientId,
      );

      // These are plain text fields in Frappe Healthcare Patient doctype
      patientInfo = {
        medical_history: patientDoc.medical_history || "",
        allergies: patientDoc.allergies || "",
        medication: patientDoc.medication || "",
        surgical_history: patientDoc.surgical_history || "",
        tobacco_past_use: patientDoc.tobacco_past_use || "",
        tobacco_current_use: patientDoc.tobacco_current_use || "",
        alcohol_past_use: patientDoc.alcohol_past_use || "",
        alcohol_current_use: patientDoc.alcohol_current_use || "",
        surrounding_factors: patientDoc.surrounding_factors || "",
        other_risk_factors: patientDoc.other_risk_factors || "",
        occupation: patientDoc.occupation || "",
        marital_status: patientDoc.marital_status || "",
      };

      // Convert text fields into structured conditions for display
      if (patientDoc.medical_history) {
        patientConditions.push({
          id: "medical_history",
          type: "condition",
          category: "condition",
          label: "Medical History",
          subject: patientDoc.medical_history,
          date: patientDoc.modified || patientDoc.creation,
          status: "Active",
          field: "medical_history",
        });
      }
      if (patientDoc.allergies) {
        patientConditions.push({
          id: "allergies",
          type: "condition",
          category: "allergy",
          label: "Allergies",
          subject: patientDoc.allergies,
          date: patientDoc.modified || patientDoc.creation,
          status: "Active",
          field: "allergies",
        });
      }
      if (patientDoc.medication) {
        patientConditions.push({
          id: "medication",
          type: "condition",
          category: "medication",
          label: "Current Medication",
          subject: patientDoc.medication,
          date: patientDoc.modified || patientDoc.creation,
          status: "Active",
          field: "medication",
        });
      }
      if (patientDoc.surgical_history) {
        patientConditions.push({
          id: "surgical_history",
          type: "condition",
          category: "surgery",
          label: "Surgical History",
          subject: patientDoc.surgical_history,
          date: patientDoc.modified || patientDoc.creation,
          status: "Active",
          field: "surgical_history",
        });
      }
    } catch (e) {
      console.log("Could not fetch patient document:", e.message);
    }

    // Format Patient Medical Record entries
    const history = medicalRecords.map((r) => ({
      id: r.name,
      type: "record",
      subject: r.subject || "Medical Record",
      date: r.communication_date || r.creation,
      status: r.status || "Open",
      reference_doctype: r.reference_doctype || null,
      reference_name: r.reference_name || null,
    }));

    const all = [...history, ...patientConditions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    res.json({
      success: true,
      data: {
        records: history,
        conditions: patientConditions,
        all: all,
        patientInfo: patientInfo,
      },
    });
  } catch (error) {
    console.error("Get medical history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medical history",
    });
  }
};

// ========================================
// POST /patients/medical-history
// Add a new medical history entry and sync to Frappe
// ========================================
exports.addMedicalHistory = async (req, res) => {
  try {
    const { category, description, date, notes } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create or fetch Frappe Patient ID
    let frappePatientId = user.frappePatientId;
    if (!frappePatientId) {
      try {
        const frappePatient = await frappe.createDocument("Patient", {
          first_name: user.firstName || user.email.split("@")[0],
          last_name: user.lastName || "",
          email: user.email,
          mobile: user.phone || "",
          sex: user.gender || "Male",
          dob: user.dateOfBirth || null,
          status: "Active",
        });
        frappePatientId = frappePatient.name;

        // Save frappe patient ID to local user
        await prisma.user.update({
          where: { id: user.id },
          data: { frappePatientId: frappePatientId },
        });
      } catch (frappeError) {
        console.error("Failed to create Frappe patient:", frappeError);
        return res.status(500).json({
          success: false,
          message: "Failed to create patient record in healthcare system",
        });
      }
    }

    // Strategy: Update the correct text field on the Patient document based on category
    let frappeRecord = null;

    if (
      category === "condition" ||
      category === "allergy" ||
      category === "surgery" ||
      category === "medication" ||
      category === "family"
    ) {
      // Map category to the correct Frappe Patient text field
      const fieldMap = {
        condition: "medical_history",
        allergy: "allergies",
        surgery: "surgical_history",
        medication: "medication",
        family: "medical_history", // family history goes into medical_history
      };

      const frappeField = fieldMap[category] || "medical_history";

      try {
        const patientDoc = await frappe.getDocument("Patient", frappePatientId);
        const existing = patientDoc[frappeField] || "";

        // Append the new entry to existing text (with newline separator)
        const dateStr = date || new Date().toISOString().split("T")[0];
        const newEntry =
          category === "family"
            ? `[Family] ${description}${notes ? " - " + notes : ""} (${dateStr})`
            : `${description}${notes ? " - " + notes : ""} (${dateStr})`;

        const updated = existing ? `${existing}\n${newEntry}` : newEntry;

        await frappe.updateDocument("Patient", frappePatientId, {
          [frappeField]: updated,
        });

        frappeRecord = { type: category, field: frappeField, success: true };
      } catch (e) {
        console.error(`Failed to update Patient ${frappeField}:`, e.message);
        // Fallback: Create a Patient Medical Record instead
        try {
          frappeRecord = await frappe.createDocument("Patient Medical Record", {
            patient: frappePatientId,
            subject: `[${category.toUpperCase()}] ${description}${notes ? " - " + notes : ""}`,
            communication_date: date || new Date().toISOString().split("T")[0],
            status: "Open",
          });
        } catch (e2) {
          console.error("Fallback also failed:", e2.message);
        }
      }
    } else {
      // General medical record - create as Patient Medical Record
      try {
        const subject = notes ? `${description} - ${notes}` : description;

        frappeRecord = await frappe.createDocument("Patient Medical Record", {
          patient: frappePatientId,
          subject: subject,
          communication_date: date || new Date().toISOString().split("T")[0],
          status: "Open",
        });
      } catch (e) {
        console.error("Failed to create Patient Medical Record:", e.message);
      }
    }

    if (!frappeRecord) {
      return res.status(500).json({
        success: false,
        message: "Failed to save medical history to the healthcare system",
      });
    }

    res.json({
      success: true,
      message: "Medical history entry added successfully",
      data: frappeRecord,
    });
  } catch (error) {
    console.error("Add medical history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add medical history",
    });
  }
};

// ========================================
// DELETE /patients/medical-history/:id
// Remove a medical history entry
// ========================================
exports.deleteMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.frappePatientId) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Try deleting from Patient Medical Record
    try {
      await frappe.call("frappe.client.delete", {
        doctype: "Patient Medical Record",
        name: id,
      });
    } catch (e) {
      console.error("Could not delete Patient Medical Record:", e.message);

      // Try removing from Patient's medical_history child table
      try {
        const patientDoc = await frappe.getDocument(
          "Patient",
          user.frappePatientId,
        );
        const filteredHistory = (patientDoc.medical_history || []).filter(
          (item) => item.name !== id,
        );
        await frappe.updateDocument("Patient", user.frappePatientId, {
          medical_history: filteredHistory,
        });
      } catch (e2) {
        console.error("Could not remove from patient history:", e2.message);
        return res.status(500).json({
          success: false,
          message: "Failed to delete medical history entry",
        });
      }
    }

    res.json({
      success: true,
      message: "Medical history entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete medical history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete medical history",
    });
  }
};

// ========================================
// GET /patients/lab-results
// Fetch lab test results from Frappe
// ========================================
exports.getLabResults = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.frappePatientId) {
      return res.json({ success: true, data: [] });
    }

    // Fetch Lab Tests from Frappe
    let labTests = [];
    try {
      labTests = await frappe.getDocumentList("Lab Test", {
        filters: [["patient", "=", user.frappePatientId]],
        fields: [
          "name",
          "lab_test_name",
          "template",
          "result_date",
          "practitioner",
          "practitioner_name",
          "status",
          "creation",
          "department",
        ],
        order_by: "creation desc",
        limit_page_length: 50,
      });
    } catch (e) {
      console.log("Could not fetch lab tests:", e.message);
    }

    // Fetch detailed results for each lab test
    const detailedLabTests = [];
    for (const test of labTests) {
      try {
        const fullTest = await frappe.getDocument("Lab Test", test.name);
        detailedLabTests.push({
          id: test.name,
          test_name: fullTest.lab_test_name || fullTest.template,
          date: fullTest.result_date || fullTest.creation,
          doctor: fullTest.practitioner_name || fullTest.practitioner,
          status: fullTest.status,
          department: fullTest.department,
          // Normal test items
          normal_test_items: (fullTest.normal_test_items || []).map((item) => ({
            test_name: item.lab_test_name,
            result: item.result_value,
            unit: item.lab_test_uom,
            normal_range: `${item.normal_range || ""}`,
            status: item.result_value ? "Completed" : "Pending",
          })),
          // Special test items
          special_test_items: (
            fullTest.descriptive_test_items ||
            fullTest.special_test_items ||
            []
          ).map((item) => ({
            test_name: item.lab_test_particulars || item.particulars,
            result: item.result_value || item.result_component,
          })),
          comments: fullTest.lab_test_comment || "",
        });
      } catch (e) {
        // If can't get details, add basic info
        detailedLabTests.push({
          id: test.name,
          test_name: test.lab_test_name || test.template,
          date: test.result_date || test.creation,
          doctor: test.practitioner_name || test.practitioner,
          status: test.status,
          department: test.department,
          normal_test_items: [],
          special_test_items: [],
          comments: "",
        });
      }
    }

    res.json({
      success: true,
      data: detailedLabTests,
    });
  } catch (error) {
    console.error("Get lab results error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lab results",
    });
  }
};

// ========================================
// GET /patients/vital-signs
// Fetch vital signs from Frappe
// ========================================
exports.getVitalSigns = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.frappePatientId) {
      return res.json({ success: true, data: [] });
    }

    let vitalSigns = [];
    try {
      vitalSigns = await frappe.getDocumentList("Vital Signs", {
        filters: [["patient", "=", user.frappePatientId]],
        fields: [
          "name",
          "signs_date",
          "signs_time",
          "temperature",
          "pulse",
          "respiratory_rate",
          "bp_systolic",
          "bp_diastolic",
          "bmi",
          "height",
          "weight",
          "oxygen_saturation",
        ],
        order_by: "signs_date desc",
        limit_page_length: 50,
      });
    } catch (e) {
      console.log("Could not fetch vital signs:", e.message);
    }

    const formatted = vitalSigns.map((v) => ({
      id: v.name,
      date: v.signs_date,
      time: v.signs_time,
      temperature: v.temperature,
      pulse: v.pulse,
      respiratory_rate: v.respiratory_rate,
      bp:
        v.bp_systolic && v.bp_diastolic
          ? `${v.bp_systolic}/${v.bp_diastolic}`
          : null,
      bp_systolic: v.bp_systolic,
      bp_diastolic: v.bp_diastolic,
      bmi: v.bmi,
      height: v.height,
      weight: v.weight,
      oxygen_saturation: v.oxygen_saturation,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get vital signs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vital signs",
    });
  }
};
