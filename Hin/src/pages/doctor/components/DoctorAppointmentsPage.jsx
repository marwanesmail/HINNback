import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendar,
  FaClock,
  FaPhone,
  FaCalendarTimes,
  FaCheck,
  FaTimes,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

const DoctorAppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Initialize data from localStorage
  useEffect(() => {
    // هنا هيكون ربط بالباك اند بعدين
    // البيانات التالية سيتم استبدالها بطلب API فعلي في المستقبل

    // Load doctor data from localStorage
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const doctor = doctors.find((d) => d.id === 1) || doctors[0] || null;
    setCurrentDoctor(doctor);

    // Load appointments data from localStorage
    const defaultAppointments = [
      {
        id: 1,
        patientName: "أحمد محمد علي",
        patientPhone: "+20 12 345 6789",
        patientEmail: "ahmed@email.com",
        date: "2024-01-20",
        time: "10:00",
        duration: 30,
        reason: "فحص دوري للقلب",
        status: "confirmed",
        notes: "",
        patientAge: 45,
        isNewPatient: false,
      },
      {
        id: 2,
        patientName: "فاطمة أحمد",
        patientPhone: "+20 11 234 5678",
        patientEmail: "fatma@email.com",
        date: "2024-01-20",
        time: "10:30",
        duration: 30,
        reason: "ألم في الصدر",
        status: "pending",
        notes: "",
        patientAge: 38,
        isNewPatient: true,
      },
      {
        id: 3,
        patientName: "محمد حسن",
        patientPhone: "+20 10 987 6543",
        patientEmail: "mohamed@email.com",
        date: "2024-01-20",
        time: "11:00",
        duration: 30,
        reason: "متابعة ضغط الدم",
        status: "confirmed",
        notes: "",
        patientAge: 52,
        isNewPatient: false,
      },
      {
        id: 4,
        patientName: "سارة محمود",
        patientPhone: "+20 12 876 5432",
        patientEmail: "sara@email.com",
        date: "2024-01-21",
        time: "09:30",
        duration: 30,
        reason: "فحص شامل",
        status: "pending",
        notes: "",
        patientAge: 29,
        isNewPatient: true,
      },
      {
        id: 5,
        patientName: "خالد عبد الله",
        patientPhone: "+20 11 765 4321",
        patientEmail: "khaled@email.com",
        date: "2024-01-19",
        time: "14:00",
        duration: 30,
        reason: "متابعة العلاج",
        status: "completed",
        notes: "تم الفحص بنجاح. يحتاج متابعة بعد أسبوعين.",
        patientAge: 41,
        isNewPatient: false,
      },
    ];

    // Save default appointments to localStorage if not exists
    if (!localStorage.getItem("appointments")) {
      localStorage.setItem("appointments", JSON.stringify(defaultAppointments));
    }

    // Load appointments from localStorage
    const storedAppointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );
    setAppointments(storedAppointments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "pending":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  const filterAppointments = (appointmentsList, filter) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    switch (filter) {
      case "today":
        return appointmentsList.filter((apt) => apt.date === today);
      case "tomorrow":
        return appointmentsList.filter((apt) => apt.date === tomorrowStr);
      case "pending":
        return appointmentsList.filter((apt) => apt.status === "pending");
      case "all":
        return appointmentsList;
      default:
        return appointmentsList;
    }
  };

  const handleAppointmentAction = (appointment, action) => {
    setSelectedAppointment(appointment);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedAppointment && modalAction) {
      let newStatus = "";
      let message = "";
      
      switch (modalAction) {
        case "confirm":
          newStatus = "confirmed";
          message = "تم تأكيد الموعد بنجاح";
          break;
        case "cancel":
          newStatus = "cancelled";
          message = "تم إلغاء الموعد";
          break;
        case "complete":
          newStatus = "completed";
          message = "تم تسجيل الموعد كمكتمل";
          break;
        default:
          message = "تم تنفيذ العملية";
      }

      // Update appointment status
      const updatedAppointments = appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: newStatus }
          : apt
      );
      
      setAppointments(updatedAppointments);
      
      // Save to localStorage
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

      Swal.fire({ 
        icon: "success", 
        title: "نجح",
        text: message,
        confirmButtonText: "موافق",
        confirmButtonColor: "#3b82f6"
      });
    }

    setShowModal(false);
    setSelectedAppointment(null);
    setModalAction("");
  };

  const todayAppointments = filterAppointments(appointments, "today");
  const tomorrowAppointments = filterAppointments(appointments, "tomorrow");
  const pendingAppointments = filterAppointments(appointments, "pending");
  const newPatientsToday = todayAppointments.filter(
    (apt) => apt.isNewPatient
  ).length;

  const getCurrentAppointments = () => {
    return filterAppointments(appointments, activeTab);
  };

  const handleViewDetails = (appointment) => {
    Swal.fire({
      title: `<div class="text-right"><strong>${appointment.patientName}</strong></div>`,
      html: `
        <div class="text-right" style="direction: rtl;">
          <div class="mb-3">
            <p class="text-gray-600 mb-2"><strong>العمر:</strong> ${appointment.patientAge} سنة</p>
            <p class="text-gray-600 mb-2"><strong>سبب الزيارة:</strong> ${appointment.reason}</p>
            ${appointment.notes ? `<p class="text-gray-600 mb-2"><strong>ملاحظات:</strong> ${appointment.notes}</p>` : ''}
            ${appointment.isNewPatient ? '<span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">مريض جديد</span>' : ''}
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'إغلاق',
      confirmButtonColor: '#3b82f6',
      width: 600,
    });
  };

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

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إدارة المواعيد
            </h1>
            <p className="text-gray-600">
              د. {currentDoctor?.name} - {currentDoctor?.specialty}
            </p>
          </div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-blue-50 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-blue-600">
                {todayAppointments.length}
              </div>
              <div className="text-sm text-blue-700">مواعيد اليوم</div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-yellow-50 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-yellow-600">
                {pendingAppointments.length}
              </div>
              <div className="text-sm text-yellow-700">في الانتظار</div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-green-50 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-green-600">
                {newPatientsToday}
              </div>
              <div className="text-sm text-green-700">مرضى جدد اليوم</div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-purple-50 rounded-xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-purple-600">
                {tomorrowAppointments.length}
              </div>
              <div className="text-sm text-purple-700">مواعيد الغد</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex flex-wrap gap-2">
          <motion.button
            layout
            onClick={() => setActiveTab("today")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "today"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            اليوم ({todayAppointments.length})
          </motion.button>
          <motion.button
            layout
            onClick={() => setActiveTab("tomorrow")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "tomorrow"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            الغد ({tomorrowAppointments.length})
          </motion.button>
          <motion.button
            layout
            onClick={() => setActiveTab("pending")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            معلقة ({pendingAppointments.length})
          </motion.button>
          <motion.button
            layout
            onClick={() => setActiveTab("all")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            الكل ({appointments.length})
          </motion.button>
        </div>

        {/* Appointments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {getCurrentAppointments().length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarTimes className="text-6xl text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                لا توجد مواعيد
              </h3>
              <p className="text-gray-500">
                {activeTab === "today" && "لا توجد مواعيد اليوم"}
                {activeTab === "tomorrow" && "لا توجد مواعيد غداً"}
                {activeTab === "pending" && "لا توجد مواعيد معلقة"}
                {activeTab === "all" && "لا توجد مواعيد"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-bold">#</th>
                    <th className="px-6 py-4 text-right text-sm font-bold">اسم المريض</th>
                    <th className="px-6 py-4 text-right text-sm font-bold">التاريخ</th>
                    <th className="px-6 py-4 text-right text-sm font-bold">الوقت</th>
                    <th className="px-6 py-4 text-right text-sm font-bold">رقم الهاتف</th>
                    <th className="px-6 py-4 text-right text-sm font-bold">الحالة</th>
                    <th className="px-6 py-4 text-right text-sm font-bold">التفاصيل</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence mode="popLayout">
                    {getCurrentAppointments().map((appointment, index) => (
                      <motion.tr
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {appointment.patientName}
                            </span>
                            {appointment.isNewPatient && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                جديد
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <FaCalendar className="text-blue-500" />
                            {new Date(appointment.date).toLocaleDateString("ar-EG", {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-green-500" />
                            {appointment.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-purple-500" />
                            <a
                              href={`tel:${appointment.patientPhone}`}
                              className="hover:text-purple-600 hover:underline"
                            >
                              {appointment.patientPhone}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusText(appointment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(appointment)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            <FaEye />
                            <span>عرض</span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {appointment.status === "pending" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAppointmentAction(appointment, "confirm")}
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                  title="تأكيد"
                                >
                                  <FaCheck />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAppointmentAction(appointment, "cancel")}
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                  title="رفض"
                                >
                                  <FaTimes />
                                </motion.button>
                              </>
                            )}
                            {appointment.status === "confirmed" && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAppointmentAction(appointment, "complete")}
                                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                  title="تسجيل كمكتمل"
                                >
                                  <FaCheckCircle />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAppointmentAction(appointment, "cancel")}
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                  title="إلغاء"
                                >
                                  <FaTimes />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {showModal && selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {modalAction === "confirm" && "تأكيد الموعد"}
                {modalAction === "cancel" && "إلغاء الموعد"}
                {modalAction === "complete" && "تسجيل الموعد كمكتمل"}
              </h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من{" "}
                {modalAction === "confirm"
                  ? "تأكيد"
                  : modalAction === "cancel"
                  ? "إلغاء"
                  : "تسجيل"}{" "}
                موعد {selectedAppointment.patientName}؟
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmAction}
                  className={`flex-1 py-3 text-white rounded-lg font-medium transition-colors ${
                    modalAction === "confirm"
                      ? "bg-green-600 hover:bg-green-700"
                      : modalAction === "cancel"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  نعم، تأكيد
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAppointment(null);
                    setModalAction("");
                  }}
                  className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  تراجع
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorAppointmentsPage;
