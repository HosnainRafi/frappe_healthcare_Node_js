import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Patient Portal
import Dashboard from "./pages/portal/Dashboard";
import Appointments from "./pages/portal/Appointments";
import BookAppointment from "./pages/portal/BookAppointment";
import MedicalRecords from "./pages/portal/MedicalRecords";
import Prescriptions from "./pages/portal/Prescriptions";
import MedicalHistory from "./pages/portal/MedicalHistory";
import Profile from "./pages/portal/Profile";

// Not Found
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Standalone Appointment Page (has its own layout) */}
      <Route path="appointment" element={<Appointment />} />

      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<DoctorDetail />} />
        <Route path="services" element={<Services />} />

        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Protected Patient Portal Routes */}
        <Route path="portal" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route
            path="book-appointment/:doctorId"
            element={<BookAppointment />}
          />
          <Route path="medical-history" element={<MedicalHistory />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
