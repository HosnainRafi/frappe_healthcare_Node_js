import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiAward,
  FiHeart,
  FiClock,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

function Home() {
  const features = [
    {
      icon: <FiCalendar className="w-8 h-8" />,
      title: "Easy Booking",
      description:
        "Book appointments online in just a few clicks. Choose your preferred doctor and time slot.",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Expert Doctors",
      description:
        "Our team of experienced healthcare professionals are dedicated to your wellbeing.",
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "24/7 Support",
      description:
        "Round-the-clock medical support and emergency services available.",
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Secure Records",
      description:
        "Your medical records are safely stored and accessible only to authorized personnel.",
    },
  ];

  const services = [
    {
      name: "General Medicine",
      description: "Comprehensive primary care for all ages",
    },
    { name: "Cardiology", description: "Heart and cardiovascular system care" },
    { name: "Orthopedics", description: "Bone, joint, and muscle treatment" },
    { name: "Pediatrics", description: "Specialized care for children" },
    { name: "Dermatology", description: "Skin, hair, and nail care" },
    { name: "Neurology", description: "Brain and nervous system care" },
  ];

  const stats = [
    { number: "50+", label: "Expert Doctors" },
    { number: "10K+", label: "Happy Patients" },
    { number: "15+", label: "Departments" },
    { number: "24/7", label: "Emergency Care" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Health, <br />
                <span className="text-primary-200">Our Priority</span>
              </h1>
              <p className="mt-6 text-lg text-primary-100 max-w-lg">
                Experience world-class healthcare with compassionate doctors,
                modern facilities, and personalized treatment plans tailored
                just for you.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/portal/book-appointment"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all inline-flex items-center justify-center"
                >
                  Book Appointment <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/services"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-6 rounded-lg transition-all inline-flex items-center justify-center"
                >
                  Our Services
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop"
                alt="Healthcare"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600">
                  {stat.number}
                </div>
                <div className="mt-2 text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We provide comprehensive healthcare services with a focus on
              patient comfort and advanced medical care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Comprehensive healthcare services across multiple specializations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="card p-6 hover:border-primary-500 border-2 border-transparent cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiHeart className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/services"
              className="btn-primary inline-flex items-center"
            >
              View All Services <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Take Control of Your Health?
          </h2>
          <p className="mt-4 text-primary-100 max-w-2xl mx-auto">
            Book an appointment today and experience healthcare that puts you
            first.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all inline-flex items-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
