import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminNav from "../../../../components/AdminNav";
import { CirclePlus } from "lucide-react";
import Image from "next/image";


export default function Index() {
  const [img, setImg] = useState("");
  const [data, setData] = useState([]);
  const [deleting, setDeleting] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Listen to sidebar toggle events from AdminNav
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarOpen(!event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  // Fetch real data from API
  const getData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/images`, {});
      const { data: fetchedData } = await res.json();
      setData(fetchedData || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileSizeInKB = file.size / 1024;
    
    if (fileSizeInKB > 500) {
      alert("File size exceeds 500KB. Please upload a smaller file.");
      setIsOpen(false);
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setImg(readerEvent.target.result);
    };
  };
const addPoster = async (uploadData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/images`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: uploadData.image, 
        imgid: uploadData.imgid,  
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "DB insert failed");
    }

    setIsUploading(false);
    setIsOpen(false);
    getData();
    setImg("");
    setFile(null);
  } catch (error) {
    setIsUploading(false);
    alert(error.message);
  }
};


const deleteDoc = async (id) => {
  try {
  await fetch(`${process.env.NEXT_PUBLIC_PORT}/api/images/delete/${id}`, {
  method: "DELETE",
});


    setDeleting("");
    getData();
  } catch (error) {
    setDeleting("");
    alert(error);
  }
};

const handleDelete = async (id, imgid) => {
  if (!confirm("Are you sure you want to delete this poster?")) return;

  setDeleting(id);

  try {
    const response = await fetch("/api/deleteImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId: imgid }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log(responseData.message);
      await deleteDoc(id); 
    } else {
      throw new Error(responseData.error || "Deletion failed");
    }
  } catch (error) {
    setDeleting("");
    alert("Delete error: " + error.message);
  }
};

const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) return;

  setIsUploading(true);

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await response.json();
    if (response.ok) {
      console.log(uploadData.image); // secure_url
      addPoster(uploadData);
    } else {
      throw new Error(uploadData.error || "Upload failed");
    }
  } catch (error) {
    setIsUploading(false);
    alert(error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div 
        className={`px-4 md:px-6 py-8 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-72' : 'md:ml-0'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Posters Management</h1>
                <p className="text-gray-500 mt-1">Manage and organize Posters </p>
              </div>
              <button
                   className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 py-3 px-6 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                onClick={() => setIsOpen(true)}
              >
               <CirclePlus className="w-5 h-5" />Add Poster
              </button>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posters Yet</h3>
              <p className="text-gray-500">Click `&quot;`Add Poster`&quot;` to upload your first poster</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((d) => (
                  <div 
                    key={d.id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <Image 
                        src={d.image} 
                        alt="Poster"
                        layout="fill"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {d.image && (
                      <div className="p-4">
                        <button
                          className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDelete(d.id, d.imgid)}
                          disabled={deleting === d.id}
                        >
                          {deleting === d.id ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Deleting...
                            </span>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex flex-wrap gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const isCurrentPage = currentPage === pageNumber;
                      
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              isCurrentPage
                                ? 'bg-emerald-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              <div className="mt-4 text-center text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} posters
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upload New Poster</h2>
              <p className="text-sm text-gray-500 mt-1">Select an image file (max 500KB)</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setFile(null);
                  setImg("");
                }}
                className="absolute right-6 top-6 text-gray-400 hover:text-red-500 transition-colors"
              >
                <IoIosCloseCircle className="text-3xl" />
              </button>
            </div>

            <div className="p-6">
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
                  <div className="text-4xl mb-4">📤</div>
                  <label className="cursor-pointer">
                    <span className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                    <input
                      onChange={handleImg}
                      accept="image/*"
                      type="file"
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 500KB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                    <Image 
                      src={img} 
                      alt="Preview"
                      width={400}
                      height={500}
                      className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      onClick={() => {
                        setFile(null);
                        setImg("");
                      }}
                    >
                      Change Image
                    </button>

                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        'Upload Poster'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
