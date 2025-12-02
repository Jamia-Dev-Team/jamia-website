z 

import React from 'react';
import Image from 'next/image';
import { FaUsers, FaGlobe, FaGraduationCap, FaHandsHelping, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const images =[
  '/images/prism-1.jpg',
  '/images/prism-2.jpg',
  '/images/prism-3.jpg',
  '/images/prism-4.jpg',
]
const AlumniPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="relative   bg-gradient-to-r from-primary to-primary/80 pt-80 md:pb-10 lg:py-40 pt-52 pb-24">
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className='mt-10'>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4 mt-4 md:mt-0">PRISM Foundation</h1>
            <p className="text-xl text-white">Alumni Network of Jamia Madeenathunnoor</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Logo and Basic Info */}
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
              <div className="relative  w-48 h-32 md:h-48 mb-6">
                <Image
                  src="/images/prism.png"
                  alt="PRISM Foundation Logo"
              layout='fill'
                  className="object-contain"
                />
              </div>
              <a 
                href="https://prismfoundation.org" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
              >
                Visit Alumni Website <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>

          {/* About Text */}
          <div className="md:w-2/3">
            <div className="prose prose-lg text-gray-700 mb-8">
              <p>
                The PRISM Foundation (Potential Resources Innovation and Social Management) is an initiative of the alumni of 
                Jamia Madeenathunnoor – Nurani Graduates. It has been actively engaging in educational and community services 
                with more than 250+ members and active working chapters at national and international levels for the last ten years, 
                majorly focusing on livelihood and educational activities.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">250+</div>
                <div className="text-gray-600">Members</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <FaGlobe className="text-3xl text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">20+</div>
                <div className="text-gray-600">Chapters</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <FaGraduationCap className="text-3xl text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-gray-600">Scholarships</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <FaHandsHelping className="text-3xl text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">20+</div>
                <div className="text-gray-600">Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alumni Activities */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Career Support</h3>
              <p className="text-gray-600">
                Mentorship programs, job placement assistance, and professional development workshops for graduates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Educational Outreach</h3>
              <p className="text-gray-600">
                Scholarships, school adoption programs, and educational resources for underprivileged communities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Community Development</h3>
              <p className="text-gray-600">
                Sustainable livelihood projects, healthcare initiatives, and social welfare programs.
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Alumni Moments</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((item) => (
              <div key={item} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={item}
                  alt={`Alumni activity ${item}`}
                  layout='fill'
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="text-secondary font-medium hover:underline">
              View More Photos
            </button>
          </div>
        </div>

       
      </div>
      <Footer/>
    </div>
  );
};

export default AlumniPage;
