import React from 'react';
import Image from 'next/image';
import {   FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaArrowRight, FaBook } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { hssProgrammes } from '../../assets/data/programmes';

const HSSProgrammePage = () => {
 
  const features = [
    {
      title: "Dual Certification",
      description: "SCERT syllabus with Islamic studies certification",
      icon: <FaBook  className="text-2xl text-blue-600" />
    },
    {
      title: "Stream Options",
      description: "Science, Commerce, and Humanities streams available",
      icon: <FaChalkboardTeacher className="text-2xl text-green-600" />
    },
    {
      title: "Hifz Integration",
      description: "Optional Qur'an memorization program",
      icon: <FaUserGraduate className="text-2xl text-purple-600" />
    }
  ];

  return (
    <div className="bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 bg-blue-900  pt-80 pb-10 lg:py-40">
      <Image
          src="/photos/18.jpg"
          alt="HSS Programme Students"
     layout='fill'
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">SENIOR SCHOOL</h1>
            <p className="text-xl text-white">Higher Secondary Education with Islamic Foundation</p>
          </div>
        </div>
      </div>

      {/* Programme Overview */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">SENIOR SCHOOL</h2>
          <div className="prose prose-lg text-gray-600 mb-12">
            <p>
              The students will parallelly complete Higher secondary course under the SCERT, Government of Kerala 
              and with the foundation course in Islamic studies. For higher secondary program, Jamia Madeenathunnoor 
              offers three streams viz Science, Commerce and Humanities. Students will be admitted based on their marks 
              obtained in entrance examination for selection process and their preference of courses. The final decision 
              on the course preference will be vested in the Jamia Madeenathunnoor authority.
            </p>
          </div>

          {/* Programme Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary/60">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Programme Streams */}
          <div className="space-y-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Available Streams</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hssProgrammes.map((programme) => (
                <div key={programme.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="mr-4 mt-1">
                        {programme.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{programme.course}</h3>
                    </div>
                    
                    {/* <div className="flex items-center text-gray-600 mb-4">
                      <FaCalendarAlt className="mr-2 text-secondary" />
                      <span className="font-medium">Intake: {programme.intake} students per year</span>
                    </div> */}
                    
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Learning Outcomes:</h4>
                    <ul className="space-y-2 text-gray-600">
                      {programme.outcomes.map((outcome, index) => (
                        <li key={index} className="flex">
                          <span className="text-gray-500 mr-2">▪</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Programme Structure */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Programme Structure</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Core Subjects</td>
                    <td className="px-6 py-4 text-gray-600">As per SCERT Kerala HSS curriculum</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Islamic Studies</td>
                    <td className="px-6 py-4 text-gray-600">Daily classes in Quran, Hadith, Fiqh and Islamic History</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Hifz Programme</td>
                    <td className="px-6 py-4 text-gray-600">Optional Quran memorization track with certified Huffaz</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Admission Info */}
          <div className="bg-primary/5 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Admission Information</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Requirements:</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Successful completion of 10th standard or equivalent</li>
                  {/* <li>Minimum 60% marks in SSLC/THSLC</li> */}
                  <li>Entrance examination clearance</li>
                  <li>Interview with academic committee</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Academic Calendar:</h4>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex justify-between border-b pb-2">
                    <span>Application Period:</span>
                    <span className="font-medium">Jan 1 - Mar 31</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Entrance Exam:</span>
                    <span className="font-medium">Mid-April</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Academic Year Begins:</span>
                    <span className="font-medium">Early-git June</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          {/* <div className="text-center mt-16">
            <button className="bg-primary hover:bg-primary/70 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center">
              Download Prospectus <FaArrowRight className="ml-2" />
            </button>
          </div> */}
        </div>
      </section>
   <Footer/>
    </div>
  );
};

export default HSSProgrammePage;