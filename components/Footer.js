import React from "react";
import Image from "next/image";
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
import Link from "next/link";

const Footer = () => {
  const quickLinks = [
    { name: "Home", url: "/" },
    { name: "About", url: "/About" },
    { name: "Staff Panel", url: "https://manager.jamiamadeenathunnoor.org/" },
    { name: "Contact us", url: "/Contact" },
    { name: "Programmes", url: "/Programmes" },
    { name: "On-Campuses", url: "/campuses/OnCampuses" },
    { name: "Junior Schools", url: "/campuses/JuniorSchools" },
    { name: "Open Schools", url: "/campuses/OpenSchools" },
    { name: "Interstate Campuses", url: "/campuses/Interstate" },
    { name: "Alumni", url: "/Alumni" },
    { name: "Updates", url: "/Newses" },

    { name: "Admin", url: "/admin/Login" },
  ];

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
    { icon: <FaLinkedin className="text-xl" />, url: "#", name: "LinkedIn" },
  ];

  const importantLinks = [
    { name: "Privacy Policy", url: "#" },
    // { name: "Terms of Service", url: "/terms" },
    { name: "Accessibility", url: "#" },
    { name: "Site Map", url: "#" },
  ];

  return (
    <footer className="bg-primary text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* University Info */}
          <div>
            <div className="flex-col items-center mb-4">
              <div className="bg-white p-2 w-fit ml-8 rounded">
                <div className="relative h-12 w-12  ">
                  <Image
                    src="/images/LOGO-3.png"
                    alt="Jamia Madeenathunnoor Logo"
                    layout="fill"
                    className="object-contain"
                  />
                </div>
              </div>
              {/* <h3 className="text-xl pl-8 pt-5  font-bold">JAMIA MADEENATHUNNOOR</h3> */}
            </div>
            <p className="text-justify pl-8">
              Jamia Madeenathunnoor exemplifies academic and spiritual excellence, uniting traditional Islamic learning with diverse modern disciplines. Its multicultural atmosphere encourages rich dialogue, while the serene campus supports holistic growth. With strong moral values and dedicated faculty, the Jamia nurtures compassionate, capable leaders ready to serve society.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4  pb-2">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) =>
                link.name !== "Staff Panel" ? (
                  <span
                    key={link.name}
                    className="text-white hover:text-white/80"
                  >
                    {" "}
                    <Link href={link.url} className="  transition-colors">
                      {link.name}
                    </Link>{" "}
                  </span>
                ) : (
                  <a
                    key={index}
                    href={link.url}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                )
              )}
            </div>
          </div>
          <div>
            <h1 className="font-bold mb-4 pb-2 text-lg">Get In Touch</h1>
            <address className="not-italic space-y-3">
              <p className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                Poonoor, Unnikulam(PO), Kozhikode, Kerala
                <br />
                India - PIN: 673 574
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-3 flex-shrink-0" />
                <a href="tel:04952963484" className="hover:text-blue-300">
                  0495 2963484
                </a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-3 flex-shrink-0" />
                <a
                  href="mailto:info@jamiamadeenathunoor.org"
                  className="hover:text-blue-300"
                >
                  info@jamiamadeenathunoor.org
                </a>
              </p>
              <p className="flex items-center">
                <FaClock className="mr-3 flex-shrink-0" />
                Mon-Sat: 9:00 AM - 5:00 PM
              </p>
            </address>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4  pb-2">
              Connect With Us
            </h3>
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-500 pt-6 flex justify-center">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="mb-4 md:mb-0  text-center justify-center flex items-center">
              <p className="text-gray-400 text-center">
                © 2025 Jamia Madeenathunnoor. All Rights Reserved.
              </p>

            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
