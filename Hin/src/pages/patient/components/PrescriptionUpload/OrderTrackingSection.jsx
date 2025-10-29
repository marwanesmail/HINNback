// src/components/OrderTrackingSection.jsx
import React, { useState } from "react";
import {
  FaListAlt,
  FaSyncAlt,
  FaEye,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Define variants for the table rows
const rowVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: {
    scale: 1.01,
    backgroundColor: "#F9FAFB",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -50 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: -50 },
};

const OrderTrackingSection = ({ recentOrders, getOrderStatusInfo, onReload }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="modern-card p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FaListAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">طلباتك الأخيرة</h3>
              <p className="text-gray-600">تابع حالة طلباتك المرسلة</p>
            </div>
          </div>
          <motion.button
            onClick={onReload}
            className="secondary-button px-6 py-3 font-medium flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <FaSyncAlt />
            </motion.span>
            تحديث
          </motion.button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-4 px-6 font-bold text-gray-700">
                  اسم الدواء
                </th>
                <th className="text-right py-4 px-6 font-bold text-gray-700">
                  تاريخ الطلب
                </th>
                <th className="text-right py-4 px-6 font-bold text-gray-700">
                  الصيدلية
                </th>
                <th className="text-right py-4 px-6 font-bold text-gray-700">
                  الحالة
                </th>
                <th className="text-center py-4 px-6 font-bold text-gray-700">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const acceptedPharmacy = order.pharmacyResponses?.find(
                  (r) => r.status === "accepted"
                );
                const statusInfo = getOrderStatusInfo(order.status);

                return (
                  <motion.tr
                    key={order.id}
                    className="border-b border-gray-100 transition-colors"
                    variants={rowVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ duration: 0.3 }}
                  >
                    {/* Medicine name */}
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.medicines && order.medicines.length > 0
                            ? order.medicines.map((m) => m.name).join(", ")
                            : "أدوية متنوعة"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.medicines?.length || 0} دواء
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-5 px-6">
                      <p className="text-gray-900 font-medium">
                        {new Date(order.requestTime).toLocaleDateString("ar-EG")}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.requestTime).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    {/* Pharmacy */}
                    <td className="py-5 px-6">
                      <p className="text-gray-900 font-medium">
                        {acceptedPharmacy
                          ? acceptedPharmacy.pharmacyName
                          : "قيد الانتظار"}
                      </p>
                      {!acceptedPharmacy ? (
                        <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                          <FaClock />
                          في انتظار الرد
                        </p>
                      ) : (
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                          <FaCheckCircle />
                          تم القبول
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-5 px-6">
                      <motion.span
                        className={`status-badge ${statusInfo.color}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {statusInfo.icon}
                        {statusInfo.text}
                      </motion.span>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center">
                      <motion.button
                        onClick={() => setSelectedOrder(order)}
                        className="secondary-button px-4 py-2 text-sm font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEye />
                        تفاصيل
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {recentOrders.length >= 5 && (
          <div className="mt-8 text-center">
            <motion.button
              className="primary-button px-8 py-3 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaListAlt className="ml-2" />
              عرض جميع الطلبات
            </motion.button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaEye className="text-indigo-600" />
                تفاصيل الطلب
              </h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">الأدوية:</span>{" "}
                  {selectedOrder.medicines.map((m) => m.name).join(", ")}
                </p>
                <p>
                  <span className="font-semibold">التاريخ:</span>{" "}
                  {new Date(selectedOrder.requestTime).toLocaleString("ar-EG")}
                </p>
                <p>
                  <span className="font-semibold">الصيدلية:</span>{" "}
                  {selectedOrder.pharmacyResponses?.find(
                    (r) => r.status === "accepted"
                  )?.pharmacyName || "قيد الانتظار"}
                </p>
                <p>
                  <span className="font-semibold">الحالة:</span>{" "}
                  {getOrderStatusInfo(selectedOrder.status).text}
                </p>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="primary-button px-6 py-2"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderTrackingSection;
