import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import shortid from "shortid";
import dynamic from "next/dynamic";
import { HiOutlinePhotograph } from "react-icons/hi";
import { BiImageAdd } from "react-icons/bi";

const Quill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import AdminNav from "../../../../components/AdminNav";

export default function CreateNews() {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const router = useRouter();

  const categories = [
    "Achievements",
    "Events",
    "Admission",
    "Education",
    "Scholarship"
  ];

  useEffect(() => {
    const getAdmin = () => {
      const adminUser = cookies.get("admin");
      if (adminUser === "false") {
        router.push("/admin/Login");
      }
    };
    getAdmin();
  }, [router]);

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSizeInKB = file.size / 1024;
    if (fileSizeInKB > 500) {
      alert("File size exceeds 500KB. Please upload a smaller file.");
      e.target.value = null;
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setImg(readerEvent.target.result);
    };
  };

  const handleRemoveImage = () => {
    setImg("");
    setFile(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = null;
  };

  const handleUpload = async (e, status = "published") => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!category) {
      alert("Please select a category");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!file) {
      alert("Please select an image");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        await addBlog(data, status);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      alert(error.message);
      setUploading(false);
    }
  };

  const addBlog = async (imgData, status) => {
    const slug = shortid.generate();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/news`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          category: category,
          content: description,
          slug: slug,
          image: imgData.imageUrl,
          imgId: imgData.publicId,
          status: status,
          createdAt: new Date(),
        }),
      });

      if (res.ok) {
        router.push("/admin/dashboard/news");
      } else {
        throw new Error("Failed to create blog post");
      }
    } catch (error) {
      alert(error.message);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div 
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-0' : 'md:ml-[280px]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create News
            </h1>
            <p className="text-gray-600 mt-2">
              Fill in the details below to create a new news post
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <form onSubmit={(e) => handleUpload(e, "published")}>
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
                      value={title}
                      onChange={handleTitle}
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
                      value={category}
                      onChange={handleCategory}
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
                      <Quill
                        className="create-news-editor"
                        value={description}
                        onChange={handleDescriptionChange}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ align: [] }],
                            ["link", "image"],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "list",
                          "bullet",
                          "align",
                          "link",
                          "image",
                        ]}
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
                      Featured Image * (Max 500KB)
                    </label>
                    
                    {/* Upload Area */}
                    <div className="mb-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <BiImageAdd className="text-5xl text-gray-400 mx-auto mb-3" />
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-700 font-medium">
                            Click to upload
                          </span>
                          <span className="text-gray-500 block mt-1">or drag and drop</span>
                          <input
                            onChange={handleImg}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            required
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, GIF up to 500KB
                        </p>
                      </div>
                    </div>

                    {/* Preview Area */}
                    <div>
                      {img ? (
                        <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={img}
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
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleUpload(e, "draft")}
                  disabled={uploading}
                  className="px-8 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  disabled={uploading}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                      Publishing...
                    </>
                  ) : (
                    "Publish News"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles for Quill Editor */}
      <style>{`
        .create-news-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
        }
        
        .create-news-editor .ql-editor {
          min-height: 400px;
        }

        .create-news-editor .ql-toolbar {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .create-news-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}