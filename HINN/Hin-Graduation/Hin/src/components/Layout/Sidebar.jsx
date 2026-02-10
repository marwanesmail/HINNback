// src/components/Layout/Sidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBuilding, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const Sidebar = ({
  profileData,
  menuItems,
  onMenuItemClick,
  activeSection, // Add this prop
  sidebarColor = "bg-white",
  textColor = "text-gray-800",
}) => {
  const location = useLocation(); // بترجع الـ path الحالي
  const navigate = useNavigate();

  const logout = () => {
    console.log("User logged out!");
    // مثال لتطبيق لوج آوت فعلي
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`w-64 h-screen shadow-lg border-r border-gray-200 flex flex-col ${sidebarColor}`}
    >
      {/* Profile Section */}
      <div
        className={`flex items-center gap-4 px-5 py-5 rounded-xl border-b shadow-xl transition-all duration-300 ${
          profileData.type === "doctor"
            ? "bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] border-blue-900"
            : profileData.type === "pharmacy"
            ? "bg-gradient-to-r from-[#14532D] via-[#166534] to-[#22C55E] border-green-900"
            : profileData.type === "company"
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white border border-gray-700 shadow-lg shadow-gray-700/50"
            : profileData.type === "patient"
            ? "bg-gradient-to-r from-[#581C87] via-[#6B21A8] to-[#9333EA] border-purple-900"
            : "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700"
        }`}
      >
        {/* Icon */}
        <div
          className={`relative w-14 h-14 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,0,0,0.4)] overflow-hidden 
    before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:blur-sm`}
        >
          <div
            className={`w-full h-full flex items-center justify-center rounded-full ${
              profileData.type === "doctor"
                ? "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white"
                : profileData.type === "pharmacy"
                ? "bg-gradient-to-r from-[#166534] to-[#22C55E] text-white"
                : profileData.type === "company"
                ? "bg-gradient-to-r from-[#111827] to-[#374151] text-white"
                : profileData.type === "patient"
                ? "bg-gradient-to-r from-[#6B21A8] to-[#9333EA] text-white"
                : "bg-gradient-to-r from-green-500 to-teal-500 text-black"
            }`}
          >
            {profileData.type === "company" ? (
              <FaBuilding size={26} />
            ) : (
              <FaUser size={26} />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-white drop-shadow-sm">
            {profileData.name}
          </h3>
          <p className="text-sm text-gray-200 opacity-90 mt-0.5">
            {profileData.type === "doctor"
              ? `${profileData.clinicName || "لم يتم تحديد العيادة"}`
              : profileData.type === "pharmacy"
              ? `مدير ${profileData.manager || "لم يتم تحديد المدير"}`
              : profileData.type === "company"
              ? `${
                  profileData.businessType ||
                  profileData.activity ||
                  "نوع النشاط التجاري"
                }`
              : profileData.type === "patient"
              ? "مريض"
              : ""}
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex flex-col flex-grow px-3 py-4 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          // Check if the item is active based on activeSection prop or URL path
          const isActive =
            (activeSection && item.id === activeSection) ||
            location.pathname === item.path ||
            (item.dataSection && location.hash === `#${item.dataSection}`);

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (item.action === "logout") {
                  logout();
                } else if (onMenuItemClick) {
                  onMenuItemClick(item.id, item.dataSection, item.path);
                }
              }}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isActive
                  ? `${
                      profileData.type === "doctor"
                        ? "bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/40"
                        : profileData.type === "company"
                        ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 text-white shadow-lg shadow-gray-600/40"
                        : profileData.type === "pharmacy"
                        ? "bg-gradient-to-r from-green-900 via-green-700 to-green-500 text-white shadow-lg shadow-green-500/40"
                        : profileData.type === "patient"
                        ? "bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 text-white shadow-lg shadow-purple-500/40"
                        : "bg-gradient-to-r from-blue-700 to-purple-600 text-white shadow-lg"
                    }`
                  : `${textColor} hover:bg-gray-700`
              }`}
            >
              <IconComponent className="text-lg" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
