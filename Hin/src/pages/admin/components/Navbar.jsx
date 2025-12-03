import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setActiveSection, toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Clear admin session
    navigate("/admin/login");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-red-800 shadow-sm border-b border-red-900 w-full"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo and menu button */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-red-700 text-white"
          >
            <FaBars className="text-white" />
          </button>

          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-red-900 rounded-xl flex items-center justify-center shadow-md">
              <FaUserShield className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">HIN Admin</h1>
              <p className="text-xs text-red-200">مدير النظام</p>
            </div>
          </div>
        </div>

        {/* Right side - Admin info and logout */}
        <div className="flex items-center space-x-4 space-x-reverse">

          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 bg-red-900 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <FaSignOutAlt className="ml-2" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t border-red-900"
        >
          <div className="py-2 px-4">
            <button
              onClick={() => {
                setActiveSection("dashboard");
                setIsMenuOpen(false);
              }}
              className="block w-full text-right py-2 text-white hover:bg-red-700 rounded"
            >
              لوحة التحكم
            </button>
            <button
              onClick={() => {
                setActiveSection("users");
                setIsMenuOpen(false);
              }}
              className="block w-full text-right py-2 text-white hover:bg-red-700 rounded"
            >
              التحقق من المستخدمين
            </button>
            <button
              onClick={() => {
                setActiveSection("logs");
                setIsMenuOpen(false);
              }}
              className="block w-full text-right py-2 text-white hover:bg-red-700 rounded"
            >
              سجل النشاطات
            </button>
            <button
              onClick={() => {
                setActiveSection("settings");
                setIsMenuOpen(false);
              }}
              className="block w-full text-right py-2 text-white hover:bg-red-700 rounded"
            >
              الإعدادات
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
