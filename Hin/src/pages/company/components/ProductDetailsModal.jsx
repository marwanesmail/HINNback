import React from "react";
import { FaTimes } from "react-icons/fa";

const ProductDetailsModal = ({
  showProductDetailsModal,
  setShowProductDetailsModal,
  selectedProduct,
  getStatusColor,
  editProduct,
}) => {
  if (!showProductDetailsModal || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setShowProductDetailsModal(false)}
        ></div>
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl leading-6 font-bold text-gray-900">
                تفاصيل المنتج
              </h3>
              <button
                onClick={() => setShowProductDetailsModal(false)}
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <selectedProduct.image className="text-blue-600 text-4xl" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedProduct.status
                    )}`}
                  >
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">السعر</span>
                    <p className="text-xl font-bold text-blue-600">
                      {selectedProduct.price} ج.م
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">المخزون</span>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedProduct.stock} علبة
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500">التصنيف</span>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedProduct.category}
                  </p>
                </div>

                {selectedProduct.productionDate && (
                  <div>
                    <span className="text-sm text-gray-500">تاريخ الإنتاج</span>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(
                        selectedProduct.productionDate
                      ).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                )}

                {selectedProduct.expiryDate && (
                  <div>
                    <span className="text-sm text-gray-500">
                      تاريخ الانتهاء
                    </span>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(selectedProduct.expiryDate).toLocaleDateString(
                        "ar-EG"
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowProductDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  setShowProductDetailsModal(false);
                  editProduct(selectedProduct);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                تعديل
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
