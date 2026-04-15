import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBoxes, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PharmacyInventorySection = ({
  inventory,
  setShowInventoryModal,
  handleInventoryUpdate,
  setShowOrderModal,
  getStockColor,
}) => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const rowVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  const handleOrderClick = (itemName) => {
    // Navigate to the order medicines page with the item name as state
    navigate("/pharmacy-dashboard", {
      state: {
        activeSection: "order-medicines",
        searchQuery: itemName,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                إجمالي الأصناف
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {inventory.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBoxes className="text-blue-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {inventory.filter((item) => item.status === "low").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-yellow-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">نفد المخزون</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {inventory.filter((item) => item.status === "out").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaTimesCircle className="text-red-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              قائمة المخزون
            </h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInventoryModal(true)}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 gap-1"
            >
              <FaBoxes />
              إضافة صنف
            </motion.button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم الدواء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكمية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحد الأدنى
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الانتهاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <AnimatePresence mode="popLayout">
              <motion.tbody
                key="inventory-list-body"
                className="bg-white divide-y divide-gray-200"
              >
                {inventory.map((item) => (
                  <motion.tr
                    key={item.id}
                    layout
                    variants={rowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{ backgroundColor: "#F9FAFB" }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${getStockColor(
                          item.status
                        )}`}
                      >
                        {item.stock} علبة
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.minStock} علبة
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.expiry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.price.toFixed(2)} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "good"
                            ? "bg-green-100 text-green-800"
                            : item.status === "low"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "good" && "متوفر"}
                        {item.status === "low" && "منخفض"}
                        {item.status === "out" && "نفد"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 space-x-reverse">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          Swal.fire({
                            title: "تحديث الكمية والسعر:",
                            html: `
                              <div style="text-align: right; margin-bottom: 10px;">
                                <label>الكمية الجديدة:</label>
                                <input type="number" id="stock" class="swal2-input" value="${item.stock}" min="0">
                              </div>
                              <div style="text-align: right; margin-bottom: 10px;">
                                <label>السعر الجديد:</label>
                                <input type="number" id="price" class="swal2-input" value="${item.price}" min="0" step="0.01">
                              </div>
                            `,
                            showCancelButton: true,
                            confirmButtonText: "تحديث",
                            cancelButtonText: "إلغاء",
                            preConfirm: () => {
                              const stock =
                                Swal.getPopup().querySelector("#stock").value;
                              const price =
                                Swal.getPopup().querySelector("#price").value;
                              if (
                                isNaN(stock) ||
                                stock < 0 ||
                                isNaN(price) ||
                                price < 0
                              ) {
                                Swal.showValidationMessage(
                                  "الرجاء إدخال قيم صحيحة"
                                );
                                return false;
                              }
                              return {
                                stock: parseInt(stock),
                                price: parseFloat(price),
                              };
                            },
                          }).then((result) => {
                            if (result.isConfirmed) {
                              // Update both stock and price
                              const updatedItem = {
                                ...item,
                                stock: result.value.stock,
                                price: result.value.price,
                                status:
                                  result.value.stock === 0
                                    ? "out"
                                    : result.value.stock <= item.minStock
                                    ? "low"
                                    : "good",
                              };
                              handleInventoryUpdate(item.id, updatedItem);
                            }
                          });
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        تحديث
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOrderClick(item.name)}
                        className="text-green-600 hover:text-green-900"
                      >
                        طلب
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PharmacyInventorySection;
