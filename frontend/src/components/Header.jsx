import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiFolder,
} from "react-icons/fi";
import useAuthStore from "../store/authStore";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-gray-700 hover:text-primary-600 font-medium transition-colors ${
      isActive ? "text-primary-600" : ""
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HCH</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              Hemayetpur Central Hospital
            </span>
            <span className="text-xl font-bold text-gray-900 sm:hidden">
              HCH
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
            <NavLink to="/doctors" className={navLinkClass}>
              Doctors
            </NavLink>
            <NavLink to="/appointment" className={navLinkClass}>
              Appointment
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-primary-600" />
                  </div>
                  <span className="font-medium">
                    {user?.first_name || "Patient"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                    <Link
                      to="/portal"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiFolder className="mr-2" /> Dashboard
                    </Link>
                    <Link
                      to="/portal/appointments"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiCalendar className="mr-2" /> Appointments
                    </Link>
                    <Link
                      to="/portal/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/services"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </NavLink>
              <NavLink
                to="/doctors"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Doctors
              </NavLink>
              <NavLink
                to="/appointment"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Appointment
              </NavLink>
              <NavLink
                to="/contact"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>

              <hr />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/portal"
                    className="text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="btn-secondary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
