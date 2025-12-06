// pages/admin/dashboard/contacts/index.js

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminNav from "../../../../components/AdminNav";
import { FaEnvelopeOpenText, FaWhatsapp } from "react-icons/fa";
import { Mail, Eye, Phone, Search, X } from "lucide-react";
import { CircleX } from "lucide-react";

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    const isMobile = window.innerWidth < 768;
    setSidebarCollapsed(isMobile);

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/contact");
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load contacts");
      }

      setContacts(data.data || []);
      setFilteredContacts(data.data || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = contacts;
if (filterStatus === "new") {
  result = result.filter(c => c.status === "new");
} else if (filterStatus === "read") {
  result = result.filter(c => isReadStatus(c.status));
}


    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContacts(result);
  }, [filterStatus, searchQuery, contacts]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWhatsAppReply = (contact) => {
    const phoneNumber = contact.phone?.replace(/\D/g, '');
    if (!phoneNumber) {
      alert('Phone number not available for this contact');
      return;
    }
    
    const message = `Hi ${contact.name}, thank you for contacting us regarding "${contact.subject}". `;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailReply = (contact) => {
    const subject = `Re: ${contact.subject}`;
    const body = `Dear ${contact.name},\n\nThank you for reaching out to us.\n\nYour original message:\n"${contact.message}"\n\n`;
    const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

const markAsRead = async (contactId) => {
  try {
    const res = await fetch(`/api/contact/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error('Failed to update status:', data.message);
      return;
    }

    const updated = data.data;

    setContacts(prev =>
      prev.map(item =>
        item.id === contactId ? { ...item, status: updated.status } : item
      )
    );

    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact(prev => ({ ...prev, status: updated.status }));
    }
  } catch (err) {
    console.error('Error updating status:', err);
  }
};

 const isReadStatus = (status) => status && status !== 'new';

const getStatusCount = (status) => {
  if (status === "all") return contacts.length;

  if (status === "new") {
    return contacts.filter(c => c.status === "new").length;
  }

  if (status === "read") {
    // everything that is not "new" counts as read
    return contacts.filter(c => isReadStatus(c.status)).length;
  }

  return 0;
};


  return (
    <>
      <AdminNav />
      
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '0' : '280px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Message Management
                </h1>
                <p className="text-gray-600 text-base">
                  <span className="font-semibold text-gray-900">{contacts.length}</span> Total
                  <span className="mx-2">|</span>
                  <span className="font-semibold text-teal-600">{getStatusCount('new')}</span> New
                  <span className="mx-2">|</span>
                  <span className="font-semibold text-orange-500">{getStatusCount('read')}</span> Read
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full lg:w-96 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === "all"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Messages ({getStatusCount("all")})
              </button>
              
              <button
                onClick={() => setFilterStatus("new")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === "new"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                New ({getStatusCount("new")})
              </button>
              
              <button
                onClick={() => setFilterStatus("read")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === "read"
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Read ({getStatusCount("read")})
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {loading && (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading messages...</p>
              </div>
            )}

            {error && !loading && (
              <div className="p-8 text-center">
                <div className="text-red-600 text-lg font-semibold">{error}</div>
              </div>
            )}

            {!loading && !error && filteredContacts.length === 0 && (
              <div className="p-12 text-center">
                <FaEnvelopeOpenText className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">
                  {searchQuery || filterStatus !== "all" ? "No messages" : "No contact messages found"}
                </p>
              </div>
            )}

            {!loading && !error && filteredContacts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        SL.NO
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Message Preview
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Received
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Reply
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContacts.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="font-semibold text-gray-900 text-base">
                              {item.name}
                            </div>
                            <a className="text-sm text-gray-900 flex items-center gap-1">
                              {item.email}
                            </a>
                            {item.phone && (
                              <a className="text-sm text-gray-900 flex items-center gap-1">
                                {item.phone}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {item.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-gray-700 line-clamp-2">
                            {item.message}
                          </div>
                          {item.message.length > 100 && (
                            <button
                              onClick={() => setSelectedContact(item)}
                              className="text-xs text-blue-600 hover:underline mt-1 font-medium"
                            >
                              Read more →
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.status === 'new' ? (
                            <button
                              onClick={() => markAsRead(item.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
                            >
                              Mark as Read
                            </button>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Read
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {formatDateTime(item.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEmailReply(item)}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                              title="Reply via Email"
                            >
                              <Mail size={16} />
                            </button>
                            {item.phone && (
                              <button
                                onClick={() => handleWhatsAppReply(item)}
                                className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg  transition-colors shadow-sm"
                                title="Reply via WhatsApp"
                              >
                                <FaWhatsapp size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedContact && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedContact(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-start justify-between">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">
                    {selectedContact.name}
                  </h3>
                  <p className="text-sm text-blue-100 mt-1 capitalize">
                    {selectedContact.subject}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-white hover:text-gray-200 text-3xl font-light"
                >
                     <CircleX />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
            
             
              <div className="bg-blue-50 rounded-xl p-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed">
                  {selectedContact.message}
                </p>
              </div>
              
            

              <div className="bg-gray-50 rounded-xl p-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                <div className="mt-2">
                  {selectedContact.status === 'new' ? (
                    <button
                      onClick={() => markAsRead(selectedContact.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Read
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 rounded-b-3xl">
              <button
                onClick={() => handleEmailReply(selectedContact)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md font-semibold"
              >
                <Mail size={18} />
                Reply via Email
              </button>
              {selectedContact.phone && (
                <button
                  onClick={() => handleWhatsAppReply(selectedContact)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md font-semibold"
                >
                  <FaWhatsapp size={18} />
                  Reply via WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminContactsPage;