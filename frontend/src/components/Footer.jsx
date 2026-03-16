import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiClock } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HCH</span>
              </div>
              <span className="text-xl font-bold">
                Hemayetpur Central Hospital
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              A modern multispecialty healthcare facility dedicated to providing
              safe, affordable, and quality medical services to the people of
              Hemayetpur.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/scmihch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  to="/doctors"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/portal/book-appointment"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Cardiology</li>
              <li className="text-gray-400">Orthopedics</li>
              <li className="text-gray-400">Neurology</li>
              <li className="text-gray-400">Medicine</li>
              <li className="text-gray-400">Pulmonology</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <FiMapPin className="flex-shrink-0 mt-1" />
                <span>
                  Pranto Plaza, Hemayetpur Bus Stand, Hemayetpur, Savar, Dhaka
                  1240, Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiPhone className="flex-shrink-0" />
                <a
                  href="tel:+8801839952901"
                  className="hover:text-white transition-colors"
                >
                  +8801839-952901
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiMail className="flex-shrink-0" />
                <a
                  href="mailto:hemayetpurch@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  hemayetpurch@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <FiClock className="flex-shrink-0" />
                <span>9 AM to 9 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Hemayetpur Central Hospital. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
