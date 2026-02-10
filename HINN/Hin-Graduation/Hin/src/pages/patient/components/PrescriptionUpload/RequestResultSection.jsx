import React from "react";
import {
  FaCheck,
  FaInfoCircle,
  FaStar,
  FaRegStar,
  FaRegStarHalf,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RequestResultSection = ({
  requestResult,
  nearbyPharmacies,
  setRequestSent,
  setRequestResult,
  setNearbyPharmacies,
  setPatientName,
  setPatientPhone,
  setLocation,
  setActiveTab,
}) => {
  // Variants for staggering animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay between each child's animation
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar
          key={`full-${i}`}
          className="text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaRegStarHalf
          key="half"
          className="text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar
          key={`empty-${i}`}
          className="text-yellow-400"
        />
      );
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <motion.div
      className="modern-card mt-8 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <motion.div // Animate the success icon container
          initial={{ scale: 0.5, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FaCheck className="text-white text-3xl" />
        </motion.div>
        <h3 className="text-2xl font-bold text-green-800 mb-3">
          تم إرسال طلبك بنجاح!
        </h3>
        <p className="text-gray-600 text-lg">{requestResult.message}</p>
      </div>

      {nearbyPharmacies.length > 0 && (
        <div>
          <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
            الصيدليات التي تم إرسال الطلب إليها:
          </h4>
          <motion.div // Stagger the pharmacy cards
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {nearbyPharmacies.map((pharmacy) => (
              <motion.div // Animate each pharmacy card
                key={pharmacy.id}
                className="pharmacy-card p-5 bg-white"
                variants={itemVariants}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h5 className="font-bold text-lg text-gray-900">
                    {pharmacy.name}
                  </h5>
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {pharmacy.distanceText}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{pharmacy.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderRating(pharmacy.rating)}
                    <span className="text-sm text-gray-600">
                      {pharmacy.rating}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        pharmacy.isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pharmacy.isOpen ? "مفتوح" : "مغلق"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <div className="mt-8 p-5 bg-blue-50 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FaInfoCircle className="text-white text-lg" />
          </div>
          <div>
            <h5 className="font-bold text-blue-800 mb-2">ماذا بعد؟</h5>
            <p className="text-blue-600">
              ستتلقى إشعاراً عندما ترد إحدى الصيدليات على طلبك. يمكنك أيضاً
              الاتصال بالصيدليات مباشرة.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <motion.button
          onClick={() => {
            setRequestSent(false);
            setRequestResult(null);
            setNearbyPharmacies([]);
            setPatientName("");
            setPatientPhone("");
            setLocation(null);
            setActiveTab("upload");
          }}
          className="primary-button px-8 py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          طلب دواء جديد
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RequestResultSection;