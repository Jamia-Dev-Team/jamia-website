 import React from 'react';
import Image from 'next/image';
import { FaSchool, FaGraduationCap, FaUserGraduate, FaBook, FaArrowRight } from 'react-icons/fa';
import Navbar from '../../components/Navbar';

const ProgrammesPage = () => {
  const programmes = [
    {
      id: 1,
      title: "JUNIOR SCHOOL",
      icon: <FaSchool className="text-3xl text-blue-600" />,
      description: "Students complete Higher School course under SCERT, Government of Kerala alongside foundation courses in Islamic studies. Admission based on entrance examination marks and course preference.",
      link: "/Programmes/Hs"
    },
    {
      id: 2,
      title: "SENIOR SCHOOL",
      icon: <FaGraduationCap className="text-3xl text-green-600" />,
      description: "Higher Secondary program offering Science, Commerce, and Humanities streams with Islamic studies foundation. Admission through entrance examination and course preference.",
      link: "/Programmes/Hss"
    },
    {
      id: 3,
      title: "GRADUATE SCHOOL",
      icon: <FaUserGraduate className="text-3xl text-purple-600" />,
      description: "Bachelor programs in Science, Commerce, History, Sociology, Psychology, English literature, and Arabic literature. Admission based on selection process scores.",
      link: "/Programmes/Bs"
    },
     {
      id: 4,
      title: "FINISHING SCHOOL",
      icon: <FaGraduationCap className="text-3xl text-blue-600" />,
      description: "A one-year PG Diploma in Islamic Theology offering advanced training in leadership, research, and community engagement, with coursework, internships, field immersion, and merit-based admission.",
      link: "/Programmes/finishing"
    },
    {
      id: 4,
      title: "RABBANI FINISHING SCHOOL",
      icon: <FaUserGraduate className="text-3xl text-green-600" />,
      description: "The Rabbani Finishing School offers a one-year PG Diploma in leadership and Islamic scholarship with training and internships preparing graduates for community roles.",
      link: "/Programmes/rabbani"
    }
  ];

  return (
    <div className="bg-gray-50">
 <Navbar/>
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-blue-900 pt-80 pb-10 lg:py-40  ">
        <Image
          src="/photos/8.jpg"
          alt="Students studying"
         layout='fill'
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Academic Programmes</h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Pathways to excellence in Education and Islamic scholarship
            </p>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">JMN ACADEMIC PROGRAMMES</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Jamia Madeenathunnoor offers different academic programs which are designed to develop students into professionally competent and socially committed Islamic graduates, fully equipped to take on the challenges of the contemporary scenario. The programs explore the critical areas of contemporary academic and professional themes, in conjunction with comprehensive knowledge and understanding of the Islamic tradition and knowledge.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            The broad objectives of these programs are to familiarize students with the social, political, economic, moral and ecological environments of society; to enable students to become effective leaders and scholars to contribute to community welfare; to develop a global perspective among students to respond to global challenges; and to impart values of intellectual honesty, justice, social compassion and fairness.
          </p>
        </div>

        {/* Programmes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {programmes.map((programme) => (
            <div key={programme.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {programme.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{programme.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{programme.description}</p>
                <a 
                  href={programme.link}
                  className="text-secondary font-medium flex items-center hover:text-primary"
                >
                  Learn more <FaArrowRight className="ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Programme Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <FaBook className="text-blue-600 text-xl mt-1 mr-4" />
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Integrated Curriculum</h4>
                <p className="text-gray-600">Combining modern education with Islamic studies</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaUserGraduate className="text-green-600 text-xl mt-1 mr-4" />
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Experienced Faculty</h4>
                <p className="text-gray-600">Renowned scholars and academicians</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaGraduationCap className="text-purple-600 text-xl mt-1 mr-4" />
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Career Pathways</h4>
                <p className="text-gray-600">Preparation for professional and religious leadership</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="bg-primary/5 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Begin Your Journey?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our admission process and join our community of scholars and leaders
          </p>
          <button className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-medium">
            Apply Now
          </button>
        </div> */}
      </section>
    </div>
  );
};

export default ProgrammesPage;
