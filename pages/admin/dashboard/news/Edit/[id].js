/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cookies from "js-cookie";
import AdminNav from "../../../../../components/AdminNav";
import { HiOutlinePhotograph } from "react-icons/hi";
import { BiImageAdd } from "react-icons/bi";
import dynamic from "next/dynamic";

// Import React Quill dynamically
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditNews() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    imgId: "",
    isPublished: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalImageId, setOriginalImageId] = useState("");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const fileInputRef = useRef(null);

  const categories = [
    "Achievements",
    "Events",
    "Admission",
    "Education",
    "Scholarship",
  ];

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Check admin authentication
  useEffect(() => {
    const adminUser = cookies.get("admin");
    if (adminUser === "false") {
      router.push("/admin/Login");
    }
  }, [router]);

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };

    window.addEventListener("sidebarToggle", handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarToggle", handleSidebarChange);
  }, []);

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { data } = await res.json();

      // Make sure keys match what API returns (after mapping)
      setFormData({
        title: data.title || "",
        content: data.content || "",
        category: data.category || "",
        image: data.image || "",
        imgId: data.imgId || data.imgid || "",
        isPublished: data.isPublished ?? data.ispublished ?? false,
      });
      setImagePreview(data.image || "");
      setOriginalImageId(data.imgId || data.imgid || "");
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  /**
   * Upload new image (if any) via /api/upload, delete old Cloudinary image if replaced.
   * Returns { imageUrl, publicId }
   */
  const uploadImage = async () => {
    // No new image selected → keep existing
    if (!imageFile) {
      return {
        imageUrl: formData.image,
        publicId: formData.imgId,
      };
    }

    const form = new FormData();
    form.append("image", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Image upload failed");
    }

    // Delete old image if there was one and it's different from new
    if (originalImageId && originalImageId !== data.publicId) {
      try {
        await fetch("/api/deleteImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: originalImageId }),
        });
      } catch (err) {
        console.error("Failed to delete old image:", err);
        // Don't block main update on this
      }
    }

    return {
      imageUrl: data.imageUrl,
      publicId: data.publicId,
    };
  };

  /**
   * Handle submit
   * status: "published" | "draft"
   */
  const handleSubmit = async (e, status) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter content");
      return;
    }

    setSubmitting(true);

    try {
      // Upload new image if selected
      const { imageUrl, publicId } = await uploadImage();

      const isPublishing = status === "published";

      const updateData = {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        image: imageUrl,
        imgId: publicId,
        isPublished: isPublishing,
        publishedAt: isPublishing ? new Date().toISOString() : null,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/news/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${res.status}`);
      }

      alert("News updated successfully!");
      router.push("/admin/dashboard/news");
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-0" : "md:ml-[280px]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit News</h1>
            <p className="text-gray-600 mt-2">
              Update the details below to edit the news post
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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

          {/* Form Card */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* submit = publish */}
              <form onSubmit={(e) => handleSubmit(e, "published")}>
                <div className="grid lg:grid-cols-3 gap-6 p-6">
                  {/* Left Column - Form Fields */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Title Section */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        News Title *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter news title..."
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    {/* Category Section */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select a category...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Content Section */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        News Content *
                      </label>
                      <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
                        <ReactQuill
                          className="edit-news-editor"
                          theme="snow"
                          value={formData.content}
                          onChange={(value) =>
                            setFormData({ ...formData, content: value })
                          }
                          modules={modules}
                          placeholder="Write your news content here..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <HiOutlinePhotograph className="text-lg" />
                        Featured Image *
                      </label>

                      {/* Upload Area */}
                      <div className="mb-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <BiImageAdd className="text-5xl text-gray-400 mx-auto mb-3" />
                          <label className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-700 font-medium">
                              Click to upload
                            </span>
                            <span className="text-gray-500 block mt-1">
                              or drag and drop
                            </span>
                            <input
                              ref={fileInputRef}
                              onChange={handleImageChange}
                              type="file"
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>

                      {/* Preview Area */}
                      <div>
                        {imagePreview ? (
                          <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-64 object-cover"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors shadow-lg"
                            >
                              Remove
                            </button>
                            <div className="p-3 bg-white border-t border-gray-200">
                              <p className="text-xs text-gray-600 text-center">
                                Image Preview
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-[200px]">
                            <p className="text-gray-400 text-center">
                              No image selected
                              <br />
                              <span className="text-xs">
                                Preview will appear here
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/dashboard/news")}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, "draft")}
                    disabled={submitting}
                    className="px-8 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save as Draft"
                    )}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Update News"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles for Quill Editor */}
      <style>{`
        .edit-news-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
        }

        .edit-news-editor .ql-editor {
          min-height: 400px;
        }

        .edit-news-editor .ql-toolbar {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .edit-news-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
