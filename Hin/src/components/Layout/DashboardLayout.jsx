import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import SimpleNavbar from "./SimpleNavbar";
import Sidebar from "./Sidebar";
import NotificationsDropdown from "./NotificationsDropdown";
import {
  searchInElement,
  removeHighlights,
  highlightSearchTerms,
} from "../../utils/dashboardSearch";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({
  children,
  sidebarItems,
  profileData,
  title = "لوحة التحكم",
  onSectionChange, // Add this prop to handle section changes
  activeSection, // Add this prop to receive the active section
  notifications = [], // Add notifications prop
  unreadCount = 0, // Add unread count prop
  onNotificationClick, // Add notification click handler
  onToggleNotifications, // Add toggle notifications handler
  showNotifications = false, // Add show notifications state
  onGenerateSampleNotifications, // Add generate sample notifications handler
  // Color customization props
  navbarColor = "bg-white",
  sidebarColor = "bg-white",
  textColor = "text-gray-800",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add logout action to sidebar items
  const sidebarItemsWithLogout = [
    ...sidebarItems,
    {
      id: "logout",
      icon: () => (
        <div className="flex items-center gap-2 text-red-500">
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </div>
      ),
      action: "logout",
    },
  ];

  const handleMenuItemClick = (itemId, dataSection, path) => {
    if (itemId === "logout") {
      logout();
      navigate("/login");
    } else if (path) {
      // If a path is provided, navigate to it
      navigate(path);
    } else if (onSectionChange) {
      // Handle section change if callback is provided
      onSectionChange(itemId);
    }
    // Handle other menu item clicks if needed
  };

  // Handle search events from navbar
  useEffect(() => {
    const handleDashboardSearch = (e) => {
      const query = e.detail.query;
      setSearchQuery(query);

      if (contentRef.current) {
        // Remove previous highlights
        removeHighlights(contentRef.current);

        if (query) {
          // Search in content
          const results = searchInElement(contentRef.current, query);

          // Highlight the search terms
          highlightSearchTerms(contentRef.current, query);

          // Emit results back to navbar
          window.dispatchEvent(
            new CustomEvent("dashboardSearchResults", {
              detail: { results },
            })
          );
        } else {
          // Clear results
          window.dispatchEvent(
            new CustomEvent("dashboardSearchResults", {
              detail: { results: [] },
            })
          );
        }
      }
    };

    window.addEventListener("dashboardSearch", handleDashboardSearch);
    return () => {
      window.removeEventListener("dashboardSearch", handleDashboardSearch);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavbar
        title={title}
        onToggleSidebar={toggleSidebar}
        // Pass notification props to SimpleNavbar
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={onNotificationClick}
        onToggleNotifications={onToggleNotifications}
        showNotifications={showNotifications}
        onGenerateSampleNotifications={onGenerateSampleNotifications}
        // Pass profile data
        profileData={profileData}
        // Pass color customization props
        navbarColor={navbarColor}
        textColor={textColor}
      />

      {/* Notifications Dropdown */}
      {showNotifications && (
        <NotificationsDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationClick={onNotificationClick}
          onGenerateSampleNotifications={onGenerateSampleNotifications}
          onToggleNotifications={onToggleNotifications}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 bottom-0 right-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:block`}
      >
        <Sidebar
          profileData={profileData}
          menuItems={sidebarItemsWithLogout}
          onMenuItemClick={handleMenuItemClick}
          activeSection={activeSection} // Pass the active section value as prop
          // Pass color customization props
          sidebarColor={sidebarColor}
          textColor={textColor}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div
        ref={contentRef}
        className="lg:mr-64 pt-16 min-h-screen transition-all duration-300"
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
