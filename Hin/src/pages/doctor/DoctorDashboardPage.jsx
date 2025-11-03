import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  FaUserMd,
  FaTachometerAlt,
  FaFileMedical,
  FaHistory,
  FaUsers,
  FaComments,
  FaChartBar,
  FaPlus,
  FaPrescription,
  FaClock,
  FaStar,
  FaEye,
  FaSearch,
  FaTrash,
  FaPaperPlane,
  FaTimes,
  FaUser,
  FaStethoscope,
  FaPills,
  FaInfoCircle,
  FaCalendarPlus,
  FaPrint,
  FaCheckCircle,
  FaExclamationCircle,
  FaStickyNote,
  FaCalendarCheck,
} from "react-icons/fa";
import ChatPage from "../ChatPage";
import { USER_TYPES } from "../../services/chatService";
import DoctorAppointmentsPage from "./components/DoctorAppointmentsPage";
import DashboardLayout from "../../components/Layout/DashboardLayout";

// Import the new components
import DashboardSection from "./components/DashboardSection";
import NewPrescriptionSection from "./components/NewPrescriptionSection";
import PrescriptionsHistorySection from "./components/PrescriptionsHistorySection";
import PrescriptionDetailsModal from "./components/PrescriptionDetailsModal";
import PlaceholderSection from "./components/PlaceholderSection";
import PatientListPage from "./components/PatientListPage";
import DoctorSettingsSection from "./components/DoctorSettingsSection";

// Dummy data for prescriptions
const dummyPrescriptions = [
  {
    id: "p1",
    date: "2024-01-15",
    patientName: "ليلى السيد أحمد",
    patientId: "29012345678901",
    patientAge: 35,
    patientPhone: "01234567890",
    pharmacy: "صيدلية الشفاء",
    status: "جديدة",
    diagnosis: "التهاب في الحلق والجيوب الأنفية",
    medications: [
      {
        name: "أموكسيسيلين",
        dosage: "500mg",
        frequency: "مرتين يومياً",
        duration: "7 أيام",
        instructions: "بعد الأكل",
      },
      {
        name: "فيتامين سي",
        dosage: "1000mg",
        frequency: "مرة يومياً",
        duration: "30 يوم",
        instructions: "مع الماء",
      },
      {
        name: "مسكن للألم",
        dosage: "500mg",
        frequency: "عند الحاجة",
        duration: "5 أيام",
        instructions: "لا يزيد عن 3 مرات يومياً",
      },
    ],
    notes:
      "يجب تناول المضاد الحيوي كاملاً حتى لو تحسنت الأعراض. مراجعة بعد أسبوع إذا لم تتحسن الحالة.",
    nextVisit: "2024-01-22",
    priority: "متوسط",
  },
  {
    id: "p2",
    date: "2024-01-14",
    patientName: "محمود خالد محمد",
    patientId: "29112345678902",
    patientAge: 42,
    patientPhone: "01987654321",
    pharmacy: "صيدلية النور",
    status: "تم الصرف",
    diagnosis: "صداع نصفي",
    medications: [
      {
        name: "باراسيتامول",
        dosage: "500mg",
        frequency: "عند الحاجة",
        duration: "3 أيام",
        instructions: "مع الطعام",
      },
      {
        name: "مرخي عضلات",
        dosage: "250mg",
        frequency: "مرتين يومياً",
        duration: "5 أيام",
        instructions: "قبل النوم",
      },
    ],
    notes: "تجنب التوتر والإجهاد. شرب كمية كافية من الماء.",
    nextVisit: null,
    priority: "منخفض",
  },
  {
    id: "p3",
    date: "2024-01-13",
    patientName: "فاطمة علي حسن",
    patientId: "29212345678903",
    patientAge: 28,
    patientPhone: "01122334455",
    pharmacy: "صيدلية الرحمة",
    status: "قيد المراجعة",
    diagnosis: "التهاب المعدة",
    medications: [
      {
        name: "مضاد للحموضة",
        dosage: "20mg",
        frequency: "مرة يومياً",
        duration: "14 يوم",
        instructions: "قبل الإفطار بنصف ساعة",
      },
      {
        name: "مهدئ للمعدة",
        dosage: "10mg",
        frequency: "ثلاث مرات يومياً",
        duration: "7 أيام",
        instructions: "قبل الوجبات",
      },
    ],
    notes: "تجنب الأطعمة الحارة والمقلية. تناول وجبات صغيرة ومتكررة.",
    nextVisit: "2024-01-27",
    priority: "عالي",
  },
];

const DoctorDashboardPage = () => {
  const contentRef = useRef(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [prescriptions, setPrescriptions] = useState(dummyPrescriptions);
  // const [showNotification, setShowNotification] = useState(false); // غير مستخدم حالياً
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Doctor data state
  const [doctorData, setDoctorData] = useState({
    id: "doctor-123", // Added id for chat component
    name: "د. أحمد محمد علي",
    specialty: "طبيب عام",
    experience: "15 سنة خبرة",
    patients: 1250,
    prescriptions: prescriptions.length,
    rating: 4.9,
    type: "doctor",
    clinicName: "عيادة النور للأطفال", // Default clinic name
  });

  // Function to update doctor data
  const updateDoctorData = (newData) => {
    setDoctorData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // استبدال البيانات الوهمية بالإشعارات من localStorage
  const getNotificationsData = () => {
    // هنا هيكون ربط بالباك اند بعدين
    const storedNotifications = localStorage.getItem("doctorNotifications");
    if (storedNotifications) {
      return JSON.parse(storedNotifications);
    }

    // بيانات افتراضية إذا لم توجد بيانات في localStorage
    const defaultNotifications = [
      {
        id: 1,
        title: "موعد جديد",
        message: "لديك موعد جديد مع مريض اليوم",
        time: "منذ 10 دقائق",
        isRead: false,
        type: "appointment",
      },
      {
        id: 2,
        title: "نتيجة تحليل",
        message: "نتيجة تحليل مريضك جاهزة للمراجعة",
        time: "منذ ساعة",
        isRead: false,
        type: "test",
      },
      {
        id: 3,
        title: "تذكير موعد",
        message: "تذكير بموعدك مع المريض أحمد محمد غداً",
        time: "منذ يومين",
        isRead: true,
        type: "reminder",
      },
    ];

    // حفظ البيانات الافتراضية في localStorage
    localStorage.setItem(
      "doctorNotifications",
      JSON.stringify(defaultNotifications)
    );
    return defaultNotifications;
  };

  // Load notifications
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    setIsLoadingNotifications(true);
    // استبدال محاكاة API call ببيانات من localStorage
    setTimeout(() => {
      const notificationData = getNotificationsData();
      setNotifications(notificationData);
      setIsLoadingNotifications(false);
    }, 500);
  };

  const loadUnreadCount = () => {
    // Count unread notifications
    const notificationData = getNotificationsData();
    const unread = notificationData.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    const updatedNotifications = notifications.map((n) =>
      n.id === notification.id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);

    // تحديث البيانات في localStorage
    localStorage.setItem(
      "doctorNotifications",
      JSON.stringify(updatedNotifications)
    );

    // Update unread count
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Handle notification action based on type
    if (notification.type === "appointment") {
      setActiveSection("appointments");
    } else if (notification.type === "test") {
      setActiveSection("prescriptions-history");
    }

    // Close notifications dropdown
    setShowNotifications(false);
  };

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const generateSampleNotifications = () => {
    // Add a new sample notification
    const newNotification = {
      id: Date.now(),
      title: "تنبيه جديد",
      message: "لديك تنبيه مهم يتطلب انتباهك",
      time: "الآن",
      isRead: false,
      type: "alert",
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);

    // تحديث البيانات في localStorage
    localStorage.setItem(
      "doctorNotifications",
      JSON.stringify(updatedNotifications)
    );

    setUnreadCount((prev) => prev + 1);
  };

  // Handle search events from navbar
  useEffect(() => {
    const handleDashboardSearch = (e) => {
      const query = e.detail.query;

      if (contentRef.current) {
        // Remove previous highlights
        removeHighlights(contentRef.current);

        if (query) {
          // Search in content
          const results = searchInElement(contentRef.current, query);

          // Highlight the search terms
          highlightSearchTerms(contentRef.current, query);

          // Emit results back to navbar
          window.dispatchEvent(
            new CustomEvent("dashboardSearchResults", {
              detail: { results },
            })
          );
        } else {
          // Clear results
          window.dispatchEvent(
            new CustomEvent("dashboardSearchResults", {
              detail: { results: [] },
            })
          );
        }
      }
    };

    window.addEventListener("dashboardSearch", handleDashboardSearch);
    return () => {
      window.removeEventListener("dashboardSearch", handleDashboardSearch);
    };
  }, []);

  // Utility functions
  const showNotificationMessage = (message, type = "success") => {
    Swal.fire({
      icon: type,
      title: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "جديدة":
        return "bg-blue-100 text-blue-800";
      case "تم الصرف":
        return "bg-green-100 text-green-800";
      case "قيد المراجعة":
        return "bg-yellow-100 text-yellow-800";
      case "ملغية":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "عالي":
        return "text-red-600";
      case "متوسط":
        return "text-yellow-600";
      case "منخفض":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Logic for adding/removing medications in the new prescription form
  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    patientId: "",
    patientAge: "",
    patientPhone: "",
    diagnosis: "",
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    notes: "",
    pharmacy: "",
    priority: "متوسط",
    nextVisit: "",
  });

  const handleNewPrescriptionChange = (e) => {
    setNewPrescription({ ...newPrescription, [e.target.name]: e.target.value });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = newPrescription.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setNewPrescription({ ...newPrescription, medications: updatedMedications });
  };

  const addMedication = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [
        ...newPrescription.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    });
  };

  const removeMedication = (index) => {
    if (newPrescription.medications.length > 1) {
      const updatedMedications = newPrescription.medications.filter(
        (_, i) => i !== index
      );
      setNewPrescription({
        ...newPrescription,
        medications: updatedMedications,
      });
    }
  };

  // TODO: ربط مع API هنا - POST /api/doctor/prescriptions
  // نوع البيانات المطلوبة: { patientName, patientId, patientAge, patientPhone, diagnosis, medications, notes, pharmacy, priority, nextVisit }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { id, patientName, patientId, patientAge, patientPhone, diagnosis, medications, notes, pharmacy, priority, nextVisit, date, status }
  const submitPrescription = () => {
    // Basic validation
    if (
      !newPrescription.patientName ||
      !newPrescription.patientId ||
      !newPrescription.diagnosis ||
      !newPrescription.pharmacy ||
      newPrescription.medications.some(
        (m) => !m.name || !m.dosage || !m.frequency
      )
    ) {
      showNotificationMessage(
        "الرجاء تعبئة جميع الحقول المطلوبة (اسم المريض، رقم الهوية، التشخيص، الصيدلية، وتفاصيل الأدوية).",
        "error"
      );
      return;
    }

    const newId = `p${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];

    const submittedPrescription = {
      ...newPrescription,
      id: newId,
      date: today,
      status: "جديدة",
      patientAge: parseInt(newPrescription.patientAge) || 0,
    };

    setPrescriptions((prev) => [submittedPrescription, ...prev]);
    showNotificationMessage("تم إرسال الروشتة بنجاح");

    // Reset form after submission
    setNewPrescription({
      patientName: "",
      patientId: "",
      patientAge: "",
      patientPhone: "",
      diagnosis: "",
      medications: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
      notes: "",
      pharmacy: "",
      priority: "متوسط",
      nextVisit: "",
    });
  };

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter((p) => {
    const matchesSearch =
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.includes(searchQuery) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const viewPrescriptionDetails = (id) => {
    const prescription = prescriptions.find((p) => p.id === id);
    if (prescription) {
      setSelectedPrescription(prescription);
      setShowModal(true);
    } else {
      showNotificationMessage("لم يتم العثور على الروشتة المطلوبة", "error");
    }
  };

  const closePrescriptionDetails = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  // TODO: ربط مع API هنا - DELETE /api/doctor/prescriptions/{id}
  // نوع البيانات المطلوبة: path param { id }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { success: true }
  const deletePrescription = (id) => {
    Swal.fire({
      title: "هل أنت متأكد من حذف هذه الروشتة؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        setPrescriptions((prev) => prev.filter((p) => p.id !== id));
        showNotificationMessage("تم حذف الروشتة بنجاح");
        closePrescriptionDetails();
      }
    });
  };

  // TODO: ربط مع API هنا - PUT /api/doctor/prescriptions/{id}/status
  // نوع البيانات المطلوبة: path param { id }, body { status }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { success: true, prescription: { id, status } }
  const updatePrescriptionStatus = (id, newStatus) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    showNotificationMessage(`تم تحديث حالة الروشتة إلى: ${newStatus}`);
  };

  // إضافة معالج لمفتاح Escape لإغلاق النافذة المنبثقة
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && showModal) {
        console.log("Escape key pressed, closing modal");
        closePrescriptionDetails();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showModal]);

  const menuItems = [
    {
      id: "dashboard",
      icon: FaTachometerAlt,
      label: "لوحة التحكم",
    },
    {
      id: "new-prescription",
      icon: FaFileMedical,
      label: "روشتة جديدة",
    },
    {
      id: "prescriptions-history",
      icon: FaHistory,
      label: "سجل الروشتات",
    },
    { id: "appointments", icon: FaCalendarCheck, label: "مواعيدي" },
    { id: "patients", icon: FaUsers, label: "المرضى" },
    { id: "settings", icon: FaUser, label: "الإعدادات" },
    { id: "chat", icon: FaComments, label: "المحادثات" },
    // { id: "analytics", icon: FaChartBar, label: "التقارير" },
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div ref={contentRef} className="min-h-screen bg-gray-50">
      <DashboardLayout
        sidebarItems={menuItems}
        profileData={doctorData}
        title="لوحة تحكم الطبيب"
        onSectionChange={handleSectionChange}
        activeSection={activeSection} // Pass the activeSection value
        // Notification props
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onToggleNotifications={handleToggleNotifications}
        showNotifications={showNotifications}
        onGenerateSampleNotifications={generateSampleNotifications}
        // Color customization for Doctor Dashboard
        navbarColor="bg-blue-900"
        sidebarColor="bg-blue-800"
        textColor="text-white"
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === "dashboard" && "لوحة التحكم"}
                  {activeSection === "new-prescription" && "كتابة روشتة جديدة"}
                  {activeSection === "prescriptions-history" && "سجل الروشتات"}
                  {activeSection === "appointments" && "مواعيدي"}
                  {activeSection === "patients" && "قائمة المرضى"}
                  {activeSection === "settings" &&
                    " إعدادات العيادة و المواعيد"}
                  {activeSection === "chat" && "المحادثات"}
                  {/* {activeSection === "analytics" && "التقارير والإحصائيات"} */}
                </h1>
                <p className="text-gray-600 mt-1">
                  {new Date().toLocaleDateString("ar-EG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeSection === "dashboard" && (
            <DashboardSection
              doctorData={doctorData}
              prescriptions={prescriptions}
              getStatusColor={getStatusColor}
              setActiveSection={setActiveSection}
              viewPrescriptionDetails={viewPrescriptionDetails}
            />
          )}

          {activeSection === "new-prescription" && (
            <NewPrescriptionSection
              newPrescription={newPrescription}
              handleNewPrescriptionChange={handleNewPrescriptionChange}
              handleMedicationChange={handleMedicationChange}
              addMedication={addMedication}
              removeMedication={removeMedication}
              submitPrescription={submitPrescription}
            />
          )}

          {activeSection === "prescriptions-history" && (
            <PrescriptionsHistorySection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              filteredPrescriptions={filteredPrescriptions}
              prescriptions={prescriptions} // Add this prop
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
              viewPrescriptionDetails={viewPrescriptionDetails}
              updatePrescriptionStatus={updatePrescriptionStatus}
            />
          )}

          {activeSection === "appointments" && <DoctorAppointmentsPage />}

          {/* Chat Section */}
          {activeSection === "chat" && (
            <div className="h-[calc(100vh-12rem)]">
              <ChatPage userType={USER_TYPES.DOCTOR} userId={doctorData.id} />
            </div>
          )}

          {/* Other sections placeholders */}
          {activeSection === "patients" && (
            <PatientListPage
              onNavigateToPrescription={(patient) => {
                // Set the patient data for the new prescription
                setNewPrescription((prev) => ({
                  ...prev,
                  patientName: patient.fullName,
                  patientId: "", // You might want to store patient ID in your patient data
                  patientAge: patient.age.toString(),
                  patientPhone: patient.phone,
                }));
                // Navigate to the new prescription section
                setActiveSection("new-prescription");
              }}
            />
          )}

          {activeSection === "settings" && (
            <DoctorSettingsSection
              updateDoctorData={updateDoctorData}
              doctorData={doctorData}
            />
          )}

          {activeSection === "analytics" && (
            <PlaceholderSection
              icon={FaChartBar}
              title="التقارير والإحصائيات"
            />
          )}
        </main>

        {/* Prescription Details Modal */}
        {showModal && (
          <PrescriptionDetailsModal
            selectedPrescription={selectedPrescription}
            closePrescriptionDetails={closePrescriptionDetails}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            deletePrescription={deletePrescription}
          />
        )}
      </DashboardLayout>
    </div>
  );
};

export default DoctorDashboardPage;
