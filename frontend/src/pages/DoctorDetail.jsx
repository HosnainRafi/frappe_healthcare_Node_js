import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiAward,
  FiUser,
  FiPhone,
  FiMail,
  FiGrid,
} from "react-icons/fi";
import { doctorAPI } from "../services/api";

function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorAPI.getById(id);
      setDoctor(response.data.data);
    } catch (err) {
      console.error("Failed to fetch doctor:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 h-48 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
              <div className="h-4 bg-gray-200 rounded w-full mt-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <FiUser className="mx-auto text-5xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Doctor not found</h2>
        <p className="text-gray-500 mt-2">
          The doctor you are looking for could not be loaded.
        </p>
        <Link
          to="/doctors"
          className="text-primary-600 hover:text-primary-700 mt-4 inline-block font-medium"
        >
          &larr; Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={
                doctor.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&size=200&background=fff&color=0284c7`
              }
              alt={doctor.name}
              className="w-48 h-48 rounded-xl object-cover border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{doctor.name}</h1>
              {doctor.designation && (
                <p className="text-primary-200 text-base mt-1">
                  {doctor.designation}
                </p>
              )}
              <p className="text-primary-100 text-lg mt-1">
                {doctor.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-primary-100">
                {doctor.phone && (
                  <span className="flex items-center">
                    <FiPhone className="mr-1" />
                    {doctor.phone}
                  </span>
                )}
                {doctor.email && (
                  <span className="flex items-center">
                    <FiMail className="mr-1" />
                    {doctor.email}
                  </span>
                )}
              </div>
              {doctor.op_consulting_charge && (
                <p className="mt-3 text-sm text-primary-200">
                  Consulting Fee:{" "}
                  <span className="font-semibold text-white">
                    ৳{doctor.op_consulting_charge}
                  </span>
                </p>
              )}
              <div className="mt-6">
                <Link
                  to={`/appointment`}
                  className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium inline-flex items-center"
                >
                  <FiCalendar className="mr-2" /> Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About / Description */}
              {doctor.description && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-gray-600 whitespace-pre-line">
                    {doctor.description}
                  </p>
                </div>
              )}

              {/* Education / Qualifications */}
              {doctor.education && doctor.education.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Education & Qualifications
                  </h2>
                  <ul className="space-y-2">
                    {doctor.education.map((edu, index) => (
                      <li
                        key={index}
                        className="flex items-start text-gray-600"
                      >
                        <FiAward className="mr-2 mt-1 text-primary-600 flex-shrink-0" />
                        <span>
                          {typeof edu === "string"
                            ? edu
                            : edu.qualification || edu.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Department */}
              {doctor.department && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Department
                  </h2>
                  <div className="flex items-center">
                    <FiGrid className="mr-2 text-primary-600" />
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {doctor.department}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Schedule */}
              {doctor.schedule && doctor.schedule.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    <FiClock className="inline mr-2" />
                    Schedule
                  </h2>
                  <div className="space-y-3">
                    {doctor.schedule.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.day || item.schedule_name}
                        </span>
                        {item.time && (
                          <span className="font-medium text-gray-900">
                            {item.time}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3 text-sm">
                  {doctor.phone && (
                    <div className="flex items-center text-gray-600">
                      <FiPhone className="mr-2 text-primary-600" />
                      {doctor.phone}
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center text-gray-600">
                      <FiMail className="mr-2 text-primary-600" />
                      {doctor.email}
                    </div>
                  )}
                  {doctor.address && (
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2 text-primary-600" />
                      {doctor.address}
                    </div>
                  )}
                  {doctor.gender && (
                    <div className="flex items-center text-gray-600">
                      <FiUser className="mr-2 text-primary-600" />
                      {doctor.gender}
                    </div>
                  )}
                </div>
              </div>

              <Link
                to={`/appointment`}
                className="btn-primary w-full flex items-center justify-center"
              >
                <FiCalendar className="mr-2" /> Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DoctorDetail;
