import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPrescription,
  FaBell,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaBoxes,
  FaCheckCircle,
} from "react-icons/fa";
import StatsGrid from "../../../components/Layout/StatsGrid"; // Import the new StatsGrid component

const PharmacyDashboardSection = ({
  prescriptions,
  medicineRequests,
  inventory,
  exchangeRequests,
  pharmacyData,
  getStatusColor,
  getStockColor,
  setActiveSection,
}) => {
  const [stats, setStats] = useState({
    pendingPrescriptions: 0,
    pendingRequests: 0,
    lowStock: 0,
    pendingExchanges: 0,
    totalSales: 0,
    completedToday: 0,
    inventoryValue: 0,
    salesGrowth: 0,
  });

  useEffect(() => {
    // Calculate dynamic statistics
    const pending = prescriptions.filter((p) => p.status === "pending").length;
    const requests = medicineRequests.filter(
      (r) => r.status === "pending"
    ).length;
    const lowStockItems = inventory.filter(
      (item) => item.status === "low" || item.status === "out"
    ).length;
    const exchanges = exchangeRequests.filter(
      (r) => r.status === "pending"
    ).length;

    // Calculate inventory value
    const invValue = inventory.reduce(
      (sum, item) => sum + (item.quantity * item.price || 0),
      0
    );

    // Calculate completed prescriptions today
    const today = new Date().toLocaleDateString("ar-EG");
    const completedToday = prescriptions.filter(
      (p) => p.status === "completed" && p.date === today
    ).length;

    setStats({
      pendingPrescriptions: pending,
      pendingRequests: requests,
      lowStock: lowStockItems,
      pendingExchanges: exchanges,
      totalSales: pharmacyData.totalSales || 0,
      completedToday: completedToday,
      inventoryValue: invValue,
      salesGrowth: 15,
    });
  }, [
    prescriptions,
    medicineRequests,
    inventory,
    exchangeRequests,
    pharmacyData,
  ]);

  // Prepare stats data for the StatsGrid component
  const statsData = [
    {
      id: 1,
      title: "الروشتات الجديدة",
      value: stats.pendingPrescriptions,
      icon: <FaPrescription className="text-yellow-500 text-xl" />,
      iconBg: "bg-yellow-100",
      borderLeft: "border-yellow-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "في انتظار المراجعة",
    },
    {
      id: 2,
      title: "طلبات أدوية جديدة",
      value: stats.pendingRequests,
      icon: <FaBell className="text-orange-500 text-xl" />,
      iconBg: "bg-orange-100",
      borderLeft: "border-orange-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "من المرضى القريبين",
    },
    {
      id: 3,
      title: "المخزون المنخفض",
      value: stats.lowStock,
      icon: <FaExclamationTriangle className="text-red-500 text-xl" />,
      iconBg: "bg-red-100",
      borderLeft: "border-red-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "يحتاج إعادة طلب",
    },
    {
      id: 4,
      title: "طلبات التبادل",
      value: stats.pendingExchanges,
      icon: <FaExchangeAlt className="text-blue-500 text-xl" />,
      iconBg: "bg-blue-100",
      borderLeft: "border-blue-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "من صيدليات أخرى",
    },
    {
      id: 5,
      title: "إجمالي المبيعات",
      value: stats.totalSales.toLocaleString(),
      icon: <FaMoneyBillWave className="text-green-500 text-xl" />,
      iconBg: "bg-green-100",
      borderLeft: "border-green-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: stats.salesGrowth,
      trendIcon: FaChartLine,
      trendText: "هذا الشهر",
    },
    {
      id: 6,
      title: "قيمة المخزون",
      value: stats.inventoryValue.toLocaleString(),
      icon: <FaBoxes className="text-purple-500 text-xl" />,
      iconBg: "bg-purple-100",
      borderLeft: "border-purple-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "جنيه إجمالي",
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

  const prescriptionCardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid - Using the new reusable component */}
      <StatsGrid stats={statsData} columns={3} />

      {/* Completed Today Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-sm border border-teal-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-teal-600 text-2xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-teal-700">
                الروشتات المكتملة اليوم
              </p>
              <p className="text-4xl font-bold text-teal-900 mt-2">
                {stats.completedToday}
              </p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm text-teal-600 font-medium">
              روشتة تم تجهيزها
            </p>
            <p className="text-xs text-teal-500 mt-1">أداء ممتاز اليوم! 🎉</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Prescriptions and Medicine Requests Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                onClick={() => setActiveSection("prescriptions")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                عرض الكل
              </motion.button>
            </div>
          </div>
          <div className="p-6">
            <AnimatePresence mode="popLayout">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {prescriptions.slice(0, 3).map((prescription) => (
                  <motion.div
                    key={prescription.id}
                    layout
                    variants={prescriptionCardVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {prescription.patientName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {prescription.doctorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {prescription.medicines.length} أدوية
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          prescription.status
                        )}`}
                      >
                        {prescription.status === "pending" && "في الانتظار"}
                        {prescription.status === "processing" && "قيد التحضير"}
                        {prescription.status === "completed" && "مكتملة"}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {prescription.total.toFixed(2)} ج.م
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Recent Medicine Requests */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                طلبات الأدوية الحديثة
              </h3>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection("medicine-requests")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                عرض الكل
              </motion.button>
            </div>
          </div>
          <div className="p-6">
            <AnimatePresence mode="popLayout">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {medicineRequests.slice(0, 3).map((request) => (
                  <motion.div
                    key={request.id}
                    layout
                    variants={prescriptionCardVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {request.patientName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {request.distance}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.medicines.length} أدوية
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : request.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status === "pending" && "في الانتظار"}
                        {request.status === "accepted" && "مقبول"}
                        {request.status === "declined" && "مرفوض"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacyDashboardSection;
