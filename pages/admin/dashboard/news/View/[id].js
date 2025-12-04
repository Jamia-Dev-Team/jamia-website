/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cookies from "js-cookie";
import AdminNav from "../../../../../components/AdminNav";
import { ArrowLeft, Calendar, Eye, EyeOff } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return "Invalid Date";
  }
};

export default function ViewNews() {
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  // Check admin authentication
  useEffect(() => {
    const adminUser = cookies.get("admin");
    if (adminUser === "false") {
      router.push("/admin/Login");
    }
  }, [router]);

  // Fetch news data
  useEffect(() => {
    if (id) {
      fetchNewsData();
    }
  }, [id]);

  const fetchNewsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const { data } = await res.json();
      setNewsData(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebarToggle', handleSidebarChange);
    return () => window.removeEventListener('sidebarToggle', handleSidebarChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0' : 'ml-0 md:ml-[280px] lg:ml-[280px]'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/admin/dashboard/news">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to News List</span>
              </button>
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading news article...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">Error: {error}</p>
              <button 
                onClick={fetchNewsData}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* News Content */}
          {!loading && !error && newsData && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Status Banner */}
              <div className={`px-6 py-4 ${
                newsData.isPublished ? 'bg-green-50 border-b border-green-200' : 'bg-yellow-50 border-b border-yellow-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {newsData.isPublished ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className={`font-semibold ${
                      newsData.isPublished ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {newsData.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <Link href={`/admin/dashboard/news/Edit/${id}`}>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Edit Article
                    </button>
                  </Link>
                </div>
              </div>

              {/* Featured Image */}
              {newsData.image && (
                <div className="w-full h-96 relative">
                  <img
                    src={newsData.image}
                    alt={newsData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {newsData.title}
                </h1>

                {/* Meta Information */}
                <div className="grid md:grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Created At</p>
                      <p className="text-sm text-gray-600">{formatDate(newsData.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                    <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Published At</p>
                      <p className="text-sm text-gray-600">
                        {newsData.isPublished ? formatDate(newsData.publishedAt) : 'Not Published'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: newsData.content }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-3 justify-end">
                  <Link href="/admin/dashboard/news">
                    <button className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                      Back to List
                    </button>
                  </Link>
                  <Link href={`/admin/dashboard/news/Edit/${id}`}>
                    <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                      Edit Article
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}