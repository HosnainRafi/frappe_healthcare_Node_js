import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiPlusCircle,
  FiFilter,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { appointmentAPI } from "../../services/api";
import toast from "react-hot-toast";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getMyAppointments();
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    setCancellingId(appointmentId);
    try {
      await appointmentAPI.cancel(appointmentId);
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Closed":
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isUpcoming = (date) => new Date(date) >= new Date();

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "upcoming")
      return isUpcoming(apt.appointment_date) && apt.status !== "Cancelled";
    if (filter === "past") return !isUpcoming(apt.appointment_date);
    if (filter === "cancelled") return apt.status === "Cancelled";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>
        <Link
          to="/portal/book-appointment"
          className="btn-primary inline-flex items-center"
        >
          <FiPlusCircle className="mr-2" /> Book Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <FiFilter className="text-gray-400" />
        <div className="flex space-x-2">
          {["all", "upcoming", "past", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <FiCalendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">
            No appointments found
          </h3>
          <p className="mt-2 text-gray-600">
            {filter === "all"
              ? "You haven't booked any appointments yet."
              : `No ${filter} appointments.`}
          </p>
          <Link
            to="/portal/book-appointment"
            className="mt-6 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <FiPlusCircle className="mr-2" /> Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <div key={index} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiUser className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.practitioner_name ||
                        appointment.practitioner}
                    </h3>
                    <p className="text-gray-600">
                      {appointment.department || "General Consultation"}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(appointment.appointment_date)}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="mr-1" />
                        {formatTime(appointment.appointment_time)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>

                  {isUpcoming(appointment.appointment_date) &&
                    appointment.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancel(appointment.name)}
                        disabled={cancellingId === appointment.name}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                      >
                        {cancellingId === appointment.name ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FiX className="mr-1" /> Cancel
                          </>
                        )}
                      </button>
                    )}
                </div>
              </div>

              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Notes:</strong> {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;
