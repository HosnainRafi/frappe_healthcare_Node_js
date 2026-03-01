const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const frappe = require("../services/FrappeAPIClient");

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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

// Patient Registration - Creates user locally and Patient in Frappe Healthcare
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      mobile,
      dob,
      gender,
      bloodGroup,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in local database with all fields
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phone: mobile,
        role: "patient",
        dateOfBirth: dob ? new Date(dob) : null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        address: address || null,
      },
    });

    // Create Patient in Frappe Healthcare Module
    try {
      const patientData = {
        doctype: "Patient",
        first_name: firstName,
        last_name: lastName || "",
        email: email,
        mobile: mobile,
        sex: gender || "Male",
        dob: dob,
        blood_group: toFrappeBloodGroup(bloodGroup),
        patient_name: `${firstName} ${lastName || ""}`.trim(),
        invite_user: 0, // Don't create website user - we manage auth separately
      };

      const frappePatient = await frappe.createDocument("Patient", patientData);

      // Update user with Frappe Patient ID
      await prisma.user.update({
        where: { id: user.id },
        data: { frappePatientId: frappePatient.name },
      });
      user.frappePatientId = frappePatient.name;
    } catch (frappeError) {
      console.error("Failed to create patient in Frappe:", frappeError);
      // Continue - user is created locally, Frappe sync can happen later
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
          date_of_birth: user.dateOfBirth,
          gender: user.gender,
          blood_group: user.bloodGroup,
          address: user.address,
          frappe_patient_id: user.frappePatientId,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Patient Login
exports.patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
          date_of_birth: user.dateOfBirth,
          gender: user.gender,
          blood_group: user.bloodGroup,
          address: user.address,
          frappe_patient_id: user.frappePatientId,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  res.json({ success: true, message: "Logged out successfully" });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: "If this email exists, a reset link will be sent",
      });
    }

    // In production, send email with reset token
    // For now, just return success
    res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        frappePatientId: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        role: user.role,
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
