import React, { useState } from "react";
import { motion } from "framer-motion";
import AdminDashboardLayout from "./components/AdminDashboardLayout";
import DashboardOverview from "./components/DashboardOverview";
import UsersVerification from "./components/UsersVerification";
import UserManagement from "./components/UserManagement";
import ActivityLogs from "./components/ActivityLogs";
import Settings from "./components/Settings";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview onNavigateToUsers={setActiveSection} />;
      case "users":
        return <UsersVerification />;
      case "user-management":
        return <UserManagement />;
      case "logs":
        return <ActivityLogs />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  // Menu items for the sidebar
  const menuItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
    },
    {
      id: "users",
      label: "التحقق من المستخدمين",
    },
    {
      id: "user-management",
      label: "إدارة المستخدمين",
    },
    {
      id: "logs",
      label: "سجل النشاطات",
    },
    {
      id: "settings",
      label: "الإعدادات",
    },
  ];

  return (
    <div dir="rtl">
      <AdminDashboardLayout
        onSectionChange={setActiveSection}
        activeSection={activeSection}
      >
        {/* Page Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === "dashboard" && "لوحة التحكم"}
                  {activeSection === "users" && "التحقق من المستخدمين"}
                  {activeSection === "user-management" && "إدارة المستخدمين"}
                  {activeSection === "logs" && "سجل النشاطات"}
                  {activeSection === "settings" && "الإعدادات"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {new Date().toLocaleDateString("ar-EG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveSection()}
          </motion.div>
        </main>
      </AdminDashboardLayout>
    </div>
  );
};

export default AdminDashboard;
