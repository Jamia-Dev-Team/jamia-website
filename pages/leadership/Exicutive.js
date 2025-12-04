 
import React from 'react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ExicutiveCouncil = () => {
  const data = [
    {
      name: "Asaf Nurani",
      image: "/images/senate/asaf-nurani.jpg",
      designation: "Pro-Rector",
    },
    {
      name: "Sayyid Thwaha Nurani",
      image: "/images/academic-council/thaha-nurani.jpeg",
      designation: "Dean of Academic Affairs",
    },
    {
      name: "Irshad Nurani",
      image: "/images/exicutive/irshad-nurani.jpeg",
      designation: "Dean of Faculty and Management Affairs",
    },
    {
      name: "Yunus Ahsani",
      image: "/images/exicutive/yunus-ahsani.jpeg",
      designation: "Chief Librarian",
    },
    {
      name: "Shibili Nurani",
      image: "/images/exicutive/shibili-nurani.jpeg",
      designation: "Dean of Student Affairs",
    },
    {
      name: "Mujthaba Nurani",
      image: "/images/exicutive/mujthaba-nurani.jpeg",
      designation: " Head of Senior School (Science & Technology)",
    },
    {
      name: "Jafer Nurani",
      image: "/images/senate/jafar-nurani.jpg",
      designation: "Head of inter-state campuses",
    },
    {
      name: "Fazil Nurani",
      image: "/images/exicutive/fazil-nurani.jpg",
      designation: " Head of Rabbani Finishing school",
    },
    {
      name: "Uvais Nurani",
      image: "/images/exicutive/uwais-nurani.jpg",
      designation: "Head of Open School (Irsuv-un-nabawi)",
    },
     {
      name: "Ubaid Nurani",
      image: "/images/exicutive/ubaid-nurani.jpg",
      designation: " Head of Junior School",
    },
     {
      name: "Junaid Nurani",
      image: "/images/exicutive/junaid-nurani.jpg",
      designation: "Exam controller & Head of bachelor programme(open school)",
    },
  ];

  return (
   <div className="min-h-screen bg-gray-50">
         <Navbar/>
         {/* Hero Header */}
         <div className="bg-primary text-white   pt-28 pb-16 lg:py-28 lg:pt-36">
           <div className="container mx-auto px-4 text-center">
             <h1 className="text-3xl md:text-4xl font-semibold md:font-bold mb-4">EXICUTIVE COUNCIL</h1>
             
           </div>
         </div>
   
         {/* Main Content */}
         <div className="container mx-auto px-4 py-16 lg:py-24">
           {/* Members Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
             {data.map((member, index) => (
               <div 
                 key={index} 
                 className="bg-white m-auto w-full rounded-xl shadow-m overflow-hidden hover:shadow-lg transition-shadow"
               >
                 {/* Member Photo */}
                 <div className="relative h-36  w-36 m-auto rounded-full mt-3">
                   <Image
                     src={member.image}
                     alt={member.name}
                   layout='fill'
                     className="object-cover rounded-full"
                   />
                 </div>
                 
                 {/* Member Details */}
                 <div className="p-6 text-center">
                   <h3 className="text-l font-semibold text-primary mb-1">{member.name}</h3>
                   <p className="text-secondary  ">{member.designation}</p>
                   
                 
                 </div>
               </div>
             ))}
           </div>
   
           
         </div>
         <Footer/>
       </div>
  );
};

export default ExicutiveCouncil;
