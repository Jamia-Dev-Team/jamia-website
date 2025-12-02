/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import AdminNav from "../../../../components/AdminNav";
import { CirclePlus } from "lucide-react";

// Improved formatDate function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return "Invalid Date";
  }
};

export default function Component() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loadingStates, setLoadingStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  // Check admin authentication
  useEffect(() => {
    const adminUser = cookies.get("admin");
    if (adminUser === "false") {
      router.push("/admin/Login");
    }
  }, [router]);

  // Fetch data from API
  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const { data: newsData } = await res.json();
      setData(newsData || []);
      setFilteredData(newsData || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Filter data based on selected filter
  useEffect(() => {
    let filtered = [];
    if (filter === "all") {
      filtered = data;
    } else if (filter === "published") {
      filtered = data.filter((item) => item.isPublished === true);
    } else if (filter === "unpublished") {
      filtered = data.filter((item) => 
        item.isPublished === false || 
        item.isPublished === "false" ||
        !item.isPublished
      );
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filter, data]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const publishBlog = async (_id) => {
    setLoadingStates(prev => ({ ...prev, [`publish-${_id}`]: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${_id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: true,
            publishedAt: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await getData();
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish: ' + error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`publish-${_id}`]: false }));
    }
  };

  const unPublishBlog = async (_id) => {
    setLoadingStates(prev => ({ ...prev, [`unpublish-${_id}`]: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${_id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: false,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await getData();
    } catch (error) {
      console.error('Unpublish error:', error);
      alert('Failed to unpublish: ' + error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`unpublish-${_id}`]: false }));
    }
  };

  const handleDelete = async (docId, publicId) => {
    if (!confirm('Are you sure you want to delete this news article?')) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [`delete-${docId}`]: true }));
    try {
      const imageResponse = await fetch("/api/deleteImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (!imageResponse.ok) {
        const data = await imageResponse.json();
        throw new Error(data.error || "Image deletion failed");
      }

      const newsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${docId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!newsResponse.ok) {
        throw new Error(`HTTP error! status: ${newsResponse.status}`);
      }

      await getData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete: ' + error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`delete-${docId}`]: false }));
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
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-full mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
                  <p className="text-gray-600 mt-1">
                    Total: {data.length} | Published: {data.filter(d => d.isPublished).length} | 
                    Unpublished: {data.filter(d => !d.isPublished).length}
                  </p>
                </div>
                <Link href="/admin/dashboard/news/Create">
                  <button className="bg-emerald-600 hover:bg-emerald-700 py-2.5 px-6 text-white rounded-lg font-medium transition-colors shadow-sm flex">
                    <CirclePlus className="w-4 h-4 mt-1 mr-1" /> Add News
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    filter === "all"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All News ({data.length})
                </button>
                <button
                  onClick={() => setFilter("published")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    filter === "published"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Published ({data.filter(d => d.isPublished).length})
                </button>
                <button
                  onClick={() => setFilter("unpublished")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    filter === "unpublished"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unpublished ({data.filter(d => !d.isPublished).length})
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading news articles...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-800">Error: {error}</p>
              <button 
                onClick={getData}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredData.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">No news articles found</p>
            </div>
          )}

          {/* Table View */}
          {!loading && !error && filteredData.length > 0 && (
            <>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          S.No
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Published At
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentData.map((d, index) => {
                        const serialNumber = startIndex + index + 1;
                        const createdAt = formatDate(d?.createdAt);
                        const publishedAt = formatDate(d?.publishedAt);
                        const isPublishing = loadingStates[`publish-${d._id}`];
                        const isUnpublishing = loadingStates[`unpublish-${d._id}`];
                        const isDeleting = loadingStates[`delete-${d._id}`];
                        
                        return (
                          <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {serialNumber}
                            </td>
                            <td className="px-4 py-4">
                              <img
                                src={d?.image}
                                alt={d?.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm font-medium text-gray-900 max-w-md line-clamp-2">
                                {d?.title}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                  d?.isPublished
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {d?.isPublished ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              {createdAt}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              {d?.isPublished ? publishedAt : "Not Published"}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {d?.isPublished ? (
                                  <button
                                    onClick={() => unPublishBlog(d?._id)}
                                    disabled={isUnpublishing || isDeleting}
                                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => publishBlog(d?._id)}
                                    disabled={isPublishing || isDeleting}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isPublishing ? "Publishing..." : "Publish"}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(d?._id, d.imgId)}
                                  disabled={isDeleting || isPublishing || isUnpublishing}
                                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === pageNumber
                                  ? "bg-emerald-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} articles
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}