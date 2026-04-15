import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaUserMd,
  FaUser,
  FaBuilding,
  FaPrescriptionBottle,
  FaEye,
} from "react-icons/fa";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for demonstration - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          name: "أحمد محمد",
          username: "ahmed_doc",
          email: "ahmed@example.com",
          phone: "01012345678",
          type: "طبيب",
          specialization: "جراحة عامة",
          yearsOfExperience: "10",
          status: "مفعل",
          registrationDate: "2023-05-15",
          address: "شارع الملك فهد، مصر",
          dateOfBirth: "1985-03-15",
          gender: "ذكر",
          biography:
            "طبيب مختص في الجراحة العامة مع خبرة 10 سنوات في مستشفيات القاهرة الكبرى",
          licenseNumber: "DOC-12345",
          university: "جامعة القاهرة",
          graduationYear: "2010",
        },
        {
          id: 2,
          name: "سارة عبدالله",
          username: "sara_pharm",
          email: "sara@example.com",
          phone: "01123456789",
          type: "صيدلية",
          pharmacyName: "الرحمة",
          pharmacyPhone: "0234567890",
          address: "شارع الملك فهد، مصر",
          status: "مفعل",
          registrationDate: "2023-07-22",
          dateOfBirth: "1990-07-22",
          gender: "أنثى",
          openingHours: "9 صباحاً - 11 مساءً",
          deliveryArea: "الرياض، حي الملز، حي النفل، حي العليا",
          licenseNumber: "PHARM-67890",
        },
        {
          id: 3,
          name: "خالد علي",
          username: "khaled_company",
          email: "khaled@example.com",
          phone: "01234567890",
          type: "شركة أدوية",
          companyName: "الأدوية المتقدمة",
          companyActivityType: "تصنيع",
          companyAddress: "حي الملز، مصر",
          status: "معلق",
          registrationDate: "2024-01-10",
          dateOfBirth: "1980-11-30",
          gender: "ذكر",
          commercialRegister: "COM-11223",
          taxNumber: "TAX-44556",
        },
        {
          id: 4,
          name: "فاطمة أحمد",
          username: "fatima_patient",
          email: "fatima@example.com",
          phone: "01567890123",
          type: "مريض",
          dateOfBirth: "1990-05-15",
          gender: "أنثى",
          address: "حي العليا، مصر",
          status: "مفعل",
          registrationDate: "2024-03-18",
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.phone.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const getTypeColor = (type) => {
    switch (type) {
      case "طبيب":
        return "bg-blue-100 text-blue-800";
      case "صيدلية":
        return "bg-purple-100 text-purple-800";
      case "شركة أدوية":
        return "bg-indigo-100 text-indigo-800";
      case "مريض":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "مفعل":
        return "bg-green-100 text-green-800";
      case "معلق":
        return "bg-yellow-100 text-yellow-800";
      case "محظور":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "مفعل" ? "معلق" : "مفعل";
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكنك التراجع عن هذا الإجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف المستخدم!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف المستخدم بنجاح.",
          icon: "success",
          confirmButtonText: "موافق",
        });
      }
    });
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      

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

      {/* Users Table */}
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
                    البريد الإلكتروني
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الهاتف
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              {user.type === "طبيب" && (
                                <FaUserMd className="text-red-600" />
                              )}
                              {user.type === "صيدلية" && (
                                <FaBuilding className="text-red-600" />
                              )}
                              {user.type === "شركة أدوية" && (
                                <FaBuilding className="text-red-600" />
                              )}
                              {user.type === "مريض" && (
                                <FaUser className="text-red-600" />
                              )}
                            </div>
                          </div>
                          <div className="mr-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                            user.type
                          )}`}
                        >
                          {user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100"
                            title="عرض التفاصيل"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`p-2 rounded-full ${
                              user.status === "مفعل"
                                ? "text-yellow-600 hover:bg-yellow-100"
                                : "text-green-600 hover:bg-green-100"
                            }`}
                            title={user.status === "مفعل" ? "تعطيل" : "تفعيل"}
                          >
                            {user.status === "مفعل" ? (
                              <FaToggleOn size={18} />
                            ) : (
                              <FaToggleOff size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100"
                            title="حذف"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  تفاصيل المستخدم
                </h3>
                {/* <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTrash size={20} />
                </button> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                  <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                    المعلومات الأساسية
                  </h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-gray-500 w-32">الاسم:</span>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">اسم المستخدم:</span>
                      <span>{selectedUser.username}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">
                        البريد الإلكتروني:
                      </span>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">الهاتف:</span>
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">النوع:</span>
                      <span>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                            selectedUser.type
                          )}`}
                        >
                          {selectedUser.type}
                        </span>
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">تاريخ الميلاد:</span>
                      <span>{selectedUser.dateOfBirth || "غير محدد"}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">الجنس:</span>
                      <span>{selectedUser.gender || "غير محدد"}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">العنوان:</span>
                      <span>{selectedUser.address || "غير محدد"}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">تاريخ التسجيل:</span>
                      <span>
                        {new Date(
                          selectedUser.registrationDate
                        ).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-32">الحالة:</span>
                      <span>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            selectedUser.status
                          )}`}
                        >
                          {selectedUser.status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Type-specific Information */}
                {selectedUser.type === "طبيب" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                      معلومات الطبيب
                    </h4>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-gray-500 w-32">التخصص:</span>
                        <span>{selectedUser.specialization}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          سنوات الخبرة:
                        </span>
                        <span>{selectedUser.yearsOfExperience} سنوات</span>
                      </div>
                      {/* <div className="flex">
                        <span className="text-gray-500 w-32">رقم الرخصة:</span>
                        <span>{selectedUser.licenseNumber}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">الجامعة:</span>
                        <span>{selectedUser.university || "غير محدد"}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">سنة التخرج:</span>
                        <span>{selectedUser.graduationYear || "غير محدد"}</span>
                      </div> */}
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          السيرة الذاتية:
                        </span>
                        <span>{selectedUser.biography || "غير محدد"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.type === "صيدلية" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                      معلومات الصيدلية
                    </h4>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          اسم الصيدلية:
                        </span>
                        <span>{selectedUser.pharmacyName}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          هاتف الصيدلية:
                        </span>
                        <span>{selectedUser.pharmacyPhone}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">رقم الرخصة:</span>
                        <span>{selectedUser.licenseNumber}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">ساعات العمل:</span>
                        <span>{selectedUser.openingHours || "غير محدد"}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          منطقة التوصيل:
                        </span>
                        <span>{selectedUser.deliveryArea || "غير محدد"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.type === "شركة أدوية" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
                      معلومات الشركة
                    </h4>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-gray-500 w-32">اسم الشركة:</span>
                        <span>{selectedUser.companyName}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">نوع النشاط:</span>
                        <span>{selectedUser.companyActivityType}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          عنوان الشركة:
                        </span>
                        <span>{selectedUser.companyAddress || "غير محدد"}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          السجل التجاري:
                        </span>
                        <span>
                          {selectedUser.commercialRegister || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">
                          الرقم الضريبي:
                        </span>
                        <span>{selectedUser.taxNumber || "غير محدد"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
