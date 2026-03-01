import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiCalendar,
  FiStar,
  FiMapPin,
  FiClock,
  FiAward,
  FiUser,
} from "react-icons/fi";
import { doctorAPI } from "../services/api";

function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorAPI.getById(id);
      setDoctor(response.data.data);
    } catch (error) {
      console.error("Failed to fetch doctor:", error);
      // Mock data for demo
      setDoctor({
        name: decodeURIComponent(id),
        department: "General Medicine",
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(id)}&size=200&background=0284c7&color=fff`,
        experience: "15 years",
        rating: 4.8,
        reviews: 124,
        education: ["MBBS - Medical College", "MD - Specialty Hospital"],
        languages: ["English", "Spanish"],
        about:
          "Dedicated healthcare professional with extensive experience in patient care. Committed to providing compassionate and comprehensive medical treatment.",
        schedule: [
          { day: "Monday - Friday", time: "9:00 AM - 5:00 PM" },
          { day: "Saturday", time: "10:00 AM - 2:00 PM" },
        ],
        specializations: [
          "General Checkup",
          "Preventive Care",
          "Chronic Disease Management",
        ],
      });
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

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Doctor not found</h2>
        <Link
          to="/doctors"
          className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
        >
          Back to Doctors
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
              <p className="text-primary-100 text-lg mt-1">
                {doctor.department}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
                <span className="flex items-center">
                  <FiAward className="mr-1" />
                  {doctor.experience} experience
                </span>
              </div>
              <div className="mt-6">
                <Link
                  to={`/portal/book-appointment?doctor=${encodeURIComponent(doctor.name)}`}
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
            {/* About */}
            <div className="md:col-span-2 space-y-8">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <p className="text-gray-600">{doctor.about}</p>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Education
                </h2>
                <ul className="space-y-2">
                  {doctor.education?.map((edu, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <FiAward className="mr-2 text-primary-600" />
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations?.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  <FiClock className="inline mr-2" />
                  Schedule
                </h2>
                <div className="space-y-3">
                  {doctor.schedule?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.day}</span>
                      <span className="font-medium text-gray-900">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages?.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={`/portal/book-appointment?doctor=${encodeURIComponent(doctor.name)}`}
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
