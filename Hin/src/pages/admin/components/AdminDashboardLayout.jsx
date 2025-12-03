import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AdminDashboardLayout = ({ children, onSectionChange, activeSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      {/* Fixed Navbar at top-0 */}
      <div className="fixed top-0 right-0 left-0 z-50">
        <Navbar
          setActiveSection={onSectionChange}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar fixed below navbar at top-16 */}
        <div
          className={`fixed top-16 bottom-0 right-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } lg:block`}
        >
          <Sidebar
            activeSection={activeSection}
            setActiveSection={onSectionChange}
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
        <div className="flex-1 lg:mr-64">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
