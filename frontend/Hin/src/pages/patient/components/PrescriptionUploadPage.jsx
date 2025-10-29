import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SimpleNavbar from "../../../components/Layout/SimpleNavbar";
import Footer from "../../../components/Layout/Footer";
import LocationPicker from "../../../components/LocationPicker";
import {
  sendMedicineRequest,
  getPatientRequests,
} from "../../../services/medicineRequestApi";
import { notifyPharmacyNewRequest } from "../../../services/notificationService";
import {
  FaCheck,
  FaPrescriptionBottleAlt,
  FaClock,
  FaFileMedical,
  FaMapMarkerAlt,
  FaPrescription,
  FaTimes,
  FaSearch,
  FaPills,
  FaInfoCircle,
  FaExclamationTriangle,
  FaPaperPlane,
  FaShieldAlt,
  FaListAlt,
  FaSyncAlt,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaMinusCircle,
  FaPhoneAlt,
  FaReply,
  FaCheckDouble,
  FaThumbsUp,
  FaTimesCircle,
  FaUpload,
  FaStar,
  FaRegStar,
  FaRegStarHalf,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../../hooks/useAuth";
import {
  getUserNotifications,
  getUnreadCount,
} from "../../../services/notificationService";
import NotificationsDropdown from "../../../components/Layout/NotificationsDropdown";

// Import the new components
import MedicineUploadSection from "./PrescriptionUpload/MedicineUploadSection";
import ManualMedicineEntrySection from "./PrescriptionUpload/ManualMedicineEntrySection";
import AlternativeOptionsSection from "./PrescriptionUpload/AlternativeOptionsSection";
import OrderTrackingSection from "./PrescriptionUpload/OrderTrackingSection";
import RequestResultSection from "./PrescriptionUpload/RequestResultSection";

// ======================
// Framer Motion Variants
// ======================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // تأخير 0.15 ثانية بين كل عنصر
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const PrescriptionUploadPage = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [medicineText, setMedicineText] = useState("");
  const [alternativeOption, setAlternativeOption] = useState("nearest");
  const [showPreview, setShowPreview] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestResult, setRequestResult] = useState(null);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [showOrderTrackingSection, setShowOrderTrackingSection] =
    useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // ======================
  // Helper Functions
  // ======================

  // Load notifications when component mounts or when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    setIsLoadingNotifications(true);
    try {
      // Get user notifications
      const userNotifications = await getUserNotifications(
        "patient",
        user.phone || user.id
      );
      setNotifications(userNotifications);

      // Get unread count
      const count = await getUnreadCount("patient", user.phone || user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click if needed
    console.log("Notification clicked:", notification);
  };

  const handleGenerateSampleNotifications = async () => {
    // This would typically call a service to generate sample notifications
    // For now, we'll just reload the notifications
    loadNotifications();
  };

  // تحميل الطلبات الأخيرة عند تحميل الصفحة
  useEffect(() => {
    loadRecentOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRecentOrders = async () => {
    try {
      const userPhone =
        patientPhone || localStorage.getItem("userPhone") || "01234567890";
      const orders = await getPatientRequests(userPhone);
      setRecentOrders(orders.slice(0, 5)); // آخر 5 طلبات
      if (orders.length > 0) {
        setShowOrderTrackingSection(true);
      }
    } catch (error) {
      console.error("خطأ في تحميل الطلبات:", error);
    }
  };

  const getOrderStatusInfo = (status) => {
    const statusMap = {
      pending: {
        text: "قيد الانتظار",
        color: "bg-yellow-100 text-yellow-800",
        icon: <FaClock />,
      },
      sent: {
        text: "تم الإرسال",
        color: "bg-blue-100 text-blue-800",
        icon: <FaPaperPlane />,
      },
      responses_received: {
        text: "تم استلام الردود",
        color: "bg-purple-100 text-purple-800",
        icon: <FaReply />,
      },
      accepted: {
        text: "تم القبول",
        color: "bg-green-100 text-green-800",
        icon: <FaCheckCircle />,
      },
      preparing: {
        text: "جاري التجهيز",
        color: "bg-indigo-100 text-indigo-800",
        icon: <FaPills />,
      },
      ready: {
        text: "جاهز للاستلام",
        color: "bg-emerald-100 text-emerald-800",
        icon: <FaCheckDouble />,
      },
      completed: {
        text: "مكتمل",
        color: "bg-gray-100 text-gray-800",
        icon: <FaThumbsUp />,
      },
      rejected: {
        text: "مرفوض",
        color: "bg-red-100 text-red-800",
        icon: <FaTimesCircle />,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  // دالة لمعالجة اختيار الموقع
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  // دالة لاختيار دواء من البحث التلقائي
  const handleMedicineSelect = (medicine) => {
    const isAlreadySelected = selectedMedicines.some(
      (m) => m.id === medicine.id
    );
    if (!isAlreadySelected) {
      setSelectedMedicines((prev) => [...prev, { ...medicine, quantity: 1 }]);
    }
  };

  // دالة لحذف دواء من القائمة
  const removeMedicine = (medicineId) => {
    setSelectedMedicines((prev) => prev.filter((m) => m.id !== medicineId));
  };

  // دالة لتحديث كمية الدواء
  const updateMedicineQuantity = (medicineId, quantity) => {
    setSelectedMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, quantity: parseInt(quantity) || 1 } : m
      )
    );
  };

  // ======================
  // Event Handlers
  // ======================

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setShowPreview(!!file);
  };

  const handleMedicineTextChange = (e) => setMedicineText(e.target.value);
  const handleAlternativeChange = (e) => setAlternativeOption(e.target.value);

  // ======================
  // Form Submission
  // ======================

  // TODO: ربط مع API هنا - POST /api/patient/medicine-requests
  // نوع البيانات المطلوبة: { patientName, patientPhone, medicines, location, alternativeOption, maxDistance }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { requestId, message, targetPharmacies, status }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من البيانات المطلوبة
    if (!patientName.trim()) {
      Swal.fire({ icon: "info", text: "يرجى إدخال اسم المريض" });
      return;
    }

    if (!patientPhone.trim()) {
      Swal.fire({ icon: "info", text: "يرجى إدخال رقم الهاتف" });
      return;
    }

    // التحقق من وجود أدوية مختارة أو نص مكتوب
    if (
      selectedMedicines.length === 0 &&
      !medicineText.trim() &&
      !selectedFile
    ) {
      Swal.fire({
        icon: "info",
        text: "يرجى إضافة أدوية أو رفع صورة الروشتة أو كتابة اسم الدواء",
      });
      return;
    }

    // التحقق من الموقع
    if (!location) {
      Swal.fire({ icon: "info", text: "يرجى تحديد موقعك على الخريطة" });
      return;
    }

    setIsSubmitting(true);

    try {
      // تحضير قائمة الأدوية
      let medicines = [...selectedMedicines];

      // إضافة الأدوية من النص إذا وجدت
      if (medicineText.trim()) {
        const textMedicines = medicineText
          .split("\n")
          .filter((line) => line.trim())
          .map((line, index) => ({
            id: `text-${index}`,
            name: line.trim(),
            quantity: 1,
          }));
        medicines = [...medicines, ...textMedicines];
      }

      // إرسال الطلب للصيدليات القريبة
      const result = await sendMedicineRequest({
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        medicines,
        location,
        alternativeOption,
        maxDistance: 3, // 3 كم كحد أقصى
      });

      setRequestResult(result);
      setRequestSent(true);

      // إظهار رسالة النجاح باستخدام SweetAlert2 مع ستايل مخصص
      Swal.fire({
        title: "تم إرسال الطلب بنجاح!",
        text: "تم استلام طلبك وسيتم البحث عن أفضل الصيدليات المتاحة، برجاء الانتظار لحين الرد...",
        icon: "success",
        confirmButtonText: "موافق",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        customClass: {
          container: "custom-swal-top-notification",
          popup: "custom-swal-success-popup",
          title: "custom-swal-title",
          content: "custom-swal-content",
        },
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      // تحديث قائمة الطلبات
      await loadRecentOrders();
      setShowOrderTrackingSection(true);

      // إرسال إشعارات للصيدليات القريبة
      try {
        const pharmaciesToNotify = result.targetPharmacies || [];
        for (const pharmacy of pharmaciesToNotify) {
          await notifyPharmacyNewRequest(
            pharmacy.id,
            {
              name: patientName.trim(),
              phone: patientPhone.trim(),
              location,
              distance: pharmacy.distanceText,
            },
            {
              medicines,
              requestId: result.requestId,
              alternativeOption,
            }
          );
        }
      } catch (notificationError) {
        console.error("خطأ في إرسال الإشعارات للصيدليات:", notificationError);
        // لا نوقف العملية إذا فشل إرسال الإشعارات
      }

      // Reset form
      setSelectedFile(null);
      setMedicineText("");
      setSelectedMedicines([]);
      setShowPreview(false);
      setShowMedicineSearch(false);
    } catch (error) {
      console.error("خطأ في إرسال الطلب:", error);
      Swal.fire({
        icon: "error",
        text:
          error.message || "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================
  // Render Methods
  // ======================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16">
      {/* Custom CSS for SweetAlert2 notification */}
      <style>{`
        .custom-swal-top-notification {
          z-index: 9999 !important;
          inset: 80px auto auto 50% !important;
          transform: translateX(-50%) !important;
          width: 90% !important;
          max-width: 500px !important;
        }
        
        .custom-swal-success-popup {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7) !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid #bbf7d0 !important;
          padding: 20px !important;
          direction: rtl !important;
        }
        
        .custom-swal-title {
          font-weight: 700 !important;
          font-size: 1.25rem !important;
          color: #166534 !important;
          margin-bottom: 8px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }
        
        .custom-swal-content {
          font-size: 0.95rem !important;
          color: #166534 !important;
          line-height: 1.5 !important;
        }
        
        .swal2-success-ring {
          border: 0.25em solid #4ade80 !important;
        }
        
        .swal2-success-line-tip,
        .swal2-success-line-long {
          background-color: #166534 !important;
        }
        
        .swal2-timer-progress-bar {
          background: #166534 !important;
        }
        
        @media (max-width: 640px) {
          .custom-swal-top-notification {
            inset: 70px 10px auto 10px !important;
            transform: none !important;
            width: calc(100% - 20px) !important;
          }
        }
        
        .modern-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
        }
        
        .modern-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .tab-button {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .tab-button.active {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .tab-button:not(.active) {
          background: rgba(255, 255, 255, 0.7);
          color: #4b5563;
        }
        
        .tab-button:not(.active):hover {
          background: rgba(249, 250, 251, 0.9);
        }
        
        .input-field {
          padding: 14px 16px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          background: #f9fafb;
        }
        
        .input-field:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          background: white;
        }
        
        .upload-area {
          border: 2px dashed #c7d2fe;
          border-radius: 16px;
          background: rgba(238, 242, 255, 0.5);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .upload-area:hover {
          border-color: #4f46e5;
          background: rgba(238, 242, 255, 0.8);
        }
        
        .upload-area.active {
          border-color: #4f46e5;
          background: rgba(238, 242, 255, 0.9);
        }
        
        .medicine-tag {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border-radius: 50px;
          padding: 6px 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }
        
        .action-button {
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .primary-button {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }
        
        .primary-button:active {
          transform: translateY(0);
        }
        
        .secondary-button {
          background: rgba(243, 244, 246, 0.8);
          color: #4b5563;
        }
        
        .secondary-button:hover {
          background: rgba(243, 244, 246, 1);
        }
        
        .option-card {
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .option-card:hover {
          border-color: #4f46e5;
          background: rgba(238, 242, 255, 0.3);
        }
        
        .option-card.selected {
          border-color: #4f46e5;
          background: rgba(238, 242, 255, 0.5);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
        }
        
        .pharmacy-card {
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        
        .pharmacy-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-color: #c7d2fe;
        }
        
        .status-badge {
          padding: 6px 14px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.85rem;
        }
      `}</style>

      <SimpleNavbar
        title="طلب دواء جديد"
        showSearch={false}
        showNotifications={showNotifications}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onGenerateSampleNotifications={handleGenerateSampleNotifications}
      />

      {/* Notifications Dropdown */}
      {showNotifications && (
        <NotificationsDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isLoadingNotifications={isLoadingNotifications}
          onNotificationClick={handleNotificationClick}
          onGenerateSampleNotifications={handleGenerateSampleNotifications}
          onToggleNotifications={() => setShowNotifications(false)}
        />
      )}

      {/* Page Container with entry animation */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            اطلب دواك أونلاين
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احصل على أدويتك من أقرب صيدلية إليك ببضع نقرات فقط.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - How It Works */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="modern-card p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <FaInfoCircle className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    كيف تطلب الدواء؟
                  </h3>
                  <p className="text-gray-600 text-sm">
                    خطوات بسيطة وسهلة لطلب دوائك
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      1. اختر العنوان
                    </h4>
                    <p className="text-gray-600 text-sm">
                      قم باختيار العنوان الذي تريد توصيل الدواء أو المنتج إليه.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-3 p-4 bg-green-50 rounded-xl"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaFileMedical className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      2. ارفع الروشتة
                    </h4>
                    <p className="text-gray-600 text-sm">
                      قم برفع صورة الروشتة أو اكتب طلبك أو اسم المنتج الذي
                      تحتاجه.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaSearch className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">3. البحث</h4>
                    <p className="text-gray-600 text-sm">
                      يقوم تطبيق هيِّن بالبحث في الصيدليات القريبة وإرسال طلبك.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="modern-card p-8">
              {/* Tabs */}
              <div className="flex gap-2 mb-8 border-b pb-4">
                <motion.button
                  className={`tab-button ${
                    activeTab === "upload" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("upload")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUpload className="mr-7" />
                  رفع الروشتة
                </motion.button>
                <motion.button
                  className={`tab-button ${
                    activeTab === "manual" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("manual")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPills className="mr-7" />
                  إضافة يدوياً
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      اسم المريض *
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="أدخل اسم المريض"
                      className="input-field w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>

                {/* Location Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <FaMapMarkerAlt className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      عنوان التوصيل
                    </h2>
                  </div>
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={{ lat: 30.0444, lng: 31.2357 }}
                    showMap={true}
                    showMapToggle={true}
                  />
                </div>

                {/* Medicine Section */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <FaPrescription className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      معلومات الدواء
                    </h2>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "upload" ? (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MedicineUploadSection
                          selectedFile={selectedFile}
                          showPreview={showPreview}
                          handleFileChange={handleFileChange}
                          setSelectedFile={setSelectedFile}
                          setShowPreview={setShowPreview}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="manual"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ManualMedicineEntrySection
                          showMedicineSearch={showMedicineSearch}
                          setShowMedicineSearch={setShowMedicineSearch}
                          handleMedicineSelect={handleMedicineSelect}
                          selectedMedicines={selectedMedicines}
                          updateMedicineQuantity={updateMedicineQuantity}
                          removeMedicine={removeMedicine}
                          medicineText={medicineText}
                          handleMedicineTextChange={handleMedicineTextChange}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Alternative Options */}
                <AlternativeOptionsSection
                  alternativeOption={alternativeOption}
                  setAlternativeOption={setAlternativeOption}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 text-lg transition-all duration-300 shadow-md ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        ></motion.div>
                        <span>جاري إرسال الطلب...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-xl" />
                        <span>إرسال الطلب الآن</span>
                      </>
                    )}
                  </motion.button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-600">
                    <FaShieldAlt />
                    <span>طلبك محمي ومشفر بالكامل</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Request Result Section */}
            <AnimatePresence>
              {requestSent && requestResult && (
                <RequestResultSection
                  requestResult={requestResult}
                  nearbyPharmacies={nearbyPharmacies}
                  setRequestSent={setRequestSent}
                  setRequestResult={setRequestResult}
                  setNearbyPharmacies={setNearbyPharmacies}
                  setPatientName={setPatientName}
                  setPatientPhone={setPatientPhone}
                  setLocation={setLocation}
                  setActiveTab={setActiveTab}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Enhanced Order Tracking Section */}
        <AnimatePresence>
          {showOrderTrackingSection && recentOrders.length > 0 && (
            <OrderTrackingSection
              recentOrders={recentOrders}
              getOrderStatusInfo={getOrderStatusInfo}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrescriptionUploadPage;
