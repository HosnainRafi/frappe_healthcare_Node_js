import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/patient-login", credentials),
  register: (data) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

// Patient APIs
export const patientAPI = {
  getProfile: () => api.get("/patients/profile"),
  updateProfile: (data) => api.put("/patients/profile", data),
  getMedicalRecords: () => api.get("/patients/medical-records"),
  getPrescriptions: () => api.get("/patients/prescriptions"),
  getLabResults: () => api.get("/patients/lab-results"),
  deleteAccount: () => api.delete("/patients/account"),
};

// Doctor APIs
export const doctorAPI = {
  getAll: (params) => api.get("/doctors", { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getAvailableSlots: (doctorId, date) =>
    api.get(`/doctors/${doctorId}/slots`, { params: { date } }),
  getDepartments: () => api.get("/doctors/departments"),
  getSpecializations: () => api.get("/doctors/specializations"),
};

// Appointment APIs
export const appointmentAPI = {
  getAll: () => api.get("/appointments"),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post("/appointments", data),
  book: (data) => api.post("/appointments/book", data),
  cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  reschedule: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
  getUpcoming: () => api.get("/appointments/upcoming"),
  getPast: () => api.get("/appointments/past"),
  getMyAppointments: () => api.get("/appointments/my"),
  getAvailableSlots: (doctorId, date) =>
    api.get(`/appointments/slots`, { params: { doctor: doctorId, date } }),
};

// Healthcare Services APIs
export const servicesAPI = {
  getAll: () => api.get("/services"),
  getById: (id) => api.get(`/services/${id}`),
};

// Contact/Inquiry APIs
export const contactAPI = {
  submit: (data) => api.post("/contact", data),
};

export default api;
