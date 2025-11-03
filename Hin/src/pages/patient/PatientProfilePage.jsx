import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPills,
  FaTint,
  FaIdCard,
  FaSave,
  FaArrowLeft,
  FaTachometerAlt,
  FaFileMedical,
  FaHistory,
  FaPrescription,
  FaCalendarCheck,
  FaComments,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  getUserNotifications,
  markNotificationAsRead,
  getUnreadCount,
  simulatePatientNotifications,
} from "../../services/notificationService";
import {
  getOrCreateChat,
  sendTestMessageToPatient,
} from "../../services/chatService";
import ChatPage from "../ChatPage";
import PatientAppointmentsPage from "./components/PatientAppointmentsPage";
import { USER_TYPES } from "../../services/chatService";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { motion } from "framer-motion";

import PatientDashboardSection from "./components/PatientDashboardSection";
import PatientMedicalFileSection from "./components/PatientMedicalFileSection";
import PlaceholderSection from "./components/PlaceholderSection";
import PatientMedicalHistorySection from "./components/PatientMedicalHistorySection";
import { useAuth } from "../../hooks/useAuth";
import {
  searchInElement,
  removeHighlights,
  highlightSearchTerms,
} from "../../utils/dashboardSearch";

const PatientProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);

  // Check if the current path is the dedicated profile page
  const isProfilePage = location.pathname === "/patient/profile-page";

  const [activeSection, setActiveSection] = useState(
    isProfilePage ? "profile" : "dashboard"
  );
  const [patientData, setPatientData] = useState(null);
  const [medicalFile, setMedicalFile] = useState(null);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [editedMedicalData, setEditedMedicalData] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
    bloodType: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const generateSampleNotifications = useCallback(async () => {
    try {
      await simulatePatientNotifications("01234567890");
      setTimeout(() => {
        loadNotifications();
        loadUnreadCount();
      }, 1000);
    } catch (error) {
      console.error("خطأ في إنشاء الإشعارات التجريبية:", error);
    }
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const basicInfo = localStorage.getItem("patientBasicInfo");
      const medicalInfo = localStorage.getItem("patientMedicalFile");
      if (basicInfo) {
        const parsedBasicInfo = JSON.parse(basicInfo);
        setPatientData(parsedBasicInfo);
        setProfileData({
          fullName: parsedBasicInfo.name || parsedBasicInfo.fullName || "",
          email: parsedBasicInfo.email || "",
          phone: parsedBasicInfo.phone || "",
          birthdate: parsedBasicInfo.birthdate || "",
          gender: parsedBasicInfo.gender || "",
          bloodType: parsedBasicInfo.bloodType || "",
        });
      } else {
        const dummyPatientData = {
          id: "patient-123",
          fullName: "أحمد محمد علي",
          name: "أحمد محمد علي",
          email: "ahmed@example.com",
          phone: "01234567890",
          birthdate: "1990-05-15",
          gender: "male",
          bloodType: "O+",
          age: 33,
          address: "القاهرة، مصر",
        };
        setPatientData(dummyPatientData);
        setProfileData({
          fullName: dummyPatientData.fullName,
          email: dummyPatientData.email,
          phone: dummyPatientData.phone,
          birthdate: dummyPatientData.birthdate,
          gender: dummyPatientData.gender,
          bloodType: dummyPatientData.bloodType,
        });
      }
      if (medicalInfo) {
        const medical = JSON.parse(medicalInfo);
        setMedicalFile(medical);
        setEditedMedicalData(medical);
      } else {
        const defaultMedical = {
          age: 33,
          gender: "male",
          weight: 75,
          height: 175,
          bloodType: "O+",
          chronicDiseases: "الضغط والسكري",
          currentMedications: "ميتفورمين 500mg - مرتين يومياً",
          allergies: "حساسية من البنسلين",
          lastVisit: "2024-01-15",
          nextAppointment: "2024-02-15",
        };
        setMedicalFile(defaultMedical);
        setEditedMedicalData(defaultMedical);
      }
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError(
        "حدث خطأ أثناء تحميل بيانات الملف الطبي. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  useEffect(() => {
    if (patientData) {
      loadNotifications();
      loadUnreadCount();
      const hasGeneratedNotifications = localStorage.getItem(
        "hasGeneratedNotifications"
      );
      if (!hasGeneratedNotifications) {
        generateSampleNotifications();
        localStorage.setItem("hasGeneratedNotifications", "true");
      }
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [patientData, generateSampleNotifications]);

  useEffect(() => {
    const handleDashboardSearch = (e) => {
      const query = e.detail.query;
      if (contentRef.current) {
        removeHighlights(contentRef.current);
        if (query) {
          const results = searchInElement(contentRef.current, query);
          highlightSearchTerms(contentRef.current, query);
          window.dispatchEvent(
            new CustomEvent("dashboardSearchResults", {
              detail: { results },
            })
          );
        } else {
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
  }, [highlightSearchTerms, removeHighlights, searchInElement]);

  const loadNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const userNotifications = await getUserNotifications(
        "patient",
        "01234567890"
      );
      setNotifications(userNotifications);
    } catch (error) {
      console.error("خطأ في تحميل الإشعارات:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount("patient", "01234567890");
      setUnreadCount(count);
    } catch (error) {
      console.error("خطأ في تحميل عدد الإشعارات:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("خطأ في تحديد الإشعار كمقروء:", error);
      }
    }
    if (notification.actionType === "open_chat" && notification.actionData) {
      await openChatFromNotification(notification.actionData);
    } else if (
      notification.type === "medicine_available" ||
      notification.type === "medicine_unavailable"
    ) {
      window.open(
        `#/contact/pharmacy/${notification.data.pharmacyId}`,
        "_blank"
      );
    } else if (
      notification.type === "appointment_confirmed" ||
      notification.type === "doctor_note" ||
      notification.type === "appointment_reminder" ||
      notification.type === "test_results" ||
      notification.type === "appointment_rescheduled"
    ) {
      window.open(`#/contact/doctor/${notification.data.doctorId}`, "_blank");
    }
    setShowNotifications(false);
  };

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const openChatFromNotification = async (actionData) => {
    try {
      const { participantId, participantType, participantName } = actionData;
      const currentUser = {
        id: patientData?.phone || "01234567890",
        type: "patient",
        name: patientData?.fullName || "المريض",
      };
      const otherParticipant = {
        id: participantId,
        type: participantType,
        name: participantName,
      };
      await getOrCreateChat(currentUser, otherParticipant);
      setActiveSection("chats");
      setShowNotifications(false);
    } catch (error) {
      console.error("خطأ في فتح المحادثة:", error);
    }
  };

  const testChatNotifications = async () => {
    try {
      await sendTestMessageToPatient();
      setTimeout(() => {
        loadNotifications();
        loadUnreadCount();
      }, 1000);
      Swal.fire({
        icon: "success",
        text: "تم إرسال رسالة تجريبية! تحقق من الإشعارات.",
      });
    } catch (error) {
      console.error("خطأ في إرسال الرسالة التجريبية:", error);
      Swal.fire({ icon: "error", text: "حدث خطأ في إرسال الرسالة التجريبية" });
    }
  };

  const handleMedicalDataChange = (field, value) => {
    setEditedMedicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveMedicalData = () => {
    setMedicalFile(editedMedicalData);
    localStorage.setItem(
      "patientMedicalFile",
      JSON.stringify(editedMedicalData)
    );
    setIsEditingMedical(false);
    Swal.fire({ icon: "success", text: "تم حفظ البيانات الطبية بنجاح!" });
  };

  const cancelEdit = () => {
    setEditedMedicalData(medicalFile);
    setIsEditingMedical(false);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfileData = () => {
    const updatedPatientData = {
      ...patientData,
      name: profileData.fullName,
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      birthdate: profileData.birthdate,
      gender: profileData.gender,
      bloodType: profileData.bloodType,
    };
    setPatientData(updatedPatientData);
    localStorage.setItem(
      "patientBasicInfo",
      JSON.stringify(updatedPatientData)
    );
    if (user) {
      const updatedUser = {
        ...user,
        name: profileData.fullName,
        email: profileData.email,
        additionalInfo: {
          ...user.additionalInfo,
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          birthdate: profileData.birthdate,
          gender: profileData.gender,
          bloodType: profileData.bloodType,
        },
      };
      updateUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setIsEditingProfile(false);
    Swal.fire({
      icon: "success",
      title: "تم حفظ البيانات",
      text: "تم تحديث بياناتك الشخصية بنجاح",
      confirmButtonText: "موافق",
    });
  };

  const handleSectionChange = (sectionId) => {
    // Navigate only if the user is on a different page.
    // Otherwise, just set the active section state.
    if (location.pathname === "/patient/profile-page") {
      navigate("/patient-profile");
    }
    setActiveSection(sectionId);
  };

  const handleGoBack = () => {
    navigate("/patient-profile");
  };

  const handleProfileDropdownClick = () => {
    navigate("/patient/profile-page");
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: FaTachometerAlt,
      label: "لوحة التحكم",
    },
    {
      id: "medical-file",
      icon: FaFileMedical,
      label: "الملف الطبي",
    },
    {
      id: "medical-history",
      icon: FaHistory,
      label: "السجل الطبي",
    },
    {
      id: "current-prescriptions",
      icon: FaPrescription,
      label: "الروشتات الحالية",
    },
    {
      id: "dispensed-medications",
      icon: FaPills,
      label: "الأدوية المصروفة",
    },
    {
      id: "appointments",
      icon: FaCalendarCheck,
      label: "مواعيدي",
    },
    {
      id: "chats",
      icon: FaComments,
      label: "المحادثات",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            خطأ في التحميل
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPatientData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const dashboardProfileData = {
    name: patientData.fullName,
    email: patientData.email,
    // description: "مريض",
    type: "patient",
  };

  return (
    <div ref={contentRef} className="min-h-screen bg-gray-50">
      <DashboardLayout
        sidebarItems={menuItems}
        profileData={dashboardProfileData}
        title={isProfilePage ? "الملف الشخصي للمريض" : "لوحة تحكم المريض"}
        onSectionChange={handleSectionChange}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onToggleNotifications={handleToggleNotifications}
        showNotifications={showNotifications}
        onGenerateSampleNotifications={generateSampleNotifications}
        onProfileDropdownClick={handleProfileDropdownClick}
        activeSection={activeSection}
        // Color customization for Patient Dashboard
        navbarColor="bg-purple-900"
        sidebarColor="bg-purple-800"
        textColor="text-white"
      >
         {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {activeSection === "dashboard" && "لوحة التحكم"}
                      {activeSection === "medical-file" && "الملف الطبي"}
                      {activeSection === "medical-history" && "السجل الطبي"}
                      {activeSection === "current-prescriptions" && "الروشتات الحالية"}
                      {activeSection === "dispensed-medications" && "الأدوية المصروفة"}
                      {activeSection === "appointments" && "مواعيدي"}
                      {activeSection === "chats" && "المحادثات"}
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
           
        {isProfilePage ? (
          <div className="p-6">
            <motion.div
              className="max-w-4xl mx-auto px-4"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 p-6"
                  variants={itemVariants}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <FaUser className="text-white text-3xl ml-4" />
                      <div>
                        <h1 className="text-2xl font-bold text-white">
                          الملف الشخصي
                        </h1>
                        <p className="text-blue-100">معلومات حساب المريض</p>
                      </div>
                    </div>
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
                <div className="p-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveProfileData();
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          الاسم الكامل
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditingProfile
                                ? "bg-white border-gray-300"
                                : "bg-gray-100 border-gray-200 text-gray-600"
                            }`}
                          />
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          البريد الإلكتروني
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditingProfile
                                ? "bg-white border-gray-300"
                                : "bg-gray-100 border-gray-200 text-gray-600"
                            }`}
                          />
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          رقم الهاتف
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditingProfile
                                ? "bg-white border-gray-300"
                                : "bg-gray-100 border-gray-200 text-gray-600"
                            }`}
                          />
                          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          تاريخ الميلاد
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="birthdate"
                            value={profileData.birthdate}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditingProfile
                                ? "bg-white border-gray-300"
                                : "bg-gray-100 border-gray-200 text-gray-600"
                            }`}
                          />
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          النوع
                        </label>
                        <div className="relative">
                          <select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditingProfile
                                ? "bg-white border-gray-300"
                                : "bg-gray-100 border-gray-200 text-gray-600"
                            }`}
                          >
                            <option value="">اختر النوع</option>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                          </select>
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          فصيلة الدم
                        </label>
                        <div className="relative">
                          <select
                            name="bloodType"
                            value={profileData.bloodType}
                            onChange={handleProfileChange}
                            disabled={!isEditingProfile}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isEditingProfile
                                ? "bg-white border-gray-300"
                                : "bg-gray-100 border-gray-200 text-gray-600"
                            }`}
                          >
                            <option value="">اختر فصيلة الدم</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                          <FaTint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </motion.div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {!isEditingProfile ? (
                        <motion.button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
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
                            onClick={() => {
                              const basicInfo =
                                localStorage.getItem("patientBasicInfo");
                              if (basicInfo) {
                                const parsedBasicInfo = JSON.parse(basicInfo);
                                setProfileData({
                                  fullName:
                                    parsedBasicInfo.name ||
                                    parsedBasicInfo.fullName ||
                                    "",
                                  email: parsedBasicInfo.email || "",
                                  phone: parsedBasicInfo.phone || "",
                                  birthdate: parsedBasicInfo.birthdate || "",
                                  gender: parsedBasicInfo.gender || "",
                                  bloodType: parsedBasicInfo.bloodType || "",
                                });
                              }
                              setIsEditingProfile(false);
                            }}
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
              </div>
            </motion.div>
          </div>
        ) : (
          <main className="p-6">
            {activeSection === "dashboard" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <PatientDashboardSection
                  patientData={patientData}
                  medicalFile={medicalFile}
                  setActiveSection={setActiveSection}
                  testChatNotifications={testChatNotifications}
                />
              </motion.div>
            )}
            {activeSection === "medical-file" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <PatientMedicalFileSection
                  patientData={patientData}
                  medicalFile={medicalFile}
                  isEditingMedical={isEditingMedical}
                  editedMedicalData={editedMedicalData}
                  setIsEditingMedical={setIsEditingMedical}
                  handleMedicalDataChange={handleMedicalDataChange}
                  saveMedicalData={saveMedicalData}
                  cancelEdit={cancelEdit}
                />
              </motion.div>
            )}
            {activeSection === "medical-history" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <PatientMedicalHistorySection />
              </motion.div>
            )}
            {activeSection === "current-prescriptions" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <PlaceholderSection
                  icon={FaPrescription}
                  title="الروشتات الحالية"
                />
              </motion.div>
            )}
            {activeSection === "dispensed-medications" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <PlaceholderSection icon={FaPills} title="الأدوية المصروفة" />
              </motion.div>
            )}
            {activeSection === "appointments" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <PatientAppointmentsPage />
              </motion.div>
            )}
            {activeSection === "chats" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="h-[calc(100vh-12rem)]"
              >
                <ChatPage
                  userType={USER_TYPES.PATIENT}
                  userId={patientData.phone}
                />
              </motion.div>
            )}
          </main>
        )}
      </DashboardLayout>
    </div>
  );
};

export default PatientProfilePage;
