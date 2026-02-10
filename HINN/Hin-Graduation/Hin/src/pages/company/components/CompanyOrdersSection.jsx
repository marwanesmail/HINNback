import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaCog, FaCheck, FaEye, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

// ----------------------------------------------------------------------
// 1. OrderCard Component
// ----------------------------------------------------------------------

const OrderCard = ({ order, getOrderStatusColor, updateOrderStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Variants for the card expansion/collapse animation
  const detailsVariants = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  // Determine which action button(s) to show
  const ActionButtons = () => (
    <div className="flex items-center space-x-2 space-x-reverse mt-4">
      {order.status === "جديد" && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            updateOrderStatus(order.id, "قيد المعالجة");
          }}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          <FaCog className="inline ml-1" /> معالجة
        </motion.button>
      )}
      {order.status === "قيد المعالجة" && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            updateOrderStatus(order.id, "مكتمل");
          }}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
        >
          <FaCheck className="inline ml-1" /> إتمام الطلب
        </motion.button>
      )}
      
      {/* Cancel button appears for New and Processing orders */}
      {(order.status === "جديد" || order.status === "قيد المعالجة") && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            updateOrderStatus(order.id, "ملغي");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
        >
          <FaTimes className="inline ml-1" /> إلغاء
        </motion.button>
      )}
    </div>
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-5 cursor-pointer transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Card Header (Summary) */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-lg font-bold text-gray-900">{order.pharmacy}</p>
          <p className="text-sm text-gray-500">{order.phone}</p>
        </div>
        <span
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full rtl:mr-3 ${getOrderStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-2 gap-y-3 border-t pt-4 border-gray-100">
        <div className="text-sm text-gray-600">
          <FaClock className="inline w-3 h-3 ml-1 text-blue-500" /> التاريخ:
        </div>
        <div className="text-sm font-medium text-right text-gray-800">
          {new Date(order.date).toLocaleDateString("ar-EG")}
        </div>

        <div className="text-sm text-gray-600">
          <FaCheck className="inline w-3 h-3 ml-1 text-green-500" /> المنتجات:
        </div>
        <div className="text-sm font-medium text-right text-gray-800">
          {order.products.length} منتجات
        </div>
        
        <div className="text-sm text-gray-600">
          <FaEye className="inline w-3 h-3 ml-1 text-yellow-500" /> الإجمالي:
        </div>
        <div className="text-base font-bold text-right text-gray-900">
          {order.total.toLocaleString()} ج.م
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="details-expansion"
            variants={detailsVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-hidden border-t mt-4 pt-4 border-gray-200"
          >
            <h4 className="text-md font-semibold mb-2 text-gray-700">تفاصيل المنتجات:</h4>
            <ul className="list-disc pr-5 space-y-1 text-sm text-gray-600">
              {order.products.map((product, index) => (
                <li key={index} className="text-right">{product}</li>
              ))}
              {/* Add more specific product details here if available in the 'order' object */}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Action Buttons */}
      <ActionButtons />
      
      {/* Expansion Toggle Button */}
      <div className="mt-4 text-center border-t pt-3">
        <button className="text-blue-500 text-sm font-medium flex items-center justify-center w-full">
          {isExpanded ? (
            <><FaChevronUp className="ml-1" /> إخفاء التفاصيل</>
          ) : (
            <><FaChevronDown className="ml-1" /> عرض التفاصيل</>
          )}
        </button>
      </div>

    </motion.div>
  );
};

// ----------------------------------------------------------------------
// 2. CompanyOrdersSection Component (Main)
// ----------------------------------------------------------------------

const CompanyOrdersSection = ({
  orders,
  getOrderStatusColor,
  updateOrderStatus,
}) => {
  // Orders Summary (kept for the top dashboard section)
  const newOrders = orders.filter((o) => o.status === "جديد").length;
  const processingOrders = orders.filter(
    (o) => o.status === "قيد المعالجة"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "مكتمل").length;

  // Variants for the staggered animation
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

  return (
    <div className="space-y-8">
      {/* Orders Summary */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* New Orders Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">طلبات جديدة</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {newOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Processing Orders Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {processingOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaCog className="text-yellow-600" />
            </div>
          </div>
        </motion.div>

        {/* Completed Orders Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مكتملة</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {completedOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheck className="text-green-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      ---

      {/* Orders List (as Cards) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">قائمة الطلبات</h3>
          <p className="text-sm text-gray-500">انقر على أي طلب لعرض أو إخفاء التفاصيل.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                getOrderStatusColor={getOrderStatusColor}
                updateOrderStatus={updateOrderStatus}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {orders.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
            لا توجد طلبات لعرضها حاليًا.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompanyOrdersSection;