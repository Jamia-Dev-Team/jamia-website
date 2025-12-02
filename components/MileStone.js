import React, { useState } from "react";

import VisibilitySensor from "react-visibility-sensor-v2";
import CountUp from "react-countup";
const MilestoneSection = () => {
  const [didViewCountUp, setState] = useState(false);

  const onVisibilityChange = (isVisible) => {
    if (isVisible) {
      setState({ didViewCountUp: true });
    }
  };
  // Primary milestones (highlighted)
  const primaryMilestones = [
    { number: 40, label: "Nations", id: 1 },
    { number: 40, label: "Campuses", id: 2 },
    { number: 24, label: "States", id: 3 },
  ];

  // Secondary milestones grouped by category
  const academicMilestones = [
    { number: 1, label: "Civil Service", id: 23 },
    { number: 2, label: "Full Bright Scholarships", id: 31 },
    { number: 3, label: "Post Doctoral Fellowships", id: 5 },
    { number: 31, label: "PhD Researchers", id: 3 },
    { number: 3, label: "Doctors", id: 14 },
    { number: 3, label: "Chartered Accountant", id: 56 },
    { number: 78, label: "Mudarris", id: 4 },
    { number: 40, label: "Advocates", id: 2 },
    { number: 323, label: "Post Graduates", id: 12 },
    { number: 98, label: "Professionals", id: 1 },
    { number: 200, label: "Social Workers", id: 31 },
    { number: 2500, label: "Students", id: 18 },
  ];

  return (
    <section
      className=" py-16 md:py-20 bg-gradient-to-br bg-gray-100 mt-8 md:mt-20"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center  text-secondary mb-8 md:mb-12">
          JOURNEY<span className="text-primary"> OF 25 YEARS</span>
        </h2>

        {/* Primary Milestones - Highlighted */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {primaryMilestones.map((item) => (
            <VisibilitySensor
              key={item.id}
              scrollCheck={true}
              onChange={onVisibilityChange}
              delayedCall
            >
              <div
                data-aos="fade-up"
                data-aos-duration="500"
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="text-3xl font-bold text-primary mb-1">
                  <CountUp
                    start={0}
                    end={didViewCountUp ? item.number : 0}
                    duration={3}
                  />
                  {/* {item.number} */}+
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  {item.label}
                </div>
                <div className="mt-2 h-1 w-20 bg-secondary rounded-full"></div>
              </div>
            </VisibilitySensor>
          ))}
        </div>

        <div className="space-y-12">
          <div>
            {/* <h3 className="text-2xl font-semibold text-primary mb-6 pl-2 border-l-4 border-secondary">Academic Excellence</h3> */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {academicMilestones.map((item) => (
                <VisibilitySensor
                  key={item.id}
                  scrollCheck={true}
                  onChange={onVisibilityChange}
                  delayedCall
                >
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    key={item.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="text-3xl font-bold text-primary mb-2">
                      <CountUp
                        start={0}
                        end={didViewCountUp ? item.number : 0}
                        duration={3}
                      />
                      +
                    </div>
                    <div className="text-lg text-secondary">{item.label}</div>
                  </div>
                </VisibilitySensor>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestoneSection;
