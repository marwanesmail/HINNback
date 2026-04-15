import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaSave,
  FaArrowLeft,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";
import DashboardLayout from "../../components/Layout/DashboardLayout";
// Framer Motion Import
import { motion } from "framer-motion";

const DoctorProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Menu items for sidebar
  const menuItems = [
    {
      id: "dashboard",
      icon: FaTachometerAlt,
      label: "لوحة التحكم",
      path: "/doctor-dashboard",
    },
    {
      id: "profile",
      icon: FaUser,
      label: "الملف الشخصي",
      path: "/doctor/profile",
    },
    // Add other menu items as needed
  ];

  const handleMenuItemClick = (itemId) => {
    if (itemId === "dashboard") {
      navigate("/doctor-dashboard");
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.additionalInfo?.fullName || user.name || "",
        email: user.additionalInfo?.email || user.email || "",
        phone: user.additionalInfo?.phone || "",
        specialization: user.additionalInfo?.specialization || "",
        licenseNumber: user.additionalInfo?.licenseNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: formData.fullName,
      email: formData.email,
      additionalInfo: {
        ...user.additionalInfo,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
      },
    };

    updateUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);

    Swal.fire({
      icon: "success",
      title: "تم حفظ البيانات",
      text: "تم تحديث بياناتك الشخصية بنجاح",
      confirmButtonText: "موافق",
    });
  };

  const handleGoBack = () => {
    navigate("/doctor-dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserMd className="text-4xl text-blue-600 mb-4 mx-auto" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // Prepare profile data for DashboardLayout
  const dashboardProfileData = {
    name: user.name || formData.fullName,
    email: user.email || formData.email,
    description: "طبيب",
    type: "doctor",
  };

  // Framer Motion Variants for a staggered animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2, // Stagger delay for children
        staggerChildren: 0.1, // Delay between each child
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <DashboardLayout
      sidebarItems={menuItems}
      profileData={dashboardProfileData}
      title="الملف الشخصي للطبيب"
      onSectionChange={handleMenuItemClick}
      // Color customization for Doctor Dashboard
      navbarColor="bg-blue-900"
      sidebarColor="bg-blue-800"
      textColor="text-white"
    >
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Framer Motion for the main card container */}
        <motion.div
          className="max-w-4xl mx-auto px-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            variants={itemVariants}
          >
            {/* Header */}
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-6"
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <FaUserMd className="text-white text-3xl ml-4" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      الملف الشخصي
                    </h1>
                    <p className="text-blue-100">معلومات حساب الطبيب</p>
                  </div>
                </div>
                {/* Motion for the back button */}
                <motion.button
                  onClick={handleGoBack}
                  className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="ml-2" />
                  العودة للوحة التحكم
                </motion.button>
              </div>
            </motion.div>

            {/* Profile Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {/* Full Name */}
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isEditing
                            ? "bg-white border-gray-300"
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      />
                      <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isEditing
                            ? "bg-white border-gray-300"
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      />
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      رقم الهاتف
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isEditing
                            ? "bg-white border-gray-300"
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      />
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </motion.div>

                  {/* Specialization */}
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      التخصص
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isEditing
                            ? "bg-white border-gray-300"
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      />
                      <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </motion.div>

                  {/* License Number */}
                  <motion.div variants={itemVariants}>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      رقم الترخيص
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isEditing
                            ? "bg-white border-gray-300"
                            : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}
                      />
                      <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {!isEditing ? (
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      تعديل البيانات
                    </motion.button>
                  ) : (
                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        إلغاء
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaSave className="ml-2" />
                        حفظ التغييرات
                      </motion.button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfilePage;
