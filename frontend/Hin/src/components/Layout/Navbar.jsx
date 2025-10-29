// src/components/Layout/Navbar.jsx

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaClinicMedical,
  FaHome,
  FaSearch,
  FaCalendarCheck,
  FaPrescription,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaVial,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const isActiveLink = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  // ✅ تعديل الكلاسات
  const getLinkClasses = (path) => {
    const isActive = isActiveLink(path);
    return `relative px-3 py-2 rounded-lg flex items-center font-medium transition-all duration-300 group ${
      isActive
        ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md"
        : "text-gray-600 hover:text-primary-500"
    }`;
  };

  // Handle medicine request link click
  const handleMedicineRequestClick = (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      navigate("/prescription-upload");
    } else {
      Swal.fire({
        title: "يجب تسجيل الدخول أولاً",
        text: "يرجى تسجيل الدخول للمتابعة إلى طلب الدواء",
        icon: "warning",
        confirmButtonText: "حسنًا",
      });
    }
  };

  // ✅ Animation Variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const desktopLinkVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <motion.div
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
              className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-md"
            >
              <FaClinicMedical className="text-white text-lg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                هيِّن
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                للرعاية الصحية
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <motion.div
            className="hidden lg:flex items-center space-x-6 space-x-reverse"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <motion.div variants={desktopLinkVariants}>
                <Link to="/" className={getLinkClasses("/")}>
                  <FaHome className="ml-1" />
                  الرئيسية
                  {/* Underline */}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
              <motion.div variants={desktopLinkVariants}>
                <Link to="/doctors" className={getLinkClasses("/doctors")}>
                  <FaSearch className="ml-1" />
                  ابحث عن طبيب
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
              <motion.div variants={desktopLinkVariants}>
                <button
                  onClick={handleMedicineRequestClick}
                  className={getLinkClasses("/prescription-upload")}
                >
                  <FaPrescription className="ml-1" />
                  طلب دواء
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </motion.div>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            {/* Cart + Auth */}
            <motion.div
              className="flex items-center space-x-3 space-x-reverse relative"
              variants={menuVariants}
            >
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-primary-500 transition-all"
                title="سلة الشراء"
              >
                <FaShoppingCart className="text-lg" />
                {isAuthenticated() && getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                  >
                    <FaUser className="text-primary-600 hover:text-primary-700 transition duration-300 transform hover:scale-110 drop-shadow-sm cursor-pointer" />
                    <span>
                      {user?.userType === "doctor" && `أهلاً Dr/ ${user?.name?.replace("د. ", "") || user?.email?.split("@")[0]}`}
                      {user?.userType === "pharmacy" && `أهلاً Dr/ ${user?.name?.replace("د. ", "") || user?.email?.split("@")[0]}`}
                      {user?.userType === "company" && `أهلاً Dr/ ${user?.name?.replace("د. ", "")|| user?.email?.split("@")[0]}`}
                      {user?.userType === "patient" && `أهلاً، ${user?.name || user?.email?.split("@")[0]}`}
                    </span>
                    <FaChevronDown className="text-sm" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {user?.userType === "patient" && (
                        <Link
                          to="/patient-profile"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 transition"
                        >
                          <FaVial className="text-primary-600" />
                          ملفي الطبي
                        </Link>
                      )}
                      {user?.userType === "doctor" && (
                        <Link
                          to="/doctor-dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 transition"
                        >
                          <FaTachometerAlt className="text-primary-600" />
                          لوحة التحكم
                        </Link>
                      )}
                      {user?.userType === "pharmacy" && (
                        <Link
                          to="/pharmacy-dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 transition"
                        >
                          <FaTachometerAlt className="text-primary-600" />
                          لوحة التحكم
                        </Link>
                      )}
                      {user?.userType === "company" && (
                        <Link
                          to="/company-dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary-50 transition"
                        >
                          <FaTachometerAlt className="text-primary-600" />
                          لوحة التحكم
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <FaSignOutAlt className="text-red-600" />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  className="flex items-center space-x-3 space-x-reverse"
                  variants={desktopLinkVariants}
                >
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200 font-medium"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    إنشاء حساب
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3 space-x-reverse">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-primary-500 transition-all"
              title="سلة الشراء"
            >
              <FaShoppingCart className="text-lg" />
              {isAuthenticated() && getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-primary-600 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden bg-white/90 backdrop-blur-md border-t shadow-md px-3 py-4 space-y-2 rounded-b-xl"
            >
              <motion.div variants={linkVariants}>
                <Link to="/" className={getLinkClasses("/")}>
                  <FaHome className="ml-2" />
                  الرئيسية
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
              <motion.div variants={linkVariants}>
                <Link to="/doctors" className={getLinkClasses("/doctors")}>
                  <FaSearch className="ml-2" />
                  ابحث عن طبيب
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
              {/* <motion.div variants={linkVariants}>
                <Link
                  to="/my-appointments"
                  className={getLinkClasses("/my-appointments")}
                >
                  <FaCalendarCheck className="ml-2" />
                  مواعيدي
                                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>

                </Link>
              </motion.div> */}
              <motion.div variants={linkVariants}>
                <button
                  onClick={handleMedicineRequestClick}
                  className={getLinkClasses("/prescription-upload")}
                >
                  <FaPrescription className="ml-2" />
                  طلب دواء
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              </motion.div>

              <div className="border-t border-gray-200 my-2"></div>

              <div className="flex flex-col space-y-2">
                {isAuthenticated() ? (
                  <>
                    <motion.div
                      variants={linkVariants}
                      className="flex items-center space-x-2 space-x-reverse px-2 py-2"
                    >
                      <FaUser className="text-primary-600 text-lg" />
                      <span className="text-gray-700 font-medium">
                        {user?.userType === "doctor" && `أهلاً Dr/ ${user?.name?.replace("د. ", "") || user?.email?.split("@")[0]}`}
                        {user?.userType === "pharmacy" && `أهلاً Dr/ ${user?.name?.replace("د. ", "") || user?.email?.split("@")[0]}`}
                        {user?.userType === "company" && `أهلاً Dr/ ${user?.name?.replace("د. ", "") || user?.email?.split("@")[0]}`}
                        {user?.userType === "patient" && `أهلاً، ${user?.name || user?.email?.split("@")[0]}`}
                      </span>
                    </motion.div>

                    {user?.userType === "patient" && (
                      <Link
                        to="/patient-profile"
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-primary-50 transition text-center justify-center"
                      >
                        <FaVial className="text-primary-600" />
                        ملفي الطبي
                      </Link>
                    )}
                    {user?.userType === "doctor" && (
                      <Link
                        to="/doctor-dashboard"
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-primary-50 transition text-center justify-center"
                      >
                        <FaTachometerAlt className="text-primary-600" />
                        لوحة التحكم
                      </Link>
                    )}
                    {user?.userType === "pharmacy" && (
                      <Link
                        to="/pharmacy-dashboard"
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-primary-50 transition text-center justify-center"
                      >
                        <FaTachometerAlt className="text-primary-600" />
                        لوحة التحكم
                      </Link>
                    )}
                    {user?.userType === "company" && (
                      <Link
                        to="/company-dashboard"
                        className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-primary-50 transition text-center justify-center"
                      >
                        <FaTachometerAlt className="text-primary-600" />
                        لوحة التحكم
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition justify-center"
                    >
                      <FaSignOutAlt className="text-red-600" />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <motion.div variants={linkVariants}>
                      <Link
                        to="/login"
                        className="w-full px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition text-center block"
                      >
                        تسجيل الدخول
                      </Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <Link
                        to="/signup"
                        className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 transition shadow-md text-center block"
                      >
                        إنشاء حساب
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
