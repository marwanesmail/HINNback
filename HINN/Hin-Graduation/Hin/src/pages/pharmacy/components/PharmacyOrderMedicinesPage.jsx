import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import MedicineCompanySearch from "../../../components/Pharmacy/MedicineCompanySearch";
import {
  FaCheck,
  FaPills,
  FaSearch,
  FaLightbulb,
  FaPlusCircle,
  FaGift,
  FaPlus,
  FaShoppingCart,
  FaTrash,
  FaPaperPlane,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

// --- Framer Motion Variants (تم تعريفها لجعل الحركة قابلة لإعادة الاستخدام) ---

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Variants لبطاقات الأدوية داخل ملخص الطلب (الهدف هو محاكاة حركة بطاقات التبادل)
const summaryItemVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.3 },
  },
};

const AddPanelVariants = {
  initial: { opacity: 0, height: 0, padding: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    padding: "1.5rem", // p-6
    transition: {
      opacity: { duration: 0.3, delay: 0.1 },
      height: { duration: 0.4 },
      padding: { duration: 0.4 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    padding: 0,
    transition: {
      opacity: { duration: 0.2 },
      height: { duration: 0.3 },
      padding: { duration: 0.3 },
    },
  },
};

// --------------------------------------------------------------------------

const PharmacyOrderMedicinesPage = () => {
  const location = useLocation();
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Effect to handle search query from navigation state
  useEffect(() => {
    if (location.state && location.state.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  const handleMedicineSelect = (medicine) => {
    setCurrentSelection(medicine);
    setQuantity(medicine.minQuantity.toString());
  };

  const addToOrder = () => {
    if (
      !currentSelection ||
      !quantity ||
      parseInt(quantity) < currentSelection.minQuantity
    ) {
      Swal.fire({
        icon: "info",
        text: `الحد الأدنى للطلب هو ${currentSelection?.minQuantity} علبة`,
      });
      return;
    }

    const orderItem = {
      ...currentSelection,
      orderedQuantity: parseInt(quantity),
      totalPrice: currentSelection.price * parseInt(quantity),
      orderNotes: notes,
    };

    const existingIndex = selectedMedicines.findIndex(
      (item) => item.id === currentSelection.id
    );

    if (existingIndex >= 0) {
      const updated = [...selectedMedicines];
      updated[existingIndex] = orderItem;
      setSelectedMedicines(updated);
    } else {
      setSelectedMedicines([...selectedMedicines, orderItem]);
    }

    setCurrentSelection(null);
    setQuantity("");
    setNotes("");
  };

  const removeFromOrder = (medicineId) => {
    setSelectedMedicines(
      selectedMedicines.filter((item) => item.id !== medicineId)
    );
  };

  const updateQuantity = (medicineId, newQuantity) => {
    const updated = selectedMedicines.map((item) => {
      if (item.id === medicineId) {
        // التحقق من الحد الأدنى للكمية قبل التحديث
        const newQty = Math.max(parseInt(newQuantity) || 0, item.minQuantity);

        return {
          ...item,
          orderedQuantity: newQty,
          totalPrice: item.price * newQty,
        };
      }
      return item;
    });
    setSelectedMedicines(updated);
  };

  const getTotalAmount = () =>
    selectedMedicines.reduce((total, item) => total + item.totalPrice, 0);
  const getTotalItems = () =>
    selectedMedicines.reduce((total, item) => total + item.orderedQuantity, 0);

  const handleSubmitOrder = async () => {
    if (selectedMedicines.length === 0) {
      Swal.fire({ icon: "info", text: "يرجى إضافة أدوية للطلب أولاً" });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowOrderSummary(true);

      setSelectedMedicines([]);
      setCurrentSelection(null);
      setQuantity("");
      setNotes("");
    } catch (error) {
      console.error("خطأ في إرسال الطلب:", error);
      Swal.fire({
        icon: "error",
        text: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showOrderSummary) {
    return (
      <div className="p-6">
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <FaCheck className="text-3xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  تم إرسال الطلب بنجاح!
                </h2>
                <p className="text-green-100">سيتم التواصل معك قريباً</p>
              </div>

              <div className="p-8 text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 text-sm">
                    تم إرسال طلبك إلى الشركات المختارة وسيتم التواصل معك خلال 24
                    ساعة
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderSummary(false)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-medium"
                >
                  طلب جديد
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    // تطبيق حركة الدخول للصفحة بأكملها
    <motion.div
      className="p-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4 py-6">
        {/* استخدام StaggerChildren لتأخير ظهور اللوحات */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* Search & Add Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* لوحة البحث */}
            <motion.div
              className="bg-white rounded-3xl shadow-md border border-gray-200 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaSearch /> البحث عن الأدوية
              </h3>

              <MedicineCompanySearch
                onSelect={handleMedicineSelect}
                placeholder="ابحث عن دواء أو شركة أو فئة..."
                initialSearchQuery={searchQuery}
              />

              <div className="mt-4 text-gray-500 text-sm space-y-1">
                <p className="flex items-center gap-1">
                  <FaLightbulb /> يمكنك البحث بـ:
                </p>
                <ul className="list-disc list-inside">
                  <li>اسم الدواء (مثل: بانادول، أسبرين)</li>
                  <li>اسم الشركة (مثل: فايزر، جلاكسو)</li>
                  <li>فئة الدواء (مثل: مسكنات، فيتامينات)</li>
                </ul>
              </div>
            </motion.div>

            {/* لوحة الإضافة للطلب - حركة سحب وإخفاء ممتازة */}
            <AnimatePresence>
              {currentSelection && (
                <motion.div
                  key="add-panel"
                  variants={AddPanelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-white rounded-3xl shadow-md border border-gray-200 space-y-5"
                >
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaPlusCircle /> إضافة للطلب
                  </h3>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-indigo-900">
                          {currentSelection.medicineName}
                        </h4>
                        <p className="text-indigo-700 text-sm">
                          {currentSelection.companyName}
                        </p>
                        <p className="text-indigo-600 text-xs">
                          {currentSelection.category}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-green-600">
                          {currentSelection.price.toFixed(2)} جنيه
                        </p>
                        {currentSelection.originalPrice !==
                          currentSelection.price && (
                          <p className="text-gray-400 line-through text-xs">
                            {currentSelection.originalPrice.toFixed(2)} جنيه
                          </p>
                        )}
                      </div>
                    </div>

                    {currentSelection.offer && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mt-2">
                        <p className="text-orange-800 text-sm font-medium flex items-center gap-1">
                          <FaGift /> {currentSelection.offer}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الكمية المطلوبة (الحد الأدنى:{" "}
                        {currentSelection.minQuantity} علبة)
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min={currentSelection.minQuantity}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        placeholder={`أدخل الكمية`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ملاحظات (اختياري)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        placeholder="أي ملاحظات خاصة بهذا الدواء..."
                      />
                    </div>

                    {quantity &&
                      parseInt(quantity) >= currentSelection.minQuantity && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 font-medium">
                          إجمالي السعر:{" "}
                          {(
                            currentSelection.price * parseInt(quantity)
                          ).toFixed(2)}{" "}
                          جنيه
                        </div>
                      )}

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={addToOrder}
                      disabled={
                        !quantity ||
                        parseInt(quantity) < currentSelection.minQuantity
                      }
                      className="w-full bg-indigo-500 text-white py-3 rounded-xl hover:bg-indigo-600 transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlus /> إضافة للطلب
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-6 sticky top-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaShoppingCart /> ملخص الطلب
              </h3>

              {/* AnimatePresence مع mode="popLayout" لتحريك العناصر عند الإضافة/الحذف */}
              <AnimatePresence mode="popLayout">
                {selectedMedicines.length === 0 ? (
                  <motion.div
                    key="empty-cart"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-8 text-gray-400"
                  >
                    <FaShoppingCart className="text-4xl mx-auto mb-4" />
                    لم تتم إضافة أي أدوية بعد
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart-items-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="space-y-3 max-h-64 overflow-y-auto"
                  >
                    {selectedMedicines.map((item) => (
                      <motion.div
                        key={item.id}
                        layout // الأهم: لتشغيل الحركة التلقائية عند إعادة الترتيب أو تحديث الكمية
                        variants={summaryItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        // حركة عند التفاعل مشابهة لبطاقات التبادل
                        whileHover={{
                          scale: 1.01,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2 relative"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">
                              {item.medicineName}
                            </h5>
                            <p className="text-xs text-gray-500">
                              {item.companyName}
                            </p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => removeFromOrder(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="text-sm" />
                          </motion.button>
                        </div>
                        <div className="flex justify-between items-center">
                          <input
                            type="number"
                            value={item.orderedQuantity}
                            onChange={(e) =>
                              updateQuantity(item.id, e.target.value)
                            }
                            min={item.minQuantity}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="text-green-600 font-medium">
                            {item.totalPrice.toFixed(2)} جنيه
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedMedicines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border-t border-gray-200 pt-4 space-y-2"
                >
                  <div className="flex justify-between text-gray-600">
                    <span>إجمالي العناصر:</span>
                    <span className="font-medium">{getTotalItems()} علبة</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-semibold text-lg">
                    <span>الإجمالي:</span>
                    <span className="text-green-600">
                      {getTotalAmount().toFixed(2)} جنيه
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors font-medium flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <>
                        <FaPaperPlane /> إرسال الطلب
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PharmacyOrderMedicinesPage;
