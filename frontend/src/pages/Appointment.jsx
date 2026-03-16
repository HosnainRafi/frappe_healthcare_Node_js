import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCheckCircle,
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiActivity,
  FiStar,
  FiGrid,
} from "react-icons/fi";
import { doctorAPI, appointmentAPI } from "../services/api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

function Appointment() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    user,
    login,
    register: registerUser,
    isLoading,
  } = useAuthStore();

  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchDoctors(selectedDepartment);
    } else {
      setDoctors([]);
    }
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedSlot(null);
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDepartments = async () => {
    try {
      const response = await doctorAPI.getDepartments();
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchDoctors = async (department) => {
    setLoadingDoctors(true);
    try {
      const response = await doctorAPI.getAll({ department });
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await appointmentAPI.getAvailableSlots(
        selectedDoctor.id || selectedDoctor.name,
        selectedDate,
      );
      setSlots(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    return maxDate.toISOString().split("T")[0];
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedSlot(null);
    setStep(2);
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const proceedToNextStep = () => {
    if (step === 2 && selectedSlot) {
      if (isAuthenticated) {
        setStep(4);
      } else {
        setStep(3);
      }
    }
  };

  const handleLogin = async (data) => {
    try {
      const result = await login({
        email: data.loginEmail,
        password: data.loginPassword,
      });
      if (result.success) {
        toast.success("Login successful!");
        setStep(4);
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleRegister = async (data) => {
    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.phone,
        password: data.password,
        dob: data.dateOfBirth,
        gender: data.gender,
      });
      if (result.success) {
        toast.success("Registration successful!");
        setStep(4);
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleBookAppointment = async (data) => {
    setSubmitting(true);
    try {
      const appointmentData = {
        practitioner: selectedDoctor.id || selectedDoctor.name,
        practitioner_name:
          selectedDoctor.name || selectedDoctor.practitioner_name,
        appointment_date: selectedDate,
        appointment_time: selectedSlot.time,
        department: selectedDepartment,
        reason: data.reason || "",
        notes: data.notes || "",
      };

      const response = await appointmentAPI.book(appointmentData);
      const bookedData = response.data?.data || {};
      setBookedAppointment({
        id: bookedData.name || bookedData.id || `APT-${Date.now()}`,
        doctorName: selectedDoctor.name || selectedDoctor.practitioner_name,
        department: selectedDepartment,
        date: selectedDate,
        time: selectedSlot.time,
      });
      toast.success("Appointment booked successfully!");
      setStep(5);
    } catch (error) {
      console.error("Failed to book appointment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      if (isAuthenticated) {
        setStep(2);
      } else {
        setStep(3);
      }
    }
  };

  // Steps: 1=Doctor(with dept dropdown), 2=Schedule, 3=Auth(optional), 4=Confirm, 5=Success
  const stepLabels = isAuthenticated
    ? ["Doctor", "Schedule", "Confirm"]
    : ["Doctor", "Schedule", "Account", "Confirm"];

  const currentStepIndex = (() => {
    if (isAuthenticated) {
      if (step <= 2) return step;
      if (step === 4) return 3;
      return 4;
    }
    return step === 5 ? 5 : step;
  })();

  // Step Indicator Component
  const StepIndicator = () => (
    <div className="mb-10">
      <div className="flex items-center justify-center">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold transition-all duration-300 shadow-md ${
                  currentStepIndex > index + 1
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                    : currentStepIndex === index + 1
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white ring-4 ring-primary-100"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                }`}
              >
                {currentStepIndex > index + 1 ? (
                  <FiCheckCircle size={20} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium hidden sm:block ${
                  currentStepIndex >= index + 1
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {index < stepLabels.length - 1 && (
              <div
                className={`w-12 md:w-20 h-1 mx-2 rounded-full transition-all duration-300 ${
                  currentStepIndex > index + 1
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Doctor Card Component
  const DoctorCard = ({ doctor }) => (
    <button
      onClick={() => handleDoctorSelect(doctor)}
      className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-400 hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <FiUser className="text-white text-2xl" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
            {doctor.name || doctor.practitioner_name}
          </h3>
          <p className="text-primary-600 font-medium text-sm mt-0.5">
            {doctor.department || doctor.specialty || "General Practice"}
          </p>

          <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
            {doctor.experience && (
              <span className="flex items-center">
                <FiActivity className="mr-1 text-primary-500" />
                {doctor.experience}
              </span>
            )}
            {doctor.rating && (
              <span className="flex items-center">
                <FiStar className="mr-1 text-yellow-400 fill-current" />
                {doctor.rating}
              </span>
            )}
          </div>
        </div>
        <FiArrowRight className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );

  // Time Slot Button Component
  const TimeSlotButton = ({ slot }) => (
    <button
      onClick={() => handleSlotSelect(slot)}
      disabled={!slot.available}
      className={`relative p-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
        selectedSlot?.time === slot.time
          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105"
          : slot.available
            ? "bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50 hover:shadow-md"
            : "bg-gray-50 text-gray-300 cursor-not-allowed border-2 border-gray-100"
      }`}
    >
      {selectedSlot?.time === slot.time && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <FiCheckCircle className="text-white text-xs" />
        </span>
      )}
      <FiClock
        className={`mx-auto mb-1 ${selectedSlot?.time === slot.time ? "text-white" : "text-primary-500"}`}
      />
      {formatTime(slot.time)}
    </button>
  );

  // Step 1: Select Department & Doctor
  const renderDoctorSelection = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg mb-4">
          <FiUser className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Doctor</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Select a department and then choose a doctor
        </p>
      </div>

      {/* Department Dropdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <FiGrid className="mr-2 text-primary-500" />
          Select Department
        </label>
        {loadingDepartments ? (
          <div className="flex items-center py-3">
            <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mr-3"></div>
            <span className="text-gray-500 text-sm">
              Loading departments...
            </span>
          </div>
        ) : (
          <select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-700 font-medium bg-white"
          >
            <option value="">-- Choose a Department --</option>
            {departments.map((dept) => {
              const name =
                typeof dept === "string" ? dept : dept.name || dept.department;
              return (
                <option key={name} value={name}>
                  {name}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {/* Doctors List */}
      {selectedDepartment && (
        <>
          {loadingDoctors ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <FiUser className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">
                No doctors available in this department
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Doctors in{" "}
                <span className="text-primary-600">{selectedDepartment}</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id || doctor.name} doctor={doctor} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!selectedDepartment && !loadingDepartments && (
        <div className="text-center py-12">
          <FiGrid className="mx-auto text-4xl text-gray-200 mb-4" />
          <p className="text-gray-400">
            Select a department above to see available doctors
          </p>
        </div>
      )}
    </div>
  );

  // Step 2: Select Date & Time
  const renderDateTimeSelection = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg mb-4">
          <FiCalendar className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Pick a Time</h2>
        <p className="text-gray-500 mt-2">
          Scheduling with{" "}
          <span className="font-semibold text-primary-600">
            {selectedDoctor?.name || selectedDoctor?.practitioner_name}
          </span>
        </p>
      </div>

      {/* Selected Doctor Mini Card */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-4 flex items-center space-x-4 border border-primary-100">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow">
          <FiUser className="text-white text-lg" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">
            {selectedDoctor?.name || selectedDoctor?.practitioner_name}
          </h4>
          <p className="text-sm text-primary-600">{selectedDepartment}</p>
        </div>
        <button
          onClick={goBack}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Change
        </button>
      </div>

      {/* Date Picker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
          <FiCalendar className="mr-2 text-primary-500" />
          Select Appointment Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedSlot(null);
          }}
          min={getMinDate()}
          max={getMaxDate()}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-700 font-medium"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-4">
            <FiClock className="mr-2 text-primary-500" />
            Available Time Slots
          </label>

          {loadingSlots ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500 text-sm">
                Loading available slots...
              </p>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No slots available for this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {slots.map((slot, index) => (
                <TimeSlotButton key={index} slot={slot} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={goBack}
          className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <button
          onClick={proceedToNextStep}
          disabled={!selectedSlot}
          className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
            selectedSlot
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  // Step 3: Login or Register
  const renderAuthStep = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg mb-4">
          {authMode === "login" ? (
            <FiLock className="text-white text-2xl" />
          ) : (
            <FiUser className="text-white text-2xl" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          {authMode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-500 mt-2">
          {authMode === "login"
            ? "Sign in to complete your booking"
            : "Quick registration to book your appointment"}
        </p>
      </div>

      {/* Appointment Summary Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-primary-100 text-sm font-medium">
            Your Appointment
          </span>
          <FiCalendar className="text-primary-200" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <FiUser className="mr-2 text-primary-200" />
            <span className="font-semibold">
              {selectedDoctor?.name || selectedDoctor?.practitioner_name}
            </span>
          </div>
          <div className="flex items-center text-sm text-primary-100">
            <FiGrid className="mr-2" />
            {selectedDepartment}
          </div>
          <div className="flex items-center text-sm text-primary-100">
            <FiCalendar className="mr-2" />
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center text-sm text-primary-100">
            <FiClock className="mr-2" />
            {selectedSlot && formatTime(selectedSlot.time)}
          </div>
        </div>
      </div>

      {/* Auth Toggle */}
      <div className="bg-gray-100 p-1.5 rounded-xl flex">
        <button
          onClick={() => setAuthMode("login")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
            authMode === "login"
              ? "bg-white text-primary-600 shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setAuthMode("register")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
            authMode === "register"
              ? "bg-white text-primary-600 shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Register
        </button>
      </div>

      {authMode === "login" ? (
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register("loginEmail", { required: "Email is required" })}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
            {errors.loginEmail && (
              <p className="text-red-500 text-sm mt-1.5">
                {errors.loginEmail.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("loginPassword", {
                  required: "Password is required",
                })}
                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.loginPassword && (
              <p className="text-red-500 text-sm mt-1.5">
                {errors.loginPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName", { required: "Required" })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName", { required: "Required" })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Email address"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                {...register("phone", { required: "Phone is required" })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Phone number"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dateOfBirth", { required: "Required" })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                {...register("gender", { required: "Required" })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Required",
                  validate: (value) =>
                    value === password || "Passwords don't match",
                })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="Confirm password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              <FiArrowLeft className="mr-2" /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  Register <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // Step 4: Confirm Details
  const renderConfirmation = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg mb-4">
          <FiCheckCircle className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Confirm Booking</h2>
        <p className="text-gray-500 mt-2">Review your appointment details</p>
      </div>

      {/* Appointment Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <FiUser className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-xl">
                {selectedDoctor?.name || selectedDoctor?.practitioner_name}
              </h3>
              <p className="text-primary-100">{selectedDepartment}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center text-gray-500">
              <FiGrid className="mr-3 text-primary-500" />
              <span>Department</span>
            </div>
            <span className="font-semibold text-gray-900">
              {selectedDepartment}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center text-gray-500">
              <FiCalendar className="mr-3 text-primary-500" />
              <span>Date</span>
            </div>
            <span className="font-semibold text-gray-900">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center text-gray-500">
              <FiClock className="mr-3 text-primary-500" />
              <span>Time</span>
            </div>
            <span className="font-semibold text-gray-900">
              {selectedSlot && formatTime(selectedSlot.time)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center text-gray-500">
              <FiUser className="mr-3 text-primary-500" />
              <span>Patient</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900 block">
                {user?.first_name} {user?.last_name || user?.lastName}
              </span>
              <span className="text-sm text-gray-500">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Form */}
      <form
        onSubmit={handleSubmit(handleBookAppointment)}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for Visit
          </label>
          <input
            type="text"
            {...register("reason")}
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            placeholder="e.g., Regular checkup, Follow-up visit, Consultation"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register("notes")}
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
            rows={3}
            placeholder="Any symptoms, medical history, or special requests for the doctor..."
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Booking...
              </>
            ) : (
              <>
                <FiCheckCircle className="mr-2" />
                Confirm Appointment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Step 5: Success
  const renderSuccess = () => (
    <div className="text-center space-y-8 py-8 animate-fadeIn">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <FiCheckCircle className="text-white text-5xl" />
        </div>
        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto animate-ping opacity-25"></div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-500 mt-2">
          Your appointment has been successfully scheduled
        </p>
      </div>

      {/* Appointment Details Card */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-md mx-auto text-left">
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            Confirmed
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-mono font-bold text-primary-600">
              {bookedAppointment?.id}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500">Department</span>
            <span className="font-semibold text-gray-900">
              {bookedAppointment?.department}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500">Doctor</span>
            <span className="font-semibold text-gray-900">
              {bookedAppointment?.doctorName}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-900">
              {bookedAppointment?.date &&
                new Date(bookedAppointment.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
            </span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-500">Time</span>
            <span className="font-semibold text-gray-900">
              {bookedAppointment?.time && formatTime(bookedAppointment.time)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link
          to="/portal/appointments"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <FiCalendar className="mr-2" />
          View My Appointments
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-blue-50 via-white to-primary-50">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {step < 5 && <StepIndicator />}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
          {step === 1 && renderDoctorSelection()}
          {step === 2 && renderDateTimeSelection()}
          {step === 3 && renderAuthStep()}
          {step === 4 && renderConfirmation()}
          {step === 5 && renderSuccess()}
        </div>

        {/* Help Text */}
        {step < 5 && (
          <p className="text-center text-gray-400 text-sm mt-6">
            Need help?{" "}
            <Link to="/contact" className="text-primary-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Appointment;
