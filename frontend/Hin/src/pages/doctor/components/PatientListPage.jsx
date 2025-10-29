import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaEye,
  FaStickyNote,
  FaPrescription,
  FaUser,
  FaTimes,
  FaHistory,
  FaMale,
  FaFemale,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCopy,
  FaDownload,
} from "react-icons/fa";

const PatientListPage = ({ onNavigateToPrescription }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // info, visits, prescriptions

  // Dummy patient data (omitted for brevity, assume it's here)
  const dummyPatients = [
    {
      id: 1,
      fullName: "ليلى السيد أحمد",
      age: 35,
      gender: "أنثى",
      lastVisit: "2024-01-15",
      status: "نشط",
      phone: "01234567890",
      email: "leyla@example.com",
      address: "القاهرة، مصر",
      medicalHistory: "التهاب في الحلق والجيوب الأنفية",
      fileNumber: "P-2024-001",
      visits: [
        {
          id: 1,
          date: "2024-01-15",
          diagnosis: "التهاب في الحلق والجيوب الأنفية",
          treatment: "أموكسيسيلين 500mg",
          notes: "المريض يشكو من التهاب في الحلق والجيوب الأنفية",
          files: [],
        },
        {
          id: 2,
          date: "2024-01-08",
          diagnosis: "متابعة روتينية",
          treatment: "فيتامينات",
          notes: "حالة المريض مستقرة",
          files: [],
        },
      ],
      prescriptions: [
        {
          id: 1,
          date: "2024-01-15",
          diagnosis: "التهاب في الحلق والجيوب الأنفية",
          medications: [
            {
              name: "أموكسيسيلين",
              dosage: "500mg",
              frequency: "مرتين يومياً",
              duration: "7 أيام",
            },
          ],
        },
      ],
      notes: [
        {
          id: 1,
          date: "2024-01-15",
          content: "المريض يشكو من التهاب في الحلق والجيوب الأنفية",
          doctor: "د. أحمد محمد علي",
          private: true,
        },
      ],
      nextAppointment: "2024-01-22",
    },
    {
      id: 2,
      fullName: "محمود خالد محمد",
      age: 42,
      gender: "ذكر",
      lastVisit: "2024-01-14",
      status: "قيد المتابعة",
      phone: "01987654321",
      email: "mahmoud@example.com",
      address: "الإسكندرية، مصر",
      medicalHistory: "صداع نصفي",
      fileNumber: "P-2024-002",
      visits: [
        {
          id: 1,
          date: "2024-01-14",
          diagnosis: "صداع نصفي",
          treatment: "باراسيتامول",
          notes: "المريض يشكو من صداع نصفي متكرر",
          files: [],
        },
      ],
      prescriptions: [
        {
          id: 1,
          date: "2024-01-14",
          diagnosis: "صداع نصفي",
          medications: [
            {
              name: "باراسيتامول",
              dosage: "500mg",
              frequency: "عند الحاجة",
              duration: "3 أيام",
            },
          ],
        },
      ],
      notes: [
        {
          id: 1,
          date: "2024-01-14",
          content: "المريض يشكو من صداع نصفي متكرر",
          doctor: "د. أحمد محمد علي",
          private: true,
        },
      ],
      nextAppointment: null,
    },
    {
      id: 3,
      fullName: "فاطمة علي حسن",
      age: 28,
      gender: "أنثى",
      lastVisit: "2024-01-13",
      status: "تم الشفاء",
      phone: "01122334455",
      email: "fatima@example.com",
      address: "الجيزة، مصر",
      medicalHistory: "التهاب المعدة",
      fileNumber: "P-2024-003",
      visits: [
        {
          id: 1,
          date: "2024-01-13",
          diagnosis: "التهاب المعدة",
          treatment: "مضاد للحموضة",
          notes: "المريض يشكو من التهاب في المعدة",
          files: [],
        },
      ],
      prescriptions: [],
      notes: [
        {
          id: 1,
          date: "2024-01-13",
          content: "المريض يشكو من التهاب في المعدة",
          doctor: "د. أحمد محمد علي",
          private: false,
        },
      ],
      nextAppointment: null,
    },
    {
      id: 4,
      fullName: "عمر عبد الرحمن",
      age: 55,
      gender: "ذكر",
      lastVisit: "2024-01-10",
      status: "نشط",
      phone: "01556677889",
      email: "omar@example.com",
      address: "المنصورة، مصر",
      medicalHistory: "ضغط الدم المرتفع",
      fileNumber: "P-2024-004",
      visits: [
        {
          id: 1,
          date: "2024-01-10",
          diagnosis: "فحص دوري لضغط الدم",
          treatment: "أدوية ضغط الدم",
          notes: "فحص دوري لضغط الدم",
          files: [],
        },
      ],
      prescriptions: [],
      notes: [
        {
          id: 1,
          date: "2024-01-10",
          content: "فحص دوري لضغط الدم",
          doctor: "د. أحمد محمد علي",
          private: false,
        },
      ],
      nextAppointment: "2024-02-10",
    },
    {
      id: 5,
      fullName: "سارة محمد عبد الله",
      age: 29,
      gender: "أنثى",
      lastVisit: "2024-01-08",
      status: "قيد المتابعة",
      phone: "01011223344",
      email: "sara@example.com",
      address: "طنطا، مصر",
      medicalHistory: "حساسية الربيع",
      fileNumber: "P-2024-005",
      visits: [
        {
          id: 1,
          date: "2024-01-08",
          diagnosis: "التحسس من حبوب اللقاح",
          treatment: "مضادات الهيستامين",
          notes: "التحسس من حبوب اللقاح",
          files: [],
        },
      ],
      prescriptions: [],
      notes: [
        {
          id: 1,
          date: "2024-01-08",
          content: "التحسس من حبوب اللقاح",
          doctor: "د. أحمد محمد علي",
          private: true,
        },
      ],
      nextAppointment: "2024-02-08",
    },
  ];

  // Initialize patients data
  useEffect(() => {
    setPatients(dummyPatients);
    setFilteredPatients(dummyPatients);
  }, []);

  // Filter patients based on search and filters
  useEffect(() => {
    let result = patients;

    if (searchQuery) {
      result = result.filter((patient) =>
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (ageFilter) {
      const age = parseInt(ageFilter);
      if (!isNaN(age)) {
        result = result.filter((patient) => patient.age === age);
      }
    }

    if (statusFilter) {
      result = result.filter((patient) => patient.status === statusFilter);
    }

    setFilteredPatients(result);
  }, [searchQuery, ageFilter, statusFilter, patients]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-800";
      case "قيد المتابعة":
        return "bg-yellow-100 text-yellow-800";
      case "تم الشفاء":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Animation variants for the patient list
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const listItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    exit: { y: -20, opacity: 0 },
  };

  // Handle actions
  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setActiveTab("info");
    setShowDetailsModal(true);
  };

  const handleCreatePrescription = (patient) => {
    if (onNavigateToPrescription) {
      onNavigateToPrescription(patient);
    }
  };

  // Modal variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">
          إدارة جميع المرضى والوصول السريع إلى معلوماتهم
        </h2>
        <p className="text-gray-600">
          عرض قائمة المرضى مع إمكانية البحث والتصفية وإدارة تفاصيل كل مريض
        </p>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 rounded-lg p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name Search */}
          <div>
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث بالاسم..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Age Filter */}
          <div>
            <input
              type="number"
              placeholder="العمر"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="قيد المتابعة">قيد المتابعة</option>
              <option value="تم الشفاء">تم الشفاء</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Patient List Container */}
      <motion.div
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              variants={listItemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              exit="exit"
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600 text-lg" />
                    </div>
                    <div className="mr-3">
                      <h3 className="font-bold text-gray-900">
                        {patient.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        العمر: {patient.age} سنة
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">آخر زيارة:</span>
                    <span className="font-medium">{patient.lastVisit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">رقم الهاتف:</span>
                    <span className="font-medium">{patient.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">الجنس:</span>
                    <span className="font-medium flex items-center">
                      {patient.gender === "ذكر" ? (
                        <FaMale className="text-blue-500 ml-1" />
                      ) : (
                        <FaFemale className="text-pink-500 ml-1" />
                      )}
                      {patient.gender}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(patient)}
                    className="flex items-center justify-center py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <FaEye className="ml-1" />
                    <span>عرض التفاصيل</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCreatePrescription(patient)}
                    className="flex items-center justify-center py-2 px-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                  >
                    <FaPrescription className="ml-1" />
                    <span>روشتة جديدة</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No patients message */}
      {filteredPatients.length === 0 && (
        <motion.div
          key="no-patients-msg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12"
        >
          <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500">جرب تعديل معايير البحث أو الفلاتر</p>
        </motion.div>
      )}

      {/* Patient Details Modal - Enhanced with Tabs */}
      <AnimatePresence>
        {showDetailsModal && selectedPatient && (
          <motion.div
            key="details-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              key="details-modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    تفاصيل المريض
                  </h3>
                  <motion.button
                    whileTap={{ rotate: 90 }}
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes className="text-xl" />
                  </motion.button>
                </div>

                {/* Patient Basic Info Card */}
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-6">
                  <div className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-3xl" />
                  </div>
                  <div className="mr-4 flex-1">
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedPatient.fullName}
                    </h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-600">
                        العمر: {selectedPatient.age} سنة
                      </span>
                      <span className="text-gray-600 flex items-center">
                        {selectedPatient.gender === "ذكر" ? (
                          <FaMale className="text-blue-500 ml-1" />
                        ) : (
                          <FaFemale className="text-pink-500 ml-1" />
                        )}
                        {selectedPatient.gender}
                      </span>
                    </div>
                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedPatient.status
                      )}`}
                    >
                      {selectedPatient.status}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex gap-2">
                    {[
                      { id: "info", label: "المعلومات الأساسية", icon: FaUser },
                      { id: "visits", label: "سجل الزيارات", icon: FaHistory },
                      {
                        id: "prescriptions",
                        label: "الروشتات",
                        icon: FaPrescription,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <tab.icon className="ml-2" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                  {/* Basic Info Tab */}
                  {activeTab === "info" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                            <FaPhone className="ml-2 text-blue-500" />
                            معلومات الاتصال
                          </h5>
                          <div className="space-y-2">
                            <p className="text-gray-600 flex items-center">
                              <FaPhone className="ml-2 text-gray-400" />
                              الهاتف: {selectedPatient.phone}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <FaEnvelope className="ml-2 text-gray-400" />
                              البريد الإلكتروني: {selectedPatient.email}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <FaMapMarkerAlt className="ml-2 text-gray-400" />
                              العنوان: {selectedPatient.address}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h5 className="font-bold text-gray-900 mb-3">
                            معلومات طبية
                          </h5>
                          <div className="space-y-2">
                            <p className="text-gray-600">
                              <span className="font-medium">آخر زيارة:</span>{" "}
                              {selectedPatient.lastVisit}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">السجل الطبي:</span>{" "}
                              {selectedPatient.medicalHistory}
                            </p>
                            {selectedPatient.nextAppointment && (
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  الموعد القادم:
                                </span>{" "}
                                {selectedPatient.nextAppointment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Visits History Tab */}
                  {activeTab === "visits" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {selectedPatient.visits &&
                      selectedPatient.visits.length > 0 ? (
                        selectedPatient.visits.map((visit) => (
                          <div
                            key={visit.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-bold text-gray-900">
                                زيارة {visit.date}
                              </h5>
                              <span className="text-xs text-gray-500">
                                {visit.date}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-gray-700">
                                  التشخيص:
                                </span>
                                <p className="text-gray-600 mt-1">
                                  {visit.diagnosis}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  العلاج:
                                </span>
                                <p className="text-gray-600 mt-1">
                                  {visit.treatment}
                                </p>
                              </div>
                              {visit.notes && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    ملاحظات الطبيب:
                                  </span>
                                  <p className="text-gray-600 mt-1">
                                    {visit.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FaHistory className="mx-auto text-4xl text-gray-300 mb-3" />
                          <p className="text-gray-500">لا يوجد سجل زيارات</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Prescriptions Tab */}
                  {activeTab === "prescriptions" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {selectedPatient.prescriptions &&
                      selectedPatient.prescriptions.length > 0 ? (
                        selectedPatient.prescriptions.map((prescription) => (
                          <div
                            key={prescription.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-bold text-gray-900">
                                روشتة {prescription.date}
                              </h5>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-gray-700">
                                  التشخيص:
                                </span>
                                <p className="text-gray-600 mt-1">
                                  {prescription.diagnosis}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  الأدوية:
                                </span>
                                <ul className="mt-2 space-y-2">
                                  {prescription.medications.map((med, idx) => (
                                    <li
                                      key={idx}
                                      className="p-2 bg-gray-50 rounded text-sm"
                                    >
                                      <span className="font-medium">
                                        {med.name}
                                      </span>{" "}
                                      - {med.dosage} - {med.frequency}
                                      {med.duration && ` لمدة ${med.duration}`}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FaPrescription className="mx-auto text-4xl text-gray-300 mb-3" />
                          <p className="text-gray-500">لا توجد روشتات</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {selectedPatient.notes &&
                      selectedPatient.notes.length > 0 ? (
                        selectedPatient.notes.map((note) => (
                          <motion.div
                            key={note.id}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`p-4 rounded-lg ${
                              note.private
                                ? "bg-yellow-50 border border-yellow-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  {note.doctor}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {note.date}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">{note.content}</p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <FaStickyNote className="mx-auto text-4xl text-gray-300 mb-3" />
                          <p className="text-gray-500">لا توجد ملاحظات</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatientListPage;
