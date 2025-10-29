// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaBell,
//   FaInbox,
//   FaPhone,
//   FaShoppingCart,
//   FaMapMarkerAlt,
//   FaPlus,
//   FaHistory,
//   FaMap,
// } from "react-icons/fa";
// import SimpleNavbar from "../components/Layout/SimpleNavbar";
// import {
//   getPatientRequests,
//   getMedicineRequest,
// } from "../services/medicineRequestApi";

// const PatientNotificationsPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [patientPhone] = useState("01234567890"); // في التطبيق الحقيقي، سيأتي من context المستخدم

//   const [mockNotifications] = useState([
//     {
//       id: 1,
//       type: "medicine_available",
//       title: "دواء متوفر!",
//       message: "صيدلية الشفاء لديها الأدوية المطلوبة",
//       pharmacyName: "صيدلية الشفاء",
//       pharmacyPhone: "02-25555555",
//       medicines: ["باراسيتامول 500mg", "فيتامين د"],
//       totalPrice: 45.5,
//       distance: "0.5 كم",
//       timestamp: "منذ 5 دقائق",
//       isRead: false,
//       requestId: 1,
//     },
//     {
//       id: 2,
//       type: "medicine_unavailable",
//       title: "دواء غير متوفر",
//       message: "صيدلية النور: الدواء غير متوفر حالياً",
//       pharmacyName: "صيدلية النور",
//       pharmacyPhone: "02-25666666",
//       medicines: ["إيبوبروفين 400mg"],
//       timestamp: "منذ 15 دقيقة",
//       isRead: false,
//       requestId: 2,
//     },
//     {
//       id: 3,
//       type: "medicine_available",
//       title: "دواء متوفر!",
//       message: "صيدلية الأمل لديها بديل مناسب",
//       pharmacyName: "صيدلية الأمل",
//       pharmacyPhone: "02-25777777",
//       medicines: ["أنسولين"],
//       totalPrice: 120.0,
//       distance: "0.8 كم",
//       timestamp: "منذ 30 دقيقة",
//       isRead: true,
//       requestId: 3,
//     },
//   ]);

//   useEffect(() => {
//     setNotifications(mockNotifications);
//     loadPatientRequests();
//   }, []);

//   const loadPatientRequests = async () => {
//     setIsLoading(true);
//     try {
//       // Logic for fetching data from the API
//       // const patientRequests = await getPatientRequests(patientPhone);
//       // setRequests(patientRequests);
//     } catch (error) {
//       console.error("خطأ في تحميل طلبات المريض:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const markAsRead = (notificationId) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === notificationId
//           ? { ...notification, isRead: true }
//           : notification
//       )
//     );
//   };

//   const NotificationIcon = ({ type, className }) => {
//     switch (type) {
//       case "medicine_available":
//         return <FaCheckCircle className={`text-green-500 ${className}`} />;
//       case "medicine_unavailable":
//         return <FaTimesCircle className={`text-red-500 ${className}`} />;
//       default:
//         return <FaBell className={`text-blue-500 ${className}`} />;
//     }
//   };

//   const getNotificationBg = (type, isRead) => {
//     if (isRead) return "bg-gray-50";

//     switch (type) {
//       case "medicine_available":
//         return "bg-green-50 border-green-200";
//       case "medicine_unavailable":
//         return "bg-red-50 border-red-200";
//       default:
//         return "bg-blue-50 border-blue-200";
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const headerVariants = {
//     hidden: { y: -20, opacity: 0 },
//     visible: { y: 0, opacity: 1 },
//   };

//   const listVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const notificationItemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 },
//     exit: { y: -20, opacity: 0 },
//   };

//   const actionButtonVariants = {
//     tap: { scale: 0.95 },
//   };

//   const pulseVariants = {
//     pulse: {
//       scale: [1, 1.05, 1],
//       transition: { duration: 1.5, repeat: Infinity },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <SimpleNavbar title="الإشعارات" />

//       <div className="container mx-auto px-4 py-6">
//         {/* Header */}
//         <motion.div
//           variants={headerVariants}
//           initial="hidden"
//           animate="visible"
//           transition={{ duration: 0.5 }}
//           className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">إشعاراتك</h1>
//               <p className="text-gray-600 mt-1">
//                 تابع حالة طلبات الأدوية والردود من الصيدليات
//               </p>
//             </div>
//             <div className="text-center">
//               <motion.div
//                 variants={pulseVariants}
//                 animate="pulse"
//                 className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"
//               >
//                 <FaBell className="text-blue-600 text-2xl" />
//               </motion.div>
//               {unreadCount > 0 && (
//                 <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                   {unreadCount} جديد
//                 </span>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         {/* Notifications List */}
//         <div className="space-y-4">
//           <AnimatePresence mode="popLayout">
//             {notifications.length === 0 ? (
//               <motion.div
//                 key="empty-list"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100"
//               >
//                 <FaInbox className="text-4xl text-gray-400 mb-4 mx-auto" />
//                 <h3 className="text-lg font-semibold text-gray-600 mb-2">
//                   لا توجد إشعارات
//                 </h3>
//                 <p className="text-gray-500">
//                   ستظهر هنا الإشعارات عند ورود ردود من الصيدليات
//                 </p>
//               </motion.div>
//             ) : (
//               <motion.div
//                 variants={listVariants}
//                 initial="hidden"
//                 animate="visible"
//               >
//                 {notifications.map((notification) => (
//                   <motion.div
//                     key={notification.id}
//                     layout
//                     variants={notificationItemVariants}
//                     initial="hidden"
//                     animate="visible"
//                     exit="exit"
//                     whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
//                     transition={{ type: "spring", stiffness: 300, damping: 15 }}
//                     className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${getNotificationBg(
//                       notification.type,
//                       notification.isRead
//                     )}`}
//                     onClick={() => markAsRead(notification.id)}
//                   >
//                     <div className="p-6">
//                       <div className="flex items-start gap-4">
//                         <div className="flex-shrink-0">
//                           <NotificationIcon
//                             type={notification.type}
//                             className="text-2xl"
//                           />
//                         </div>

//                         <div className="flex-1">
//                           <div className="flex items-center justify-between mb-2">
//                             <h3
//                               className={`font-semibold ${
//                                 notification.isRead
//                                   ? "text-gray-700"
//                                   : "text-gray-900"
//                               }`}
//                             >
//                               {notification.title}
//                             </h3>
//                             <span className="text-sm text-gray-500">
//                               {notification.timestamp}
//                             </span>
//                           </div>

//                           <p
//                             className={`mb-3 ${
//                               notification.isRead ? "text-gray-600" : "text-gray-800"
//                             }`}
//                           >
//                             {notification.message}
//                           </p>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                             <div>
//                               <p className="text-sm text-gray-600">
//                                 الصيدلية
//                               </p>
//                               <p className="font-medium text-gray-900">
//                                 {notification.pharmacyName}
//                               </p>
//                             </div>

//                             {notification.distance && (
//                               <div>
//                                 <p className="text-sm text-gray-600">
//                                   المسافة
//                                 </p>
//                                 <p className="font-medium text-gray-900">
//                                   {notification.distance}
//                                 </p>
//                               </div>
//                             )}
//                           </div>

//                           <div className="mb-4">
//                             <p className="text-sm text-gray-600 mb-2">
//                               الأدوية:
//                             </p>
//                             <div className="flex flex-wrap gap-2">
//                               {notification.medicines.map((medicine, index) => (
//                                 <motion.span
//                                   key={index}
//                                   initial={{ opacity: 0, scale: 0.8 }}
//                                   animate={{ opacity: 1, scale: 1 }}
//                                   transition={{ delay: index * 0.05 }}
//                                   className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//                                 >
//                                   {medicine}
//                                 </motion.span>
//                               ))}
//                             </div>
//                           </div>

//                           {notification.totalPrice && (
//                             <div className="mb-4">
//                               <p className="text-sm text-gray-600">
//                                 السعر الإجمالي
//                               </p>
//                               <p className="text-lg font-bold text-green-600">
//                                 {notification.totalPrice.toFixed(2)} ج.م
//                               </p>
//                             </div>
//                           )}

//                           <div className="flex flex-wrap gap-3">
//                             <motion.button
//                               whileTap="tap"
//                               variants={actionButtonVariants}
//                               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
//                             >
//                               <FaPhone />
//                               اتصال: {notification.pharmacyPhone}
//                             </motion.button>

//                             {notification.type === "medicine_available" && (
//                               <motion.button
//                                 whileTap="tap"
//                                 variants={actionButtonVariants}
//                                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
//                               >
//                                 <FaShoppingCart />
//                                 طلب الآن
//                               </motion.button>
//                             )}

//                             <motion.button
//                               whileTap="tap"
//                               variants={actionButtonVariants}
//                               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
//                             >
//                               <FaMapMarkerAlt />
//                               الموقع
//                             </motion.button>
//                           </div>
//                         </div>

//                         {!notification.isRead && (
//                           <motion.div
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"
//                           ></motion.div>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
//         >
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             إجراءات سريعة
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <motion.button
//               whileTap="tap"
//               variants={actionButtonVariants}
//               className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-center"
//             >
//               <FaPlus className="text-blue-600 text-2xl mb-2 mx-auto" />
//               <p className="font-medium text-blue-800">طلب دواء جديد</p>
//             </motion.button>

//             <motion.button
//               whileTap="tap"
//               variants={actionButtonVariants}
//               className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 text-center"
//             >
//               <FaHistory className="text-green-600 text-2xl mb-2 mx-auto" />
//               <p className="font-medium text-green-800">طلباتي السابقة</p>
//             </motion.button>

//             <motion.button
//               whileTap="tap"
//               variants={actionButtonVariants}
//               className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-center"
//             >
//               <FaMap className="text-purple-600 text-2xl mb-2 mx-auto" />
//               <p className="font-medium text-purple-800">الصيدليات القريبة</p>
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default PatientNotificationsPage;