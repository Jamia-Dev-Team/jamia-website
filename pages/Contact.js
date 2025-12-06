import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const socialLinks = [
    {
      icon: <FaFacebook className="text-xl" />,
      url: "https://www.facebook.com/profile.php?id=100085673749100",
      name: "Facebook",
    },
    {
      icon: <FaInstagram className="text-xl" />,
      url: "https://www.instagram.com/jamia_madeenathunnoor/",
      name: "Instagram",
    },
    {
      icon: <FaYoutube className="text-xl" />,
      url: "https://www.youtube.com/c/GlocalMediaMarkazGarden",
      name: "YouTube",
    },
    {
      icon: <FaLinkedin className="text-xl" />,
      url: "https://www.linkedin.com/company/jamia-madeenathunnoor/posts/?feedView=all",
      name: "LinkedIn",
    },
  ];

  const departments = [
    {
      name: "Admissions",
      email: "admissions@jamiamadeenathunoor.org",
      phone: "8086 798 8392",
    },
    {
      name: "Academic Office",
      email: "academia@jamiamadeenathunoor.org",
      phone: "702 589 9571",
    },
    {
      name: "Student Affairs",
      email: "dean_students@jamiamadeenathunnoor.org",
      phone: "0495 2963484",
    },
    {
      name: "Alumni Relations",
      email: "om.prism@gmail.com",
      phone: "+91 9048 338 225",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
     const response = await axios.post("/api/contact", formData);


      if (response.data.success) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 pt-52 pb-24">
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="mt-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-white">Get in touch with JMN</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Information - Left Side */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-3" />
                Our Address
              </h2>
              <address className="not-italic text-gray-700 space-y-4">
                <p className="text-lg font-semibold">JAMIA MADEENATHUNNOOR</p>
                <p>Poonoor, Unnikulam(PO)</p>
                <p>Kozhikode, Kerala</p>
                <p>India - PIN: 673 574</p>
                <p className="flex items-center mt-4">
                  <FaPhone className="text-secondary mr-3" />
                  <a href="tel:04952963484" className="hover:text-blue-600">
                    0495 2963484
                  </a>
                </p>
                <p className="flex items-center">
                  <FaEnvelope className="text-secondary mr-3" />
                  <a
                    href="mailto:info@jamiamadeenathunnoor.org"
                    className="hover:text-blue-600"
                  >
                    info@jamiamadeenathunnoor.org
                  </a>
                </p>
                <p className="flex items-center">
                  <FaClock className="text-secondary mr-3" />
                  Office Hours: 9:00 AM - 5:00 PM (Monday to Saturday)
                </p>
              </address>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Connect With Us
              </h2>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-blue-100 text-primary/80 p-4 rounded-full transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Department Contacts */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Department Contacts
              </h2>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <h3 className="font-bold text-gray-800">{dept.name}</h3>
                    <p className="flex items-center text-gray-600">
                      <FaPhone className="mr-2 text-sm" />
                      <a
                        href={`tel:${dept.phone.replace(/\s/g, "")}`}
                        className="hover:text-blue-600"
                      >
                        {dept.phone}
                      </a>
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FaEnvelope className="mr-2 text-sm" />
                      <a
                        href={`mailto:${dept.email}`}
                        className="hover:text-blue-600"
                      >
                        {dept.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Map and Contact Form */}
          <div className="lg:w-1/2">
            {/* Google Map */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <h2 className="text-xl font-bold text-gray-800 p-6 pb-0">
                Our Location
              </h2>
              <div className="aspect-w-16 aspect-h-9 h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15642.429655451811!2d75.9051301!3d11.4360147!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf60ace6147523af3!2sMarkaz%20Garden!5e0!3m2!1sen!2sin!4v1642778170307!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Jamia Madeenathunnoor Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Send Us a Message
              </h2>

              {submitStatus && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="admission">Admission Inquiry</option>
                    <option value="academic">Academic Question</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback/Suggestion</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;