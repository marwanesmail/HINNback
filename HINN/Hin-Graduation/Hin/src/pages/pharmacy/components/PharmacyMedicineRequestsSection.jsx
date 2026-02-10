import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock,
  FaCheckCircle,
  FaList,
  FaInbox,
  FaMapMarkerAlt,
  FaCheck,
  FaTimes,
  FaPhone,
  FaMap,
} from "react-icons/fa";
import Swal from "sweetalert2";

const PharmacyMedicineRequestsSection = ({
  medicineRequests,
  isLoadingRequests,
  handleMedicineRequest,
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
      {/* Stats Cards */}
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
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">طلبات جديدة</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {medicineRequests.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-orange-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">في انتظار الرد</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">طلبات مقبولة</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {medicineRequests.filter((r) => r.status === "accepted").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">تم قبولها</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                إجمالي الطلبات
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {medicineRequests.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaList className="text-blue-600 text-xl" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">اليوم</p>
        </motion.div>
      </motion.div>

      {/* Medicine Requests List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            طلبات الأدوية من المرضى
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            طلبات الأدوية من المرضى القريبين منك
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          <AnimatePresence mode="popLayout">
            {isLoadingRequests ? (
              <motion.div
                key="loading-requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <div className="inline-flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                    className="rounded-full h-6 w-6 border-b-2 border-blue-600 ml-3"
                  ></motion.div>
                  <span className="text-gray-600">جاري تحميل الطلبات...</span>
                </div>
              </motion.div>
            ) : medicineRequests.length === 0 ? (
              <motion.div
                key="no-requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center"
              >
                <FaInbox className="text-4xl text-gray-400 mb-4 mx-auto" />
                <p className="text-gray-500">لا توجد طلبات أدوية حالياً</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {medicineRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    layout
                    variants={requestCardVariants}
                    whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="p-6 bg-white hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {request.patientName}
                          </h4>
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
                          <span className="text-sm text-gray-500">
                            <FaMapMarkerAlt className="ml-1" />
                            {request.distance}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">رقم الهاتف</p>
                            <p className="font-medium text-gray-900">
                              {request.patientPhone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">وقت الطلب</p>
                            <p className="font-medium text-gray-900">
                              {request.requestTime}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            الأدوية المطلوبة:
                          </p>
                          <div className="space-y-2">
                            {request.medicines.map((medicine, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                              >
                                <span className="font-medium text-gray-900">
                                  {medicine.name}
                                </span>
                                <span className="text-sm text-gray-600">
                                  الكمية: {medicine.quantity}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 space-x-reverse text-sm">
                          <span className="text-gray-600">
                            البديل المفضل:{" "}
                            <span className="font-medium">
                              {request.alternativeOption === "nearest"
                                ? "الأقرب"
                                : "الأرخص"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 mr-6">
                        {request.status === "pending" && (
                          <>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleMedicineRequest(request.id, "accepted")
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm flex items-center"
                            >
                              <FaCheck className="ml-1" />
                              توفر الدواء
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleMedicineRequest(request.id, "declined")
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm flex items-center"
                            >
                              <FaTimes className="ml-1" />
                              غير متوفر
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center"
                        >
                          <FaPhone className="ml-1" />
                          اتصال
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm flex items-center"
                        >
                          <FaMap className="ml-1" />
                          الموقع
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PharmacyMedicineRequestsSection;