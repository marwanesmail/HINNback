// import React, { useState } from 'react';
// import { FaLocationArrow, FaSearch, FaMousePointer, FaPills } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import LocationPicker from '../components/LocationPicker';
// import SimpleNavbar from '../components/Layout/SimpleNavbar';

// const LocationTestPage = () => {
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   const handleLocationSelect = (location) => {
//     setSelectedLocation(location);
//     console.log('تم اختيار الموقع:', location);
//   };

//   // إعدادات الانيميشن العامة
//   const containerVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: { staggerChildren: 0.2, duration: 0.5 } 
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <SimpleNavbar />

//       <motion.div
//         className="container mx-auto px-4 py-8"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <div className="max-w-4xl mx-auto">

//           {/* العنوان */}
//           <motion.div className="text-center mb-8" variants={itemVariants}>
//             <h1 className="text-3xl font-bold text-gray-800 mb-4">
//               اختبار مكون تحديد الموقع
//             </h1>
//             <p className="text-gray-600">
//               جرب خاصية تحديد الموقع الجغرافي الجديدة
//             </p>
//           </motion.div>

//           {/* تحديد الموقع */}
//           <motion.div className="bg-white rounded-2xl shadow-lg p-6 mb-8" variants={itemVariants}>
//             <h2 className="text-xl font-semibold text-gray-800 mb-6">
//               حدد موقعك
//             </h2>
//             <LocationPicker 
//               onLocationSelect={handleLocationSelect}
//               initialLocation={{ lat: 30.0444, lng: 31.2357 }}
//               showMap={true}
//             />
//           </motion.div>

//           {/* عرض الموقع المحدد */}
//           {selectedLocation && (
//             <motion.div className="bg-green-50 border border-green-200 rounded-2xl p-6" variants={itemVariants}>
//               <h3 className="text-lg font-semibold text-green-800 mb-4">
//                 الموقع المحدد:
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-white rounded-lg p-4 border border-green-200">
//                   <h4 className="font-medium text-gray-800 mb-2">خط العرض (Latitude)</h4>
//                   <p className="text-green-600 font-mono">{selectedLocation.lat.toFixed(6)}</p>
//                 </div>
//                 <div className="bg-white rounded-lg p-4 border border-green-200">
//                   <h4 className="font-medium text-gray-800 mb-2">خط الطول (Longitude)</h4>
//                   <p className="text-green-600 font-mono">{selectedLocation.lng.toFixed(6)}</p>
//                 </div>
//               </div>
//               <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
//                 <h4 className="font-medium text-gray-800 mb-2">JSON للمطورين:</h4>
//                 <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
//                   {JSON.stringify(selectedLocation, null, 2)}
//                 </pre>
//               </div>
//             </motion.div>
//           )}

//           {/* معلومات إضافية */}
//           <motion.div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6" variants={itemVariants}>
//             <h3 className="text-lg font-semibold text-blue-800 mb-4">
//               كيفية الاستخدام:
//             </h3>
//             <div className="space-y-3 text-blue-700">
//               <div className="flex items-start gap-3">
//                 <FaLocationArrow className="text-green-500 mt-1" />
//                 <p><strong>تحديد الموقع التلقائي:</strong> اضغط على "تحديد موقعي الحالي" للحصول على موقعك من GPS</p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <FaSearch className="text-blue-500 mt-1" />
//                 <p><strong>البحث اليدوي:</strong> اكتب اسم المكان أو العنوان في حقل البحث</p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <FaMousePointer className="text-purple-500 mt-1" />
//                 <p><strong>النقر على الخريطة:</strong> اضغط على أي مكان في الخريطة لتحديد الموقع</p>
//               </div>
//             </div>
//           </motion.div>

//           {/* أزرار التنقل */}
//           <motion.div className="mt-8 text-center" variants={itemVariants}>
//             <a
//               href="/prescription-upload"
//               className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               <FaPills />
//               جرب في صفحة طلب الدواء
//             </a>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LocationTestPage;
