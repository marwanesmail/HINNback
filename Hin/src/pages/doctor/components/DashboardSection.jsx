import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaPrescription,
  FaClock,
  FaStar,
  FaEye,
  FaCalendarCheck,
  FaChartLine,
  FaUserClock,
} from "react-icons/fa";
import StatsGrid from "../../../components/Layout/StatsGrid"; // Import the new StatsGrid component

const DashboardSection = ({
  doctorData,
  prescriptions,
  getStatusColor,
  setActiveSection,
  viewPrescriptionDetails,
}) => {
  // Calculate statistics
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    newPrescriptions: 0,
    averageRating: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    // Simulate real statistics calculation
    const today = new Date().toLocaleDateString("ar-EG");
    const thisMonth = new Date().getMonth();

    const newPrescriptions = prescriptions.filter(
      (p) => p.status === "جديدة"
    ).length;
    const completedThisMonth = prescriptions.filter((p) => {
      const prescDate = new Date(p.date);
      return prescDate.getMonth() === thisMonth && p.status === "مكتملة";
    }).length;

    setStats({
      totalPatients: doctorData.patients || 0,
      todayAppointments: Math.floor(Math.random() * 8) + 2, // Simulated
      completedAppointments: completedThisMonth,
      newPrescriptions: newPrescriptions,
      averageRating: doctorData.rating || 4.5,
      monthlyGrowth: 12,
    });
  }, [prescriptions, doctorData]);

  // Prepare stats data for the StatsGrid component
  const statsData = [
    {
      id: 1,
      title: "إجمالي المرضى",
      value: stats.totalPatients,
      icon: <FaUsers className="text-blue-500 text-xl" />,
      iconBg: "bg-blue-100",
      borderLeft: "border-blue-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: stats.monthlyGrowth,
      trendIcon: FaChartLine,
      trendText: "من الشهر الماضي",
    },
    {
      id: 2,
      title: "مواعيد اليوم",
      value: stats.todayAppointments,
      icon: <FaCalendarCheck className="text-purple-500 text-xl" />,
      iconBg: "bg-purple-100",
      borderLeft: "border-purple-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "موعد محجوز لهذا اليوم",
    },
    {
      id: 3,
      title: "مواعيد مكتملة",
      value: stats.completedAppointments,
      icon: <FaUserClock className="text-green-500 text-xl" />,
      iconBg: "bg-green-100",
      borderLeft: "border-green-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "هذا الشهر",
    },
    {
      id: 4,
      title: "روشتات جديدة",
      value: stats.newPrescriptions,
      icon: <FaPrescription className="text-yellow-500 text-xl" />,
      iconBg: "bg-yellow-100",
      borderLeft: "border-yellow-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "تحتاج مراجعة",
    },
  ];

  // Variants for the staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger effect for a smooth flow
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid - Using the new reusable component */}
      <StatsGrid stats={statsData} columns={4} />

      {/* Rating Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
              <FaStar className="text-amber-600 text-2xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700">تقييم المرضى</p>
              <div className="flex items-center mt-2">
                <p className="text-4xl font-bold text-amber-900">
                  {stats.averageRating}
                </p>
                <p className="text-lg text-amber-600 mr-2">/ 5.0</p>
              </div>
            </div>
          </div>
          <div className="text-left">
            <div className="flex space-x-1 space-x-reverse mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-xl ${
                    star <= Math.floor(stats.averageRating)
                      ? "text-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-amber-600 font-medium">
              بناءً على {stats.totalPatients} تقييم
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recent Prescriptions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              الروشتات الحديثة
            </h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection("prescriptions-history")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              عرض الكل
            </motion.button>
          </div>
        </div>
        <div className="p-6">
          <AnimatePresence mode="popLayout">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {prescriptions.slice(0, 5).map((prescription) => (
                <motion.div
                  key={prescription.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <h4 className="font-medium text-gray-900">
                        {prescription.patientName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          prescription.status
                        )}`}
                      >
                        {prescription.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {prescription.diagnosis}
                    </p>
                    <p className="text-sm text-gray-500">
                      {prescription.date} - {prescription.medications.length}{" "}
                      أدوية
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => viewPrescriptionDetails(prescription.id)}
                    className="px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <FaEye className="ml-1" />
                    عرض
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardSection;
