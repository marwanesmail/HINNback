import React from "react";

const AddInventoryItemModal = ({
  showInventoryModal,
  setShowInventoryModal,
  setInventory,
  showNotification,
}) => {
  if (!showInventoryModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = {
      id: Date.now(),
      name: formData.get("name"),
      stock: parseInt(formData.get("stock")),
      minStock: parseInt(formData.get("minStock")),
      expiry: formData.get("expiry"),
      price: parseFloat(formData.get("price")),
      status:
        parseInt(formData.get("stock")) <= parseInt(formData.get("minStock"))
          ? "low"
          : "good",
    };
    setInventory((prev) => [...prev, newItem]);
    showNotification("تم إضافة الصنف بنجاح");
    setShowInventoryModal(false);
    e.target.reset();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowInventoryModal(false)}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-right w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  إضافة صنف جديد
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الدواء
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="أدخل اسم الدواء"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الكمية
                      </label>
                      <input
                        type="number"
                        name="stock"
                        required
                        min="0"
                        placeholder="الكمية"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الحد الأدنى
                      </label>
                      <input
                        type="number"
                        name="minStock"
                        required
                        min="0"
                        placeholder="الحد الأدنى"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الانتهاء
                      </label>
                      <input
                        type="date"
                        name="expiry"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر (ج.م)
                      </label>
                      <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        placeholder="السعر"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                    <button
                      type="button"
                      onClick={() => setShowInventoryModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      إضافة الصنف
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

export default AddInventoryItemModal;
