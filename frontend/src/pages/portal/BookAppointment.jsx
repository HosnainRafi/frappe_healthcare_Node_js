import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiGrid,
} from "react-icons/fi";
import { doctorAPI, appointmentAPI } from "../../services/api";
import toast from "react-hot-toast";

function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const [isBooked, setIsBooked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  // When department changes, fetch doctors for that department
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

  // Handle pre-selected doctor from URL
  useEffect(() => {
    const doctorParam = searchParams.get("doctor");
    if (doctorParam && doctors.length > 0) {
      const doctor = doctors.find((d) => d.name === doctorParam);
      if (doctor) {
        setSelectedDoctor(doctor);
        setStep(3);
      }
    }
  }, [searchParams, doctors]);

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
      toast.error("Failed to load available time slots");
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

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await appointmentAPI.book({
        practitioner: selectedDoctor.id || selectedDoctor.name,
        appointment_date: selectedDate,
        appointment_time: selectedSlot.time,
        department: selectedDoctor.department,
        notes: data.notes,
      });
      setIsBooked(true);
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isBooked) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Appointment Booked!
        </h2>
        <p className="mt-4 text-gray-600">
          Your appointment with {selectedDoctor.name} has been successfully
          booked for{" "}
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at {formatTime(selectedSlot.time)}.
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          A confirmation email will be sent to your registered email address.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/portal/appointments")}
            className="btn-primary"
          >
            View Appointments
          </button>
          <button
            onClick={() => {
              setIsBooked(false);
              setStep(1);
              setSelectedDepartment("");
              setSelectedDoctor(null);
              setSelectedDate("");
              setSelectedSlot(null);
            }}
            className="btn-outline"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Book an Appointment
      </h1>
      <p className="text-gray-600 mb-8">
        Select a doctor, date, and time slot for your appointment
      </p>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: "Department" },
          { num: 2, label: "Select Doctor" },
          { num: 3, label: "Date & Time" },
          { num: 4, label: "Confirm" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > s.num
                    ? "bg-green-500 text-white"
                    : step === s.num
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > s.num ? <FiCheckCircle /> : s.num}
              </div>
              <span className="text-xs mt-1 text-gray-600">{s.label}</span>
            </div>
            {i < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${step > s.num ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Department */}
      {step === 1 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <FiGrid className="inline mr-2" />
            Select a Department
          </h2>
          {loadingDepartments ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : departments.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              No departments available.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {departments.map((dept, index) => {
                const name =
                  typeof dept === "string"
                    ? dept
                    : dept.name || dept.department;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDepartment(name);
                      setStep(2);
                    }}
                    className={`p-4 border-2 rounded-lg text-left hover:border-primary-500 transition-colors ${
                      selectedDepartment === name
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Doctor */}
      {step === 2 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Select a Doctor
            </h2>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Change Department
            </button>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-semibold text-gray-900">{selectedDepartment}</p>
          </div>

          {loadingDoctors ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-4 border rounded-lg animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded mt-3 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              No doctors available in this department.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {doctors.map((doctor, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setStep(3);
                  }}
                  className={`p-4 border-2 rounded-lg text-left hover:border-primary-500 transition-colors ${
                    selectedDoctor?.name === doctor.name
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {doctor.department}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            <button onClick={() => setStep(1)} className="btn-outline">
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Date & Time
            </h2>
            <button
              onClick={() => setStep(2)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Change Doctor
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Selected Doctor</p>
            <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
            <p className="text-sm text-gray-600">{selectedDoctor.department}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline mr-2" />
              Select Date
            </label>
            <input
              type="date"
              min={getMinDate()}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot(null);
              }}
              className="input-field"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiClock className="inline mr-2" />
                Available Time Slots
              </label>
              {loadingSlots ? (
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div
                      key={n}
                      className="h-10 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No available slots for this date
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => slot.available && setSelectedSlot(slot)}
                      disabled={!slot.available}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedSlot?.time === slot.time
                          ? "bg-primary-600 text-white"
                          : slot.available
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed line-through"
                      }`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(2)} className="btn-outline">
              Back
            </button>
            <button
              onClick={() => selectedSlot && setStep(4)}
              disabled={!selectedSlot}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Confirm Appointment
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Appointment Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor</span>
                <span className="font-medium text-gray-900">
                  {selectedDoctor.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department</span>
                <span className="font-medium text-gray-900">
                  {selectedDoctor.department}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium text-gray-900">
                  {formatTime(selectedSlot.time)}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="inline mr-2" />
                Notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="input-field resize-none"
                placeholder="Any specific concerns or symptoms you'd like to discuss..."
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-outline"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
