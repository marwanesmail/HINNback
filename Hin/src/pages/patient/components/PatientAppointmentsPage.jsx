import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaSearch,
  FaCalendarCheck,
  FaHistory,
  FaCalendarTimes,
  FaUserMd,
  FaPhoneAlt,
} from "react-icons/fa";

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: "د. أحمد محمد علي",
    specialty: "طب القلب",
    address: "شارع التحرير، القاهرة",
    phone: "+20 12 345 6789",
    bio: "طبيب قلب متخصص بخبرة 15 عاماً في تشخيص وعلاج أمراض القلب والأوعية الدموية. حاصل على البورد الأمريكي في طب القلب.",
  },
  {
    id: 2,
    name: "د. فاطمة حسن",
    specialty: "طب الأطفال",
    address: "شارع الجمهورية، الإسكندرية",
    phone: "+20 11 234 5678",
    bio: "أخصائية طب أطفال بخبرة تزيد عن 10 سنوات. تهتم بالصحة العامة للأطفال من حديثي الولادة حتى سن المراهقة.",
  },
  {
    id: 3,
    name: "د. محمد عبد الرحمن",
    specialty: "طب العظام",
    address: "شارع النيل، الجيزة",
    phone: "+20 10 987 6543",
    bio: "جراح عظام متخصص في علاج إصابات المفاصل والكسور والأمراض المزمنة للعظام. يستخدم أحدث التقنيات الجراحية.",
  },
];

const PatientAppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Mock appointments
  const mockPatientAppointments = [
    {
      id: 1,
      doctorId: 1,
      doctorName: "د. أحمد محمد علي",
      doctorSpecialty: "طب القلب",
      date: "2024-01-20",
      time: "10:00",
      duration: 30,
      reason: "فحص دوري للقلب",
      status: "confirmed",
      address: "شارع التحرير، القاهرة",
      phone: "+20 12 345 6789",
      fee: 300,
      notes: "",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      doctorId: 2,
      doctorName: "د. فاطمة حسن",
      doctorSpecialty: "طب الأطفال",
      date: "2024-01-25",
      time: "14:30",
      duration: 25,
      reason: "فحص طفل",
      status: "pending",
      address: "شارع الجمهورية، الإسكندرية",
      phone: "+20 11 234 5678",
      fee: 250,
      notes: "",
      createdAt: "2024-01-18T15:30:00Z",
    },
    {
      id: 3,
      doctorId: 1,
      doctorName: "د. أحمد محمد علي",
      doctorSpecialty: "طب القلب",
      date: "2024-01-10",
      time: "11:00",
      duration: 30,
      reason: "متابعة نتائج التحاليل",
      status: "completed",
      address: "شارع التحرير، القاهرة",
      phone: "+20 12 345 6789",
      fee: 300,
      notes: "تم الفحص بنجاح. النتائج طبيعية.",
      createdAt: "2024-01-05T11:00:00Z",
    },
    {
      id: 4,
      doctorId: 3,
      doctorName: "د. محمد عبد الرحمن",
      doctorSpecialty: "طب العظام",
      date: "2024-01-08",
      time: "15:00",
      duration: 45,
      reason: "ألم في الركبة",
      status: "cancelled",
      address: "شارع النيل، الجيزة",
      phone: "+20 10 987 6543",
      fee: 400,
      notes: "تم إلغاء الموعد بناءً على طلب المريض",
      createdAt: "2024-01-03T15:00:00Z",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed": return "مؤكد";
      case "pending": return "في الانتظار";
      case "completed": return "مكتمل";
      case "cancelled": return "ملغى";
      default: return status;
    }
  };

  const filterAppointments = (appointments, filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (filter) {
      case "upcoming":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          return aptDate >= today && apt.status !== "cancelled" && apt.status !== "completed";
        });
      case "past":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          return aptDate < today || apt.status === "completed";
        });
      case "cancelled":
        return appointments.filter((apt) => apt.status === "cancelled");
      default: return appointments;
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
    Swal.fire({ icon: 'success', text: 'تم إلغاء الموعد بنجاح' });
  };

  const canCancelAppointment = (appointment) => {
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime - now) / (1000 * 60 * 60);
    return hoursDifference > 24 && (appointment.status === "confirmed" || appointment.status === "pending");
  };

  const handleViewDoctor = (doctorId) => {
    const doctor = mockDoctors.find(doc => doc.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setShowDoctorModal(true);
    }
  };

  const upcomingAppointments = filterAppointments(mockPatientAppointments, "upcoming");
  const pastAppointments = filterAppointments(mockPatientAppointments, "past");
  const cancelledAppointments = filterAppointments(mockPatientAppointments, "cancelled");

  const getCurrentAppointments = () => {
    switch (activeTab) {
      case "upcoming": return upcomingAppointments;
      case "past": return pastAppointments;
      case "cancelled": return cancelledAppointments;
      default: return [];
    }
  };

  const AppointmentCard = ({ appointment }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{appointment.doctorName}</h3>
              <p className="text-blue-600 font-medium">{appointment.doctorSpecialty}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2"><FaCalendar className="text-blue-500" /><span>{new Date(appointment.date).toLocaleDateString("ar-EG")}</span></div>
            <div className="flex items-center gap-2"><FaClock className="text-green-500" /><span>{appointment.time} ({appointment.duration} دقيقة)</span></div>
            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-500" /><span className="text-gray-600">{appointment.address}</span></div>
            <div className="flex items-center gap-2"><FaMoneyBillWave className="text-purple-500" /><span className="font-medium">{appointment.fee} جنيه</span></div>
          </div>

          {appointment.reason && <div className="mt-3 p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-700"><span className="font-medium">سبب الزيارة:</span> {appointment.reason}</p></div>}
          {appointment.notes && <div className="mt-3 p-3 bg-blue-50 rounded-lg"><p className="text-sm text-blue-700"><span className="font-medium">ملاحظات:</span> {appointment.notes}</p></div>}
        </div>

        <div className="flex flex-col gap-2 md:w-48">
          <button onClick={() => handleViewDoctor(appointment.doctorId)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium">عرض الطبيب</button>
          <a href={`tel:${appointment.phone}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium">اتصال</a>
          {canCancelAppointment(appointment) && <button onClick={() => { setSelectedAppointment(appointment); setShowCancelModal(true); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-center text-sm font-medium">إلغاء الموعد</button>}
          {appointment.status === "confirmed" && <Link to={`/book-appointment/${appointment.doctorId}`} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center text-sm font-medium">حجز موعد آخر</Link>}
        </div>
      </div>
    </motion.div>
  );

  const DoctorModal = ({ doctor, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-lg w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">معلومات الطبيب</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors text-2xl font-bold">&times;</button>
          </div>
          {doctor && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <FaUserMd className="text-4xl text-blue-600" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{doctor.name}</h4>
                  <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-gray-700">
                <div className="flex items-start gap-2"><FaMapMarkerAlt className="text-red-500 mt-1" /><span>{doctor.address}</span></div>
                <div className="flex items-center gap-2"><FaPhoneAlt className="text-green-500" /><span>{doctor.phone}</span></div>
              </div>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{doctor.bio}</p>
              </div>
              <a href={`tel:${doctor.phone}`} className="w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium mt-4">اتصال بالطبيب</a>
            </div>
          )}
        </motion.div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* الصفحة تتحرك عند الدخول */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">مواعيدي</h1>
            <p className="text-gray-600">إدارة مواعيدك الطبية</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex flex-wrap gap-2">
            {["upcoming", "past", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === tab ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab === "upcoming" ? `المواعيد القادمة (${upcomingAppointments.length})` :
                  tab === "past" ? `المواعيد السابقة (${pastAppointments.length})` :
                  `المواعيد الملغاة (${cancelledAppointments.length})`}
              </button>
            ))}
          </div>

          {/* Appointments List with AnimatePresence */}
          <AnimatePresence mode="popLayout">
            {getCurrentAppointments().length === 0 ? (
              <motion.div
                key="no-appointments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <FaCalendarTimes className="text-6xl text-gray-300 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مواعيد</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === "upcoming" && "لا توجد مواعيد قادمة"}
                  {activeTab === "past" && "لا توجد مواعيد سابقة"}
                  {activeTab === "cancelled" && "لا توجد مواعيد ملغاة"}
                </p>
                {activeTab === "upcoming" && <Link to="/doctors" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">احجز موعد جديد</Link>}
              </motion.div>
            ) : (
              <div className="space-y-6"> {/* أضفنا هذا العنصر لإنشاء المسافات */}
                {getCurrentAppointments().map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">تأكيد إلغاء الموعد</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من إلغاء موعدك مع {selectedAppointment.doctorName} في{" "}
                {new Date(selectedAppointment.date).toLocaleDateString("ar-EG")} الساعة {selectedAppointment.time}؟
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleCancelAppointment(selectedAppointment.id)} className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">نعم، إلغاء الموعد</button>
                <button onClick={() => { setShowCancelModal(false); setSelectedAppointment(null); }} className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium">تراجع</button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Doctor Info Modal */}
      <AnimatePresence>
        {showDoctorModal && selectedDoctor && (
          <DoctorModal doctor={selectedDoctor} onClose={() => setShowDoctorModal(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default PatientAppointmentsPage;