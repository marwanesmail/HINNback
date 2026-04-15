import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaStar,
  FaCheck,
  FaTimes,
  FaCheckDouble,
  FaPhone,
} from "react-icons/fa";
import Swal from "sweetalert2";

const PharmacyPrescriptionsSection = ({
  prescriptions,
  filteredPrescriptions,
  searchQuery,
  setSearchQuery,
  getStatusColor,
  handlePrescriptionAction,
  handlePointsModal,
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

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-1 relative">
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <motion.input
              type="text"
              placeholder="البحث في الروشتات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Prescriptions Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredPrescriptions.map((prescription) => (
            <motion.div
              key={prescription.id}
              layout
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {prescription.patientName}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      prescription.status
                    )}`}
                  >
                    {prescription.status === "pending" && "في الانتظار"}
                    {prescription.status === "processing" && "قيد التحضير"}
                    {prescription.status === "completed" && "مكتملة"}
                    {prescription.status === "rejected" && "مرفوضة"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <p>الطبيب: {prescription.doctorName}</p>
                  <p>الهاتف: {prescription.phone}</p>
                  <p>التاريخ: {prescription.date}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">الأدوية المطلوبة:</p>
                  <div className="flex flex-wrap gap-2">
                    {prescription.medicines.map((medicine, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {medicine}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {prescription.status === "pending" && (
                  <>
                    <button
                      onClick={() => handlePointsModal(prescription)}
                      className="flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm gap-1"
                    >
                      <FaStar /> استخدام النقاط
                    </button>
                    <button
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "هل أنت متأكد من قبول هذه الروشتة؟",
                          icon: "success",
                          showCancelButton: true,
                          confirmButtonText: "نعم",
                          cancelButtonText: "إلغاء",
                        });
                        if (result.isConfirmed) {
                          handlePrescriptionAction(prescription.id, "accept");
                        }
                      }}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm gap-1"
                    >
                      <FaCheck /> قبول
                    </button>
                    <button
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "هل أنت متأكد من حذف هذه الروشتة؟",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "نعم",
                          cancelButtonText: "إلغاء",
                        });
                        if (result.isConfirmed) {
                          handlePrescriptionAction(prescription.id, "reject");
                        }
                      }}
                      className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm gap-1"
                    >
                      <FaTimes /> رفض
                    </button>
                  </>
                )}

                {prescription.status === "processing" && (
                  <button
                    onClick={() =>
                      handlePrescriptionAction(prescription.id, "complete")
                    }
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm gap-1"
                  >
                    <FaCheckDouble /> تم التحضير
                  </button>
                )}

                <button className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm gap-1">
                  <FaPhone /> اتصال
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PharmacyPrescriptionsSection;
