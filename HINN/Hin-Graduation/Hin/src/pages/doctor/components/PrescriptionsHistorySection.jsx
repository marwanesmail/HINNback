import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaEye } from "react-icons/fa";

const PrescriptionsHistorySection = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  filteredPrescriptions,
  prescriptions,
  getStatusColor,
  getPriorityColor,
  viewPrescriptionDetails,
  updatePrescriptionStatus,
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const rowVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث بالاسم، رقم الهوية، أو التشخيص..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <motion.select
              whileTap={{ scale: 0.98 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="جديدة">جديدة</option>
              <option value="تم الصرف">تم الصرف</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="ملغية">ملغية</option>
            </motion.select>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-500"
            >
              {filteredPrescriptions.length} من {prescriptions.length} روشتة
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Prescriptions List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">سجل الروشتات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المريض
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التشخيص
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الصيدلية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الأولوية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <AnimatePresence mode="popLayout">
              <motion.tbody
                key="prescriptions-list-body"
                className="bg-white divide-y divide-gray-200"
              >
                {filteredPrescriptions.length === 0 ? (
                  <motion.tr
                    key="no-results-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="7" className="text-center py-12">
                      <FaSearch className="text-4xl text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-500">
                        لا توجد روشتات تطابق البحث
                      </p>
                    </td>
                  </motion.tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <motion.tr
                      key={prescription.id}
                      layout
                      variants={rowVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      // تم تعديل تأثير الـ whileHover ليكون أهدأ
                      whileHover={{ backgroundColor: "#fafafa" }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prescription.patientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            العمر: {prescription.patientAge} سنة
                          </div>
                          <div className="text-sm text-gray-500">
                            {prescription.patientId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {prescription.diagnosis}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prescription.medications.length} أدوية
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(prescription.date).toLocaleDateString(
                          "ar-EG"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.pharmacy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {prescription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${getPriorityColor(
                            prescription.priority
                          )}`}
                        >
                          {prescription.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => viewPrescriptionDetails(prescription.id)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                            title="عرض التفاصيل"
                          >
                            <FaEye className="ml-1" />
                            عرض
                          </motion.button>
                          <motion.select
                            whileTap={{ scale: 0.95 }}
                            value={prescription.status}
                            onChange={(e) =>
                              updatePrescriptionStatus(
                                prescription.id,
                                e.target.value
                              )
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="جديدة">جديدة</option>
                            <option value="قيد المراجعة">قيد المراجعة</option>
                            <option value="تم الصرف">تم الصرف</option>
                            <option value="ملغية">ملغية</option>
                          </motion.select>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </AnimatePresence>
          </table>
          {filteredPrescriptions.length === 0 && (
            <div className="hidden">
              <FaSearch className="text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">لا توجد روشتات تطابق البحث</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PrescriptionsHistorySection;