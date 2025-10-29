import React from "react";
import {
  FaTimes,
  FaUser,
  FaFileMedical,
  FaStethoscope,
  FaPills,
  FaClock,
  FaCalendarPlus,
  FaInfoCircle,
  FaStickyNote,
  FaTrash,
  FaPrint,
} from "react-icons/fa";

const PrescriptionDetailsModal = ({
  selectedPrescription,
  closePrescriptionDetails,
  getStatusColor,
  getPriorityColor,
  deletePrescription,
}) => {
  if (!selectedPrescription) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closePrescriptionDetails}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl leading-6 font-bold text-gray-900">
                تفاصيل الروشتة
              </h3>
              <button
                onClick={closePrescriptionDetails}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaUser className="ml-2 text-blue-600" />
                  معلومات المريض
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium text-gray-900">
                      {selectedPrescription.patientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم الهوية:</span>
                    <span className="font-medium text-gray-900">
                      {selectedPrescription.patientId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">العمر:</span>
                    <span className="font-medium text-gray-900">
                      {selectedPrescription.patientAge} سنة
                    </span>
                  </div>
                  {selectedPrescription.patientPhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium text-gray-900">
                        {selectedPrescription.patientPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prescription Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaFileMedical className="ml-2 text-green-600" />
                  معلومات الروشتة
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">التاريخ:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedPrescription.date).toLocaleDateString(
                        "ar-EG"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الصيدلية:</span>
                    <span className="font-medium text-gray-900">
                      {selectedPrescription.pharmacy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedPrescription.status
                      )}`}
                    >
                      {selectedPrescription.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الأولوية:</span>
                    <span
                      className={`font-medium ${getPriorityColor(
                        selectedPrescription.priority
                      )}`}
                    >
                      {selectedPrescription.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mt-6 bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FaStethoscope className="ml-2 text-blue-600" />
                التشخيص
              </h4>
              <p className="text-gray-800 font-medium">
                {selectedPrescription.diagnosis}
              </p>
            </div>

            {/* Medications */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaPills className="ml-2 text-purple-600" />
                الأدوية المطلوبة ({selectedPrescription.medications.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPrescription.medications.map((medication, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-gray-900 text-lg">
                        {medication.name}
                      </h5>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        {medication.dosage}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <FaClock className="text-blue-500 ml-2 w-4" />
                        <span className="text-gray-600">التكرار:</span>
                        <span className="font-medium text-gray-900 mr-2">
                          {medication.frequency}
                        </span>
                      </div>
                      {medication.duration && (
                        <div className="flex items-center">
                          <FaCalendarPlus className="text-green-500 ml-2 w-4" />
                          <span className="text-gray-600">المدة:</span>
                          <span className="font-medium text-gray-900 mr-2">
                            {medication.duration}
                          </span>
                        </div>
                      )}
                      {medication.instructions && (
                        <div className="flex items-start">
                          <FaInfoCircle className="text-yellow-500 ml-2 w-4 mt-0.5" />
                          <span className="text-gray-600">التعليمات:</span>
                          <span className="font-medium text-gray-900 mr-2">
                            {medication.instructions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedPrescription.notes && (
              <div className="mt-6 bg-yellow-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaStickyNote className="ml-2 text-yellow-600" />
                  ملاحظات
                </h4>
                <p className="text-gray-800 leading-relaxed">
                  {selectedPrescription.notes}
                </p>
              </div>
            )}

            {/* Next Visit */}
            {selectedPrescription.nextVisit && (
              <div className="mt-6 bg-green-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaCalendarPlus className="ml-2 text-green-600" />
                  موعد المراجعة القادم
                </h4>
                <p className="text-gray-800 font-medium">
                  {new Date(selectedPrescription.nextVisit).toLocaleDateString(
                    "ar-EG"
                  )}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200">
              <button
                onClick={() => deletePrescription(selectedPrescription.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <FaTrash className="ml-2" />
                حذف الروشتة
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <FaPrint className="ml-2" />
                طباعة
              </button>
              <button
                onClick={closePrescriptionDetails}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsModal;
