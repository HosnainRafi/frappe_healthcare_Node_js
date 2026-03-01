import { Link } from "react-router-dom";
import {
  FiHeart,
  FiActivity,
  FiEye,
  FiUsers,
  FiShield,
  FiDroplet,
  FiSun,
  FiZap,
  FiSmile,
  FiArrowRight,
} from "react-icons/fi";

function Services() {
  const services = [
    {
      icon: <FiHeart className="w-8 h-8" />,
      name: "Cardiology",
      description:
        "Comprehensive heart and cardiovascular care including diagnostics, treatment, and preventive care for heart conditions.",
      features: ["ECG & Echo", "Angiography", "Heart Surgery", "Cardiac Rehab"],
    },
    {
      icon: <FiActivity className="w-8 h-8" />,
      name: "Neurology",
      description:
        "Expert care for brain, spine, and nervous system disorders with advanced diagnostic and treatment options.",
      features: [
        "Brain Scans",
        "Stroke Care",
        "Epilepsy Treatment",
        "Nerve Studies",
      ],
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      name: "Pediatrics",
      description:
        "Dedicated healthcare for infants, children, and adolescents with a focus on growth and development.",
      features: [
        "Well-child Visits",
        "Vaccinations",
        "Growth Monitoring",
        "Developmental Care",
      ],
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      name: "Orthopedics",
      description:
        "Treatment for bones, joints, ligaments, and muscles including sports medicine and joint replacement.",
      features: [
        "Joint Replacement",
        "Fracture Care",
        "Sports Medicine",
        "Physical Therapy",
      ],
    },
    {
      icon: <FiSun className="w-8 h-8" />,
      name: "Dermatology",
      description:
        "Skin, hair, and nail care including cosmetic procedures and treatment for skin conditions.",
      features: [
        "Skin Cancer Screening",
        "Acne Treatment",
        "Cosmetic Procedures",
        "Allergy Testing",
      ],
    },
    {
      icon: <FiEye className="w-8 h-8" />,
      name: "Ophthalmology",
      description:
        "Complete eye care from routine exams to complex surgeries for vision correction and eye diseases.",
      features: [
        "Eye Exams",
        "Cataract Surgery",
        "LASIK",
        "Glaucoma Treatment",
      ],
    },
    {
      icon: <FiDroplet className="w-8 h-8" />,
      name: "Nephrology",
      description:
        "Kidney care including dialysis, transplant services, and management of chronic kidney disease.",
      features: [
        "Dialysis",
        "Kidney Transplant",
        "Hypertension",
        "Kidney Stones",
      ],
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      name: "Emergency Care",
      description:
        "24/7 emergency medical services for critical and life-threatening conditions.",
      features: [
        "Trauma Care",
        "Critical Care",
        "Ambulance",
        "24/7 Availability",
      ],
    },
    {
      icon: <FiSmile className="w-8 h-8" />,
      name: "Dental Care",
      description:
        "Comprehensive dental services from routine cleanings to complex oral surgeries.",
      features: ["Cleanings", "Fillings", "Root Canal", "Orthodontics"],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Comprehensive healthcare services across multiple specializations to
            meet all your medical needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/doctors?specialization=${encodeURIComponent(service.name)}`}
                  className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Find Doctors <FiArrowRight className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Need Medical Assistance?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our team of experts is ready to help you. Book an appointment today
            and get the care you deserve.
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
