import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaExchangeAlt } from "react-icons/fa";

const PharmacyExchangeSection = ({
  exchangeRequests,
  setShowExchangeModal,
  handleExchangeRequest,
}) => {
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

  const requestCardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Exchange Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              تبادل الأدوية
            </h3>
            <p className="text-gray-600 mt-1">
              تبادل الأدوية مع الصيدليات الأخرى في الشبكة
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExchangeModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 gap-1"
          >
            <FaPlus />
            طلب تبادل جديد
          </motion.button>
        </div>
      </motion.div>

      {/* Exchange Requests */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">طلبات التبادل</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <AnimatePresence mode="popLayout">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {exchangeRequests.length === 0 ? (
                <motion.div
                  key="no-requests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8 text-center"
                >
                  <FaExchangeAlt className="text-4xl text-gray-400 mb-4 mx-auto" />
                  <p className="text-gray-500">لا توجد طلبات تبادل حالياً</p>
                </motion.div>
              ) : (
                exchangeRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    layout
                    variants={requestCardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {request.pharmacy}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.status === "pending" && "في الانتظار"}
                            {request.status === "approved" && "موافق عليه"}
                            {request.status === "rejected" && "مرفوض"}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          الدواء:{" "}
                          <span className="font-medium">{request.medicine}</span>
                        </p>
                        <p className="text-gray-600">
                          الكمية:{" "}
                          <span className="font-medium">
                            {request.quantity} علبة
                          </span>
                        </p>
                      </div>
                      {request.status === "pending" && (
                        <div className="flex space-x-2 space-x-reverse">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleExchangeRequest(request.id, "approved")
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            موافقة
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleExchangeRequest(request.id, "rejected")
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                          >
                            رفض
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PharmacyExchangeSection;