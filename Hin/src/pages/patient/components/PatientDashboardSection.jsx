import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaBirthdayCake,
  FaTint,
  FaWeight,
  FaRuler,
  FaPrescription,
  FaExclamationTriangle,
  FaHeartbeat,
  FaExclamationCircle,
  FaFileMedical,
  FaCalendarCheck,
  FaComments,
  FaUserMd,
  FaPills,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const PatientDashboardSection = ({
  patientData,
  medicalFile,
  setActiveSection,
  testChatNotifications,
}) => {
  const [stats, setStats] = useState({
    activePrescriptions: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    currentMedications: 0,
    bmi: 0,
    bmiStatus: '',
  });

  useEffect(() => {
    // Calculate BMI if height and weight are available
    let bmi = 0;
    let bmiStatus = '';
    if (medicalFile.height && medicalFile.weight) {
      const heightInMeters = medicalFile.height / 100;
      bmi = (medicalFile.weight / (heightInMeters * heightInMeters)).toFixed(1);
      
      if (bmi < 18.5) bmiStatus = 'نحيف';
      else if (bmi < 25) bmiStatus = 'طبيعي';
      else if (bmi < 30) bmiStatus = 'وزن زائد';
      else bmiStatus = 'سمنة';
    }

    // Simulated statistics - in production, these would come from API
    setStats({
      activePrescriptions: 2,
      upcomingAppointments: 1,
      completedAppointments: 8,
      currentMedications: 3,
      bmi: bmi,
      bmiStatus: bmiStatus,
    });
  }, [medicalFile]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const alertItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl p-6 text-gray-900"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              مرحباً، {patientData.fullName}
            </h2>
            <p className="text-black">نتمنى لك دوام الصحة والعافية</p>
          </div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
            className="hidden md:block"
          >
            <FaHeart className="text-6xl text-blue-200" />
          </motion.div>
        </div>
      </motion.div>

      {/* Health Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">العمر</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {medicalFile.age}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <FaBirthdayCake className="text-blue-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-4 font-medium">سنة</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">فصيلة الدم</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {medicalFile.bloodType || "غير محدد"}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
              <FaTint className="text-red-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-4 font-medium">فصيلة الدم</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">الوزن</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {medicalFile.weight || "--"}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <FaWeight className="text-green-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 font-medium">كيلوجرام</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-6 border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">الطول</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {medicalFile.height || "--"}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <FaRuler className="text-orange-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-4 font-medium">سنتيمتر</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">
                مؤشر الكتلة
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {stats.bmi || "--"}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <FaHeartbeat className="text-purple-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-4 font-medium">{stats.bmiStatus || "BMI"}</p>
        </motion.div>
      </motion.div>

      {/* Medical Activities Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm p-6 border border-indigo-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">
                الروشتات النشطة
              </p>
              <p className="text-3xl font-bold text-indigo-900 mt-2">
                {stats.activePrescriptions}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center">
              <FaPrescription className="text-indigo-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-indigo-600 mt-4 font-medium">روشتة سارية</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-sm p-6 border border-teal-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">
                الأدوية الحالية
              </p>
              <p className="text-3xl font-bold text-teal-900 mt-2">
                {stats.currentMedications}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-200 rounded-lg flex items-center justify-center">
              <FaPills className="text-teal-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-teal-600 mt-4 font-medium">دواء نشط</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl shadow-sm p-6 border border-cyan-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-700">
                مواعيد قادمة
              </p>
              <p className="text-3xl font-bold text-cyan-900 mt-2">
                {stats.upcomingAppointments}
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-200 rounded-lg flex items-center justify-center">
              <FaClock className="text-cyan-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-cyan-600 mt-4 font-medium">موعد محجوز</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm p-6 border border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                مواعيد مكتملة
              </p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {stats.completedAppointments}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-emerald-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-emerald-600 mt-4 font-medium">زيارة مسبقة</p>
        </motion.div>
      </motion.div>

      {/* Medical Alerts */}
      {(medicalFile.chronicDiseases || medicalFile.allergies) && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaExclamationTriangle className="text-yellow-500 ml-2" />
              تنبيهات طبية مهمة
            </h3>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-4"
          >
            {medicalFile.chronicDiseases && (
              <motion.div
                variants={alertItemVariants}
                className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <FaHeartbeat className="text-yellow-600 mt-1 ml-3" />
                <div>
                  <h4 className="font-medium text-yellow-900">
                    الأمراض المزمنة
                  </h4>
                  <p className="text-yellow-800 mt-1">
                    {medicalFile.chronicDiseases}
                  </p>
                </div>
              </motion.div>
            )}
            {medicalFile.allergies && (
              <motion.div
                variants={alertItemVariants}
                className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <FaExclamationCircle className="text-red-600 mt-1 ml-3" />
                <div>
                  <h4 className="font-medium text-red-900">الحساسية</h4>
                  <p className="text-red-800 mt-1">{medicalFile.allergies}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h3>
        </div>
        <div className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection("medical-file")}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-center"
            >
              <FaFileMedical className="text-blue-600 text-2xl mb-2 mx-auto" />
              <p className="font-medium text-gray-900">عرض الملف الطبي</p>
            </motion.button>
            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection("current-prescriptions")}
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200 text-center"
            >
              <FaPrescription className="text-green-600 text-2xl mb-2 mx-auto" />
              <p className="font-medium text-gray-900">الروشتات الحالية</p>
            </motion.button>
            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection("appointments")}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200 text-center"
            >
              <FaCalendarCheck className="text-purple-600 text-2xl mb-2 mx-auto" />
              <p className="font-medium text-gray-900">حجز موعد</p>
            </motion.button>
            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              onClick={testChatNotifications}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors duration-200 text-center"
            >
              <FaComments className="text-orange-600 text-2xl mb-2 mx-auto" />
              <p className="font-medium text-gray-900">اختبار الرسائل</p>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDashboardSection;