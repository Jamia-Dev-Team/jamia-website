// pages/news/[slug].js
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import {
  FaCalendarAlt,
  FaShareAlt,
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiWhatsappFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import formatDate from "../../functions/formatDate";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewsDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [news, setNews] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [posters, setPosters] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // Safely compute published date
  const publishedAt =
    news && (news.publishedat || news.createdat)
      ? formatDate(new Date(news.publishedat || news.createdat))
      : "";

  const getNews = async (slugParam) => {
    try {
      if (!slugParam) return;
      setLoading(true);

      const res = await fetch(`/api/news/view/${encodeURIComponent(slugParam)}`);
      const json = await res.json();

      if (!res.ok || !json.success || !json.data) {
        console.error("NEWS DETAIL ERROR:", json);
        setNotFound(true);
        setNews(null);
        return;
      }

      setNews(json.data);
      setNotFound(false);
    } catch (error) {
      console.error("GET NEWS ERROR:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getNewsItems = async () => {
    try {
      const res = await fetch(`/api/news`);
      const { data } = await res.json();
      setNewsItems(data.filter((item) => item.ispublished === true));
    } catch (error) {
      console.log(error);
    }
  };

  const getPoster = async () => {
    try {
      const res = await fetch(`/api/poster`);
      const { data } = await res.json();
      setPosters(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNewsItems();
    getPoster();
  }, []);

  useEffect(() => {
    if (!router.isReady || !slug) return;
    getNews(slug);
  }, [router.isReady, slug]);

  // Share functionality
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = news?.title || "";
  const shareImage = news?.image || "";
  const shareBody = news?.content ? news.content.substring(0, 200).replace(/<[^>]*>/g, '') : "";

  const shareToFacebook = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToTwitter = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=yourTwitterHandle`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToLinkedIn = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToPinterest = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedImage = encodeURIComponent(shareImage);
    const encodedDescription = encodeURIComponent(shareBody);
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedDescription}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareViaEmail = () => {
    const encodedSubject = encodeURIComponent(shareTitle);
    const encodedBody = encodeURIComponent(`${shareBody}\n\nRead more: ${shareUrl}`);
    window.location.href = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  };

  const shareToWhatsApp = () => {
    // Decode the URL to show readable Malayalam characters
    const decodedUrl = decodeURIComponent(shareUrl);
    const text = `${shareTitle}\n${decodedUrl}`;
    const encodedText = encodeURIComponent(text);
    window.open(
      `https://api.whatsapp.com/send?text=${encodedText}`,
      "_blank"
    );
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: posters.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: posters.length > 1,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        {/* Breadcrumb Section */}
        {/* <div className="bg-white border-b border-gray-200 py-4 mb-8">
          <div className="container mx-auto px-4">
            <Link href="/Newses">
              <button className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 font-medium group">
                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to News</span>
              </button>
            </Link>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : notFound ? (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                News Not Found
              </h2>
              <p className="text-gray-600 mb-8">
                The news article you're looking for could not be found.
              </p>
              <Link href="/news">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Browse All News
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Main Article */}
              <div className="lg:col-span-2">
                <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Featured Image */}
                  {news?.image && (
                    <div className="relative w-full h-96">
                      <Image
                        src={news.image}
                        alt={news.title}
                        layout="fill"
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                  )}

                  <div className="p-8">
                    {/* Article Header */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {news?.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 mb-8 text-gray-600 text-sm">
                      <span>1 min read</span>
                      <span>|</span>
                      <span>{publishedAt}</span>
                    </div>

                    {/* Article Content */}
                    <div
                      className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: news?.content }}
                    />

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Share This News
                      </h3>
                      <div className="social-share flex gap-2">
                        <button
                          className="p-3 text-lg border border-gray-300 rounded-2xl hover:text-blue-500 hover:border-blue-500 font-medium hover:bg-gray-50 transition-all duration-300"
                          onClick={shareToFacebook}
                          aria-label="Share on Facebook"
                        >
                          <FaFacebookF />
                        </button>


                        <button
                          className="p-3 text-lg border border-gray-300 rounded-2xl hover:text-blue-700 hover:border-blue-700 font-medium hover:bg-gray-50 transition-all duration-300"
                          onClick={shareToLinkedIn}
                          aria-label="Share on LinkedIn"
                        >
                          <FaLinkedinIn />
                        </button>

                       

                        <button
                          className="p-3 text-lg border border-gray-300 rounded-2xl hover:text-green-500 hover:border-green-500 font-medium hover:bg-gray-50 transition-all duration-300"
                          onClick={shareToWhatsApp}
                          aria-label="Share on WhatsApp"
                        >
                          <RiWhatsappFill />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Right: Sidebar */}
              <div className="space-y-8">
                {/* Achievements Section */}
                {posters.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                      Our Achievements
                    </h3>
                    <Slider {...sliderSettings}>
                      {posters.map((poster) => (
                        <div key={poster.id} className="px-2">
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <Image
                              src={poster.image}
                              alt={poster.title || "Achievement"}
                              layout="fill"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}

                {/* More News Section */}
                {newsItems.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
                      More News
                    </h3>
                    <div className="space-y-4">
                      {newsItems
                        .filter((item) => item.id !== news?.id && item.slug)
                        .slice(0, 5)
                        .map((item) => (
                          <Link
                            href={`/news/${item.slug}`}
                            key={item.id}
                            className="block group"
                          >
                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              {item.image && (
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    layout="fill"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {item.publishedat
                                    ? formatDate(new Date(item.publishedat))
                                    : item.createdat
                                    ? formatDate(new Date(item.createdat))
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                    <Link href="/Newses">
                      <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-green-800 transition-colors font-medium">
                        View All News
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;