// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   FaClinicMedical,
//   FaComments,
//   FaPhone,
//   FaInfoCircle,
//   FaPaperPlane,
//   FaWhatsapp,
//   FaEnvelope,
//   FaMapMarkerAlt,
//   FaCheckCircle,
//   FaClock,
// } from "react-icons/fa";
// import SimpleNavbar from "../components/Layout/SimpleNavbar";

// const ContactPharmacyPage = () => {
//   const { pharmacyId } = useParams();
//   const [activeTab, setActiveTab] = useState("chat");
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   // بيانات وهمية للصيدلية
//   const [pharmacyData] = useState({
//     id: 1,
//     name: "صيدلية الشفاء",
//     address: "شارع التحرير، وسط البلد",
//     phone: "02-25555555",
//     whatsapp: "01234567890",
//     email: "info@shifa-pharmacy.com",
//     rating: 4.8,
//     isOnline: true,
//     workingHours: "24 ساعة",
//     services: ["توصيل مجاني", "استشارة دوائية", "قياس ضغط الدم"],
//     pharmacist: {
//       name: "د. محمد أحمد",
//       license: "PH-12345",
//       experience: "15 سنة"
//     }
//   });

//   // بيانات وهمية للرسائل
//   const [initialMessages] = useState([
//     {
//       id: 1,
//       sender: "pharmacy",
//       message: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
//       timestamp: new Date(Date.now() - 300000).toISOString(),
//       senderName: "د. محمد أحمد"
//     },
//     {
//       id: 2,
//       sender: "patient",
//       message: "مرحباً، أريد الاستفسار عن توفر دواء باراسيتامول 500mg",
//       timestamp: new Date(Date.now() - 240000).toISOString(),
//       senderName: "أحمد محمد علي"
//     },
//     {
//       id: 3,
//       sender: "pharmacy",
//       message: "نعم، الدواء متوفر لدينا. الكمية المطلوبة؟",
//       timestamp: new Date(Date.now() - 180000).toISOString(),
//       senderName: "د. محمد أحمد"
//     },
//     {
//       id: 4,
//       sender: "patient",
//       message: "أحتاج علبتين من فضلك",
//       timestamp: new Date(Date.now() - 120000).toISOString(),
//       senderName: "أحمد محمد علي"
//     },
//     {
//       id: 5,
//       sender: "pharmacy",
//       message: "ممتاز! السعر 30 جنيه للعلبتين. هل تريد التوصيل أم الاستلام من الصيدلية؟",
//       timestamp: new Date(Date.now() - 60000).toISOString(),
//       senderName: "د. محمد أحمد"
//     }
//   ]);

//   useEffect(() => {
//     setMessages(initialMessages);
//   }, []);

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       const message = {
//         id: messages.length + 1,
//         sender: "patient",
//         message: newMessage.trim(),
//         timestamp: new Date().toISOString(),
//         senderName: "أحمد محمد علي"
//       };

//       setMessages(prev => [...prev, message]);
//       setNewMessage("");

//       // محاكاة رد الصيدلية
//       setIsTyping(true);
//       setTimeout(() => {
//         const pharmacyReply = {
//           id: messages.length + 2,
//           sender: "pharmacy",
//           message: "شكراً لك! سأتابع طلبك وأرد عليك قريباً.",
//           timestamp: new Date().toISOString(),
//           senderName: "د. محمد أحمد"
//         };
//         setMessages(prev => [...prev, pharmacyReply]);
//         setIsTyping(false);
//       }, 2000);
//     }
//   };

//   const handleWhatsAppContact = () => {
//     const message = encodeURIComponent(`مرحباً، أريد الاستفسار عن الأدوية المتوفرة في صيدلية ${pharmacyData.name}`);
//     window.open(`https://wa.me/${pharmacyData.whatsapp}?text=${message}`, '_blank');
//   };

//   const handlePhoneCall = () => {
//     window.open(`tel:${pharmacyData.phone}`, '_self');
//   };

//   const formatTime = (timestamp) => {
//     return new Date(timestamp).toLocaleTimeString('ar-EG', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <SimpleNavbar title={`التواصل مع ${pharmacyData.name}`} />
      
//       <div className="container mx-auto px-4 py-6">
//         {/* Pharmacy Header */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4 space-x-reverse">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//                 <FaClinicMedical className="text-green-600 text-2xl" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">{pharmacyData.name}</h1>
//                 <p className="text-gray-600">{pharmacyData.address}</p>
//                 <div className="flex items-center space-x-2 space-x-reverse mt-2">
//                   <span className={`w-3 h-3 rounded-full ${pharmacyData.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
//                   <span className="text-sm text-gray-600">
//                     {pharmacyData.isOnline ? 'متاح الآن' : 'غير متاح'}
//                   </span>
//                   <span className="text-sm text-gray-500">• {pharmacyData.workingHours}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="flex items-center space-x-1 space-x-reverse mb-2">
//                 <span className="text-yellow-500">⭐</span>
//                 <span className="font-bold text-gray-900">{pharmacyData.rating}</span>
//               </div>
//               <p className="text-sm text-gray-600">تقييم ممتاز</p>
//             </div>
//           </div>
//         </div>

//         {/* Communication Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="border-b border-gray-200">
//             <nav className="flex">
//               <button
//                 onClick={() => setActiveTab("chat")}
//                 className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center ${
//                   activeTab === "chat"
//                     ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                 }`}
//               >
//                 <FaComments className="ml-2" />
//                 محادثة مباشرة
//               </button>
//               <button
//                 onClick={() => setActiveTab("contact")}
//                 className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center ${
//                   activeTab === "contact"
//                     ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                 }`}
//               >
//                 <FaPhone className="ml-2" />
//                 وسائل التواصل
//               </button>
//               <button
//                 onClick={() => setActiveTab("info")}
//                 className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center ${
//                   activeTab === "info"
//                     ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                 }`}
//               >
//                 <FaInfoCircle className="ml-2" />
//                 معلومات الصيدلية
//               </button>
//             </nav>
//           </div>

//           {/* Chat Tab */}
//           {activeTab === "chat" && (
//             <div className="h-96 flex flex-col">
//               {/* Messages Area */}
//               <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//                 <div className="space-y-4">
//                   {messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
//                     >
//                       <div
//                         className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                           message.sender === "patient"
//                             ? "bg-blue-600 text-white"
//                             : "bg-white text-gray-900 border border-gray-200"
//                         }`}
//                       >
//                         <p className="text-sm">{message.message}</p>
//                         <p className={`text-xs mt-1 ${
//                           message.sender === "patient" ? "text-blue-100" : "text-gray-500"
//                         }`}>
//                           {message.senderName} • {formatTime(message.timestamp)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
                  
//                   {isTyping && (
//                     <div className="flex justify-start">
//                       <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
//                         <div className="flex items-center space-x-1 space-x-reverse">
//                           <span className="text-sm text-gray-600">د. محمد أحمد يكتب</span>
//                           <div className="flex space-x-1">
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-gray-200 bg-white">
//                 <div className="flex items-center space-x-2 space-x-reverse">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                     placeholder="اكتب رسالتك هنا..."
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!newMessage.trim()}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <FaPaperPlane />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Contact Tab */}
//           {activeTab === "contact" && (
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* WhatsApp */}
//                 <div className="bg-green-50 rounded-xl p-6 border border-green-200">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FaWhatsapp className="text-white text-2xl" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-green-800 mb-2">
//                       واتساب
//                     </h3>
//                     <p className="text-green-600 text-sm mb-4">
//                       تواصل مباشر عبر الواتساب
//                     </p>
//                     <button
//                       onClick={handleWhatsAppContact}
//                       className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       فتح الواتساب
//                     </button>
//                   </div>
//                 </div>

//                 {/* Phone Call */}
//                 <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FaPhone className="text-white text-2xl" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-blue-800 mb-2">
//                       مكالمة هاتفية
//                     </h3>
//                     <p className="text-blue-600 text-sm mb-2">
//                       {pharmacyData.phone}
//                     </p>
//                     <p className="text-blue-600 text-sm mb-4">
//                       اتصال مباشر بالصيدلية
//                     </p>
//                     <button
//                       onClick={handlePhoneCall}
//                       className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       اتصال الآن
//                     </button>
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FaEnvelope className="text-white text-2xl" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-purple-800 mb-2">
//                       البريد الإلكتروني
//                     </h3>
//                     <p className="text-purple-600 text-sm mb-2">
//                       {pharmacyData.email}
//                     </p>
//                     <p className="text-purple-600 text-sm mb-4">
//                       للاستفسارات المفصلة
//                     </p>
//                     <button
//                       onClick={() => window.open(`mailto:${pharmacyData.email}`, '_blank')}
//                       className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
//                     >
//                       إرسال إيميل
//                     </button>
//                   </div>
//                 </div>

//                 {/* Location */}
//                 <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FaMapMarkerAlt className="text-white text-2xl" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-orange-800 mb-2">
//                       الموقع
//                     </h3>
//                     <p className="text-orange-600 text-sm mb-4">
//                       {pharmacyData.address}
//                     </p>
//                     <button
//                       onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(pharmacyData.address)}`, '_blank')}
//                       className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
//                     >
//                       فتح الخريطة
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Info Tab */}
//           {activeTab === "info" && (
//             <div className="p-6">
//               <div className="space-y-6">
//                 {/* Pharmacist Info */}
//                 <div className="bg-gray-50 rounded-xl p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     معلومات الصيدلي
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-600">الاسم</p>
//                       <p className="font-medium text-gray-900">{pharmacyData.pharmacist.name}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">رقم الترخيص</p>
//                       <p className="font-medium text-gray-900">{pharmacyData.pharmacist.license}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">سنوات الخبرة</p>
//                       <p className="font-medium text-gray-900">{pharmacyData.pharmacist.experience}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Services */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     الخدمات المتاحة
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {pharmacyData.services.map((service, index) => (
//                       <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 bg-blue-50 rounded-lg">
//                         <FaCheckCircle className="text-blue-600" />
//                         <span className="text-blue-800 font-medium">{service}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Working Hours */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     ساعات العمل
//                   </h3>
//                   <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//                     <div className="flex items-center space-x-3 space-x-reverse">
//                       <FaClock className="text-green-600 text-xl" />
//                       <div>
//                         <p className="font-medium text-green-800">{pharmacyData.workingHours}</p>
//                         <p className="text-green-600 text-sm">متاح طوال أيام الأسبوع</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactPharmacyPage;