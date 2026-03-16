import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiStar,
  FiMapPin,
} from "react-icons/fi";
import { doctorAPI } from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await doctorAPI.getSpecializations();
      setSpecializations(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      !selectedSpecialization || doctor.department === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Doctors</h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Meet our team of experienced healthcare professionals dedicated to
            your wellbeing.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="md:w-64 relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="input-field pl-10"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card p-6 animate-pulse">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto" />
                  <div className="h-6 bg-gray-200 rounded mt-4 w-3/4 mx-auto" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No doctors found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <div
                  key={index}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-center">
                    <img
                      src={
                        doctor.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&size=128&background=0284c7&color=fff`
                      }
                      alt={doctor.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-100"
                    />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      {doctor.department}
                    </p>

                    <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiStar className="text-yellow-400 mr-1" />
                        {doctor.rating || "4.5"}
                      </span>
                      <span>{doctor.experience || "10+ years"}</span>
                    </div>

                    <div className="mt-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          doctor.available !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {doctor.available !== false
                          ? "Available Today"
                          : "Not Available"}
                      </span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link
                        to={`/doctors/${encodeURIComponent(doctor.id || doctor.name)}`}
                        className="flex-1 btn-outline text-center"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/portal/book-appointment?doctor=${encodeURIComponent(doctor.id || doctor.name)}`}
                        className="flex-1 btn-primary text-center flex items-center justify-center"
                      >
                        <FiCalendar className="mr-1" /> Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Doctors;
