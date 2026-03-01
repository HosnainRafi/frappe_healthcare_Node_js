import {
  FiTarget,
  FiEye,
  FiHeart,
  FiAward,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";

function About() {
  const values = [
    {
      icon: <FiHeart />,
      title: "Compassion",
      description: "We care for every patient like family",
    },
    {
      icon: <FiAward />,
      title: "Excellence",
      description: "Committed to the highest standards",
    },
    {
      icon: <FiUsers />,
      title: "Teamwork",
      description: "Collaborative approach to healthcare",
    },
    {
      icon: <FiCheckCircle />,
      title: "Integrity",
      description: "Honest and transparent care",
    },
  ];

  const milestones = [
    { year: "2010", event: "Hospital Founded" },
    { year: "2015", event: "Expanded to 100+ Beds" },
    { year: "2018", event: "Launched Digital Health Records" },
    { year: "2020", event: "Telemedicine Services Added" },
    { year: "2023", event: "Patient Portal Launched" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Providing exceptional healthcare services with compassion and
            excellence since 2010.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4">
                HealthCare Plus was founded with a simple mission: to make
                quality healthcare accessible to everyone. What started as a
                small clinic has grown into a comprehensive healthcare facility
                serving thousands of patients every year.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of dedicated healthcare professionals brings together
                decades of experience across various medical specialties. We
                believe in treating patients with dignity, respect, and the
                highest level of medical care.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate and expand our services to meet
                the evolving healthcare needs of our community, while staying
                true to our core values of compassion and excellence.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop"
                alt="Hospital Building"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <FiTarget className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To provide comprehensive, patient-centered healthcare services
                that improve the quality of life for individuals and
                communities. We strive to deliver care with compassion, respect,
                and the highest standards of medical excellence.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <FiEye className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To be the leading healthcare provider known for innovation,
                exceptional patient outcomes, and community impact. We envision
                a healthier world where everyone has access to quality medical
                care and preventive health services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-600 text-2xl">
                  {value.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Journey
          </h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center mb-8">
                <div className="w-24 text-right pr-6">
                  <span className="text-xl font-bold text-primary-600">
                    {milestone.year}
                  </span>
                </div>
                <div className="w-4 h-4 bg-primary-600 rounded-full relative">
                  {index < milestones.length - 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-primary-200" />
                  )}
                </div>
                <div className="pl-6">
                  <span className="text-lg text-gray-700">
                    {milestone.event}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
