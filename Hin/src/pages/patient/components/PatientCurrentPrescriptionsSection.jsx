import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPrescription,
  FaEye,
  FaShoppingCart,
  FaDownload,
  FaUserMd,
  FaUser,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const PatientCurrentPrescriptionsSection = () => {
  // Mock data for prescriptions
  const [prescriptions] = useState([
    {
      id: 1,
      doctorName: "د. أحمد محمد",
      doctorSpecialty: "أخصائي طب عام",
      date: "2024-01-15",
      status: "جديد",
      patientName: "محمد أحمد علي",
      patientAge: 35,
      patientPhone: "01234567890",
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
        {
          name: "مسكن للألم",
          dosage: "500mg",
          frequency: "عند الحاجة",
          duration: "5 أيام",
          instructions: "لا يزيد عن 3 مرات يومياً",
        },
      ],
      notes:
        "يجب تناول المضاد الحيوي كاملاً حتى لو تحسنت الأعراض. مراجعة بعد أسبوع إذا لم تتحسن الحالة.",
    },
    {
      id: 2,
      doctorName: "د. سارة عبدالله",
      doctorSpecialty: "أخصائية طب الأطفال",
      date: "2024-01-10",
      status: "قيد التنفيذ",
      patientName: "ليلى السيد أحمد",
      patientAge: 28,
      patientPhone: "01987654321",
      diagnosis: "حمى وصداع",
      medications: [
        {
          name: "إيبوبروفين",
          dosage: "400mg",
          frequency: "مرة كل 8 ساعات",
          duration: "3 أيام",
          instructions: "بعد الأكل",
        },
        {
          name: "شراب كحة",
          dosage: "10ml",
          frequency: "مرتين يومياً",
          duration: "5 أيام",
          instructions: "قبل النوم",
        },
      ],
      notes: "الحفاظ على شرب الكثير من الماء والراحة التامة.",
    },
  ]);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [orderStep, setOrderStep] = useState(1); // 1: select pharmacy, 2: review order, 3: order status
  const [locationPermission, setLocationPermission] = useState("prompt"); // // prompt, granted, denied

  // Mock pharmacies data
  const pharmacies = [
    { id: 1, name: "صيدلية الشفاء", distance: "0.8 كم", rating: 4.8 },
    { id: 2, name: "صيدلية الرحمة", distance: "1.2 كم", rating: 4.5 },
    { id: 3, name: "صيدلية الحياة", distance: "2.1 كم", rating: 4.2 },
  ];

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleOrderMedicines = (prescription) => {
    setSelectedPrescription(prescription);
    setShowOrderForm(true);
    setOrderStep(1);
  };

  const handlePharmacySelect = (pharmacyId) => {
    setSelectedPharmacy(pharmacyId);
    setOrderStep(2);
  };

  const confirmOrder = () => {
    setOrderStep(3);
    // Here you would typically make an API call to place the order
    setTimeout(() => {
      // Reset after showing confirmation
      setTimeout(() => {
        setShowOrderForm(false);
        setSelectedPrescription(null);
        setSelectedPharmacy("");
        setOrderStep(1);
      }, 3000);
    }, 2000);
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission("granted");
        },
        () => {
          setLocationPermission("denied");
        }
      );
    } else {
      setLocationPermission("denied");
    }
  };

  const downloadPrescriptionAsPDF = (prescription) => {
    // Create HTML content for the prescription
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>روشتة طبية - ${prescription.doctorName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            direction: rtl;
            text-align: right;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: bold;
            width: 150px;
          }
          .info-value {
            flex: 1;
          }
          .medication {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            border-right: 3px solid #6366f1;
          }
          .medication-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
          }
          .medication-details {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          .medication-detail {
            background-color: #e0e7ff;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>روشتة طبية</h1>
          <p>تاريخ الإصدار: ${new Date(prescription.date).toLocaleDateString(
            "ar-EG"
          )}</p>
        </div>
        
        <div class="section">
          <div class="section-title">معلومات الطبيب</div>
          <div class="info-row">
            <div class="info-label">الاسم:</div>
            <div class="info-value">${prescription.doctorName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">التخصص:</div>
            <div class="info-value">${prescription.doctorSpecialty}</div>
          </div>
          <div class="info-row">
            <div class="info-label">الحالة:</div>
            <div class="info-value">${prescription.status}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">معلومات المريض</div>
          <div class="info-row">
            <div class="info-label">الاسم:</div>
            <div class="info-value">${prescription.patientName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">العمر:</div>
            <div class="info-value">${prescription.patientAge} سنة</div>
          </div>
          <div class="info-row">
            <div class="info-label">رقم الهاتف:</div>
            <div class="info-value">${prescription.patientPhone}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">التشخيص</div>
          <p>${prescription.diagnosis}</p>
        </div>
        
        <div class="section">
          <div class="section-title">الأدوية</div>
          ${prescription.medications
            .map(
              (med, index) => `
            <div class="medication">
              <div class="medication-name">${index + 1}. ${med.name}</div>
              <div class="medication-details">
                <div class="medication-detail">الجرعة: ${med.dosage}</div>
                <div class="medication-detail">التكرار: ${med.frequency}</div>
                <div class="medication-detail">المدة: ${med.duration}</div>
              </div>
              ${
                med.instructions
                  ? `<div style="margin-top: 10px;"><strong>التعليمات:</strong> ${med.instructions}</div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
        
        ${
          prescription.notes
            ? `
        <div class="section">
          <div class="section-title">ملاحظات الطبيب</div>
          <p>${prescription.notes}</p>
        </div>
        `
            : ""
        }
        
        <div class="footer">
          <p>تم إنشاء هذه الروشتة إلكترونيًا</p>
          <p>© ${new Date().getFullYear()} نظام هن الصحي</p>
        </div>
      </body>
      </html>
    `;

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rosheta-${prescription.id}-${new Date().getTime()}.html`;

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-800";
      case "قيد التنفيذ":
        return "bg-yellow-100 text-yellow-800";
      case "مكتمل":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          الروشتات الطبية
        </h3>
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Prescription Summary Card */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaUserMd className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {prescription.doctorName}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {prescription.doctorSpecialty}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-gray-600 text-sm">
                          التاريخ:{" "}
                          {new Date(prescription.date).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {prescription.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewPrescription(prescription)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors duration-200"
                  >
                    <FaEye />
                    عرض
                  </button>
                  <button
                    onClick={() => handleOrderMedicines(prescription)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full transition-colors duration-200"
                  >
                    <FaShoppingCart />
                    طلب الأدوية
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Prescription Details Modal */}
      {selectedPrescription && !showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPrescription(null)}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 shadow-md z-10"
            >
              ✕
            </button>

            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  تفاصيل الروشتة
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Doctor Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUserMd className="ml-2 text-blue-600" />
                  معلومات الطبيب
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">الاسم</p>
                    <p className="font-medium">
                      {selectedPrescription.doctorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">التخصص</p>
                    <p className="font-medium">
                      {selectedPrescription.doctorSpecialty}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">التاريخ</p>
                    <p className="font-medium">
                      {new Date(selectedPrescription.date).toLocaleDateString(
                        "ar-EG"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">الحالة</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedPrescription.status
                      )}`}
                    >
                      {selectedPrescription.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUser className="ml-2 text-green-600" />
                  معلومات المريض
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">الاسم</p>
                    <p className="font-medium">
                      {selectedPrescription.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">العمر</p>
                    <p className="font-medium">
                      {selectedPrescription.patientAge} سنة
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">رقم الهاتف</p>
                    <p className="font-medium">
                      {selectedPrescription.patientPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">التشخيص</h4>
                <p className="text-gray-700">
                  {selectedPrescription.diagnosis}
                </p>
              </div>

              {/* Medications */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">الأدوية</h4>
                <div className="space-y-4">
                  {selectedPrescription.medications.map((med, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-gray-900">
                            {med.name}
                          </h5>
                          <p className="text-gray-600 text-sm mt-1">
                            {med.instructions}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {med.dosage}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            {med.frequency}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                            {med.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPrescription.notes && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    ملاحظات الطبيب
                  </h4>
                  <p className="text-gray-700">{selectedPrescription.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => handleOrderMedicines(selectedPrescription)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <FaShoppingCart />
                  طلب الأدوية
                </button>
                <button
                  onClick={() =>
                    downloadPrescriptionAsPDF(selectedPrescription)
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <FaDownload />
                  تحميل كـ PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Order Medicines Form */}
      {showOrderForm && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">طلب الأدوية</h3>
                <button
                  onClick={() => {
                    setShowOrderForm(false);
                    setSelectedPrescription(null);
                    setSelectedPharmacy("");
                    setOrderStep(1);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
                {[1, 2, 3].map((step) => (
                  <div key={step} className="relative z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        orderStep >= step
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <div className="text-xs mt-2 text-center text-gray-600">
                      {step === 1 && "الصيدلية"}
                      {step === 2 && "مراجعة"}
                      {step === 3 && "الحالة"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 1: Select Pharmacy */}
              {orderStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h4 className="text-lg font-semibold text-gray-900">
                    اختر الصيدلية
                  </h4>

                  {/* Location Permission Alert */}
                  {locationPermission === "prompt" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-blue-900">
                            الوصول إلى الموقع
                          </h5>
                          <p className="text-blue-800 text-sm mt-1">
                            لتقديم الصيدليات الأقرب إليك، نحتاج إلى إذن الوصول
                            إلى موقعك
                          </p>
                          <button
                            onClick={requestLocationPermission}
                            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            السماح بالوصول إلى الموقع
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {locationPermission === "denied" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-yellow-900">
                            الوصول إلى الموقع مرفوض
                          </h5>
                          <p className="text-yellow-800 text-sm mt-1">
                            تم رفض إذن الوصول إلى الموقع. يمكنك اختيار الصيدلية
                            يدويًا.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {locationPermission === "granted" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-green-900">
                            تم تمكين الموقع
                          </h5>
                          <p className="text-green-800 text-sm mt-1">
                            سيتم عرض الصيدليات الأقرب إلى موقعك
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pharmacy List */}
                  <div className="space-y-4">
                    {pharmacies.map((pharmacy) => (
                      <div
                        key={pharmacy.id}
                        onClick={() => handlePharmacySelect(pharmacy.id)}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedPharmacy === pharmacy.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-bold text-gray-900">
                              {pharmacy.name}
                            </h5>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-gray-600 text-sm">
                                <FaMapMarkerAlt className="inline ml-1" />
                                {pharmacy.distance}
                              </span>
                              <span className="text-gray-600 text-sm">
                                ⭐ {pharmacy.rating}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 ${
                              selectedPharmacy === pharmacy.id
                                ? "bg-purple-600 border-purple-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedPharmacy === pharmacy.id && (
                              <FaCheckCircle className="text-white text-xs" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowOrderForm(false);
                        setSelectedPrescription(null);
                        setSelectedPharmacy("");
                      }}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() =>
                        selectedPharmacy &&
                        handlePharmacySelect(selectedPharmacy)
                      }
                      disabled={!selectedPharmacy}
                      className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center ${
                        selectedPharmacy
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      متابعة
                      <FaArrowRight className="mr-2" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review Order */}
              {orderStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h4 className="text-lg font-semibold text-gray-900">
                    مراجعة الطلب
                  </h4>

                  {/* Selected Pharmacy */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">
                      الصيدلية المختارة
                    </h5>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {
                            pharmacies.find((p) => p.id === selectedPharmacy)
                              ?.name
                          }
                        </p>
                        <p className="text-gray-600 text-sm">
                          {
                            pharmacies.find((p) => p.id === selectedPharmacy)
                              ?.distance
                          }{" "}
                          • ⭐{" "}
                          {
                            pharmacies.find((p) => p.id === selectedPharmacy)
                              ?.rating
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => setOrderStep(1)}
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        تغيير
                      </button>
                    </div>
                  </div>

                  {/* Prescription Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">الروشتة</h5>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <FaPrescription className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedPrescription.doctorName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {new Date(
                            selectedPrescription.date
                          ).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h6 className="font-medium text-gray-900 mb-2">
                        الأدوية المطلوبة:
                      </h6>
                      <ul className="space-y-2">
                        {selectedPrescription.medications.map((med, index) => (
                          <li
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>{med.name}</span>
                            <span className="text-gray-600">{med.dosage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setOrderStep(1)}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      السابق
                    </button>
                    <button
                      onClick={confirmOrder}
                      className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      تأكيد الطلب
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Order Status */}
              {orderStep === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    تم تقديم الطلب
                  </h4>
                  <p className="text-gray-600 mb-6">
                    تم إرسال طلب الأدوية إلى الصيدلية المختارة بنجاح
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="font-medium">
                      رقم الطلب: #RX-{selectedPrescription.id}-
                      {Date.now().toString().slice(-4)}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      سيتم إعلامك عندما تكون الأدوية جاهزة للاستلام
                    </p>
                    <button
                      onClick={() =>
                        downloadPrescriptionAsPDF(selectedPrescription)
                      }
                      className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <FaDownload />
                      تحميل تفاصيل الطلب كـ PDF
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientCurrentPrescriptionsSection;
