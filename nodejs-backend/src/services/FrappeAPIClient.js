const axios = require("axios");
const logger = require("../utils/logger");
const { getCache, setCache, deleteCache } = require("../config/redis");

class FrappeAPIClient {
  constructor() {
    this.baseURL = process.env.FRAPPE_URL;
    this.apiKey = process.env.FRAPPE_API_KEY;
    this.apiSecret = process.env.FRAPPE_API_SECRET;
    this.site = process.env.FRAPPE_SITE || "frontend";

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `token ${this.apiKey}:${this.apiSecret}`,
        "Content-Type": "application/json",
        Host: this.site,
      },
      timeout: 30000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(
          `Frappe API Request: ${config.method.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        logger.error("Frappe API Error:", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
        throw error;
      },
    );
  }

  // ========================================
  // PATIENT OPERATIONS
  // ========================================

  async getPatient(patientId, useCache = true) {
    const cacheKey = `patient:${patientId}`;

    if (useCache) {
      const cached = await getCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.client.get(
      `/api/resource/Patient/${patientId}`,
    );
    const patient = response.data.data;

    await setCache(cacheKey, patient, 300); // 5 min TTL
    return patient;
  }

  async getPatientByEmail(email) {
    const response = await this.client.get("/api/resource/Patient", {
      params: {
        filters: JSON.stringify([["email", "=", email]]),
        fields: JSON.stringify(["*"]),
      },
    });
    return response.data.data[0] || null;
  }

  async createPatient(patientData) {
    const response = await this.client.post("/api/resource/Patient", {
      data: patientData,
    });

    const patient = response.data.data;
    await setCache(`patient:${patient.name}`, patient, 300);
    return patient;
  }

  async updatePatient(patientId, updates) {
    const response = await this.client.put(
      `/api/resource/Patient/${patientId}`,
      {
        data: updates,
      },
    );

    await deleteCache(`patient:${patientId}`);
    return response.data.data;
  }

  // ========================================
  // DOCTOR/PRACTITIONER OPERATIONS
  // ========================================

  async getDoctors(filters = {}, useCache = true) {
    const cacheKey = `doctors:${JSON.stringify(filters)}`;

    if (useCache) {
      const cached = await getCache(cacheKey);
      if (cached) return cached;
    }

    const frappeFilters = [["status", "=", "Active"]];
    if (filters.department) {
      frappeFilters.push(["department", "=", filters.department]);
    }

    const response = await this.client.get(
      "/api/resource/Healthcare Practitioner",
      {
        params: {
          filters: JSON.stringify(frappeFilters),
          fields: JSON.stringify([
            "name",
            "first_name",
            "last_name",
            "department",
            "designation",
            "mobile_phone",
            "email",
            "status",
          ]),
          limit_page_length: 100,
        },
      },
    );

    const doctors = response.data.data;
    await setCache(cacheKey, doctors, 300); // 5 min TTL
    return doctors;
  }

  async getDoctor(doctorId, useCache = true) {
    const cacheKey = `doctor:${doctorId}`;

    if (useCache) {
      const cached = await getCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.client.get(
      `/api/resource/Healthcare Practitioner/${doctorId}`,
    );
    const doctor = response.data.data;

    await setCache(cacheKey, doctor, 300);
    return doctor;
  }

  // Get doctor's schedule and available slots
  async getDoctorSchedule(doctorId, date) {
    const cacheKey = `schedule:${doctorId}:${date}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    // Call custom API endpoint (Server Script in Frappe)
    try {
      const response = await this.client.get(
        "/api/method/hospital.get_available_slots",
        {
          params: { practitioner: doctorId, date },
        },
      );

      const schedule = response.data.message;
      await setCache(cacheKey, schedule, 60); // 1 min TTL (slots change frequently)
      return schedule;
    } catch (error) {
      // Fallback if custom API doesn't exist yet
      logger.warn("Custom slot API not found, returning empty schedule");
      return {
        success: false,
        slots: [],
        message: "Schedule API not configured",
      };
    }
  }

  // ========================================
  // APPOINTMENT OPERATIONS
  // ========================================

  async createAppointment(appointmentData) {
    const response = await this.client.post(
      "/api/resource/Patient Appointment",
      {
        data: appointmentData,
      },
    );

    // Invalidate related caches
    await deleteCache(
      `slots:${appointmentData.practitioner}:${appointmentData.appointment_date}`,
    );

    return response.data.data;
  }

  async getAppointment(appointmentId) {
    const response = await this.client.get(
      `/api/resource/Patient Appointment/${appointmentId}`,
    );
    return response.data.data;
  }

  async updateAppointment(appointmentId, updates) {
    const response = await this.client.put(
      `/api/resource/Patient Appointment/${appointmentId}`,
      {
        data: updates,
      },
    );

    return response.data.data;
  }

  async getPatientAppointments(patientId, filters = {}) {
    const frappeFilters = [["patient", "=", patientId]];

    if (filters.from_date) {
      frappeFilters.push(["appointment_date", ">=", filters.from_date]);
    }
    if (filters.to_date) {
      frappeFilters.push(["appointment_date", "<=", filters.to_date]);
    }
    if (filters.status) {
      frappeFilters.push(["status", "=", filters.status]);
    }

    const response = await this.client.get(
      "/api/resource/Patient Appointment",
      {
        params: {
          filters: JSON.stringify(frappeFilters),
          fields: JSON.stringify([
            "name",
            "appointment_date",
            "appointment_time",
            "practitioner",
            "practitioner_name",
            "department",
            "status",
            "duration",
            "notes",
          ]),
          order_by: "appointment_date desc",
          limit_page_length: 50,
        },
      },
    );

    return response.data.data;
  }

  async getDoctorAppointments(doctorId, date) {
    const response = await this.client.get(
      "/api/resource/Patient Appointment",
      {
        params: {
          filters: JSON.stringify([
            ["practitioner", "=", doctorId],
            ["appointment_date", "=", date],
          ]),
          fields: JSON.stringify([
            "name",
            "appointment_time",
            "patient",
            "patient_name",
            "status",
            "department",
            "notes",
          ]),
          order_by: "appointment_time asc",
        },
      },
    );

    return response.data.data;
  }

  // ========================================
  // PRESCRIPTION & MEDICAL RECORDS
  // ========================================

  async getPatientPrescriptions(patientId) {
    const response = await this.client.get(
      "/api/resource/Patient Medical Record",
      {
        params: {
          filters: JSON.stringify([["patient", "=", patientId]]),
          fields: JSON.stringify([
            "name",
            "creation",
            "practitioner",
            "practitioner_name",
            "complaint",
            "diagnosis",
            "treatment_plan",
          ]),
          order_by: "creation desc",
          limit_page_length: 20,
        },
      },
    );

    return response.data.data;
  }

  async getPrescription(prescriptionId) {
    const response = await this.client.get(
      `/api/resource/Patient Medical Record/${prescriptionId}`,
    );
    return response.data.data;
  }

  // ========================================
  // DEPARTMENTS
  // ========================================

  async getDepartments(useCache = true) {
    const cacheKey = "departments";

    if (useCache) {
      const cached = await getCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.client.get("/api/resource/Medical Department", {
      params: {
        fields: JSON.stringify(["name", "department"]),
        limit_page_length: 100,
      },
    });

    const departments = response.data.data;
    await setCache(cacheKey, departments, 600); // 10 min TTL
    return departments;
  }

  // ========================================
  // LAB TESTS & RESULTS
  // ========================================

  async getPatientLabTests(patientId) {
    const response = await this.client.get("/api/resource/Lab Test", {
      params: {
        filters: JSON.stringify([["patient", "=", patientId]]),
        fields: JSON.stringify([
          "name",
          "creation",
          "test_name",
          "status",
          "result_date",
          "practitioner",
        ]),
        order_by: "creation desc",
      },
    });

    return response.data.data;
  }

  // ========================================
  // AUTHENTICATION
  // ========================================

  async loginUser(email, password) {
    const response = await this.client.post("/api/method/login", {
      usr: email,
      pwd: password,
    });

    return response.data;
  }

  async getLoggedUser() {
    const response = await this.client.get(
      "/api/method/frappe.auth.get_logged_user",
    );
    return response.data.message;
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  async callMethod(method, params = {}) {
    const response = await this.client.post(`/api/method/${method}`, params);
    return response.data.message;
  }

  async searchDoctype(doctype, searchTerm, fields = ["name"]) {
    const response = await this.client.get(`/api/resource/${doctype}`, {
      params: {
        filters: JSON.stringify([[fields[0], "like", `%${searchTerm}%`]]),
        fields: JSON.stringify(fields),
        limit_page_length: 20,
      },
    });

    return response.data.data;
  }

  // ========================================
  // GENERIC DOCUMENT OPERATIONS
  // ========================================

  // Generic method to get a list of documents
  async getDocumentList(doctype, options = {}) {
    const {
      filters = [],
      fields = ["*"],
      order_by,
      limit_page_length = 50,
    } = options;

    const params = {
      filters: JSON.stringify(filters),
      fields: JSON.stringify(fields),
      limit_page_length,
    };

    if (order_by) {
      params.order_by = order_by;
    }

    const response = await this.client.get(`/api/resource/${doctype}`, {
      params,
    });
    return response.data.data || [];
  }

  // Generic method to get a single document
  async getDocument(doctype, name) {
    const response = await this.client.get(
      `/api/resource/${doctype}/${encodeURIComponent(name)}`,
    );
    return response.data.data;
  }

  // Generic method to create a document
  async createDocument(doctype, data) {
    const response = await this.client.post(`/api/resource/${doctype}`, {
      data: data,
    });
    return response.data.data;
  }

  // Generic method to update a document
  async updateDocument(doctype, name, data) {
    const response = await this.client.put(
      `/api/resource/${doctype}/${encodeURIComponent(name)}`,
      {
        data: data,
      },
    );
    return response.data.data;
  }

  // Generic method to call a Frappe method
  async call(method, params = {}) {
    const response = await this.client.get(`/api/method/${method}`, { params });
    return response.data;
  }
}

module.exports = new FrappeAPIClient();
