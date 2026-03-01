import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiActivity,
  FiFileText,
  FiArrowRight,
  FiPlusCircle,
  FiUser,
} from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import { appointmentAPI } from "../../services/api";

function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    prescriptions: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await appointmentAPI.getMyAppointments();
      const appointments = response.data.data || [];

      const upcoming = appointments.filter(
        (a) =>
          new Date(a.appointment_date) >= new Date() &&
          a.status !== "Cancelled",
      );
      const completed = appointments.filter((a) => a.status === "Closed");

      setStats({
        upcoming: upcoming.length,
        completed: completed.length,
        prescriptions: 0, // Will be fetched separately
      });

      setUpcomingAppointments(upcoming.slice(0, 3));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.first_name || "Patient"}!
            </h1>
            <p className="mt-1 text-primary-100">
              Here's an overview of your health journey
            </p>
          </div>
          <Link
            to="/portal/book-appointment"
            className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <FiPlusCircle className="mr-2" /> Book Appointment
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? "-" : stats.upcoming}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link
            to="/portal/appointments"
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            View all <FiArrowRight className="ml-1" />
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Visits</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? "-" : stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FiActivity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Link
            to="/portal/medical-records"
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            View records <FiArrowRight className="ml-1" />
          </Link>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Prescriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? "-" : stats.prescriptions}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <Link
            to="/portal/prescriptions"
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            View prescriptions <FiArrowRight className="ml-1" />
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <Link
              to="/portal/appointments"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FiCalendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-600">No upcoming appointments</p>
              <Link
                to="/portal/book-appointment"
                className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <FiPlusCircle className="mr-2" /> Book your first appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.practitioner_name ||
                          appointment.practitioner}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.department || "General Consultation"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatDate(appointment.appointment_date)}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center justify-end">
                      <FiClock className="mr-1" />
                      {formatTime(appointment.appointment_time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/portal/book-appointment"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiCalendar className="w-5 h-5 text-primary-600 mr-3" />
              <span className="text-gray-700">Book New Appointment</span>
            </Link>
            <Link
              to="/portal/prescriptions"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiFileText className="w-5 h-5 text-primary-600 mr-3" />
              <span className="text-gray-700">View Prescriptions</span>
            </Link>
            <Link
              to="/portal/profile"
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiUser className="w-5 h-5 text-primary-600 mr-3" />
              <span className="text-gray-700">Update Profile</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Health Tips</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <p className="text-sm text-gray-600">
                Stay hydrated by drinking at least 8 glasses of water daily.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p className="text-sm text-gray-600">
                Regular exercise for 30 minutes can improve your overall health.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <p className="text-sm text-gray-600">
                Get 7-8 hours of sleep for better mental and physical health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
