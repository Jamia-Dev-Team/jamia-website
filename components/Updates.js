import Image from "next/image"; 
import React from "react"; 
import Carousel from "react-multi-carousel"; 
import "react-multi-carousel/lib/styles.css"; 
 
const AchievementsSection = ({ poster }) => { 
 
  const responsive = { 
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 }, 
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 }, 
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 }, 
  }; 
 
  if (!poster || poster.length === 0) {
    return null;
  }

  // Reverse the poster array to show latest images first
  const reversedPoster = [...poster].reverse();
 
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
          autoPlaySpeed={3500}
          keyBoardControl 
          transitionDuration={800}
          customTransition="transform 800ms cubic-bezier(0.4, 0, 0.2, 1)"
          removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
          pauseOnHover
        > 
          {reversedPoster.map((item, idx) => ( 
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