import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaPaperPlane, FaTrash } from "react-icons/fa";
import MedicineAutocomplete from "../../../components/Medicine/MedicineAutocomplete";

const NewPrescriptionSection = ({
  newPrescription,
  handleNewPrescriptionChange,
  handleMedicationChange,
  addMedication,
  removeMedication,
  submitPrescription,
}) => {
  // Variants for staggered form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const medicationItemVariants = {
    initial: { opacity: 0, scale: 0.9, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -10 },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            كتابة روشتة جديدة
          </h3>
          <p className="text-gray-600 mt-1">
            املأ البيانات التالية لإنشاء روشتة جديدة
          </p>
        </div>
        <div className="p-6">
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Patient Information */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المريض *
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={newPrescription.patientName}
                  onChange={handleNewPrescriptionChange}
                  placeholder="أدخل اسم المريض"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهوية *
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={newPrescription.patientId}
                  onChange={handleNewPrescriptionChange}
                  placeholder="أدخل رقم الهوية"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العمر
                </label>
                <input
                  type="number"
                  name="patientAge"
                  value={newPrescription.patientAge}
                  onChange={handleNewPrescriptionChange}
                  placeholder="أدخل العمر"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={newPrescription.patientPhone}
                  onChange={handleNewPrescriptionChange}
                  placeholder="أدخل رقم الهاتف"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </motion.div>

            {/* Diagnosis */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التشخيص *
              </label>
              <input
                type="text"
                name="diagnosis"
                value={newPrescription.diagnosis}
                onChange={handleNewPrescriptionChange}
                placeholder="أدخل التشخيص"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </motion.div>

            {/* Medications */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">الأدوية</h4>
                <motion.button
                  type="button"
                  onClick={addMedication}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <FaPlus className="ml-2" />
                  إضافة دواء
                </motion.button>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {newPrescription.medications.map((medication, index) => (
                    <motion.div
                      key={index}
                      variants={medicationItemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            اسم الدواء *
                          </label>
                          <MedicineAutocomplete
                            value={medication.name}
                            onChange={(value) =>
                              handleMedicationChange(index, "name", value)
                            }
                            placeholder="ابحث عن الدواء"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الجرعة *
                          </label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) =>
                              handleMedicationChange(
                                index,
                                "dosage",
                                e.target.value
                              )
                            }
                            placeholder="500mg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            التكرار *
                          </label>
                          <select
                            value={medication.frequency}
                            onChange={(e) =>
                              handleMedicationChange(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">اختر التكرار</option>
                            <option value="مرة يومياً">مرة يومياً</option>
                            <option value="مرتين يومياً">مرتين يومياً</option>
                            <option value="ثلاث مرات يومياً">
                              ثلاث مرات يومياً
                            </option>
                            <option value="أربع مرات يومياً">
                              أربع مرات يومياً
                            </option>
                            <option value="عند الحاجة">عند الحاجة</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            المدة
                          </label>
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) =>
                              handleMedicationChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="7 أيام"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-end">
                          <motion.button
                            type="button"
                            onClick={() => removeMedication(index)}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                            disabled={newPrescription.medications.length === 1}
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تعليمات الاستخدام
                        </label>
                        <input
                          type="text"
                          value={medication.instructions}
                          onChange={(e) =>
                            handleMedicationChange(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                          placeholder="بعد الأكل، مع الماء، إلخ..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصيدلية *
                </label>
                <select
                  name="pharmacy"
                  value={newPrescription.pharmacy}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">اختر الصيدلية</option>
                  <option value="صيدلية الشفاء">صيدلية الشفاء</option>
                  <option value="صيدلية النور">صيدلية النور</option>
                  <option value="صيدلية الرحمة">صيدلية الرحمة</option>
                  <option value="صيدلية الأمل">صيدلية الأمل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأولوية
                </label>
                <select
                  name="priority"
                  value={newPrescription.priority}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="منخفض">منخفض</option>
                  <option value="متوسط">متوسط</option>
                  <option value="عالي">عالي</option>
                </select>
              </div>
            </motion.div>

            {/* Notes and Next Visit */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  name="notes"
                  value={newPrescription.notes}
                  onChange={handleNewPrescriptionChange}
                  rows="4"
                  placeholder="أدخل أي ملاحظات إضافية..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موعد المراجعة القادم
                </label>
                <input
                  type="date"
                  name="nextVisit"
                  value={newPrescription.nextVisit}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end pt-6 border-t border-gray-200"
            >
              <motion.button
                type="button"
                onClick={submitPrescription}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center"
              >
                <FaPaperPlane className="ml-2" />
                إرسال الروشتة
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default NewPrescriptionSection;