import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilePdf,
  FaFileImage,
} from "react-icons/fa";

const UsersVerification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Simulate API call to load users
  useEffect(() => {
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          name: "أحمد محمد",
          fullName: "أحمد محمد علي",
          username: "ahmed_doc",
          type: "طبيب",
          email: "ahmed@example.com",
          phone: "01012345678",
          specialization: "جراحة عامة",
          yearsOfExperience: "10",
          biography:
            "طبيب مختص في الجراحة العامة مع خبرة 10 سنوات في مستشفيات القاهرة الكبرى",
          status: "قيد الانتظار",
          documents: [
            { name: "البطاقة الشخصية.pdf", url: "#", type: "pdf" },
            { name: "رخصة مزاولة المهنة.pdf", url: "#", type: "pdf" },
            { name: "شهادة التخرج.jpg", url: "#", type: "image" },
            { name: "عضوية النقابة.pdf", url: "#", type: "pdf" },
          ],
        },
        {
          id: 2,
          name: "سارة عبدالله",
          fullName: "سارة عبدالله محمد",
          username: "sara_pharm",
          type: "صيدلية",
          email: "sara@example.com",
          phone: "01123456789",
          pharmacyName: "الرحمة",
          pharmacyPhone: "0234567890",
          openingHours: "9 صباحاً - 11 مساءً",
          deliveryArea: "الرياض، حي الملز، حي النفل، حي العليا",
          address: "شارع الملك فهد، الرياض",
          status: "قيد الانتظار",
          documents: [
            { name: "السجل التجاري.pdf", url: "#", type: "pdf" },
            { name: "البطاقة الضريبية.jpg", url: "#", type: "image" },
            { name: "رخصة الصيدلية.pdf", url: "#", type: "pdf" },
          ],
        },
        {
          id: 3,
          name: "خالد علي",
          fullName: "خالد علي حسن",
          username: "khaled_company",
          type: "شركة أدوية",
          email: "khaled@example.com",
          phone: "01234567890",
          companyName: "الأدوية المتقدمة",
          companyActivityType: "تصنيع",
          companyAddress: "حي الملز، الرياض",
          commercialRegister: "COM-11223",
          taxNumber: "TAX-44556",
          status: "قيد الانتظار",
          documents: [
            { name: "السجل التجاري.pdf", url: "#", type: "pdf" },
            { name: "ترخيص وزارة الصحة.jpg", url: "#", type: "image" },
            { name: "شهادة ضريبية.pdf", url: "#", type: "pdf" },
          ],
        },
      ];

      setPendingUsers(mockUsers);
      setLoading(false);
    }, 1200);
  }, []);

  const handleViewDetails = (user) => setSelectedUser(user);
  const handleCloseDetails = () => setSelectedUser(null);
  const handleApprove = (userId) =>
    setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
  const handleReject = (userId) =>
    setPendingUsers(pendingUsers.filter((u) => u.id !== userId));

  const getStatusColor = (status) => {
    switch (status) {
      case "مقبول":
        return "bg-green-100 text-green-800";
      case "مرفوض":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "طبيب":
        return "bg-blue-100 text-blue-800";
      case "صيدلية":
        return "bg-purple-100 text-purple-800";
      case "شركة أدوية":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = pendingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table Section */}
        <div className={`${selectedUser ? "lg:w-2/3" : "w-full"}`}>
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="البحث عن مستخدم..."
              />
            </div>
          </div>

          {/* Table or Loader */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        النوع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <motion.tr
                          key={user.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handleViewDetails(user)}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                                user.type
                              )}`}
                            >
                              {user.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(user);
                              }}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <FaEye className="ml-1" /> عرض التفاصيل
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          لا توجد نتائج مطابقة للبحث
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Details Section with Framer Motion Animation */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              className="w-full lg:w-1/3"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    تفاصيل المستخدم
                  </h3>
                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* User Info Header */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-800">
                      {selectedUser.fullName}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedUser.type}</p>
                    <p className="text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>

                  {/* Document Previews Section */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      المستندات المرفقة
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      {selectedUser.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          {doc.type === "image" ? (
                            // Display image preview
                            <div className="h-32 bg-gray-100 flex items-center justify-center">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                                <span className="text-gray-500 text-xs">
                                  معاينة الصورة
                                </span>
                              </div>
                            </div>
                          ) : doc.type === "pdf" ? (
                            // Display PDF preview
                            <div className="h-32 flex items-center justify-center bg-red-50">
                              <div className="text-center">
                                <FaFilePdf className="w-10 h-10 text-red-500 mx-auto" />
                                <p className="text-xs mt-2 text-gray-500">
                                  مستند PDF
                                </p>
                              </div>
                            </div>
                          ) : (
                            // Display generic document preview
                            <div className="h-32 flex items-center justify-center bg-gray-50">
                              <div className="text-center">
                                <svg
                                  className="w-10 h-10 text-gray-400 mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  ></path>
                                </svg>
                                <p className="text-xs mt-2 text-gray-500">
                                  مستند
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="p-2 bg-white border-t border-gray-100">
                            <p className="text-xs text-gray-600 truncate font-medium">
                              {doc.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                    <button
                      onClick={() => handleReject(selectedUser.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center transition-colors"
                    >
                      <FaTimes className="ml-2" /> رفض
                    </button>
                    <button
                      onClick={() => handleApprove(selectedUser.id)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center transition-colors"
                    >
                      <FaCheck className="ml-2" /> موافقة
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersVerification;
