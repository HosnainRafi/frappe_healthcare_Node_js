# Project Structure & Troubleshooting Guide

Complete guide to understanding the codebase structure and fixing common issues.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Common Issues & Fixes](#common-issues--fixes)
8. [Development Guide](#development-guide)

---

## Project Overview

This is a full-stack healthcare management system built with:

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Prisma
- **ERP**: Frappe/ERPNext with Healthcare module
- **Databases**: PostgreSQL (app data), MariaDB (Frappe data)
- **Cache**: Redis (3 instances)
- **Proxy**: Nginx

### Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
┌──────▼──────┐
│    Nginx    │ (Reverse Proxy)
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
┌──▼──┐ ┌──▼────────┐
│React│ │Node.js API│
└─────┘ └──┬────────┘
           │
      ┌────┴─────┐
      │          │
┌─────▼──┐ ┌────▼─────┐
│Frappe  │ │PostgreSQL│
│ERPNext │ └──────────┘
└────┬───┘
     │
┌────▼────┐
│MariaDB  │
└─────────┘
```

---

## File Structure

```
frappe-healthcare-docker/
│
├── docker-compose.yml           # Docker services configuration
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── run.bat                      # Quick start script
├── README.md                    # Main documentation
│
├── docs/                        # Documentation folder
│   ├── SETUP.md                # Local setup guide
│   ├── DEPLOYMENT.md           # Production deployment guide
│   └── STRUCTURE.md            # This file
│
├── scripts/                     # Utility scripts
│   ├── start.bat               # Start all services
│   ├── stop.bat                # Stop all services
│   ├── logs.bat                # View logs
│   ├── backup.bat              # Backup databases
│   └── health-check.bat        # Check service health
│
├── nginx/                       # Nginx configuration
│   └── nginx.conf              # Nginx proxy config
│
├── frontend/                    # React frontend
│   ├── Dockerfile              # Frontend Docker image
│   ├── package.json            # Node dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # TailwindCSS config
│   ├── index.html              # HTML entry point
│   │
│   └── src/                    # Source code
│       ├── main.jsx            # App entry point
│       ├── App.jsx             # Root component
│       ├── index.css           # Global styles
│       │
│       ├── components/         # Reusable components
│       │   ├── Header.jsx      # Navigation header
│       │   ├── Footer.jsx      # Footer component
│       │   ├── Layout.jsx      # Page layout wrapper
│       │   ├── PortalSidebar.jsx  # Patient portal sidebar
│       │   └── ProtectedRoute.jsx # Auth route guard
│       │
│       ├── pages/              # Page components
│       │   ├── Home.jsx        # Landing page
│       │   ├── About.jsx       # About page
│       │   ├── Services.jsx    # Services page
│       │   ├── Contact.jsx     # Contact page
│       │   ├── Doctors.jsx     # Doctor listing
│       │   ├── DoctorDetail.jsx # Doctor details
│       │   ├── NotFound.jsx    # 404 page
│       │   │
│       │   ├── auth/           # Authentication pages
│       │   │   ├── Login.jsx   # Login page
│       │   │   ├── Register.jsx # Registration page
│       │   │   └── ForgotPassword.jsx
│       │   │
│       │   └── portal/         # Patient portal pages
│       │       ├── Dashboard.jsx        # Patient dashboard
│       │       ├── Profile.jsx          # User profile
│       │       ├── BookAppointment.jsx  # Book appointment
│       │       ├── Appointments.jsx     # Appointment list
│       │       ├── MedicalRecords.jsx   # Medical records
│       │       └── Prescriptions.jsx    # Prescriptions
│       │
│       ├── services/           # API services
│       │   └── api.js          # API client (Axios)
│       │
│       └── store/              # State management
│           └── authStore.js    # Authentication state (Zustand)
│
├── nodejs-backend/              # Node.js backend
│   ├── Dockerfile              # Backend Docker image
│   ├── package.json            # Node dependencies
│   ├── healthcheck.js          # Docker health check
│   ├── .env                    # Backend environment vars
│   │
│   ├── prisma/                 # Prisma ORM
│   │   └── schema.prisma       # Database schema
│   │
│   └── src/                    # Source code
│       ├── index.js            # App entry point
│       │
│       ├── config/             # Configuration
│       │   ├── redis.js        # Redis connection
│       │   └── swagger.js      # API documentation
│       │
│       ├── controllers/        # Request handlers
│       │   ├── authController.js         # Auth logic
│       │   ├── patientController.js      # Patient logic
│       │   ├── doctorController.js       # Doctor logic
│       │   └── appointmentController.js  # Appointment logic
│       │
│       ├── middlewares/        # Express middlewares
│       │   ├── auth.js         # JWT authentication
│       │   ├── validator.js    # Request validation (Joi)
│       │   ├── errorHandler.js # Error handling
│       │   └── rateLimiter.js  # Rate limiting
│       │
│       ├── routes/             # API routes
│       │   ├── index.js        # Route aggregator
│       │   ├── authRoutes.js   # Auth endpoints
│       │   ├── patientRoutes.js # Patient endpoints
│       │   ├── doctorRoutes.js  # Doctor endpoints
│       │   ├── appointmentRoutes.js # Appointment endpoints
│       │   └── webhookRoutes.js # Frappe webhooks
│       │
│       ├── services/           # Business logic
│       │   └── FrappeAPIClient.js # Frappe API integration
│       │
│       ├── sync/               # Data synchronization
│       │   └── webhookHandlers.js # Handle Frappe webhooks
│       │
│       ├── socket/             # WebSocket
│       │   └── socketHandlers.js # Real-time updates
│       │
│       ├── queues/             # Background jobs
│       │   └── index.js        # Queue setup (Bull)
│       │
│       ├── utils/              # Utilities
│       │   └── logger.js       # Winston logger
│       │
│       └── uploads/            # File uploads
│           └── .gitkeep
│
└── frappe_extensions/           # Frappe customizations
    └── server_scripts/          # Python server scripts
        ├── api_get_available_slots.py    # Slot availability API
        └── webhook_patient_updated.py    # Patient sync webhook
```

---

## Backend Architecture

### Request Flow

```
Client Request
    ↓
Nginx (Reverse Proxy)
    ↓
Rate Limiter Middleware
    ↓
Auth Middleware (JWT validation)
    ↓
Validator Middleware (Joi schemas)
    ↓
Controller (Business logic)
    ↓
Service Layer (Frappe API / Prisma)
    ↓
Database (PostgreSQL / MariaDB)
    ↓
Response to Client
```

### Key Files

#### 1. **src/index.js** - Server Entry Point

```javascript
// What it does:
// - Initializes Express app
// - Sets up middlewares
// - Connects to databases
// - Starts HTTP server
// - Initializes Socket.IO

// When to edit:
// - Add new global middleware
// - Configure CORS
// - Add new services
```

#### 2. **src/routes/index.js** - Route Aggregator

```javascript
// What it does:
// - Combines all route modules
// - Defines API structure

// When to edit:
// - Add new route modules
// - Change API versioning
```

#### 3. **src/middlewares/auth.js** - Authentication

```javascript
// What it does:
// - Validates JWT tokens
// - Extracts user info from token
// - Protects routes

// When to edit:
// - Change token validation logic
// - Add role-based access control
// - Modify token expiration
```

#### 4. **src/controllers/\*.js** - Business Logic

```javascript
// What they do:
// authController.js       - Login, register, password reset
// patientController.js    - Profile, medical records, prescriptions
// doctorController.js     - Doctor list, details, schedules
// appointmentController.js - Book, cancel, reschedule appointments

// When to edit:
// - Add new features
// - Change business rules
// - Update Frappe integration
```

#### 5. **src/services/FrappeAPIClient.js** - Frappe Integration

```javascript
// What it does:
// - Communicates with Frappe API
// - CRUD operations for Frappe doctypes
// - Handles authentication

// When to edit:
// - Add new Frappe doctype methods
// - Change API endpoints
// - Update error handling

// Key methods:
// - getDocument(doctype, name)
// - getDocumentList(doctype, options)
// - createDocument(doctype, data)
// - updateDocument(doctype, name, data)
// - deleteDocument(doctype, name)
```

#### 6. **prisma/schema.prisma** - Database Schema

```prisma
// Defines:
// - User model (auth data)
// - Appointment model (local cache)

// When to edit:
// - Add new models
// - Change fields
// - Add relations

// After editing:
// Run: npx prisma db push
```

---

## Frontend Architecture

### Component Hierarchy

```
App.jsx
├── Layout.jsx
│   ├── Header.jsx
│   └── Footer.jsx
│
├── Public Routes
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Contact.jsx
│   ├── Doctors.jsx
│   ├── DoctorDetail.jsx
│   ├── auth/Login.jsx
│   └── auth/Register.jsx
│
└── Protected Routes (ProtectedRoute.jsx)
    └── Portal
        ├── Dashboard.jsx
        ├── Profile.jsx
        ├── BookAppointment.jsx
        ├── Appointments.jsx
        ├── MedicalRecords.jsx
        └── Prescriptions.jsx
```

### State Management

**Zustand Store** (`store/authStore.js`):

```javascript
// Manages:
// - User authentication state
// - Login/logout functions
// - Token persistence
// - User profile data

// When to edit:
// - Add new auth features
// - Change token storage
// - Add user preferences
```

### Key Files

#### 1. **src/main.jsx** - App Entry

```javascript
// What it does:
// - Renders root component
// - Sets up React Router
// - Initializes global state

// When to edit:
// - Change routing structure
// - Add global providers
```

#### 2. **src/App.jsx** - Root Component

```javascript
// What it does:
// - Defines all routes
// - Sets up layout structure
// - Configures navigation

// When to edit:
// - Add new pages
// - Change route paths
// - Update navigation
```

#### 3. **src/services/api.js** - API Client

```javascript
// What it does:
// - Axios configuration
// - All API endpoint functions
// - Request/response interceptors

// When to edit:
// - Add new API endpoints
// - Change base URL
// - Update auth headers

// Key sections:
// - authAPI (login, register, logout)
// - patientAPI (profile, records, prescriptions)
// - doctorAPI (list, details, schedules)
// - appointmentAPI (book, list, cancel)
```

#### 4. **src/components/ProtectedRoute.jsx** - Route Guard

```javascript
// What it does:
// - Checks if user is authenticated
// - Redirects to login if not
// - Protects portal pages

// When to edit:
// - Add role-based access
// - Change redirect logic
```

---

## Database Schema

### PostgreSQL (Application Data)

**User Table**:

```sql
id              INT PRIMARY KEY
email           VARCHAR UNIQUE
password        VARCHAR (hashed)
firstName       VARCHAR
lastName        VARCHAR
phone           VARCHAR
dateOfBirth     DATE
gender          VARCHAR
bloodGroup      VARCHAR
address         TEXT
frappePatientId VARCHAR (links to Frappe)
role            VARCHAR (default: 'patient')
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
```

**Appointment Table** (Local cache):

```sql
id                  INT PRIMARY KEY
userId              INT (FK to User)
frappeAppointmentId VARCHAR (links to Frappe)
practitioner        VARCHAR
appointmentDate     DATE
appointmentTime     TIME
department          VARCHAR
status              VARCHAR
notes               TEXT
createdAt           TIMESTAMP
updatedAt           TIMESTAMP
```

### MariaDB (Frappe Data)

Managed by Frappe/ERPNext. Key doctypes:

- **Patient**: Patient information
- **Healthcare Practitioner**: Doctor details
- **Patient Appointment**: Appointments
- **Patient Encounter**: Consultation records
- **Appointment Type**: Appointment categories
- **Vital Signs**: Patient vitals
- **Lab Test**: Lab test results
- **Prescription**: Prescriptions

---

## API Reference

### Authentication

**POST /api/auth/register**

```json
Request:
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "Male",
  "blood_group": "B+"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "jwt-token",
    "user": { /* user data */ }
  }
}
```

**POST /api/auth/login**

```json
Request:
{
  "email": "user@example.com",
  "password": "Password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": { /* user data */ }
  }
}
```

### Patient

**GET /api/patients/profile** (Protected)

```json
Headers:
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "1234567890",
    "date_of_birth": "1990-01-01",
    "gender": "Male",
    "blood_group": "B+",
    "address": "123 Main St",
    "frappe_patient_id": "PAT-00001"
  }
}
```

**PUT /api/patients/profile** (Protected)

```json
Request:
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "Male",
  "blood_group": "B+",
  "address": "123 Main St"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user data */ }
}
```

**GET /api/patients/medical-records** (Protected)

```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "ENC-00001",
      "type": "Consultation",
      "date": "2026-01-15",
      "doctor": "Dr. John Smith",
      "status": "Completed",
      "summary": "Routine checkup"
    }
  ]
}
```

**GET /api/patients/prescriptions** (Protected)

```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "ENC-00001",
      "date": "2026-01-15",
      "doctor": "Dr. John Smith",
      "diagnosis": "Common Cold",
      "status": "Active",
      "medications": [
        {
          "name": "Paracetamol",
          "dosage": "500mg",
          "frequency": "Tablet",
          "duration": "5 days"
        }
      ]
    }
  ]
}
```

### Doctors

**GET /api/doctors**

```json
Query Params:
?department=Cardiology&limit=20

Response:
{
  "success": true,
  "data": [
    {
      "id": "HLC-PRAC-2026-00001",
      "name": "Dr. John Smith",
      "department": "Cardiology",
      "image": "url",
      "phone": "1234567890",
      "available": true
    }
  ]
}
```

**GET /api/doctors/:id**

```json
Response:
{
  "success": true,
  "data": {
    "id": "HLC-PRAC-2026-00001",
    "name": "Dr. John Smith",
    "department": "Cardiology",
    "image": "url",
    "phone": "1234567890",
    "email": "doctor@example.com",
    "schedule": [ /* schedule data */ ]
  }
}
```

### Appointments

**POST /api/appointments/book** (Protected)

```json
Request:
{
  "practitioner": "HLC-PRAC-2026-00001",
  "appointment_date": "2026-03-05",
  "appointment_time": "10:00",
  "department": "Cardiology",
  "notes": "Checkup"
}

Response:
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": 1,
    "frappe_id": "APT-00001",
    "practitioner": "HLC-PRAC-2026-00001",
    "date": "2026-03-05",
    "time": "10:00",
    "status": "Open"
  }
}
```

**GET /api/appointments** (Protected)

```json
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "frappe_id": "APT-00001",
      "practitioner": "Dr. John Smith",
      "date": "2026-03-05",
      "time": "10:00",
      "status": "Open",
      "notes": "Checkup"
    }
  ]
}
```

**GET /api/appointments/available-slots**

```json
Query Params:
?practitioner=HLC-PRAC-2026-00001&date=2026-03-05

Response:
{
  "success": true,
  "data": [
    { "time": "09:00", "available": true },
    { "time": "09:30", "available": true },
    { "time": "10:00", "available": false }
  ]
}
```

---

## Common Issues & Fixes

### Issue 1: "User not found" after registration

**Location**: `nodejs-backend/src/middlewares/auth.js`

**Cause**: JWT token field mismatch

**Fix**:

```javascript
// Line ~25
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = { id: decoded.userId }; // Should be userId not id
req.userId = decoded.userId;
```

### Issue 2: Appointment booking fails with 417 error

**Location**: `nodejs-backend/src/controllers/appointmentController.js`

**Cause**: Missing mandatory Frappe fields

**Fix**:

```javascript
// Line ~40
const appointmentData = {
  doctype: "Patient Appointment",
  patient: user.frappePatientId,
  practitioner: practitioner, // Must use Frappe ID not name
  appointment_date: appointment_date,
  appointment_time: appointment_time,
  appointment_type: "Consultation", // REQUIRED
  appointment_for: "Patient", // REQUIRED
  status: "Open",
};
```

### Issue 3: Frontend sends doctor name instead of ID

**Location**: `frontend/src/pages/portal/BookAppointment.jsx``

**Cause**: Using display name instead of Frappe ID

**Fix**:

```javascript
// Line ~150
practitioner: selectedDoctor.id || selectedDoctor.name, // Use ID first
```

### Issue 4: Blood group format mismatch

**Location**: `nodejs-backend/src/controllers/authController.js`

**Cause**: Frappe expects "B Positive" not "B+"

**Fix**:

```javascript
// Add helper function
const toFrappeBloodGroup = (bg) => {
  const map = {
    "A+": "A Positive", "A-": "A Negative",
    "B+": "B Positive", "B-": "B Negative",
    "O+": "O Positive", "O-": "O Negative",
    "AB+": "AB Positive", "AB-": "AB Negative",
  };
  return map[bg] || bg;
};

// Use when creating patient
blood_group: toFrappeBloodGroup(blood_group),
```

### Issue 5: Profile not updating after save

**Location**: `frontend/src/store/authStore.js`

**Cause**: State not updated with API response

**Fix**:

```javascript
// Line ~60
updateProfile: async (profileData) => {
  const response = await api.put('/api/patients/profile', profileData);
  set({ user: response.data.data }); // Use response.data.data not response.data
},
```

### Issue 6: Medical records API returns 500 error

**Location**: `nodejs-backend/src/controllers/patientController.js`

**Cause**: Requesting non-existent fields from Frappe

**Fix**:

```javascript
// Line ~200
fields: [
  "name",
  "encounter_date",
  "practitioner",
  "practitioner_name",
  // DON'T include "symptoms" - doesn't exist in Patient Encounter
],
```

### Issue 7: Patient not created in Frappe during registration

**Location**: `nodejs-backend/src/controllers/authController.js`

**Cause**: Frappe tries to create duplicate user account

**Fix**:

```javascript
// Line ~100
const patientData = {
  doctype: "Patient",
  first_name: firstName,
  email: email,
  invite_user: 0, // IMPORTANT: Don't create Frappe user account
};
```

### Issue 8: Docker container won't start

**Symptoms**: Container exits immediately

**Fix**:

```bash
# Check logs
docker-compose logs <service-name>

# Common issues:
# 1. Port already in use - change in docker-compose.yml
# 2. Out of memory - increase Docker memory limit
# 3. Database not ready - add depends_on in docker-compose.yml
```

### Issue 9: Prisma migration fails

**Symptoms**: Database schema mismatch errors

**Fix**:

```bash
# Access container
docker-compose exec nodejs-backend sh

# Reset and push schema
npx prisma generate
npx prisma db push --force-reset

# WARNING: This deletes all data!
```

### Issue 10: CORS errors in frontend

**Location**: `nodejs-backend/src/index.js`

**Fix**:

```javascript
// Line ~20
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
```

---

## Development Guide

### Adding a New API Endpoint

**Step 1**: Create route in `src/routes/`

```javascript
// src/routes/exampleRoutes.js
const express = require("express");
const router = express.Router();
const { getExamples } = require("../controllers/exampleController");
const { authenticateToken } = require("../middlewares/auth");

router.get("/", authenticateToken, getExamples);

module.exports = router;
```

**Step 2**: Create controller in `src/controllers/`

```javascript
// src/controllers/exampleController.js
exports.getExamples = async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**Step 3**: Register route in `src/routes/index.js`

```javascript
const exampleRoutes = require("./exampleRoutes");
router.use("/examples", exampleRoutes);
```

**Step 4**: Add to frontend API client `frontend/src/services/api.js`

```javascript
export const exampleAPI = {
  getAll: () => api.get("/api/examples"),
};
```

### Adding a New Frontend Page

**Step 1**: Create page component

```javascript
// frontend/src/pages/NewPage.jsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

**Step 2**: Add route in `App.jsx`

```javascript
import NewPage from "./pages/NewPage";

// In your routes:
<Route path="/new-page" element={<NewPage />} />;
```

**Step 3**: Add navigation link in `Header.jsx`

```javascript
<Link to="/new-page">New Page</Link>
```

### Working with Frappe API

**Example: Get data from Frappe**

```javascript
// In controller
const frappe = require("../services/FrappeAPIClient");

// Get single document
const patient = await frappe.getDocument("Patient", "PAT-00001");

// Get list with filters
const doctors = await frappe.getDocumentList("Healthcare Practitioner", {
  filters: [["status", "=", "Active"]],
  fields: ["name", "practitioner_name", "department"],
  limit_page_length: 20,
});

// Create document
const appointment = await frappe.createDocument("Patient Appointment", {
  patient: "PAT-00001",
  practitioner: "HLC-PRAC-2026-00001",
  appointment_date: "2026-03-05",
});

// Update document
await frappe.updateDocument("Patient", "PAT-00001", {
  mobile: "9876543210",
});
```

### Database Queries with Prisma

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Find one
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});

// Find many
const appointments = await prisma.appointment.findMany({
  where: { userId: 1 },
  orderBy: { appointmentDate: "desc" },
});

// Create
const newUser = await prisma.user.create({
  data: {
    email: "new@example.com",
    password: hashedPassword,
    firstName: "John",
  },
});

// Update
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { phone: "1234567890" },
});

// Delete
await prisma.user.delete({
  where: { id: 1 },
});
```

---

## Debugging Tips

### Backend Debugging

```javascript
// Add console logs
console.log('Debug:', variable);

// Use logger
const logger = require('./utils/logger');
logger.info('Info message');
logger.error('Error message', error);

// Check logs
docker-compose logs -f nodejs-backend
```

### Frontend Debugging

```javascript
// Console log
console.log("Debug:", data);

// React DevTools
// Install browser extension

// Check network requests
// Open browser DevTools → Network tab
```

### Database Debugging

```bash
# PostgreSQL
docker-compose exec postgres psql -U postgres -d healthcare_portal

# List tables
\dt

# Query
SELECT * FROM "User";

# Exit
\q

# MariaDB
docker-compose exec mariadb mysql -u root -p
USE _5c5594d7a83c2891;
SHOW TABLES;
SELECT * FROM `tabPatient`;
```

---

## Testing

### Backend Tests

```bash
# Add test script to package.json
"scripts": {
  "test": "jest"
}

# Install testing dependencies
npm install --save-dev jest supertest

# Create test file
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/index');

describe('Auth API', () => {
  test('POST /api/auth/login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toBe(200);
  });
});
```

### Frontend Tests

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react vitest

# Add test script
"scripts": {
  "test": "vitest"
}

# Create test
// src/components/__tests__/Header.test.jsx
import { render, screen } from '@testing-library/react';
import Header from '../Header';

test('renders header', () => {
  render(<Header />);
  expect(screen.getByText('Healthcare')).toBeInTheDocument();
});
```

---

## Performance Optimization

### Backend

```javascript
// 1. Add caching
const redis = require("./config/redis");

// Cache Frappe data
const cacheKey = `doctors:all`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const data = await frappe.getDocumentList("Healthcare Practitioner");
await redis.setex(cacheKey, 3600, JSON.stringify(data));

// 2. Pagination
const { page = 1, limit = 20 } = req.query;
const skip = (page - 1) * limit;
const users = await prisma.user.findMany({ skip, take: limit });

// 3. Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, firstName: true },
});
```

### Frontend

```javascript
// 1. Lazy loading
const Dashboard = lazy(() => import("./pages/portal/Dashboard"));

// 2. Memoization
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 3. Debounce
import { debounce } from "lodash";
const debouncedSearch = debounce(searchFunction, 300);
```

---

## Security Best Practices

### Backend

```javascript
// 1. Validate all inputs
const { error } = appointmentSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });

// 2. Sanitize data
const sanitizedInput = xss(userInput);

// 3. Use parameterized queries (Prisma does this automatically)

// 4. Rate limiting (already implemented)

// 5. HTTPS only in production
```

### Frontend

```javascript
// 1. Never store sensitive data in localStorage
// Store only JWT token, not passwords

// 2. Sanitize user input
import DOMPurify from "dompurify";
const clean = DOMPurify.sanitize(dirty);

// 3. Use HTTPS in production

// 4. Implement CSP headers
```

---

## Maintenance Checklist

### Daily

- [ ] Check error logs
- [ ] Monitor disk space
- [ ] Verify all services running

### Weekly

- [ ] Review security logs
- [ ] Check backup status
- [ ] Update dependencies

### Monthly

- [ ] Performance review
- [ ] Database optimization
- [ ] Security audit

---

## Additional Resources

- Frappe API Docs: https://frappeframework.com/docs/user/en/api
- Prisma Docs: https://www.prisma.io/docs
- React Docs: https://react.dev/
- Express Docs: https://expressjs.com/
- Docker Docs: https://docs.docker.com/

---

## Need Help?

1. Check logs: `docker-compose logs -f`
2. Review this guide
3. Search GitHub issues
4. Ask on Frappe forum: https://discuss.frappe.io/
5. Stack Overflow with relevant tags
