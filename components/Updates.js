// import Image from "next/image";
// import React from "react";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// const AchievementsSection = ({ poster }) => {
//   const responsive = {
//     desktop: {
//       breakpoint: { max: 3000, min: 1024 },
//       items: 4,
//     },
//     tablet: {
//       breakpoint: { max: 1024, min: 464 },
//       items: 2,
//     },
//     mobile: {
//       breakpoint: { max: 464, min: 0 },
//       items: 2,
//     },
//   };

//   return (
//     <section
//       className="py-16 md:py-24 bg-gray-50"
//       id="about"
//       data-aos="fade-up"
//       data-aos-duration="1000"
//     >
//       <div className="container mx-auto  px-4">
//         <Carousel
//           swipeable={true}
//           draggable={true}
//           responsive={responsive}
//           infinite={true}
//           autoPlay={true}
//           autoPlaySpeed={1000}
//           keyBoardControl={true}
//           transitionDuration={2000}
//           // itemClass='mx-2'
//           customTransition={"ease 2000ms"}
//           removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
//         >
//           {poster?.map((poster) => (
//             <div
//               key={poster.image}
//               className="aspect-[3/4] mx-2 bg-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="w-full relative h-full flex items-center justify-center text-gray-400">
//                 <Image
//                   src={poster.image}
//                   alt=""
//                   fill
//                   layout="fill"
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//           ))}
//         </Carousel>
//       </div>
//     </section>
//   );
// };

// export default AchievementsSection;
import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const AchievementsSection = ({ poster }) => {
  // console.log(" AchievementsSection rendered, poster:", poster);

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  if (!poster || poster.length === 0) {
    // console.log("poster is empty or undefined in AchievementsSection");
  }

  return (
    <section
      className="py-16 md:py-24 bg-gray-50"
      id="about"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="container mx-auto px-4">
        <Carousel
          swipeable
          draggable
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={1000}
          keyBoardControl
          transitionDuration={2000}
          customTransition="ease 2000ms"
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
        >
          {poster?.map((item, idx) => (
            <div
              key={item.id || item.imgid || idx}
              className="aspect-[3/4] mx-2 bg-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-full relative h-full flex items-center justify-center text-gray-400">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt="poster"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                ) : (
                  <span>No image</span>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default AchievementsSection;
