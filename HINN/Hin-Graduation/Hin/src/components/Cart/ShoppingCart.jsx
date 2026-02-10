import React from "react";
import Swal from "sweetalert2";
import {
  FaTimes,
  FaUserLock,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion"; // استيراد framer-motion

const ShoppingCart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isCartOpen,
    toggleCart,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
  if (cartItems.length === 0) return;

  Swal.fire({
    title: 'اختر طريقة الدفع',
    text: 'حدد الطريقة التي تريد الدفع بها:',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'الدفع عند الاستلام',
    cancelButtonText: 'الدفع الإلكتروني',
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // الدفع عند الاستلام
      Swal.fire({
        icon: 'success',
        text: 'تم اختيار الدفع عند الاستلام! سيتم تجهيز الطلب.'
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // الدفع الإلكتروني
      Swal.fire({
        icon: 'success',
        text: 'تم اختيار الدفع الإلكتروني! سيتم تحويلك لصفحة الدفع.'
      });
    }

    // تنظيف السلة وإغلاقها بعد اختيار طريقة الدفع
    clearCart();
    toggleCart();
  });
};

  return (
    <>
      {/* خلفية شفافة */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleCart}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* سلة الشراء */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl z-50 transform rounded-l-2xl flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* رأس السلة */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">سلة الشراء</h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            {/* محتوى السلة */}
            <div className="flex-1 overflow-y-auto p-4">
              {!isAuthenticated() ? (
                <div className="text-center py-12">
                  <FaUserLock className="text-6xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    يجب تسجيل الدخول
                  </h3>
                  <p className="text-gray-500 mb-4">
                    سجل الدخول لعرض سلة الشراء الخاصة بك
                  </p>
                  <button
                    onClick={() => {
                      toggleCart();
                      // توجيه لصفحة تسجيل الدخول هنا
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
                  >
                    تسجيل الدخول
                  </button>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    السلة فارغة
                  </h3>
                  <p className="text-gray-500">أضف بعض المنتجات لتبدأ التسوق</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm"
                    >
                      {/* صورة المنتج */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shadow"
                      />

                      {/* معلومات المنتج */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-blue-600 font-bold text-sm">
                          {item.price} جنيه
                        </p>

                        {/* التحكم في الكمية */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      </div>

                      {/* زر الحذف */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* أسفل السلة */}
            {isAuthenticated() && cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-2 bg-white/70 backdrop-blur-sm">
                {/* المجموع */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    المجموع:
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {getCartTotal().toFixed(2)} جنيه
                  </span>
                </div>

                {/* أزرار العمل */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-md"
                  >
                    إتمام الشراء
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    إفراغ السلة
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShoppingCart;
