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
import StatsGrid from "../../../components/Layout/StatsGrid"; // Import the new StatsGrid component

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
    bmiStatus: "",
  });

  useEffect(() => {
    // Calculate BMI if height and weight are available
    let bmi = 0;
    let bmiStatus = "";
    if (medicalFile.height && medicalFile.weight) {
      const heightInMeters = medicalFile.height / 100;
      bmi = (medicalFile.weight / (heightInMeters * heightInMeters)).toFixed(1);

      if (bmi < 18.5) bmiStatus = "نحيف";
      else if (bmi < 25) bmiStatus = "طبيعي";
      else if (bmi < 30) bmiStatus = "وزن زائد";
      else bmiStatus = "سمنة";
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

  // Prepare health stats data for the StatsGrid component
  const healthStatsData = [
    {
      id: 1,
      title: "العمر",
      value: medicalFile.age,
      icon: <FaBirthdayCake className="text-blue-500 text-xl" />,
      iconBg: "bg-blue-100",
      borderLeft: "border-blue-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "سنة",
    },
    {
      id: 2,
      title: "فصيلة الدم",
      value: medicalFile.bloodType || "غير محدد",
      icon: <FaTint className="text-red-500 text-xl" />,
      iconBg: "bg-red-100",
      borderLeft: "border-red-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "فصيلة الدم",
    },
    {
      id: 3,
      title: "الوزن",
      value: medicalFile.weight || "--",
      icon: <FaWeight className="text-green-500 text-xl" />,
      iconBg: "bg-green-100",
      borderLeft: "border-green-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "كيلوجرام",
    },
    {
      id: 4,
      title: "الطول",
      value: medicalFile.height || "--",
      icon: <FaRuler className="text-orange-500 text-xl" />,
      iconBg: "bg-orange-100",
      borderLeft: "border-orange-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "سنتيمتر",
    },
    {
      id: 5,
      title: "مؤشر الكتلة",
      value: stats.bmi || "--",
      icon: <FaHeartbeat className="text-purple-500 text-xl" />,
      iconBg: "bg-purple-100",
      borderLeft: "border-purple-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: stats.bmiStatus || "BMI",
    },
  ];

  // Prepare medical activities stats data for the StatsGrid component
  const medicalStatsData = [
    {
      id: 1,
      title: "الروشتات النشطة",
      value: stats.activePrescriptions,
      icon: <FaPrescription className="text-indigo-500 text-xl" />,
      iconBg: "bg-indigo-100",
      borderLeft: "border-indigo-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "روشتة سارية",
    },
    {
      id: 2,
      title: "الأدوية الحالية",
      value: stats.currentMedications,
      icon: <FaPills className="text-teal-500 text-xl" />,
      iconBg: "bg-teal-100",
      borderLeft: "border-teal-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "دواء نشط",
    },
    {
      id: 3,
      title: "مواعيد قادمة",
      value: stats.upcomingAppointments,
      icon: <FaClock className="text-cyan-500 text-xl" />,
      iconBg: "bg-cyan-100",
      borderLeft: "border-cyan-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "موعد محجوز",
    },
    {
      id: 4,
      title: "مواعيد مكتملة",
      value: stats.completedAppointments,
      icon: <FaCheckCircle className="text-emerald-500 text-xl" />,
      iconBg: "bg-emerald-100",
      borderLeft: "border-emerald-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "زيارة مسبقة",
    },
  ];

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

      {/* Health Stats - Using the new reusable component */}
      <StatsGrid stats={healthStatsData} columns={5} />

      {/* Medical Activities Stats - Using the new reusable component */}
      <StatsGrid stats={medicalStatsData} columns={4} />

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
