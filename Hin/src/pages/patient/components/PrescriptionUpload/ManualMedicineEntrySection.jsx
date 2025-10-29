import React from "react";
import { FaEye, FaEyeSlash, FaTimes, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import MedicineAutocomplete from "../../../../components/MedicineAutocomplete";

// Define animation variants for the components
const fadeInOut = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each child's animation
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
};

const ManualMedicineEntrySection = ({
  showMedicineSearch,
  setShowMedicineSearch,
  handleMedicineSelect,
  selectedMedicines,
  updateMedicineQuantity,
  removeMedicine,
  medicineText,
  handleMedicineTextChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            البحث عن الأدوية
          </label>
          <motion.button
            type="button"
            onClick={() => setShowMedicineSearch(!showMedicineSearch)}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            whileHover={{ scale: 1.05 }} // Scale up on hover
            whileTap={{ scale: 0.95 }} // Scale down on click
          >
            {showMedicineSearch ? <FaEyeSlash /> : <FaEye />}
            {showMedicineSearch ? "إخفاء البحث" : "إظهار البحث"}
          </motion.button>
        </div>

        {/* AnimatePresence handles mounting/unmounting of the search div */}
        <AnimatePresence>
          {showMedicineSearch && (
            <motion.div
              key="search-section" // Unique key is required for AnimatePresence
              variants={fadeInOut}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-indigo-50 rounded-xl p-4 mb-4"
            >
              <MedicineAutocomplete
                onMedicineSelect={handleMedicineSelect}
                placeholder="ابحث عن اسم الدواء..."
                className="mb-3"
              />
              <p className="text-indigo-600 text-xs">
                ابدأ بكتابة اسم الدواء واختر من القائمة المقترحة
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Medicines Section */}
      <AnimatePresence>
        {selectedMedicines.length > 0 && (
          <motion.div
            key="selected-medicines-section"
            variants={fadeInOut}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-green-50 rounded-xl p-4"
          >
            <h4 className="font-semibold text-green-800 mb-3">
              الأدوية المختارة ({selectedMedicines.length})
            </h4>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              {selectedMedicines.map((medicine) => (
                <motion.div
                  key={medicine.id}
                  variants={item} // Apply the item variant to each tag
                  className="medicine-tag"
                >
                  <span>{medicine.name}</span>
                  <input
                    type="number"
                    min="1"
                    value={medicine.quantity}
                    onChange={(e) =>
                      updateMedicineQuantity(medicine.id, e.target.value)
                    }
                    className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm bg-white"
                  />
                  <motion.button
                    type="button"
                    onClick={() => removeMedicine(medicine.id)}
                    className="text-red-500 hover:text-red-700"
                    whileHover={{ scale: 1.2 }} // Animate the remove button
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Text Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          أو اكتب أدوية إضافية
        </label>
        <textarea
          className="input-field w-full resize-none"
          rows={4}
          placeholder="اكتب أسماء أدوية إضافية هنا، كل دواء في سطر..."
          value={medicineText}
          onChange={handleMedicineTextChange}
        />
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium text-sm">
              طرق إضافة الأدوية:
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• استخدم البحث التلقائي لإضافة أدوية محددة</li>
              <li>• أو اكتب أسماء أدوية إضافية في النص</li>
              <li>• أو ارفع صورة الروشتة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualMedicineEntrySection;