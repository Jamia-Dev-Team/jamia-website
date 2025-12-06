import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaCalendarAlt, FaArrowRight, FaNewspaper, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import formatDate from '../functions/formatDate'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 9;

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news`);
      const { data } = await res.json();

      const publishedNews = data
        .filter(item => item.ispublished === true)
        .sort((a, b) => new Date(b.publishedat) - new Date(a.publishedat));

      setNewsItems(publishedNews);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const categories = ["All", "Achievements", "Events", "Education","Admission", "Scholarship"];

  const filteredNews = selectedCategory === "All" 
    ? newsItems 
    : newsItems.filter(news => news.category === selectedCategory);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 pt-52 pb-24">
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className='mt-10'>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4 mt-4 md:mt-0">Updates</h1>
            <p className="text-xl text-white">Stay updated with the latest happenings at Jamia Madeenathunnoor</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 text-center justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                category === selectedCategory 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-200 transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-56 w-full bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-5"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* News Grid */}
            {currentNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentNews.map((news) => (
                  <div key={news.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* News Image */}
                    <div className="relative h-56 w-full">
                      {news.image && (
                        <Image
                          src={news?.image}
                          alt={news.title}
                          layout='fill'
                          className="object-cover object-top"
                        />
                      )}
                      {/* Category Badge */}
                      {news.category && (
                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {news.category}
                        </div>
                      )}
                    </div>
                    
                    {/* News Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{news.title}</h3>
                      <p className="text-gray-600 mb-5">{news.excerpt}</p>
                      <Link href={`/news/${news.slug}`}>
                        <button className="text-primary font-medium flex items-center hover:text-secondary">
                          Read More <FaArrowRight className="ml-2" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No news found in this category.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <FaChevronLeft />
                </button>

                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default NewsPage;