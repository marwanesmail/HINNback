import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileMedical,
  FaUser,
  FaHeartbeat,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

const PatientMedicalFileSection = ({
  patientData,
  medicalFile,
  isEditingMedical,
  editedMedicalData,
  setIsEditingMedical,
  handleMedicalDataChange,
  saveMedicalData,
  cancelEdit,
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

  const formItemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="space-y-6">
      {/* Medical File Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center ml-4">
                <FaFileMedical className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  الملف الطبي
                </h3>
                <p className="text-gray-600">معلوماتك الطبية الشخصية</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditingMedical(!isEditingMedical)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
                isEditingMedical
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEditingMedical ? (
                <FaTimes className="ml-2" />
              ) : (
                <FaEdit className="ml-2" />
              )}
              {isEditingMedical ? "إلغاء" : "تعديل"}
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!isEditingMedical ? (
              // View Mode
              <motion.div
                key="view-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Basic Information */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <motion.h4 variants={itemVariants} className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="text-blue-600 ml-2" />
                    المعلومات الأساسية
                  </motion.h4>
                  <div className="space-y-3">
                    <motion.div variants={itemVariants} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">الاسم الكامل:</span>
                      <span className="font-medium text-gray-900">
                        {patientData.fullName}
                      </span>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">العمر:</span>
                      <span className="font-medium text-gray-900">
                        {medicalFile.age} سنة
                      </span>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">النوع:</span>
                      <span className="font-medium text-gray-900">
                        {medicalFile.gender === "male"
                          ? "ذكر"
                          : medicalFile.gender === "female"
                          ? "أنثى"
                          : "غير محدد"}
                      </span>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">الوزن:</span>
                      <span className="font-medium text-gray-900">
                        {medicalFile.weight || "غير محدد"} كجم
                      </span>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">الطول:</span>
                      <span className="font-medium text-gray-900">
                        {medicalFile.height || "غير محدد"} سم
                      </span>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">فصيلة الدم:</span>
                      <span className="font-medium text-gray-900">
                        {medicalFile.bloodType || "غير محدد"}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Medical Information */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <motion.h4 variants={itemVariants} className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaHeartbeat className="text-red-600 ml-2" />
                    المعلومات الطبية
                  </motion.h4>
                  <div className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الأمراض المزمنة
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">
                          {medicalFile.chronicDiseases ||
                            "لا توجد أمراض مزمنة مسجلة"}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الأدوية الحالية
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">
                          {medicalFile.currentMedications ||
                            "لا توجد أدوية حالية"}
                        </p>
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحساسية
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900">
                          {medicalFile.allergies || "لا توجد حساسية مسجلة"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              // Edit Mode
              <motion.div
                key="edit-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العمر *
                    </label>
                    <input
                      type="number"
                      value={editedMedicalData.age || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("age", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل العمر"
                    />
                  </motion.div>
                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      النوع
                    </label>
                    <select
                      value={editedMedicalData.gender || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("gender", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر النوع</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </motion.div>
                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوزن (كجم)
                    </label>
                    <input
                      type="number"
                      value={editedMedicalData.weight || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("weight", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="الوزن بالكيلوجرام"
                    />
                  </motion.div>
                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الطول (سم)
                    </label>
                    <input
                      type="number"
                      value={editedMedicalData.height || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("height", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="الطول بالسنتيمتر"
                    />
                  </motion.div>
                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      فصيلة الدم
                    </label>
                    <select
                      value={editedMedicalData.bloodType || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("bloodType", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر فصيلة الدم</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </motion.div>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الأمراض المزمنة
                    </label>
                    <textarea
                      rows="4"
                      value={editedMedicalData.chronicDiseases || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("chronicDiseases", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="اذكر أي أمراض مزمنة تعاني منها..."
                    ></textarea>
                  </motion.div>

                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الأدوية التي أتناولها حالياً
                    </label>
                    <textarea
                      rows="4"
                      value={editedMedicalData.currentMedications || ""}
                      onChange={(e) =>
                        handleMedicalDataChange(
                          "currentMedications",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="اذكر جميع الأدوية والمكملات الغذائية..."
                    ></textarea>
                  </motion.div>

                  <motion.div variants={formItemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحساسية
                    </label>
                    <textarea
                      rows="3"
                      value={editedMedicalData.allergies || ""}
                      onChange={(e) =>
                        handleMedicalDataChange("allergies", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="اذكر أي حساسية لديك من أدوية أو أطعمة أو مواد أخرى"
                    ></textarea>
                  </motion.div>

                  <motion.div variants={formItemVariants} className="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelEdit}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      إلغاء
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={saveMedicalData}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      حفظ التغييرات
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientMedicalFileSection;