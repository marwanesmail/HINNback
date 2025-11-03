import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaHospital,
  FaCalendarAlt,
  FaSave,
  FaUserMd,
  FaStethoscope,
  FaBriefcase,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaDollarSign,
  FaVideo,
  FaClock,
  FaLock,
  FaUnlock,
  FaUsers,
  FaCheckCircle,
  FaTimes,
  FaEdit,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";

const DoctorSettingsSection = ({ updateDoctorData, doctorData }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingClinic, setIsEditingClinic] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "د. أحمد محمد علي",
    specialization: "طب الأطفال",
    yearsOfExperience: "15",
    bio: "طبيب أطفال متخصص في علاج الأمراض المزمنة والعناية المركزة للأطفال. حاصل على البورد الأمريكي في طب الأطفال.",
  });

  // Clinic Info State
  const [clinicInfo, setClinicInfo] = useState({
    clinicName: "عيادة النور للأطفال",
    address: "شارع الجامعة، المعادي، القاهرة",
    phone: "01234567890",
    consultationFee: "300",
    consultationType: "both", // in-person, online, both
    sessionDuration: "30", // minutes
  });

  // Update clinic info when doctorData changes
  useEffect(() => {
    if (doctorData && doctorData.clinicName) {
      setClinicInfo((prev) => ({
        ...prev,
        clinicName: doctorData.clinicName,
      }));
    }
  }, [doctorData]);

  // Schedule State - Date and Time Based
  const timeSlots = [
    "12:00 ص",
    "12:30 ص",
    "01:00 ص",
    "01:30 ص",
    "02:00 ص",
    "02:30 ص",
    "03:00 ص",
    "03:30 ص",
    "04:00 ص",
    "04:30 ص",
    "05:00 ص",
    "05:30 ص",
    "06:00 ص",
    "06:30 ص",
    "07:00 ص",
    "07:30 ص",
    "08:00 ص",
    "08:30 ص",
    "09:00 ص",
    "09:30 ص",
    "10:00 ص",
    "10:30 ص",
    "11:00 ص",
    "11:30 ص",
    "12:00 م",
    "12:30 م",
    "01:00 م",
    "01:30 م",
    "02:00 م",
    "02:30 م",
    "03:00 م",
    "03:30 م",
    "04:00 م",
    "04:30 م",
    "05:00 م",
    "05:30 م",
    "06:00 م",
    "06:30 م",
    "07:00 م",
    "07:30 م",
    "08:00 م",
    "08:30 م",
    "09:00 م",
    "09:30 م",
    "10:00 م",
    "10:30 م",
    "11:00 م",
    "11:30 م",
  ];

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Handle Personal Info Change
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Clinic Info Change
  const handleClinicInfoChange = (field, value) => {
    setClinicInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Format date to Arabic
  const formatDateToArabic = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("ar-EG", options);
  };

  // Calculate work duration in hours
  const calculateWorkDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";

    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    const slots = endIndex - startIndex;

    if (slots <= 0) return "-";

    const hours = Math.floor(slots / 2);
    const minutes = (slots % 2) * 30;

    if (minutes === 0) {
      return `${hours} ساعة`;
    }
    return `${hours} ساعة و ${minutes} دقيقة`;
  };

  // Add new appointment slot
  const addAppointmentSlot = () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "الرجاء اختيار التاريخ ووقت البداية والنهاية",
      });
      return;
    }

    // Validate end time is after start time
    const startIndex = timeSlots.indexOf(selectedStartTime);
    const endIndex = timeSlots.indexOf(selectedEndTime);

    if (endIndex <= startIndex) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "وقت النهاية يجب أن يكون بعد وقت البداية",
      });
      return;
    }

    // Check if this date already exists
    const exists = appointments.some((apt) => apt.date === selectedDate);

    if (exists) {
      Swal.fire({
        icon: "error",
        title: "تنبيه",
        text: "هذا التاريخ موجود بالفعل",
      });
      return;
    }

    const newAppointment = {
      id: Date.now(),
      date: selectedDate,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      available: true,
    };

    setAppointments([...appointments, newAppointment]);
    setSelectedDate("");
    setSelectedStartTime("");
    setSelectedEndTime("");
    setShowAddForm(false);

    Swal.fire({
      icon: "success",
      title: "تم بنجاح",
      text: "تم إضافة الموعد",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Remove appointment slot
  const removeAppointmentSlot = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف هذا الموعد",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        setAppointments(appointments.filter((apt) => apt.id !== id));
        Swal.fire({
          icon: "success",
          title: "تم الحذف",
          text: "تم حذف الموعد بنجاح",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Toggle appointment availability
  const toggleAppointmentAvailability = (id) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, available: !apt.available } : apt
      )
    );
  };

  // Update appointment time range
  const updateAppointmentTime = (id, field, value) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, [field]: value } : apt
      )
    );
  };

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Save Personal Info
  const savePersonalInfo = async () => {
    setIsSaving(true);

    // Validate
    if (!personalInfo.fullName || !personalInfo.specialization) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "الرجاء ملء جميع الحقول المطلوبة",
      });
      setIsSaving(false);
      return;
    }

    // TODO: API call here
    setTimeout(() => {
      setIsSaving(false);
      setIsEditingPersonal(false);
      Swal.fire({
        icon: "success",
        title: "تم الحفظ بنجاح",
        text: "تم حفظ معلوماتك الشخصية",
        confirmButtonText: "موافق",
      });
    }, 1500);
  };

  // Save Clinic Info
  const saveClinicInfo = async () => {
    setIsSaving(true);

    // Validate
    if (!clinicInfo.clinicName || !clinicInfo.address) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "الرجاء ملء جميع الحقول المطلوبة",
      });
      setIsSaving(false);
      return;
    }

    // TODO: API call here
    setTimeout(() => {
      // Update doctor data with new clinic name
      if (updateDoctorData) {
        updateDoctorData({ clinicName: clinicInfo.clinicName });
      }

      setIsSaving(false);
      setIsEditingClinic(false);
      Swal.fire({
        icon: "success",
        title: "تم الحفظ بنجاح",
        text: "تم حفظ معلومات العيادة",
        confirmButtonText: "موافق",
      });
    }, 1500);
  };

  // Save Schedule
  const saveSchedule = async () => {
    setIsSaving(true);

    // TODO: API call here
    setTimeout(() => {
      setIsSaving(false);
      Swal.fire({
        icon: "success",
        title: "تم الحفظ بنجاح",
        text: "تم حفظ جدول المواعيد",
        confirmButtonText: "موافق",
      });
    }, 1500);
  };

  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row border-b border-gray-200">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium transition-all duration-200 ${
              activeTab === "personal"
                ? "text-blue-600 border-b-2 sm:border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FaUser className="text-base sm:text-lg" />
            <span className="text-sm sm:text-base">المعلومات الشخصية</span>
          </button>
          <button
            onClick={() => setActiveTab("clinic")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium transition-all duration-200 ${
              activeTab === "clinic"
                ? "text-green-600 border-b-2 sm:border-b-2 border-green-600 bg-green-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FaHospital className="text-base sm:text-lg" />
            <span className="text-sm sm:text-base">معلومات العيادة</span>
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium transition-all duration-200 ${
              activeTab === "schedule"
                ? "text-purple-600 border-b-2 sm:border-b-2 border-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FaCalendarAlt className="text-base sm:text-lg" />
            <span className="text-sm sm:text-base">إدارة المواعيد</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={tabContentVariants}
      >
        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUserMd className="text-blue-600 text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  المعلومات الشخصية
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  إدارة معلوماتك الشخصية والمهنية
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaUser className="text-gray-500" />
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) =>
                    handlePersonalInfoChange("fullName", e.target.value)
                  }
                  disabled={!isEditingPersonal}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isEditingPersonal
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaStethoscope className="text-gray-500" />
                  التخصص <span className="text-red-500">*</span>
                </label>
                <select
                  value={personalInfo.specialization}
                  onChange={(e) =>
                    handlePersonalInfoChange("specialization", e.target.value)
                  }
                  disabled={!isEditingPersonal}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isEditingPersonal
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <option value="طب الأطفال">طب الأطفال</option>
                  <option value="طب الباطنة">طب الباطنة</option>
                  <option value="طب العيون">طب العيون</option>
                  <option value="طب الأسنان">طب الأسنان</option>
                  <option value="طب النساء والتوليد">طب النساء والتوليد</option>
                  <option value="الجراحة العامة">الجراحة العامة</option>
                  <option value="طب القلب">طب القلب</option>
                  <option value="طب الأنف والأذن والحنجرة">
                    طب الأنف والأذن والحنجرة
                  </option>
                  <option value="الطب النفسي">الطب النفسي</option>
                  <option value="طب الجلدية">طب الجلدية</option>
                </select>
              </div>

              {/* Years of Experience */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaBriefcase className="text-gray-500" />
                  عدد سنوات الخبرة
                </label>
                <input
                  type="number"
                  value={personalInfo.yearsOfExperience}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "yearsOfExperience",
                      e.target.value
                    )
                  }
                  disabled={!isEditingPersonal}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isEditingPersonal
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="أدخل عدد السنوات"
                  min="0"
                  max="50"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaInfoCircle className="text-gray-500" />
                  نبذة شخصية
                </label>
                <textarea
                  value={personalInfo.bio}
                  onChange={(e) =>
                    handlePersonalInfoChange("bio", e.target.value)
                  }
                  disabled={!isEditingPersonal}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isEditingPersonal
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  rows="4"
                  placeholder="اكتب نبذة مختصرة عنك وعن خبراتك..."
                  maxLength="500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {personalInfo.bio.length} / 500 حرف
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              {!isEditingPersonal ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditingPersonal(true)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md text-sm sm:text-base"
                >
                  <FaUser />
                  تعديل البيانات
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditingPersonal(false)}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={savePersonalInfo}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 text-sm sm:text-base"
                  >
                    <FaSave />
                    <span className="hidden sm:inline">
                      {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </span>
                    <span className="inline sm:hidden">
                      {isSaving ? "جاري..." : "حفظ"}
                    </span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Clinic Info Tab */}
        {activeTab === "clinic" && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaHospital className="text-green-600 text-lg sm:text-xl" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  معلومات العيادة
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  إدارة تفاصيل عيادتك
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Clinic Name */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaHospital className="text-gray-500" />
                  اسم العيادة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clinicInfo.clinicName}
                  onChange={(e) =>
                    handleClinicInfoChange("clinicName", e.target.value)
                  }
                  disabled={!isEditingClinic}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    isEditingClinic
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="أدخل اسم العيادة"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaMapMarkerAlt className="text-gray-500" />
                  العنوان <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clinicInfo.address}
                  onChange={(e) =>
                    handleClinicInfoChange("address", e.target.value)
                  }
                  disabled={!isEditingClinic}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    isEditingClinic
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="أدخل عنوان العيادة"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaPhone className="text-gray-500" />
                  رقم التواصل
                </label>
                <input
                  type="tel"
                  value={clinicInfo.phone}
                  onChange={(e) =>
                    handleClinicInfoChange("phone", e.target.value)
                  }
                  disabled={!isEditingClinic}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    isEditingClinic
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="01xxxxxxxxx"
                />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaDollarSign className="text-gray-500" />
                  سعر الكشف (جنيه مصري)
                </label>
                <input
                  type="number"
                  value={clinicInfo.consultationFee}
                  onChange={(e) =>
                    handleClinicInfoChange("consultationFee", e.target.value)
                  }
                  disabled={!isEditingClinic}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    isEditingClinic
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Consultation Type */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaVideo className="text-gray-500" />
                  نوع الكشف
                </label>
                <select
                  value={clinicInfo.consultationType}
                  onChange={(e) =>
                    handleClinicInfoChange("consultationType", e.target.value)
                  }
                  disabled={!isEditingClinic}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    isEditingClinic
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <option value="in-person">حضوري فقط</option>
                  <option value="online">أونلاين فقط</option>
                  <option value="both">حضوري وأونلاين</option>
                </select>
              </div>

              {/* Session Duration */}
              <div>
                <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                  <FaClock className="text-gray-500" />
                  مدة الجلسة (دقيقة)
                </label>
                <select
                  value={clinicInfo.sessionDuration}
                  onChange={(e) =>
                    handleClinicInfoChange("sessionDuration", e.target.value)
                  }
                  disabled={!isEditingClinic}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    isEditingClinic
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <option value="15">15 دقيقة</option>
                  <option value="20">20 دقيقة</option>
                  <option value="30">30 دقيقة</option>
                  <option value="45">45 دقيقة</option>
                  <option value="60">60 دقيقة</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              {!isEditingClinic ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditingClinic(true)}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md text-sm sm:text-base"
                >
                  <FaHospital />
                  تعديل البيانات
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditingClinic(false)}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveClinicInfo}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md disabled:opacity-50 text-sm sm:text-base"
                  >
                    <FaSave />
                    <span className="hidden sm:inline">
                      {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </span>
                    <span className="inline sm:hidden">
                      {isSaving ? "جاري..." : "حفظ"}
                    </span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Schedule Management Tab */}
        {activeTab === "schedule" && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-purple-600 text-lg sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    إدارة المواعيد
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    أضف مواعيدك المتاحة بالتاريخ والوقت
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                <FaPlus />
                <span className="hidden sm:inline">إضافة موعد جديد</span>
                <span className="inline sm:hidden">إضافة موعد</span>
              </button>
            </div>

            {/* Add Appointment Form */}
            {showAddForm && (
              <div className="mb-6 p-4 sm:p-6 bg-purple-50 border border-purple-300 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <FaCalendarAlt className="text-purple-600" />
                      <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg">
                        اختر التاريخ
                      </span>
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getTodayDate()}
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    />
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <FaClock className="text-green-600" />
                      <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg">
                        من
                      </span>
                    </label>
                    <select
                      value={selectedStartTime}
                      onChange={(e) => setSelectedStartTime(e.target.value)}
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    >
                      <option value="">-- اختر البداية --</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <FaClock className="text-green-600" />
                      <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-lg">
                        إلى
                      </span>
                    </label>
                    <select
                      value={selectedEndTime}
                      onChange={(e) => setSelectedEndTime(e.target.value)}
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    >
                      <option value="">-- اختر النهاية --</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedStartTime && selectedEndTime && (
                  <div className="mb-4 flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-lg">
                    <FaClock className="text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-900">
                      مدة العمل:{" "}
                      {calculateWorkDuration(
                        selectedStartTime,
                        selectedEndTime
                      )}
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedDate("");
                      setSelectedStartTime("");
                      setSelectedEndTime("");
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  >
                    <FaTimes />
                    إلغاء
                  </button>
                  <button
                    onClick={addAppointmentSlot}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  >
                    <FaPlus />
                    إضافة
                  </button>
                </div>
              </div>
            )}

            {/* Appointments List */}
            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  لا توجد مواعيد متاحة
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  اضغط على "إضافة موعد جديد" لإضافة مواعيدك
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`border rounded-lg transition-all duration-200 ${
                      apt.available
                        ? "border-purple-300 bg-gradient-to-r from-purple-50 to-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="p-3 sm:p-4">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                          {/* Enable/Disable Toggle */}
                          <input
                            type="checkbox"
                            checked={apt.available}
                            onChange={() =>
                              toggleAppointmentAvailability(apt.id)
                            }
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer flex-shrink-0"
                          />

                          {/* Date Display */}
                          <div
                            className={`font-bold text-base sm:text-lg flex-1 lg:min-w-[200px] xl:min-w-[250px] ${
                              apt.available
                                ? "text-purple-900"
                                : "text-gray-400"
                            }`}
                          >
                            {formatDateToArabic(apt.date)}
                          </div>
                        </div>

                        {/* Working Hours - Only show if enabled */}
                        {apt.available && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 w-full lg:w-auto">
                            {/* Start Time */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                                من:
                              </label>
                              <select
                                value={apt.startTime}
                                onChange={(e) =>
                                  updateAppointmentTime(
                                    apt.id,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm sm:text-base flex-1 sm:flex-initial"
                              >
                                {timeSlots.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Arrow */}
                            <span className="text-purple-400 font-bold hidden sm:inline">
                              →
                            </span>

                            {/* End Time */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                                إلى:
                              </label>
                              <select
                                value={apt.endTime}
                                onChange={(e) =>
                                  updateAppointmentTime(
                                    apt.id,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm sm:text-base flex-1 sm:flex-initial"
                              >
                                {timeSlots.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Working Hours Display */}
                            <div className="flex items-center gap-2 bg-purple-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg w-full sm:w-auto">
                              <FaClock className="text-purple-600 text-sm" />
                              <span className="text-xs sm:text-sm font-semibold text-purple-900">
                                <span className="hidden sm:inline">
                                  مدة العمل:{" "}
                                </span>
                                {calculateWorkDuration(
                                  apt.startTime,
                                  apt.endTime
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Off Day Message */}
                        {!apt.available && (
                          <span className="text-gray-400 text-sm">إجازة</span>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => removeAppointmentSlot(apt.id)}
                          className="lg:mr-auto p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                          <FaTrash />
                          <span className="sm:hidden">حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Save Button */}
            {appointments.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveSchedule}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                >
                  <FaCheckCircle />
                  {isSaving ? "جاري الحفظ..." : "حفظ المواعيد"}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorSettingsSection;
