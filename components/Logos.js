import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const GraduateLogosSection = () => {

  const logoRows1 = [
    // Row 1
    [
      "/logos/22.png",
      "/logos/25.png",
      "/logos/34.png",
      "/logos/2.png",
      "/logos/3.png",
      "/logos/23.svg",
    ],
    // Row 2

    [
      "/logos/1.png",
      "/logos/4.png",
      "/logos/5.png",
      "/logos/6.png",
      "/logos/7.png",
      "/logos/8.png",
    ],
     
  ];
  const logoRows2 = [
    [
      "/logos/11.png",
      "/logos/12.png",
      "/logos/13.png",
      "/logos/14.png",
      "/logos/15.png",
      "/logos/9.png",
      "/logos/10.png",
      "/logos/27.png",
      "/logos/28.png",
    ],
    [
      "/logos/16.png",
      "/logos/17.png",
      "/logos/18.png",
      "/logos/19.png",
      "/logos/20.png",
      "/logos/21.png",
      "/logos/31.png",
      "/logos/32.svg",
    ],
  ];
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };
  return (
    <section
      className="py-16 bg-white"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          See Our Graduates In
        </h2>

        {/* Logo Grid - 4 rows */}
        <div className="space-y-12 ">
          {logoRows1.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            >
              {row.map((university) => (
                <div
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  key={university}
                  className="flex flex-col items-center group"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-50 rounded-full flex items-center justify-center p-4 border-2 border-gray-100 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md">
                    <div className="text-gray-400 text-xs text-center">
                      <Image
                        src={university}
                        alt="University Logo"
                        width={80}
                        height={80}
                        className="object-contain h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-12 lg:w-10/12 m-auto mt-12">
          {logoRows2.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              ><Carousel
                swipeable={true}
                draggable={true}
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                transitionDuration={2000}
                customTransition={"ease 2000ms"}
                removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
              >
                {row.map((university) => (
                  <div
                  
                    key={university}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-24 h-24 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center p-4 border-2 border-gray-100 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md">
                      <div className="text-gray-400 text-xs text-center">
                        <Image
                          src={university}
                          alt="University Logo"
                          width={70}
                          height={70}
                          className="object-contain h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GraduateLogosSection;
