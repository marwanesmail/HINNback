// src/components/Home/CtaSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

// Variants for container & stagger
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

// لكل عنصر داخلي
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const CtaSection = () => {
  return (
    <section
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
      id="cta"
    >
      {/* عناصر ديكورية متحركة */}
      <div className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 rounded-full animate-bounce"></div>
      <div
        className="absolute bottom-8 left-8 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 opacity-20 rounded-full animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* العنوان */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6"
          >
            ابدأ الآن مع نظام
            <span className="text-blue-600"> هيِّن</span>
          </motion.h2>

          {/* الوصف */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            انضم إلى آلاف المستخدمين الذين يستفيدون من خدماتنا لتبسيط عملية وصف
            وصرف الأدوية وتحسين جودة الرعاية الصحية
          </motion.p>

          {/* الإحصائيات */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-gray-300"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                1000+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                طبيب مسجل
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                500+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                صيدلية شريكة
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                10000+
              </div>
              <div className="text-gray-600 text-sm sm:text-base">
                روشتة تم تنفيذها
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
