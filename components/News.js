import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import formatDate from "../functions/formatDate";
import { FaArrowRight } from "react-icons/fa";

const NewsSection = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/limit`
      );
      const { data } = await res.json();
      console.log('NewsSection data:', data); // Debug log
      setData(data || []);
    } catch (error) {
      console.log('Error fetching news:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section
      className="py-16 bg-gray-50"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4 md:mb-0">
            What&apos;s New
          </h2>
          <div className="hidden md:grid">
            <Link passHref href={`/Newses`}>
              <button className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300">
                View More News
              </button>
            </Link>
          </div>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((news) => {
            // Ensure slug exists, otherwise create a fallback or skip rendering
            if (!news.slug) {
              console.warn('News item missing slug:', news);
              return null;
            }

            return (
              <div
                key={news._id || news.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* News Image */}
                <div className="relative h-56 w-full">
                  {news.image && (
                    <Image
                      src={news.image}
                      alt={news.title || 'News image'}
                      layout="fill"
                      className="object-cover object-top"
                    />
                  )}
                  {/* Category Badge */}
                  {news.category && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {news.category}
                    </div>
                  )}
                </div>

                {/* News Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {news.title}
                  </h3>
                  {news.excerpt && (
                    <p className="text-gray-600 mb-5">{news.excerpt}</p>
                  )}
                  <Link href={`/news/${news.slug}`}>
                    <button className="text-primary font-medium flex items-center hover:text-secondary transition-colors">
                      Read More <FaArrowRight className="ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="md:hidden flex">
          <Link passHref href={`/Newses`}>
            <button className="px-6 m-auto mt-10 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-300">
              View More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;