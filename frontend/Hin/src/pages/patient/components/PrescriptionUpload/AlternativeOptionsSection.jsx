import React from "react";
import {
  FaSearch,
  FaCheck,
  FaMinusCircle,
  FaPhoneAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AlternativeOptionsSection = ({
  alternativeOption,
  setAlternativeOption,
}) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <FaExclamationTriangle className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            إذا كان الدواء غير متوفر؟
          </h2>
          <p className="text-red-600 text-sm font-medium">* مطلوب الاختيار</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1: Nearest */}
        <motion.div
          className={`option-card p-5 ${
            alternativeOption === "nearest" ? "selected" : ""
          }`}
          onClick={() => setAlternativeOption("nearest")}
          whileHover={{ scale: 1.05, y: -5 }} // Animate on hover
          whileTap={{ scale: 0.95 }} // Animate on click
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FaSearch className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">بحث عن بديل</h3>
          </div>
          <p className="text-gray-600 text-sm">نختار لك بديل مناسب إن وجد</p>
          {alternativeOption === "nearest" && (
            <div className="mt-3 text-indigo-600 text-sm font-medium">
              <FaCheck className="inline mr-1" /> محدد
            </div>
          )}
        </motion.div>

        {/* Option 2: Change */}
        <motion.div
          className={`option-card p-5 ${
            alternativeOption === "change" ? "selected" : ""
          }`}
          onClick={() => setAlternativeOption("change")}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FaMinusCircle className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">إكمال بدون الناقص</h3>
          </div>
          <p className="text-gray-600 text-sm">
            تجهيز الطلب بدون الأدوية غير المتوفرة
          </p>
          {alternativeOption === "change" && (
            <div className="mt-3 text-indigo-600 text-sm font-medium">
              <FaCheck className="inline mr-1" /> محدد
            </div>
          )}
        </motion.div>

        {/* Option 3: Contact */}
        <motion.div
          className={`option-card p-5 ${
            alternativeOption === "contact" ? "selected" : ""
          }`}
          onClick={() => setAlternativeOption("contact")}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaPhoneAlt className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">التواصل الهاتفي</h3>
          </div>
          <p className="text-gray-600 text-sm">
            نتواصل معك عبر الهاتف لمناقشة البدائل
          </p>
          {alternativeOption === "contact" && (
            <div className="mt-3 text-indigo-600 text-sm font-medium">
              <FaCheck className="inline mr-1" /> محدد
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AlternativeOptionsSection;