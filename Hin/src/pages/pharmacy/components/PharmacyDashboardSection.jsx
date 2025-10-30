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
      {/* Stats Grid - Updated with 6 cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">
                الروشتات الجديدة
              </p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {stats.pendingPrescriptions}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
              <FaPrescription className="text-yellow-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-4 font-medium">
            في انتظار المراجعة
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-6 border border-orange-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">
                طلبات أدوية جديدة
              </p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {stats.pendingRequests}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <FaBell className="text-orange-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-4 font-medium">
            من المرضى القريبين
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">
                المخزون المنخفض
              </p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {stats.lowStock}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-red-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-4 font-medium">
            يحتاج إعادة طلب
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">طلبات التبادل</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.pendingExchanges}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <FaExchangeAlt className="text-blue-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-4 font-medium">
            من صيدليات أخرى
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">
                إجمالي المبيعات
              </p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.totalSales.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-green-700 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <FaChartLine className="text-green-600 text-sm ml-1" />
            <p className="text-sm text-green-600 font-medium">
              +{stats.salesGrowth}% هذا الشهر
            </p>
          </div>
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
                قيمة المخزون
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {stats.inventoryValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <FaBoxes className="text-purple-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-4 font-medium">
            جنيه إجمالي
          </p>
        </motion.div>
      </motion.div>

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
