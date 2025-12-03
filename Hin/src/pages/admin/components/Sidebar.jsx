import React from "react";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaUserShield,
  FaUserFriends,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: FaTachometerAlt,
    },
    {
      id: "users",
      label: "التحقق من المستخدمين",
      icon: FaUsers,
    },
    {
      id: "user-management",
      label: "إدارة المستخدمين",
      icon: FaUserFriends,
    },
    {
      id: "logs",
      label: "سجل النشاطات",
      icon: FaClipboardList,
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: FaCog,
    },
  ];

  // Admin profile data
  const adminData = {
    name: "مدير النظام",
    type: "admin",
    email: "admin@hin.com",
  };

  return (
    <motion.aside
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-64 h-screen shadow-lg border-r border-red-900 flex flex-col bg-red-800"
    >
      {/* Profile Section */}
      <div className="flex items-center gap-4 px-5 py-5 rounded-xl border-b shadow-xl transition-all duration-300 bg-red-900 border-red-900">
        {/* Icon */}
        <div className="relative w-14 h-14 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,0,0,0.4)] overflow-hidden before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-white/10 before:blur-sm">
          <div className="w-full h-full flex items-center justify-center rounded-full bg-red-800 text-white">
            <FaUserShield size={26} />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-white drop-shadow-sm">
            {adminData.name}
          </h3>
          <p className="text-sm text-red-200 opacity-90 mt-0.5">
            {adminData.email}
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex flex-col flex-grow px-3 py-4 space-y-2" dir="rtl">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          // Check if the item is active
          const isActive = activeSection && item.id === activeSection;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-red-900 text-white shadow-lg shadow-red-900/40"
                  : "text-white hover:bg-red-700"
              }`}
            >
              <IconComponent className="text-lg" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-red-900 text-center text-red-200 text-sm">
        © {new Date().getFullYear()} HIN Admin Panel
      </div>
    </motion.aside>
  );
};

export default Sidebar;
