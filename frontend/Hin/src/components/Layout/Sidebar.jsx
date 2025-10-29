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
      <div className="flex flex-col items-center text-center px-4 py-6 border-b">
        {profileData.type === "company" ? (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md mb-3">
            <FaBuilding size={28} />
          </div>
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-black shadow-md mb-3">
            <FaUser size={28} />
          </div>
        )}
        <h3 className={`text-lg font-semibold ${textColor}`}>
          {profileData.name}
        </h3>
        <p className="text-sm text-white">{profileData.description}</p>
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
              className={`flex items-center gap-4 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
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
