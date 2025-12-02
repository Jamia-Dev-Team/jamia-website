import React from "react";
import Image from "next/image";
import {
  FaFlask,
  FaBook,
  FaGraduationCap,
  FaCalendarAlt,
  FaArrowRight,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { bsProgrammes } from "../../assets/data/programmes";

const BSProgrammePage = () => {
  const features = [
    {
      title: "Dual Qualification",
      description: "Bachelor's degree with Islamic studies certification",
      icon: <FaBook className="text-2xl text-blue-600" />,
    },
    {
      title: "Specialized Tracks",
      description: "Seven distinct academic disciplines available",
      icon: <FaGraduationCap className="text-2xl text-green-600" />,
    },
    {
      title: "Research Focus",
      description: "Opportunities for undergraduate research projects",
      icon: <FaFlask className="text-2xl text-purple-600" />,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <Navbar />
      <div className="relative h-64 md:h-96 bg-blue-900  pt-80 pb-10 lg:py-40">
        {" "}
        <Image
          src="/photos/22.jpg"
          alt="BS Programme Students"
          layout="fill"
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              GRADUATE SCHOOL
            </h1>
            <p className="text-xl text-white">
              Integrated Bachelor&apos;s Degrees with Islamic Studies
            </p>
          </div>
        </div>
      </div>

      {/* Programme Overview */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-6">
            GRADUATE SCHOOL 
          </h2>
          <div className="prose prose-lg text-gray-600 mb-12">
            <p>
              Jamia Madeenathunnoor offers seven courses in bachelor programs
              viz Science, Commerce, History, Sociology, Psychology, English
              literature and Arabic literature. Students will be admitted based
              on their score obtained in the selection process and their
              preference. The final decision on the preference and admission
              will be vested in the Jamia Madeenathunnoor authority.
            </p>
          </div>

          {/* Programme Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary/50"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Programme Streams */}
          <div className="space-y-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Available BS Programmes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bsProgrammes.map((programme) => (
                <div
                  key={programme.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="mr-4 mt-1">{programme.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {programme.course}
                      </h3>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <FaCalendarAlt className="mr-2 text-blue-600" />
                      <span className="font-medium">
                        Intake: {programme.intake} students per batch
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Programme Outcomes:
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      {programme.outcomes.map((outcome, index) => (
                        <li key={index} className="flex">
                          <span className="text-primary/70 mr-2">▪</span>
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
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Programme Structure
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                       </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Core Degree Courses
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      As per university curriculum in chosen discipline
                    </td>
                    {/* <td className="px-6 py-4 text-gray-600">100</td> */}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Islamic Studies
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Mukhthasar programme in Quran, Hadith, Fiqh and Islamic
                      History
                    </td>
                    {/* <td className="px-6 py-4 text-gray-600">40</td> */}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      Research Project
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      Interdisciplinary research combining degree subject with
                      Islamic perspective
                    </td>
                    {/* <td className="px-6 py-4 text-gray-600">20</td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Admission Info */}
          <div className="bg-primary/5 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Admission Information
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Eligibility:</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>
                    Completion of 12th grade or equivalent with minimum 60%
                    marks
                  </li>
                  <li>
                    Entrance examination in general knowledge and Islamic
                    studies
                  </li>
                  <li>Personal interview with academic committee</li>
                  <li>
                    Submission of recommendation letters (optional but
                    preferred)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">
                  Academic Timeline:
                </h4>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex justify-between border-b pb-2">
                    <span>Application Period:</span>
                    <span className="font-medium">February 1 - April 30</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Entrance Exam:</span>
                    <span className="font-medium">May 15</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Interview Week:</span>
                    <span className="font-medium">June 1-7</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Semester Begins:</span>
                    <span className="font-medium">July 15</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Career Prospects */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Career Pathways
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">
                  Further Studies:
                </h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Master&apos;s programmes in specialized fields</li>
                  <li>Islamic studies at advanced levels</li>
                  <li>Professional certifications (CA, CS, etc.)</li>
                  <li>Research degrees (MPhil, PhD)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">
                  Professional Opportunities:
                </h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Corporate sector in respective disciplines</li>
                  <li>Islamic banking and finance</li>
                  <li>Education and academia</li>
                  <li>Social work and community development</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          {/* <div className="text-center mt-16">
            <button className="bg-primary hover:bg-primary/70 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center mr-4">
              Apply Now <FaArrowRight className="ml-2" />
            </button>
          </div> */}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BSProgrammePage;
