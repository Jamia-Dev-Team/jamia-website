// pages/admin/dashboard/news/index.js

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import AdminNav from "../../../../components/AdminNav";
import {
  BookX,
  CirclePlus,
  FolderUp,
  SquarePen,
  Trash,
  View,
} from "lucide-react";

// Improved formatDate function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// Extract first few words from HTML content
const extractPreview = (htmlContent, wordCount = 4) => {
  if (!htmlContent) return "No description";

  // Remove HTML tags
  const text = htmlContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Get first N words
  const words = text.split(" ").slice(0, wordCount);
  return words.join(" ") + (text.split(" ").length > wordCount ? "..." : "");
};

// Categories constant
const CATEGORIES = [
  "Achievements",
  "Events",
  "Admission",
  "Education",
  "Scholarship",
];

// Helper to normalize category strings
const normalizeCategory = (value) =>
  (value || "").toString().trim().toLowerCase();

export default function Component() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
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
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { data: newsData } = await res.json();
      setData(newsData || []);
      setFilteredData(newsData || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Filter data based on selected filter and category
  useEffect(() => {
    let filtered = [...data];

    // publication status filter
    if (filter === "published") {
      filtered = filtered.filter((item) => item.ispublished === true);
    } else if (filter === "unpublished") {
      filtered = filtered.filter(
        (item) => item.ispublished === false || !item.ispublished
      );
    }

    // category filter  ✅
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (item) =>
          normalizeCategory(item.category) === normalizeCategory(categoryFilter)
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filter, categoryFilter, data]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  const publishBlog = async (id) => {
    setLoadingStates((prev) => ({ ...prev, [`publish-${id}`]: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ispublished: true,
            publishedAt: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await getData();
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish: " + error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`publish-${id}`]: false }));
    }
  };

  const unPublishBlog = async (id) => {
    setLoadingStates((prev) => ({ ...prev, [`unpublish-${id}`]: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ispublished: false,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await getData();
    } catch (error) {
      console.error("Unpublish error:", error);
      alert("Failed to unpublish: " + error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`unpublish-${id}`]: false }));
    }
  };

  const handleDelete = async (id, publicId) => {
    if (!confirm("Are you sure you want to delete this news?")) {
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [`delete-${id}`]: true }));
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
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`,
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
      console.error("Delete error:", error);
      alert("Failed to delete: " + error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [`delete-${id}`]: false }));
    }
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("sidebarToggle", handleSidebarChange);
      return () =>
        window.removeEventListener("sidebarToggle", handleSidebarChange);
    }
  }, []);
  const getCategoryCount = (category) => {
    return data.filter(
      (item) => normalizeCategory(item.category) === normalizeCategory(category)
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNav />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-0" : "ml-0 md:ml-[280px] lg:ml-[280px]"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-full mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    News Management
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-gray-600">
                      <span className="font-semibold text-gray-900">
                        {data.length}
                      </span>{" "}
                      Total
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-emerald-600">
                      <span className="font-semibold">
                        {data.filter((d) => d.ispublished).length}
                      </span>{" "}
                      Published
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-amber-600">
                      <span className="font-semibold">
                        {data.filter((d) => !d.ispublished).length}
                      </span>{" "}
                      Unpublished
                    </span>
                  </div>
                </div>
                <Link href="/admin/dashboard/news/Create">
                  <button
                   className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 py-3 px-6 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                    <CirclePlus className="w-5 h-5" /> Add News
                  </button>
                </Link>
              </div>

              {/* Publication Status Filters */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 justify-center">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    filter === "all"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  All News{" "}
                  <span className="ml-1.5 opacity-80">({data.length})</span>
                </button>
                <button
                  onClick={() => setFilter("published")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    filter === "published"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Published{" "}
                  <span className="ml-1.5 opacity-80">
                    ({data.filter((d) => d.ispublished).length})
                  </span>
                </button>
                <button
                  onClick={() => setFilter("unpublished")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    filter === "unpublished"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Unpublished{" "}
                  <span className="ml-1.5 opacity-80">
                    ({data.filter((d) => !d.ispublished).length})
                  </span>
                </button>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 justify-between">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    categoryFilter === "all"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  All Categories{" "}
                  <span className="ml-1.5 opacity-80">({data.length})</span>
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      categoryFilter === category
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {category}{" "}
                    <span className="ml-1.5 opacity-80">
                      ({getCategoryCount(category)})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
              <p className="text-gray-500 mt-4 font-medium">Loading news...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-800 font-medium">Error: {error}</p>
              <button
                onClick={getData}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-md"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredData.length === 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookX className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No news found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or add a new article
              </p>
            </div>
          )}

          {/* Table View */}
          {!loading && !error && filteredData.length > 0 && (
            <>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Sl.No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Published
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentData.map((d, index) => {
                        const id = d.id;
                        const serialNumber = startIndex + index + 1;
                        const createdAt = formatDate(
                          d?.createdAt || d?.createdat
                        );
                        const publishedAt = formatDate(
                          d?.publishedAt || d?.publishedat
                        );

                        const isPublishing = loadingStates[`publish-${id}`];
                        const isUnpublishing = loadingStates[`unpublish-${id}`];
                        const isDeleting = loadingStates[`delete-${id}`];

                        return (
                          <tr
                            key={d.id}
                            className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200"
                          >
                            <td className="px-6 py-5 text-sm font-semibold text-gray-600">
                              {serialNumber}
                            </td>
                            <td className="px-6 py-5">
                              <div className="relative group">
                                <img
                                  src={d?.image}
                                  alt={d?.title}
                                  className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-gray-100 group-hover:border-emerald-300 transition-all"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all"></div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-semibold text-gray-900 max-w-md line-clamp-2 leading-relaxed">
                                {d?.title}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                                {d?.category || "Uncategorized"}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                                {extractPreview(d?.content)}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                  d?.ispublished
                                    ? "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    d?.ispublished
                                      ? "bg-emerald-500"
                                      : "bg-amber-500"
                                  }`}
                                ></span>
                                {d?.ispublished ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                              {createdAt}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  href={`/admin/dashboard/news/View/${d?.id}`}
                                >
                                  <button
                                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2.5 rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg relative group"
                                    title="View"
                                  >
                                    <View className="w-4 h-4" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                      View
                                    </span>
                                  </button>
                                </Link>
                                <Link
                                  href={`/admin/dashboard/news/Edit/${d?.id}`}
                                >
                                  <button
                                    className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-2.5 rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg relative group"
                                    title="Edit"
                                  >
                                    <SquarePen className="w-4 h-4" />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                      Edit
                                    </span>
                                  </button>
                                </Link>
                                {d?.ispublished ? (
                                  <button
                                    onClick={() => unPublishBlog(d?.id)}
                                    disabled={isUnpublishing || isDeleting}
                                    className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-2.5 rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative group"
                                    title="Unpublish"
                                  >
                                    {isUnpublishing ? (
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <BookX className="w-4 h-4" />
                                    )}
                                    {!isUnpublishing && (
                                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                        Unpublish
                                      </span>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => publishBlog(d?.id)}
                                    disabled={isPublishing || isDeleting}
                                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-2.5 rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative group"
                                    title="Publish"
                                  >
                                    {isPublishing ? (
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <FolderUp className="w-4 h-4" />
                                    )}
                                    {!isPublishing && (
                                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                        Publish
                                      </span>
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(d?.id, d.imgid)}
                                  disabled={
                                    isDeleting || isPublishing || isUnpublishing
                                  }
                                  className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2.5 rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative group"
                                  title="Delete"
                                >
                                  {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Trash className="w-4 h-4" />
                                  )}
                                  {!isDeleting && (
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                      Delete
                                    </span>
                                  )}
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
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg font-medium hover:from-gray-200 hover:to-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-gray-200"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;

                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`w-11 h-11 rounded-lg font-semibold transition-all shadow-sm ${
                                currentPage === pageNumber
                                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-105"
                                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
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
                            <span
                              key={pageNumber}
                              className="text-gray-400 font-bold px-1"
                            >
                              ···
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-lg font-medium hover:from-gray-200 hover:to-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-gray-200"
                    >
                      Next →
                    </button>
                  </div>

                  <div className="text-center mt-5 pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-600 font-medium">
                      Page{" "}
                      <span className="font-bold text-gray-900">
                        {currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-gray-900">
                        {totalPages}
                      </span>{" "}
                      • Showing{" "}
                      <span className="font-bold text-gray-900">
                        {startIndex + 1}-
                        {Math.min(endIndex, filteredData.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-gray-900">
                        {filteredData.length}
                      </span>
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
