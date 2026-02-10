import React from "react";

const NewExchangeRequestModal = ({
  showExchangeModal,
  setShowExchangeModal,
  setExchangeRequests,
  showNotification,
}) => {
  if (!showExchangeModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRequest = {
      id: Date.now(),
      pharmacy: formData.get("pharmacy"),
      medicine: formData.get("medicine"),
      quantity: parseInt(formData.get("quantity")),
      status: "pending",
    };
    setExchangeRequests((prev) => [...prev, newRequest]);
    showNotification("تم إرسال طلب التبادل بنجاح");
    setShowExchangeModal(false);
    e.target.reset();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowExchangeModal(false)}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-right w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  طلب تبادل جديد
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصيدلية المطلوب التبادل معها
                    </label>
                    <select
                      name="pharmacy"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">اختر الصيدلية</option>
                      <option value="صيدلية النور">صيدلية النور</option>
                      <option value="صيدلية الأمل">صيدلية الأمل</option>
                      <option value="صيدلية الحياة">صيدلية الحياة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الدواء
                    </label>
                    <input
                      type="text"
                      name="medicine"
                      required
                      placeholder="أدخل اسم الدواء"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية المطلوبة
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min="1"
                      placeholder="أدخل الكمية"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                    <button
                      type="button"
                      onClick={() => setShowExchangeModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      إرسال الطلب
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

export default NewExchangeRequestModal;
