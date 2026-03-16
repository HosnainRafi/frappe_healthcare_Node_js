import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiArrowRight } from "react-icons/fi";
import { doctorAPI } from "../services/api";

function Services() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await doctorAPI.getDepartments();
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            We offer different services to improve your health with certified
            doctors and modern equipment.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="card p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  <div className="h-6 bg-gray-200 rounded mt-4 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-full" />
                </div>
              ))}
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No departments available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept, index) => {
                const name =
                  typeof dept === "string"
                    ? dept
                    : dept.name || dept.department;
                return (
                  <div
                    key={index}
                    className="card p-6 hover:shadow-lg transition-shadow group"
                  >
                    <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <FiHeart className="w-8 h-8" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">
                      {name}
                    </h3>
                    <Link
                      to={`/doctors?specialization=${encodeURIComponent(name)}`}
                      className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Find Doctors <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Need Medical Assistance?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our team of certified specialist doctors is ready to help you. Book
            an appointment or call us at +8801839-952901.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portal/book-appointment"
              className="btn-primary inline-flex items-center"
            >
              Book Appointment <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/contact"
              className="btn-outline inline-flex items-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
