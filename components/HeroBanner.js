import React from "react";

import Image from "next/image";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Link from "next/link";
const HeroBanner = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 4000,
    cssEase: "linear",
    draggable: false,
    fade: true,
    pauseOnHover: false,
  };

  const slides = [
    {
      id: 1,
      image: "/photos/2.jpg",
      heading: `Jamia 
       Madeenthunnoor`,
      subheading: "Pioneering a Promising Future",
    },

    {
      id: 2,
      image: "/photos/3.jpg",
      heading: "40+ Nations",
      subheading: "A Global Tapestry of Learning ",
    },
    {
      id: 3,
      image: "/photos/4.jpg",
      heading: "24+ States",
      subheading: "Expanding Horizons of Education Across Nation",
    },
    {
      id: 4,
      image: "/photos/5.jpg",
      heading: "61+ Campuses",
      subheading: "One Curriculum, 61+ Gateways to Knowledge",
    },
  ];

  return (
    <section className="relative h-scree w-full bg-red overflow-hidden">
      <Slider {...settings} className="h-full w-full">
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[70vh]  md:h-screen w-full">
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt=""
                layout="fill"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            <div className="relative h-full flex items-center justify-center text-center font-montserrat">
              <div
                className="px-4 text-white max-w-4xl mx-auto"
                data-aos="flip-up"
              >
                <h1 className="text-3xl md:text-6xl font-bold mb-4 ">
                  {/* Jamia <br /> Madeenthunnoor */}
                  {slide.heading.split(" ").map((word, index) => (
                    <span key={index} className="block">
                      {word}
                    </span>
                  ))}
                </h1>
                <p className="text-xl md:text-3xl mb-8 font-bol font-montserra">
                  {slide.subheading}
                </p>
                <div className="flex justify-center gap-4">
                  <Link passHref href={"/About"}>
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md flex items-center transition-colors">
                      Know More <FaArrowRight className="ml-2" />
                    </button>
                  </Link>  
                  {/* </a> */}
                  <Link passHref href={"/Programmes"}>
                    <button className="bg-white hover:bg-white/80 text-primary px-6 py-3 rounded-md flex items-center transition-colors">
                      Programmes <FaBookOpen className="ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroBanner;
