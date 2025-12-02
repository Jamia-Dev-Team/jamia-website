import React from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Senate = () => {
  const data = [
    {
      name: "Sheikh Abubakr Ahmad",
      image: "/images/senate/ap-usthad.jpg",
      designation: "Chairman",
    },
    {
      name: "Dr Muhammad Abdul Hakkim Azhari",
      image: "/images/senate/hakkim-usthad.jpg",
      designation: "Rector",
    },
    {
      name: "Asaf Nurani",
      image: "/images/senate/asaf-nurani.jpg",
      designation: "Pro-Rector",
    },
    {
      name: "Abu Swalih Saqafi",
      image: "/images/senate/boosalih-saqafi.jpg",
      designation: "Chief Finance Officer",
    },
    {
      name: "Jalal Nurani",
      image: "/images/senate/jalal-nurani.jpg",
      designation: "Chief Admin Officer",
    },
    {
      name: "jafar Nurani",
      image: "/images/senate/jafar-nurani.jpg",
      designation: "Chairman, Prism Foundation",
    },
    {
      name: "Zuhairudheen Nurani",
      image: "/images/senate/zuhair-nurani.jpg",
      designation: "Convenor, Prism Foundation",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Header */}
      <div className="bg-primary text-white   pt-28 pb-16 lg:py-28 lg:pt-36">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold md:font-bold mb-4">
            JMN SENATE
          </h1>
          <p className="  max-w-2xl mx-auto">
            {/* Distinguished members guiding our institution&apos;s vision and governance */}
          </p>
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
                  layout="fill"
                  className="object-cover rounded-full"
                />
              </div>

              {/* Member Details */}
              <div className="p-6 text-center">
                <h3 className="text-l font-semibold text-primary mb-1">
                  {member.name}
                </h3>
                <p className="text-secondary  ">{member.designation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Senate;
