import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHistory,
  FaSearch,
  FaCalendarAlt,
  FaNotesMedical,
  FaPrescription,
  FaFileMedical,
  FaFilter,
  FaEye,
  FaTimes,
  FaUserMd, // أيقونة الطبيب
} from "react-icons/fa";

// ************************************************************
// FRAMER MOTION VARIANTS
// ************************************************************
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
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};
// ************************************************************

const DUMMY_MEDICAL_HISTORY = [
  {
    id: 1,
    date: "2024-01-15",
    type: "prescription",
    title: "روشتة طبية - التهاب في الحلق",
    doctor: "د. أحمد محمد علي",
    description:
      "روشتة تحتوي على مضادات حيوية لعلاج التهاب الحلق والجيوب الأنفية",
    details: {
      diagnosis: "التهاب في الحلق والجيوب الأنفية",
      medications: [
        {
          name: "أموكسيسيلين",
          dosage: "500mg",
          frequency: "مرتين يومياً",
          duration: "7 أيام",
          instructions: "بعد الأكل",
        },
        {
          name: "فيتامين سي",
          dosage: "1000mg",
          frequency: "مرة يومياً",
          duration: "30 يوم",
          instructions: "مع الماء",
        },
      ],
      notes: "يجب تناول المضاد الحيوي كاملاً حتى لو تحسنت الأعراض.",
    },
  },
  {
    id: 2,
    date: "2023-12-20",
    type: "medical_record",
    title: "فحص دوري - ضغط الدم",
    doctor: "د. سارة عبدالله",
    description: "فحص دوري لقياس ضغط الدم والأدوية الحالية",
    details: {
      diagnosis: "ضغط الدم المرتفع",
      medications: [
        {
          name: "ليزينوبريل",
          dosage: "10mg",
          frequency: "مرة يومياً",
          duration: "مستمر",
          instructions: "قبل الإفطار",
        },
      ],
      notes: "الحفاظ على نظام غذائي منخفض الملح وممارسة الرياضة",
    },
  },
];

const PatientMedicalHistorySection = () => {
  const [medicalHistory] = useState(DUMMY_MEDICAL_HISTORY);
  const [filteredHistory, setFilteredHistory] = useState(DUMMY_MEDICAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let result = medicalHistory;

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.doctor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateFilter) {
      result = result.filter((item) => item.date === dateFilter);
    }

    if (typeFilter) {
      result = result.filter((item) => item.type === typeFilter);
    }

    // فرز حسب التاريخ الأحدث أولاً
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredHistory(result);
  }, [searchQuery, dateFilter, typeFilter, medicalHistory]);

  const showDetails = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const getTypeIcon = (type) => {
    switch (type) {
      case "prescription":
        return <FaPrescription className="text-blue-600 text-xl" />;
      case "medical_record":
        return <FaFileMedical className="text-green-600 text-xl" />;
      default:
        return <FaNotesMedical className="text-purple-600 text-xl" />;
    }
  };

  const getTypeIconContainerColor = (type) => {
    switch (type) {
      case "prescription":
        return "bg-blue-100";
      case "medical_record":
        return "bg-green-100";
      default:
        return "bg-purple-100";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "prescription":
        return "روشتة طبية";
      case "medical_record":
        return "سجل طبي";
      default:
        return "سجل طبي";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "prescription":
        return "bg-blue-100 text-blue-800";
      case "medical_record":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center ml-4">
            <FaHistory className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">السجل الطبي</h3>
            <p className="text-gray-600">جميع السجلات الطبية السابقة</p>
          </div>
        </div>
      </motion.div>

      {/* Filters (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في السجل الطبي..."
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            <option value="prescription">الروشتات الطبية</option>
            <option value="medical_record">السجلات الطبية</option>
          </select>
        </div>
      </div>

      {/* Medical History Cards List with motion */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{
                y: -3,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col justify-between h-full cursor-pointer"
              onClick={() => showDetails(item)}
            >
              <div className="flex flex-col flex-grow">
                {/* Icon and Type Tag */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${getTypeIconContainerColor(
                      item.type
                    )} rounded-full flex items-center justify-center`}
                  >
                    {getTypeIcon(item.type)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      item.type
                    )}`}
                  >
                    {getTypeLabel(item.type)}
                  </span>
                </div>

                {/* Title and Description */}
                <h4 className="text-lg font-bold text-gray-900 mb-2 truncate">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {item.description}
                </p>
              </div>

              {/* Footer (Date and Doctor) */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="ml-2 text-gray-400" />
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700 font-medium">
                  <FaUserMd className="ml-2 text-blue-500" />
                  <span className="truncate">{item.doctor}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showDetails(item);
                  }}
                  className="w-full mt-3 flex items-center justify-center text-blue-600 hover:text-blue-700 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 font-medium text-sm transition-colors duration-200"
                >
                  <FaEye className="ml-2" /> عرض التفاصيل
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="md:col-span-2 lg:col-span-3 xl:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <FaHistory className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500">جرب تعديل معايير البحث أو الفلاتر</p>
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-xl max-w-lg md:max-w-2xl w-full max-h-[95vh] overflow-y-auto p-6 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Summary Info */}
              <div className="mb-4">
                <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                <div className="flex flex-wrap text-sm text-gray-500 mb-3">
                  <div className="flex items-center ml-4">
                    <FaCalendarAlt className="ml-1" />
                    <span>{formatDate(selectedItem.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUserMd className="ml-1 text-blue-500" />
                    <span>الطبيب: {selectedItem.doctor}</span>
                  </div>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                    selectedItem.type
                  )}`}
                >
                  {getTypeLabel(selectedItem.type)}
                </span>
              </div>

              {/* Details Section */}
              <div className="mt-6 space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold mb-1 text-blue-800 flex items-center">
                    <FaFileMedical className="ml-2" /> التشخيص
                  </h5>
                  <p className="text-gray-800">
                    {selectedItem.details.diagnosis}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="font-semibold mb-3 text-gray-800 flex items-center">
                    <FaPrescription className="ml-2" /> الأدوية الموصوفة
                  </h5>
                  <div className="space-y-3">
                    {selectedItem.details.medications.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-3 border-b last:border-b-0 border-gray-200 bg-white rounded-md shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <h6 className="font-medium text-lg text-gray-900">
                            {med.name}
                          </h6>
                          <span className="text-gray-600 font-semibold text-base whitespace-nowrap">
                            {med.dosage}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {med.frequency} • {med.duration}
                        </p>
                        {med.instructions && (
                          <p className="text-gray-700 text-sm mt-1 bg-yellow-50 p-1 rounded border border-yellow-100">
                            <span className="font-medium text-blue-600">
                              التعليمات:
                            </span>{" "}
                            {med.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedItem.details.notes && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold mb-1 text-green-800 flex items-center">
                      <FaNotesMedical className="ml-2" /> ملاحظات الطبيب
                    </h5>
                    <p className="text-gray-800">
                      {selectedItem.details.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => window.print()}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  طباعة
                </button>
                <button
                  onClick={closeModal}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientMedicalHistorySection;
