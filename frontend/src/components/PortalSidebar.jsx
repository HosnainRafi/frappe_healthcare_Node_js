import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiPlusCircle,
  FiFileText,
  FiClipboard,
  FiUser,
  FiSettings,
} from "react-icons/fi";

function PortalSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-primary-100 text-primary-700 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r min-h-full p-4">
      <nav className="space-y-2">
        <NavLink to="/portal" end className={linkClass}>
          <FiHome size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/portal/appointments" className={linkClass}>
          <FiCalendar size={20} />
          <span>My Appointments</span>
        </NavLink>

        <NavLink to="/portal/book-appointment" className={linkClass}>
          <FiPlusCircle size={20} />
          <span>Book Appointment</span>
        </NavLink>

        <NavLink to="/portal/medical-records" className={linkClass}>
          <FiFileText size={20} />
          <span>Medical Records</span>
        </NavLink>

        <NavLink to="/portal/prescriptions" className={linkClass}>
          <FiClipboard size={20} />
          <span>Prescriptions</span>
        </NavLink>

        <hr className="my-4" />

        <NavLink to="/portal/profile" className={linkClass}>
          <FiUser size={20} />
          <span>My Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default PortalSidebar;
