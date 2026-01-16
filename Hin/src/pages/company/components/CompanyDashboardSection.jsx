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
import StatsGrid from "../../../components/Layout/StatsGrid"; // Import the new StatsGrid component

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
    const today = new Date().toLocaleDateString("ar-EG");
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

  // Prepare stats data for the StatsGrid component
  const orderStatsData = [
    {
      id: 1,
      title: "الطلبات الجديدة",
      value: stats.newOrders,
      icon: <FaShoppingCart className="text-blue-500 text-xl" />,
      iconBg: "bg-blue-100",
      borderLeft: "border-blue-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "طلب في انتظار المعالجة",
    },
    {
      id: 2,
      title: "قيد التجهيز",
      value: stats.processingOrders,
      icon: <FaBoxOpen className="text-orange-500 text-xl" />,
      iconBg: "bg-orange-100",
      borderLeft: "border-orange-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "طلب يتم تجهيزه",
    },
    {
      id: 3,
      title: "مكتملة",
      value: stats.completedOrders,
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      iconBg: "bg-green-100",
      borderLeft: "border-green-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "طلب تم توصيله",
    },
    {
      id: 4,
      title: "إجمالي الطلبات",
      value: orders.length,
      icon: <FaTruck className="text-purple-500 text-xl" />,
      iconBg: "bg-purple-100",
      borderLeft: "border-purple-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "هذا الشهر",
    },
  ];

  const businessStatsData = [
    {
      id: 1,
      title: "مبيعات اليوم",
      value: `${stats.dailySales.toLocaleString()} ج.م`,
      icon: <FaChartLine className="text-emerald-500 text-xl" />,
      iconBg: "bg-emerald-100",
      borderLeft: "border-emerald-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: stats.salesGrowth,
      trendIcon: FaChartLine,
      trendText: "عن أمس",
    },
    {
      id: 2,
      title: "الصيدليات النشطة",
      value: stats.activePharmacies,
      icon: <FaStore className="text-indigo-500 text-xl" />,
      iconBg: "bg-indigo-100",
      borderLeft: "border-indigo-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "صيدلية متعاقدة",
    },
    {
      id: 3,
      title: "إجمالي المنتجات",
      value: stats.totalProducts,
      icon: <FaPills className="text-yellow-500 text-xl" />,
      iconBg: "bg-yellow-100",
      borderLeft: "border-yellow-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      subtitle: "منتج متاح",
    },
  ];

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
      {/* Order Stats Grid - Using the new reusable component */}
      <StatsGrid stats={orderStatsData} columns={4} />

      {/* Business Stats Grid - Using the new reusable component */}
      <StatsGrid stats={businessStatsData} columns={3} />

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
              <p className="text-sm font-medium text-teal-700">
                إجمالي مبيعات الشهر
              </p>
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
