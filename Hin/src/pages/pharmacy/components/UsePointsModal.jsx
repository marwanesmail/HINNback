import React from "react";
import { FaStar } from "react-icons/fa";

const UsePointsModal = ({
  showPointsModal,
  setShowPointsModal,
  selectedPrescription,
  pointsToUse,
  setPointsToUse,
  applyPoints,
}) => {
  if (!showPointsModal || !selectedPrescription) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowPointsModal(false)}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-right w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  استخدام نقاط العميل
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-500 ml-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        العميل: {selectedPrescription.patientName}
                      </p>
                      <p className="text-sm text-yellow-700">
                        النقاط المتاحة: {selectedPrescription.points} نقطة
                      </p>
                      <p className="text-sm text-yellow-700">
                        قيمة النقطة: 0.5 جنيه
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={applyPoints} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد النقاط المراد استخدامها
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedPrescription.points}
                      value={pointsToUse}
                      onChange={(e) =>
                        setPointsToUse(
                          Math.min(
                            selectedPrescription.points,
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span>الإجمالي الأصلي:</span>
                      <span>{selectedPrescription.total.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm text-yellow-600">
                      <span>الخصم:</span>
                      <span>-{(pointsToUse * 0.5).toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
                      <span>الإجمالي بعد الخصم:</span>
                      <span>
                        {Math.max(
                          0,
                          selectedPrescription.total - pointsToUse * 0.5
                        ).toFixed(2)}{" "}
                        ج.م
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPointsModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                      تطبيق الخصم
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsePointsModal;
