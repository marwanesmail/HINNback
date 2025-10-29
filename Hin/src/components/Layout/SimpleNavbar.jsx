// src/components/Layout/SimpleNavbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClinicMedical,
  FaBars,
  FaHome,
  FaBell,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { scrollToElement } from "../../utils/dashboardSearch";

const SimpleNavbar = ({
  title = "النظام الطبي",
  onToggleSidebar,
  notifications = [],
  unreadCount = 0,
  onNotificationClick,
  onToggleNotifications,
  showNotifications = false,
  onGenerateSampleNotifications,
  profileData,
  // Add props to control search visibility
  showSearch = true,
  // Color customization props
  navbarColor = "bg-white",
  textColor = "text-gray-800",
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleGoHome = () => navigate("/");

  const handleSearch = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("dashboardSearch", {
        detail: { query: searchQuery.trim() },
      })
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    window.dispatchEvent(
      new CustomEvent("dashboardSearch", { detail: { query: "" } })
    );
  };

  useEffect(() => {
    const handleSearchResults = (e) => {
      const results = e.detail.results || [];
      setSearchResults(results);
      setShowSearchResults(results.length > 0 || searchQuery.trim() !== "");
    };

    window.addEventListener("dashboardSearchResults", handleSearchResults);
    return () => {
      window.removeEventListener("dashboardSearchResults", handleSearchResults);
    };
  }, [searchQuery]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`fixed top-0 right-0 left-0 z-50 shadow-sm border-b border-gray-200 h-16 ${navbarColor}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* يمين: زر التوجل + العنوان */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`lg:hidden ${textColor} hover:text-gray-900`}
            >
              <FaBars size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <FaClinicMedical className="text-blue-600" />
            <span className={`text-lg sm:text-xl font-bold ${textColor}`}>
              {title}
            </span>
          </div>
        </div>

        {/* Center: Search - only shown if enabled */}
        {showSearch && (
          <div className="search-container hidden md:flex items-center relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ابحث في لوحة التحكم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 md:w-80 px-4 py-2 pr-10 rounded-full border border-opacity-30 bg-white bg-opacity-10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-white placeholder-opacity-70"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-opacity-75"
                >
                  <FaTimes size={14} />
                </button>
              ) : (
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-opacity-70" />
              )}
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                      onClick={() => {
                        if (result.element) scrollToElement(result.element);
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {result.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    لا توجد نتائج للبحث
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* شمال: باقي الأزرار */}
        <div className="flex items-center gap-3">
          {/* Home - متاح على جميع الأحجام */}
          <button
            onClick={handleGoHome}
            className={`flex items-center px-3 py-2 ${textColor} hover:text-blue-600 hover:bg-blue-50 rounded-lg transition`}
          >
            <FaHome className="sm:ml-2" />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onToggleNotifications}
            className={`relative p-2 rounded-full ${
              location.pathname.startsWith("/orders")
                ? "text-black hover:text-blue-400"
                : location.pathname.startsWith("/doctor") ||
                  location.pathname.startsWith("/pharmacy") ||
                  location.pathname.startsWith("/company") ||
                  location.pathname.startsWith("/patient")
                ? "text-gray-100 hover:text-blue-400 hover:bg-gray-100"
                : "text-gray-600 hover:text-blue-400 hover:bg-gray-100"
            }`}
          >
            <FaBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={`flex items-center gap-1 px-2 py-1 ${textColor} hover:text-blue-600 hover:bg-blue-50 rounded-lg`}
            >
              <FaUser />
              <FaChevronDown
                className={`text-xs transition ${
                  showUserDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showUserDropdown && (
              <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="font-medium text-gray-900">
                    {profileData?.name || "اسم المستخدم"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profileData?.email || "user@example.com"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Redirect to profile based on user type
                    if (profileData?.type === "doctor") {
                      navigate("/doctor/profile");
                    } else if (profileData?.type === "pharmacy") {
                      navigate("/pharmacy/profile");
                    } else if (profileData?.type === "company") {
                      navigate("/company/profile");
                    } else {
                      // For patients, navigate to the new profile route
                      navigate("/patient/profile-page");
                    }
                  }}
                  className="w-full px-4 py-2 text-sm flex justify-end items-center gap-2 hover:bg-gray-100"
                >
                  الملف الشخصي <FaUser />
                </button>
                {/* <button
                  onClick={() => navigate("/settings")}
                  className="w-full px-4 py-2 text-sm flex justify-end items-center gap-2 hover:bg-gray-100"
                >
                  الإعدادات <FaCog />
                </button> */}
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 flex justify-end items-center gap-2 hover:bg-red-50"
                >
                  تسجيل الخروج <FaSignOutAlt />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default SimpleNavbar;
