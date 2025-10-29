// // src/pages/ContactDoctorPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaUserMd,
//   FaComments,
//   FaPhone,
//   FaInfoCircle,
//   FaPaperPlane,
//   FaCalendarPlus,
//   FaWhatsapp,
//   FaEnvelope,
//   FaGraduationCap,
//   FaStethoscope,
//   FaClinicMedical,
//   FaMapMarkerAlt,
//   FaClock,
// } from "react-icons/fa";
// import SimpleNavbar from "../components/Layout/SimpleNavbar";
// import { showInfo } from "../utils/sweetAlert";

// const ContactDoctorPage = () => {
//   const { doctorId } = useParams();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("chat");
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);

//   // بيانات وهمية للطبيب
//   const [doctorData] = useState({
//     id: 1,
//     name: "د. أحمد محمد",
//     specialty: "طب باطنة",
//     title: "استشاري باطنة وجهاز هضمي",
//     clinic: "عيادة النور الطبية",
//     address: "شارع الجمهورية، وسط البلد",
//     phone: "01111111111",
//     whatsapp: "01111111111",
//     email: "dr.ahmed@clinic.com",
//     rating: 4.9,
//     experience: "15 سنة",
//     isOnline: true,
//     consultationFee: 200,
//     workingHours: "9 ص - 9 م",
//     education: [
//       "بكالوريوس الطب والجراحة - جامعة القاهرة",
//       "ماجستير الباطنة - جامعة عين شمس",
//       "دكتوراه الجهاز الهضمي - جامعة الإسكندرية",
//     ],
//     specializations: [
//       "أمراض الجهاز الهضمي",
//       "أمراض الكبد",
//       "السكري وضغط الدم",
//       "أمراض القلب",
//     ],
//     languages: ["العربية", "الإنجليزية"],
//   });

//   // رسائل تجريبية
//   const initialMessages = [
//     {
//       id: 1,
//       sender: "doctor",
//       message: "مرحباً أحمد، كيف حالك اليوم؟",
//       timestamp: new Date(Date.now() - 300000).toISOString(),
//       senderName: "د. أحمد محمد",
//     },
//     {
//       id: 2,
//       sender: "patient",
//       message: "الحمد لله، أشعر بتحسن كبير.",
//       timestamp: new Date(Date.now() - 240000).toISOString(),
//       senderName: "أحمد محمد",
//     },
//   ];

//   useEffect(() => {
//     setMessages(initialMessages);
//   }, []);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     const msg = {
//       id: messages.length + 1,
//       sender: "patient",
//       message: newMessage,
//       timestamp: new Date().toISOString(),
//       senderName: "أحمد محمد",
//     };

//     setMessages((prev) => [...prev, msg]);
//     setNewMessage("");

//     // رد آلي من الدكتور
//     setIsTyping(true);
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1,
//           sender: "doctor",
//           message: "تم استلام رسالتك، سأرد عليك قريباً.",
//           timestamp: new Date().toISOString(),
//           senderName: doctorData.name,
//         },
//       ]);
//       setIsTyping(false);
//     }, 2000);
//   };

//   const handleWhatsAppContact = () => {
//     const text = encodeURIComponent(`مرحباً دكتور ${doctorData.name}`);
//     window.open(`https://wa.me/${doctorData.whatsapp}?text=${text}`, "_blank");
//   };

//   const handlePhoneCall = () => {
//     window.location.href = `tel:${doctorData.phone}`;
//   };

//   const handleBookAppointment = () => {
//     navigate("/appointments"); // هنا ممكن تربط بصفحة الحجز الفعلية
//   };

//   const formatTime = (t) =>
//     new Date(t).toLocaleTimeString("ar-EG", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <SimpleNavbar title={`التواصل مع ${doctorData.name}`} />

//       <div className="container mx-auto px-4 py-6">
//         {/* Doctor Info Card */}
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//                 <FaUserMd className="text-blue-600 text-2xl" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   {doctorData.name}
//                 </h1>
//                 <p className="text-blue-600 font-medium">
//                   {doctorData.specialty}
//                 </p>
//                 <p className="text-gray-600">{doctorData.title}</p>
//                 <div className="flex items-center gap-2 mt-2 text-sm">
//                   <span
//                     className={`w-3 h-3 rounded-full ${
//                       doctorData.isOnline ? "bg-green-500" : "bg-red-500"
//                     }`}
//                   ></span>
//                   <span className="text-gray-600">
//                     {doctorData.isOnline ? "متاح الآن" : "غير متاح"}
//                   </span>
//                   <span className="text-gray-400">
//                     • {doctorData.workingHours}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="font-bold text-yellow-500">
//                 ⭐ {doctorData.rating}
//               </p>
//               <p className="text-sm text-gray-600">{doctorData.experience}</p>
//               <p className="text-green-600 font-medium text-sm">
//                 {doctorData.consultationFee} ج.م
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
//           <div className="flex border-b">
//             {[
//               { key: "chat", icon: <FaComments />, label: "محادثة" },
//               { key: "contact", icon: <FaPhone />, label: "وسائل التواصل" },
//               { key: "info", icon: <FaInfoCircle />, label: "معلومات الطبيب" },
//             ].map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition ${
//                   activeTab === tab.key
//                     ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
//                     : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 {tab.icon}
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Chat Tab */}
//           {activeTab === "chat" && (
//             <div className="h-96 flex flex-col">
//               <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`flex ${
//                       msg.sender === "patient" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`px-4 py-2 rounded-xl shadow-sm max-w-xs ${
//                         msg.sender === "patient"
//                           ? "bg-blue-600 text-white"
//                           : "bg-white border text-gray-800"
//                       }`}
//                     >
//                       <p className="text-sm">{msg.message}</p>
//                       <p className="text-xs mt-1 opacity-75">
//                         {msg.senderName} • {formatTime(msg.timestamp)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 {isTyping && (
//                   <p className="text-sm text-gray-500">الدكتور يكتب...</p>
//                 )}
//               </div>
//               <div className="p-3 border-t bg-white flex gap-2">
//                 <input
//                   className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200"
//                   placeholder="اكتب رسالتك..."
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) =>
//                     e.key === "Enter" && handleSendMessage()
//                   }
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={!newMessage.trim()}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:bg-gray-300"
//                 >
//                   <FaPaperPlane />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Contact Tab */}
//           {activeTab === "contact" && (
//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <ContactCard
//                 color="green"
//                 icon={<FaCalendarPlus />}
//                 title="حجز موعد"
//                 text={`الكشف: ${doctorData.consultationFee} ج.م`}
//                 button="حجز موعد"
//                 action={handleBookAppointment}
//               />
//               <ContactCard
//                 color="green"
//                 icon={<FaWhatsapp />}
//                 title="واتساب"
//                 text="تواصل سريع عبر الواتساب"
//                 button="فتح واتساب"
//                 action={handleWhatsAppContact}
//               />
//               <ContactCard
//                 color="blue"
//                 icon={<FaPhone />}
//                 title="مكالمة هاتفية"
//                 text={doctorData.phone}
//                 button="اتصال الآن"
//                 action={handlePhoneCall}
//               />
//               <ContactCard
//                 color="purple"
//                 icon={<FaEnvelope />}
//                 title="البريد الإلكتروني"
//                 text={doctorData.email}
//                 button="إرسال إيميل"
//                 action={() =>
//                   window.open(`mailto:${doctorData.email}`, "_blank")
//                 }
//               />
//             </div>
//           )}

//           {/* Info Tab */}
//           {activeTab === "info" && (
//             <div className="p-6 space-y-6">
//               <Section title="المؤهلات العلمية" icon={<FaGraduationCap />}>
//                 {doctorData.education.map((e, i) => (
//                   <Item key={i} icon={<FaGraduationCap />} text={e} />
//                 ))}
//               </Section>
//               <Section title="التخصصات" icon={<FaStethoscope />}>
//                 {doctorData.specializations.map((s, i) => (
//                   <Item key={i} icon={<FaStethoscope />} text={s} />
//                 ))}
//               </Section>
//               <Section title="اللغات">
//                 <div className="flex gap-2 flex-wrap">
//                   {doctorData.languages.map((lang, i) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
//                     >
//                       {lang}
//                     </span>
//                   ))}
//                 </div>
//               </Section>
//               <Section title="معلومات العيادة" icon={<FaClinicMedical />}>
//                 <Item icon={<FaClinicMedical />} text={doctorData.clinic} />
//                 <Item icon={<FaMapMarkerAlt />} text={doctorData.address} />
//                 <Item icon={<FaClock />} text={doctorData.workingHours} />
//               </Section>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ContactCard = ({ color, icon, title, text, button, action }) => (
//   <div
//     className={`bg-${color}-50 border border-${color}-200 rounded-xl p-6 text-center`}
//   >
//     <div
//       className={`w-16 h-16 bg-${color}-500 rounded-full flex items-center justify-center mx-auto mb-3`}
//     >
//       {React.cloneElement(icon, { className: "text-white text-2xl" })}
//     </div>
//     <h3 className={`text-lg font-bold text-${color}-800 mb-1`}>{title}</h3>
//     <p className={`text-${color}-600 text-sm mb-4`}>{text}</p>
//     <button
//       onClick={action}
//       className={`w-full py-2 rounded-lg bg-${color}-600 hover:bg-${color}-700 text-white font-medium`}
//     >
//       {button}
//     </button>
//   </div>
// );

// const Section = ({ title, icon, children }) => (
//   <div>
//     <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
//       {icon}
//       {title}
//     </h3>
//     <div className="space-y-2">{children}</div>
//   </div>
// );

// const Item = ({ icon, text }) => (
//   <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
//     {icon}
//     <span className="text-gray-700">{text}</span>
//   </div>
// );

// export default ContactDoctorPage;
