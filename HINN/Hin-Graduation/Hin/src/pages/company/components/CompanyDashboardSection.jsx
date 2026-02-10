import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBullhorn,
  FaShoppingCart,
  FaChartLine,
  FaStore,
  FaPills,
  FaTruck,
  FaCheckCircle,
  FaBoxOpen,
} from "react-icons/fa";

const CompanyDashboardSection = ({
  orders,
  companyData,
  getOrderStatusColor,
  updateOrderStatus,
  setActiveSection,
}) => {
  const [stats, setStats] = useState({
    newOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    dailySales: 0,
    monthlySales: 0,
    activePharmacies: 0,
    totalProducts: 0,
    salesGrowth: 0,
  });

  useEffect(() => {
    // Calculate dynamic statistics
    const newOrders = orders.filter((o) => o.status === "جديد").length;
    const processing = orders.filter((o) => o.status === "قيد المعالجة").length;
    const completed = orders.filter((o) => o.status === "مكتمل").length;
    
    // Calculate sales
    const today = new Date().toLocaleDateString('ar-EG');
    const dailySales = orders
      .filter((o) => o.date === today)
      .reduce((sum, order) => sum + order.total, 0);
    
    const thisMonth = new Date().getMonth();
    const monthlySales = orders
      .filter((o) => {
        const orderDate = new Date(o.date);
        return orderDate.getMonth() === thisMonth;
      })
      .reduce((sum, order) => sum + order.total, 0);

    setStats({
      newOrders: newOrders,
      processingOrders: processing,
      completedOrders: completed,
      dailySales: dailySales,
      monthlySales: monthlySales,
      activePharmacies: companyData.activePharmacies || 0,
      totalProducts: companyData.totalProducts || 0,
      salesGrowth: 12,
    });
  }, [orders, companyData]);
  // Variants for the staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid - Updated with better logic */}
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
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">
                الطلبات الجديدة
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.newOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <FaShoppingCart className="text-blue-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-4 font-medium">طلب في انتظار المعالجة</p>
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
                قيد التجهيز
              </p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {stats.processingOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <FaBoxOpen className="text-orange-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-orange-600 mt-4 font-medium">طلب يتم تجهيزه</p>
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
                مكتملة
              </p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.completedOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 font-medium">طلب تم توصيله</p>
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
                إجمالي الطلبات
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {orders.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <FaTruck className="text-purple-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-4 font-medium">هذا الشهر</p>
        </motion.div>
      </motion.div>

      {/* Sales and Business Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm p-6 border border-emerald-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">
                مبيعات اليوم
              </p>
              <p className="text-3xl font-bold text-emerald-900 mt-2">
                {stats.dailySales.toLocaleString()} ج.م
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-emerald-700 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <FaChartLine className="text-green-600 text-sm ml-1" />
            <p className="text-sm text-emerald-600 font-medium">+{stats.salesGrowth}% عن أمس</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm p-6 border border-indigo-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">
                الصيدليات النشطة
              </p>
              <p className="text-3xl font-bold text-indigo-900 mt-2">
                {stats.activePharmacies}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center">
              <FaStore className="text-indigo-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-indigo-600 mt-4 font-medium">صيدلية متعاقدة</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">
                إجمالي المنتجات
              </p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {stats.totalProducts}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
              <FaPills className="text-yellow-700 text-xl" />
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-4 font-medium">منتج متاح</p>
        </motion.div>
      </motion.div>

      {/* Monthly Revenue Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl shadow-sm border border-teal-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-teal-200 rounded-full flex items-center justify-center">
              <FaChartLine className="text-teal-600 text-2xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-teal-700">إجمالي مبيعات الشهر</p>
              <p className="text-4xl font-bold text-teal-900 mt-2">
                {stats.monthlySales.toLocaleString()} ج.م
              </p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm text-teal-600 font-medium">أداء ممتاز 📊</p>
            <p className="text-xs text-teal-500 mt-1">مقارنة بالشهر السابق</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              الطلبات الواردة
            </h3>
            <motion.button
              onClick={() => setActiveSection("orders")}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              عرض الكل
            </motion.button>
          </div>
        </div>
        <div className="p-6">
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <h4 className="font-medium text-gray-900">
                        {order.pharmacy}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.products.length} منتجات - إجمالي:{" "}
                      {order.total.toLocaleString()} ج.م
                    </p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          order.status === "جديد" ? "قيد المعالجة" : "مكتمل"
                        )
                      }
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {order.status === "جديد"
                        ? "معالجة"
                        : order.status === "قيد المعالجة"
                        ? "إتمام"
                        : "مكتمل"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyDashboardSection;