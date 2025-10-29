// src/components/Home/QuickOrderCard.jsx
import React from "react";
import { FaBolt, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import prescriptionAnimation from "../../assets/prescription.json";

const QuickOrderCard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleMedicineRequestClick = (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      navigate("/prescription-upload");
    } else {
      Swal.fire({
        title: "يجب تسجيل الدخول أولاً",
        text: "يرجى تسجيل الدخول للمتابعة إلى طلب الدواء",
        icon: "warning",
        confirmButtonText: "حسنًا",
      });
    }
  };

  return (
    <div className="w-100 px-4 lg:px-5 m-4 flex flex-col items-center">
      {/* النص الجديد فوق الكارد */}
      <div className="max-w-6xl w-full mb-4 p-4 text-center bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/40 rounded-2xl shadow-md text-gray-800 font-medium text-sm sm:text-base">
        جميع الأدوية يتم صرفها من صيدليات مرخصة من وزارة الصحة و بوجود وصفة طبية
        من طبيب متخصص
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden mt-2 border border-emerald-200/50 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 backdrop-blur-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-emerald-200/50"
      >
        <button
          onClick={handleMedicineRequestClick}
          className="block w-full h-full"
        >
          {/* الترويسة */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-center py-2 font-bold flex items-center justify-center text-sm sm:text-base relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <FaBolt className="ml-2 text-yellow-300 relative z-10 animate-bounce" />
            <span className="relative z-10">توصيل فوري</span>
            <span className="text-white/90 mr-2 px-1 relative z-10">
              (30-60 دقيقة)
            </span>
          </div>

          {/* جسم الكارد */}
          <div className="flex items-center justify-between p-5 sm:p-4 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-teal-100/20 opacity-50"></div>
            <div className="flex flex-col items-start text-right ml-4 flex-grow relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text mb-1">
                اطلب بالروشتة
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                توصيل فوري وآمن من الصيدلية
              </p>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-300/50 hover:shadow-xl hover:shadow-emerald-400/60"
              >
                ارفع <FaArrowUp className="mr-2 animate-bounce" />
              </motion.span>
            </div>
            <div className="w-20 sm:w-32 flex-shrink-0 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/40 to-teal-200/40 rounded-full blur-2xl animate-pulse"></div>
                <Lottie
                  animationData={prescriptionAnimation}
                  loop={true}
                  className="relative z-10"
                />
              </div>
            </div>
          </div>

          {/* شريط سفلي */}
          <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
        </button>
      </motion.div>
    </div>
  );
};

export default QuickOrderCard;
