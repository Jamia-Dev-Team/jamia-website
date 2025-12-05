import React, { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { PiNewspaperClippingFill } from "react-icons/pi";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import { BookText, LogOut } from "lucide-react";

export default function AdminNav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logOuting, setLogOuting] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
      // Auto-collapse on mobile
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Dispatch sidebar state changes
  useEffect(() => {
    const event = new CustomEvent('sidebarToggle', { 
      detail: { collapsed: isCollapsed || isMobile } 
    });
    window.dispatchEvent(event);
  }, [isCollapsed, isMobile]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (isOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const NAV_ITEMS = [
    {
      link: "/admin/dashboard/news",
      icon: <PiNewspaperClippingFill />,
      label: "News",
    },
    {
      link: "/admin/dashboard/posters",
      icon: <BookText />,
      label: "Posters",
    },
  ];

  const logOut = async () => {
    setLogOuting(true);
    cookies.set("admin", false);
    router.push("/admin/Login");
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderNavItem = (item, index) => {
    return (
      <Link href={item.link} key={index} passHref>
        <a
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-xl p-3 px-5 ${
            router.pathname === item.link ? "bg-zinc-800" : ""
          } hover:bg-zinc-800 transition-colors duration-200`}
        >
          <p className="text-xl">{item.icon}</p>
          <p className="text-base text-white font-medium">{item.label}</p>
        </a>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="mobile-menu-button fixed top-4 left-4 z-50 p-3 bg-zinc-900 text-white rounded-lg shadow-lg hover:bg-zinc-800 transition-colors"
        >
          <HiMenuAlt3 size={24} />
        </button>
      )}

      {/* Desktop Toggle Button - Shows when sidebar is collapsed */}
      {!isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-zinc-900 text-white rounded-lg shadow-lg hover:bg-zinc-800 transition-colors"
        >
          <HiMenuAlt3 size={24} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside 
          className={`fixed top-0 left-0 h-screen bg-zinc-900 text-white z-30 transition-all duration-300 ${
            isCollapsed ? 'w-0 -translate-x-full' : 'w-[280px] translate-x-0'
          } overflow-hidden`}
        >
          <div className="h-full flex flex-col overflow-y-auto">
            {/* Close Button - Desktop */}
            <button
              onClick={toggleSidebar}
              className="absolute top-6 right-6 p-2 bg-red-700 hover:bg-red-800 rounded-lg transition-colors z-10"
            >
              <HiX size={24} />
            </button>

            <div className="p-6 flex flex-col h-full">
              {/* Logo/Header */}
              <div className="flex items-center justify-center bg-zinc-800 rounded-2xl p-6 mt-6 mb-6 flex-shrink-0">
                <div className="relative w-48 h-48">
                  <Image 
                    src="/images/LOGO-5.png" 
                    alt="Admin Dashboard" 
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex gap-2 flex-col flex-1">
                {NAV_ITEMS.map((item, index) => renderNavItem(item, index))}
              </div>

              {/* Logout Button - Fixed at bottom */}
              <div className="mt-auto pt-4">
                <button
                  onClick={logOut}
                  disabled={logOuting}
                  className="flex items-center gap-3 rounded-xl p-3 px-5 bg-red-700 hover:bg-red-800 transition-colors duration-200 w-full disabled:opacity-50 justify-between"
                >
                  <p className="text-base text-white font-medium">
                    {logOuting ? "Logging out..." : "Logout"}
                  </p>

                    <LogOut />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile/Tablet Dropdown Menu */}
      {isMobile && (
        <div 
          className={`mobile-menu fixed top-0 left-0 h-screen w-80 bg-zinc-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } overflow-y-auto`}
        >
          {/* Close Button - Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 bg-red-700 hover:bg-red-800 rounded-lg transition-colors z-10"
          >
            <HiX size={24} />
          </button>

          <div className="p-6 pt-20 flex flex-col h-full">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center bg-zinc-800 rounded-2xl p-6 mb-6 flex-shrink-0">
              <div className="relative w-32 h-32">
                <Image 
                  src="/images/LOGO-5.png" 
                  alt="Admin Dashboard" 
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </div>
            
            {/* Mobile Navigation Items */}
            <div className="flex gap-2 flex-col flex-1">
              {NAV_ITEMS.map((item, index) => renderNavItem(item, index))}
            </div>
            
            {/* Mobile Logout Button - Fixed at bottom */}
            <div className="mt-auto pt-4">
              <button
                onClick={logOut}
                disabled={logOuting}
                className="flex items-center gap-3 rounded-xl p-3 px-5 bg-red-700 hover:bg-red-800 transition-colors duration-200 w-full disabled:opacity-50 justify-between"
              >
                <p className="text-base text-white font-medium">
                  {logOuting ? "Logging out..." : "Logout"}
                </p>
                 <LogOut />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style >{`
        /* Prevent body scroll when mobile menu is open */
        ${isOpen && isMobile ? 'body { overflow: hidden; }' : ''}
        
        /* Smooth scrollbar for sidebar */
        .mobile-menu::-webkit-scrollbar,
        aside::-webkit-scrollbar {
          width: 4px;
        }
        .mobile-menu::-webkit-scrollbar-track,
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        .mobile-menu::-webkit-scrollbar-thumb,
        aside::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .mobile-menu::-webkit-scrollbar-thumb:hover,
        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}