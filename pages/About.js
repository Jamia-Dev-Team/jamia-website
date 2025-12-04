

import React from "react";
import Image from "next/image";
import {
  FaGlobe,
  FaUniversity,
  FaUsers,
  FaBook,
  FaGraduationCap,
  FaChartLine,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => {
  // Stats data
  const stats = [
    {
      icon: <FaGlobe className="text-3xl" />,
      value: "40+",
      label: "Nations Represented",
    },
    {
      icon: <FaUniversity className="text-3xl" />,
      value: "61+",
      label: "Campuses",
    },
    {
      icon: <FaUsers className="text-3xl" />,
      value: "2554+",
      label: "Students",
    },
    {
      icon: <FaBook className="text-3xl" />,
      value: "24+",
      label: "States Covered",
    },
  ];

  // Core values
  const values = [
    {
      title: "Academic Excellence",
      description:
        "Rigorous curriculum combining traditional and modern disciplines",
    },
    {
      title: "Moral Foundation",
      description: "Education rooted in Islamic values and ethical principles",
    },
    {
      title: "Holistic Development",
      description: "Nurturing intellectual, spiritual, and physical growth",
    },
    {
      title: "Global Perspective",
      description: "Multicultural environment fostering global citizenship",
    },
  ];

  return (
    <div className="bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div
        className="relative h-96
        bg-blue-800"
      >
        <Image
          src="/images/3.jpg"
          alt="Jamia Madeenathunnoor Campus"
          layout="fill"
          className="object-cover opacity-90"
        />
        <div  className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About JMN
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Blending tradition with innovation in education
            </p>
          </div>
        </div>
      </div>

      {/* About Text Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Jamia Madeenathunnoor
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Jamia Madeenathunnoor epitomizes excellence, blending traditional
            Islamic studies with diverse academic disciplines. Its multicultural
            environment fosters vibrant discourse, while its serene campus
            promotes holistic growth. Emphasizing moral values and well-being,
            the Jamia cultivates leaders who embody intellect, integrity, and
            compassion. With dedicated faculties, Jamia Madeenathunnoor stands
            as a beacon of enlightenment, shaping future generations poised to
            make meaningful contributions to society.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-primary mb-4 flex justify-center">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <FaGraduationCap className="text-primary text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Jamia Madeenathunnoor envisions itself as a center of advanced
              Islamic education, dedicated to cultivating scholars and leaders
              grounded in ethical principles and a commitment to the betterment
              of society. Beyond knowledge, it seeks to inspire reflection,
              purpose, and action, preparing individuals to become beacons of
              positive change in an evolving world.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <div className="bg-secondary/10 p-3 rounded-full mr-4">
                <FaChartLine className="text-secondary text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The mission of Madeenathunnoor is to provide quality education
              that is rooted in Islamic values while ensuring an atmosphere of
              intellectual curiosity and ethical responsibility. The institution
              aims to empower students through comprehensive academic programs,
              community engagement initiatives, and leadership development
              opportunities. By promoting accessibility and inclusivity,
              Madeenathunnoor is dedicated to shaping the future of its students
              and their communities, ensuring that they are well-prepared to
              face the challenges of the modern world.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-primary"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

      
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Leadership
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Leadership cards would go here */}
            <div className="text-center">
              <div className="bg-gray-200 h-64 w-56 rounded-full mx-auto mb-4 relative">
                <Image
                  src="/photos/sheikhuna.jpg"
                  alt="Chairman's Portrait"
                  layout="fill"
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold">Sheikh Abubakr Ahmad</h3>
              <p className="text-secondary">Chairman</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-64 w-56 rounded-full mx-auto mb-4 relative">
                <Image
                  src="/images/senate/hakkim-usthad.jpg"
                  alt="Chairman's Portrait"
                  layout="fill"
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold">
                Dr Muhammad Abdul Hakkim Azhari
              </h3>
              <p className="text-secondary">Rector</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-64 w-56 rounded-full mx-auto mb-4 relative">
                <Image
                  src="/images/senate/asaf-nurani.jpg"
                  alt="Chairman's Portrait"
                  layout="fill"
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold">Asaf Nurani</h3>
              <p className="text-secondary">Pro-Rector</p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default AboutPage;
