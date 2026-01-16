// src/pages/BookAppointmentPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaUserMd,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

// Import the doctor data directly
import { defaultDoctors } from "../../../utils/doctorData";

// Animations (Framer Motion)
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, ease: "easeOut", duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BookAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reason, setReason] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");

  // Initialize data from default doctors array
  useEffect(() => {
    // هنا هيكون ربط بالباك اند بعدين
    // البيانات التالية سيتم استبدالها بطلب API فعلي في المستقبل

    // Load doctor data from default doctors array
    const foundDoctor =
      defaultDoctors.find((d) => d.id === parseInt(id)) || null;

    // Use the doctor's actual image if available
    if (foundDoctor && !foundDoctor.image) {
      // Only set fallback if no image exists
      foundDoctor.image =
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80";
    }

    setDoctor(foundDoctor);

    // For appointments, we'll use a temporary approach until backend is connected
    // In a real app, this would come from the backend
    const storedAppointments = []; // Temporary empty array
    setAppointments(storedAppointments);
  }, [id]);

  // Handle case where doctor is not found
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white shadow-xl rounded-2xl p-8 max-w-md">
          <FaExclamationTriangle className="text-6xl text-yellow-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            الطبيب غير موجود
          </h2>
          <Link
            to="/doctors"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-block mt-4"
          >
            العودة للبحث
          </Link>
        </div>
      </div>
    );
  }

  // الحصول على المواعيد المتاحة للطبيب - هنا هيكون ربط بالباك اند بعدين
  const getAvailableTimeSlots = (doctorId, date) => {
    // في المستقبل سيتم استبدال هذا بطلب API فعلي
    const doctor = defaultDoctors.find((d) => d.id === doctorId);
    if (!doctor) return [];

    // Use the doctor's actual image
    if (!doctor.image) {
      doctor.image =
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80";
    }

    // Convert date to day of the week (e.g., "saturday")
    const dayOfWeek = new Date(date)
      .toLocaleDateString("en-US", {
        weekday: "long", // Use 'long' for full name (e.g., 'sunday')
      })
      .toLowerCase();

    if (!doctor.availableDays.includes(dayOfWeek)) {
      return [];
    }

    const slots = [];
    // Assuming doctor.workingHours.start/end are strings like "09:00"
    const startTime = doctor.workingHours.start;
    const endTime = doctor.workingHours.end;
    const duration = doctor.appointmentDuration;

    // Use a fixed dummy date for time calculations only
    let currentTime = new Date(`2000-01-01T${startTime}:00`);
    const endDateTime = new Date(`2000-01-01T${endTime}:00`);

    // For now, we'll simulate appointments by checking against a temporary array
    // In a real app, this would come from the backend
    const simulatedAppointments = [];

    while (currentTime < endDateTime) {
      const timeString = currentTime.toTimeString().slice(0, 5); // "HH:MM" format

      // Check if this slot is already booked
      const isBooked = simulatedAppointments.some(
        (apt) =>
          apt.doctorId === doctorId &&
          apt.date === date &&
          apt.time === timeString &&
          apt.status !== "cancelled"
      );

      if (!isBooked) {
        slots.push({
          time: timeString,
          available: true,
        });
      }

      // Increment time by appointment duration
      currentTime.setMinutes(currentTime.getMinutes() + duration);
    }

    return slots;
  };

  // Generate the next 14 available days
  const getNext14Days = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString("ar-EG", { weekday: "long" });
      const dayOfWeek = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      const isAvailable = doctor.availableDays.includes(dayOfWeek);
      const isPast = date.getTime() < today.getTime();

      days.push({
        date: date.toISOString().split("T")[0], // YYYY-MM-DD
        dayName,
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("ar-EG", { month: "short" }),
        isAvailable,
        isPast,
      });
    }
    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
    setAvailableSlots(getAvailableTimeSlots(parseInt(id), date));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !patientName || !patientPhone) {
      Swal.fire({
        icon: "info",
        text: "يرجى ملء جميع الحقول المطلوبة",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // هنا هيكون ربط بالباك اند بعدين
      // سيتم استبدال هذا بطلب API فعلي في المستقبل
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call delay

      // Create new appointment
      const newAppointment = {
        id: Date.now(), // Temporary ID
        doctorId: parseInt(id),
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        date: selectedDate,
        time: selectedTime,
        reason,
        patientName,
        patientPhone,
        status: "pending", // Initial status
        address: doctor.address,
        fee: doctor.consultationFee,
        duration: doctor.appointmentDuration,
        createdAt: new Date().toISOString(),
      };

      // Save appointment to localStorage
      const existingAppointments = JSON.parse(
        localStorage.getItem("patientAppointments") || "[]"
      );
      existingAppointments.push(newAppointment);
      localStorage.setItem(
        "patientAppointments",
        JSON.stringify(existingAppointments)
      );

      // For now, we'll just show a success message without saving to localStorage
      // In a real app, this would be sent to the backend
      console.log("Appointment booked:", newAppointment);

      // Set appointment ID and show success modal instead of SweetAlert
      setAppointmentId(`SH-2025-${Math.floor(1000 + Math.random() * 9000)}`);
      setShowSuccessModal(true);

      // Note: We're not redirecting immediately anymore, showing modal first
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({
        icon: "error",
        text: "حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const next14Days = getNext14Days();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="bg-white shadow-sm mb-10" variants={itemVariants}>
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">حجز موعد</h1>
          <p className="text-xl font-semibold text-blue-600 mb-3">
            حجز الآن مع {doctor.name}
          </p>
          <p className="text-gray-600">
            احجز أونلاين أو كلم رقم تليفون العيادة:{" "}
            <a
              href={`tel:${doctor.phone}`}
              className="text-blue-600 font-medium hover:underline"
            >
              {doctor.phone}
            </a>
          </p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Booking Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
            variants={containerVariants}
          >
            {/* Patient Info */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                معلومات المريض
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>
            </motion.div>

            {/* Date Selection */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                اختر التاريخ
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {next14Days.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() =>
                      day.isAvailable &&
                      !day.isPast &&
                      handleDateSelect(day.date)
                    }
                    disabled={!day.isAvailable || day.isPast}
                    className={`p-3 rounded-xl text-center transition-colors ${
                      selectedDate === day.date
                        ? "bg-blue-600 text-white"
                        : day.isAvailable && !day.isPast
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-xs font-medium">{day.dayName}</div>
                    <div className="text-lg font-bold">{day.dayNumber}</div>
                    <div className="text-xs">{day.month}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Time Selection */}
            {selectedDate && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6"
                variants={itemVariants}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  اختر الوقت
                </h2>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-3 rounded-xl text-center transition-colors ${
                          selectedTime === slot.time
                            ? "bg-green-600 text-white"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    لا توجد مواعيد متاحة في هذا التاريخ
                  </p>
                )}
              </motion.div>
            )}

            {/* Reason for Visit */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                سبب الزيارة (اختياري)
              </h2>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-550"
                placeholder="اكتب سبب الزيارة أو الأعراض التي تعاني منها..."
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !selectedDate ||
                  !selectedTime ||
                  !patientName ||
                  !patientPhone
                }
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الحجز...</span>
                  </div>
                ) : (
                  "تأكيد الحجز"
                )}
              </button>
            </motion.div>
          </motion.form>

          {/* Booking Summary */}
          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ملخص الحجز
              </h3>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-3"
                    onError={(e) => {
                      // Fallback to generic doctor avatar if image fails to load
                      e.target.src =
                        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80";
                    }}
                  />
                  <div className="text-center">
                    <h4 className="font-bold text-xl text-gray-900">
                      {doctor.name}
                    </h4>
                    <p className="text-lg text-blue-600 font-medium">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {doctor.address}
                </p>
              </div>
              <div className="space-y-3">
                {/* Available Days */}
                <div className="pb-3 border-b border-gray-100">
                  <span className="text-gray-600 block mb-2">
                    الأيام المتاحة:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {doctor.availableDays.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
                      >
                        {day === "sunday"
                          ? "الأحد"
                          : day === "monday"
                          ? "الاثنين"
                          : day === "tuesday"
                          ? "الثلاثاء"
                          : day === "wednesday"
                          ? "الأربعاء"
                          : day === "thursday"
                          ? "الخميس"
                          : day === "friday"
                          ? "الجمعة"
                          : "السبت"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Times */}
                <div className="pb-3 border-b border-gray-100">
                  <span className="text-gray-600 block mb-2">أوقات العمل:</span>
                  <span className="font-medium text-sm">
                    من {doctor.workingHours.start} إلى {doctor.workingHours.end}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">التاريخ المختار:</span>
                  <span className="font-medium">
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString("ar-EG")
                      : "لم يتم الاختيار"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الوقت المختار:</span>
                  <span className="font-medium">
                    {selectedTime || "لم يتم الاختيار"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مدة الجلسة:</span>
                  <span className="font-medium">
                    {doctor.appointmentDuration} دقيقة
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-gray-600">رسوم الكشف:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {doctor.consultationFee} جنيه
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-500 mt-1" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">ملاحظة مهمة:</p>
                    <p>
                      سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد. يرجى الوصول
                      قبل 15 دقيقة من موعدك.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                <p className="text-center text-green-800 font-bold text-base">
                  حجز أونلاين، ادفع في العيادة!
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              تم الحجز بنجاح!
            </h2>

            <p className="text-gray-600 mb-6">
              تم إرسال تأكيد الحجز الإلكتروني، وستصلك رسالة تحتوي على جميع
              التفاصيل
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 font-medium">
                رقم الحجز الخاص بك:
              </p>
              <p className="text-xl font-bold text-blue-600 mt-1">
                {appointmentId}
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/patient-profile?section=appointments");
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg"
            >
              عرض مواعيدي
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default BookAppointmentPage;
