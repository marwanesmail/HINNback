import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; // 1. Import SweetAlert2
import {
  FaBuilding,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

// NOTE: You must install sweetalert2 in your project: npm install sweetalert2

const CompanyPharmaciesSection = ({
  pharmacies,
  setPharmacies,
  showNotificationMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [newPharmacy, setNewPharmacy] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    manager: "",
    status: "active",
    licenseNumber: "",
    features: [],
  });

  // Filter pharmacies based on search and filters
  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.manager.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || pharmacy.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle input changes for new/edit pharmacy form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPharmacy((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle feature changes
  const handleFeatureChange = (feature, checked) => {
    if (checked) {
      setNewPharmacy((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }));
    } else {
      setNewPharmacy((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f !== feature),
      }));
    }
  };

  // Add new pharmacy
  const addPharmacy = () => {
    if (!newPharmacy.name || !newPharmacy.location) {
      showNotificationMessage("الرجاء تعبئة جميع الحقول المطلوبة", "error");
      return;
    }

    const pharmacy = {
      id: Date.now(),
      ...newPharmacy,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setPharmacies((prev) => [...prev, pharmacy]);
    showNotificationMessage("تم إضافة الصيدلية بنجاح");
    setNewPharmacy({
      name: "",
      location: "",
      phone: "",
      email: "",
      manager: "",
      status: "active",
      licenseNumber: "",
      features: [],
    });
    setShowAddModal(false);
  };

  // Edit pharmacy
  const editPharmacy = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setNewPharmacy({
      name: pharmacy.name,
      location: pharmacy.location,
      phone: pharmacy.phone,
      email: pharmacy.email,
      manager: pharmacy.manager,
      status: pharmacy.status,
      licenseNumber: pharmacy.licenseNumber,
      features: pharmacy.features || [],
    });
    setShowEditModal(true);
  };

  // View pharmacy details
  const viewPharmacyDetails = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowDetailsModal(true);
  };

  // Update pharmacy
  const updatePharmacy = () => {
    if (!newPharmacy.name || !newPharmacy.location) {
      showNotificationMessage("الرجاء تعبئة جميع الحقول المطلوبة", "error");
      return;
    }

    const updatedPharmacy = {
      ...selectedPharmacy,
      ...newPharmacy,
    };

    setPharmacies((prev) =>
      prev.map((p) => (p.id === selectedPharmacy.id ? updatedPharmacy : p))
    );
    showNotificationMessage("تم تحديث الصيدلية بنجاح");
    setNewPharmacy({
      name: "",
      location: "",
      phone: "",
      email: "",
      manager: "",
      status: "active",
      licenseNumber: "",
      features: [],
    });
    setShowEditModal(false);
    setSelectedPharmacy(null);
  };

  // 2. Updated deletePharmacy function to use SweetAlert2
  const deletePharmacy = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذفها!",
      cancelButtonText: "إلغاء",
      customClass: {
        popup: "text-right", // For RTL support (Arabic)
      },
      reverseButtons: true, // Puts confirm button on the right for RTL
    }).then((result) => {
      if (result.isConfirmed) {
        setPharmacies((prev) => prev.filter((p) => p.id !== id));
        showNotificationMessage("تم حذف الصيدلية بنجاح");
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف الصيدلية المختارة.",
          icon: "success",
          customClass: {
            popup: "text-right",
          },
        });
      }
    });
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "نشطة";
      case "inactive":
        return "غير نشطة";
      case "pending":
        return "قيد المراجعة";
      default:
        return "غير معروفة";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Available features
  const availableFeatures = [
    { id: "delivery", name: "خدمة التوصيل" },
    { id: "online", name: "طلب إلكتروني" },
    { id: "insurance", name: "قبول التأمين" },
    { id: "consultation", name: "استشارة مجانية" },
    { id: "emergency", name: "خدمة الطوارئ" },
    { id: "homeCare", name: "رعاية منزلية" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center ml-4">
                <FaBuilding className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  إدارة الصيدليات
                </h3>
                <p className="text-gray-600">
                  إدارة جميع الصيدليات المرتبطة بالشركة
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors"
            >
              <FaPlus className="ml-2" />
              إضافة صيدلية
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث بالاسم أو الموقع..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشطة</option>
                  <option value="inactive">غير نشطة</option>
                  <option value="pending">قيد المراجعة</option>
                </select>
              </div>
            </div>
            <div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-600">إجمالي الصيدليات</p>
                <p className="text-xl font-bold text-gray-900">
                  {pharmacies.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pharmacies List (Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPharmacies.length > 0 ? (
          filteredPharmacies.map((pharmacy) => (
            <motion.div
              key={pharmacy.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6 space-y-4">
                {/* Pharmacy Header & Status */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-start">
                    <FaBuilding className="text-blue-600 text-xl mt-1 ml-3 flex-shrink-0" />
                    <h4 className="text-lg font-bold text-gray-900">
                      {pharmacy.name}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                      pharmacy.status
                    )}`}
                  >
                    {getStatusLabel(pharmacy.status)}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="ml-2 text-gray-500" />
                    <span className="font-medium text-gray-600">الموقع:</span>
                    <span className="mr-2">{pharmacy.location}</span>
                  </p>
                  <p className="flex items-center">
                    <FaUser className="ml-2 text-gray-500" />
                    <span className="font-medium text-gray-600">المدير:</span>
                    <span className="mr-2">
                      {pharmacy.manager || "غير محدد"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <FaCalendarAlt className="ml-2 text-gray-500" />
                    <span className="font-medium text-gray-600">
                      تاريخ الانضمام:
                    </span>
                    <span className="mr-2">{pharmacy.joinDate || "N/A"}</span>
                  </p>
                </div>

                {/* Features (Badges) */}
                <div className="pt-2 border-t border-gray-100">
                  <h5 className="text-xs font-semibold text-gray-500 mb-1">
                    المميزات:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {pharmacy.features && pharmacy.features.length > 0 ? (
                      pharmacy.features.slice(0, 3).map((feature) => {
                        const featureObj = availableFeatures.find(
                          (f) => f.id === feature
                        );
                        return (
                          <span
                            key={`${pharmacy.id}-${feature}`}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs whitespace-nowrap"
                          >
                            {featureObj ? featureObj.name : feature}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400">لا توجد</span>
                    )}
                    {pharmacy.features && pharmacy.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-full text-xs">
                        +{pharmacy.features.length - 3} أخرى
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t border-gray-100">
                  <button
                    onClick={() => viewPharmacyDetails(pharmacy)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    title="عرض التفاصيل"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => editPharmacy(pharmacy)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
                    title="تعديل"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deletePharmacy(pharmacy.id)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors"
                    title="حذف"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FaBuilding className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500">جرب تعديل معايير البحث أو الفلاتر</p>
          </div>
        )}
      </div>

      {/* Modals (Add, Edit, Details) remain the same */}
      {/* ... Add Pharmacy Modal (showAddModal) ... */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  إضافة صيدلية جديدة
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      اسم الصيدلية *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newPharmacy.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل اسم الصيدلية"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      الموقع *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newPharmacy.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل موقع الصيدلية"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      المدير
                    </label>
                    <input
                      type="text"
                      name="manager"
                      value={newPharmacy.manager}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل اسم المدير"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      الهاتف
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={newPharmacy.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newPharmacy.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      رقم الترخيص
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={newPharmacy.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل رقم الترخيص"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      الحالة
                    </label>
                    <select
                      name="status"
                      value={newPharmacy.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">نشطة</option>
                      <option value="inactive">غير نشطة</option>
                      <option value="pending">قيد المراجعة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    المميزات
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFeatures.map((feature) => (
                      <div
                        key={`add-${feature.id}`}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={`add-${feature.id}`}
                          checked={newPharmacy.features.includes(feature.id)}
                          onChange={(e) =>
                            handleFeatureChange(feature.id, e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`add-${feature.id}`}
                          className="mr-2 text-sm text-gray-700"
                        >
                          {feature.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={addPharmacy}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    إضافة الصيدلية
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... Edit Pharmacy Modal (showEditModal) ... */}
      {showEditModal && selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  تعديل الصيدلية
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      اسم الصيدلية *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newPharmacy.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل اسم الصيدلية"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      الموقع *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newPharmacy.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل موقع الصيدلية"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      المدير
                    </label>
                    <input
                      type="text"
                      name="manager"
                      value={newPharmacy.manager}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل اسم المدير"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      الهاتف
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={newPharmacy.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newPharmacy.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      رقم الترخيص
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={newPharmacy.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل رقم الترخيص"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      الحالة
                    </label>
                    <select
                      name="status"
                      value={newPharmacy.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">نشطة</option>
                      <option value="inactive">غير نشطة</option>
                      <option value="pending">قيد المراجعة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    المميزات
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFeatures.map((feature) => (
                      <div
                        key={`edit-${feature.id}`}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={`edit-${feature.id}-${selectedPharmacy.id}`}
                          checked={newPharmacy.features.includes(feature.id)}
                          onChange={(e) =>
                            handleFeatureChange(feature.id, e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`edit-${feature.id}-${selectedPharmacy.id}`}
                          className="mr-2 text-sm text-gray-700"
                        >
                          {feature.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={updatePharmacy}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    تحديث الصيدلية
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... Pharmacy Details Modal (showDetailsModal) ... */}
      {showDetailsModal && selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  تفاصيل الصيدلية
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedPharmacy.name}
                    </h4>
                    <span
                      className={`mr-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedPharmacy.status
                      )}`}
                    >
                      {getStatusLabel(selectedPharmacy.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="ml-1 text-gray-400" />
                    {selectedPharmacy.location}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaUser className="text-gray-400 ml-2" />
                      <span className="text-gray-600">المدير:</span>
                      <span className="mr-2 font-medium">
                        {selectedPharmacy.manager}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 ml-2" />
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="mr-2 font-medium">
                        {selectedPharmacy.phone}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 ml-2" />
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="mr-2 font-medium">
                        {selectedPharmacy.email}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaCheckCircle className="text-gray-400 ml-2" />
                      <span className="text-gray-600">رقم الترخيص:</span>
                      <span className="mr-2 font-medium">
                        {selectedPharmacy.licenseNumber}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 ml-2" />
                      <span className="text-gray-600">تاريخ الانضمام:</span>
                      <span className="mr-2 font-medium">
                        {selectedPharmacy.joinDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">المميزات</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedPharmacy.features &&
                    selectedPharmacy.features.length > 0 ? (
                      selectedPharmacy.features.map((feature) => {
                        const featureObj = availableFeatures.find(
                          (f) => f.id === feature
                        );
                        return (
                          <span
                            key={`detail-${feature}`}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {featureObj ? featureObj.name : feature}
                          </span>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-sm">
                        لا توجد مميزات محددة
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPharmaciesSection;
