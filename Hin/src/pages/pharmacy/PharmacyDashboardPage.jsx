import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  getPharmacyRequests,
  respondToMedicineRequest,
  // getRequestsStats,
} from "../../services/medicineRequestApi";
import {
  notifyMedicineAvailable,
  notifyMedicineUnavailable,
} from "../../services/notificationService";
import ChatPage from "../ChatPage";
import { USER_TYPES } from "../../services/chatService";
import {
  FaClinicMedical,
  FaTachometerAlt,
  FaPrescription,
  FaBell,
  FaBoxes,
  FaExchangeAlt,
  FaComments,
  FaChartBar,
  FaPlus,
  FaUsers,
  FaCalculator,
} from "react-icons/fa";
import Swal from "sweetalert2";

// Import the new components
import PharmacyDashboardSection from "./components/PharmacyDashboardSection";
import PharmacyPrescriptionsSection from "./components/PharmacyPrescriptionsSection";
import PharmacyMedicineRequestsSection from "./components/PharmacyMedicineRequestsSection";
import PharmacyInventorySection from "./components/PharmacyInventorySection";
import PharmacyExchangeSection from "./components/PharmacyExchangeSection";
import OrderMedicineModal from "./components/OrderMedicineModal";
import UsePointsModal from "./components/UsePointsModal";
import NewExchangeRequestModal from "./components/NewExchangeRequestModal";
import AddInventoryItemModal from "./components/AddInventoryItemModal";
import PharmacyOrderMedicinesPage from "./components/PharmacyOrderMedicinesPage";

import {
  searchInElement,
  removeHighlights,
  highlightSearchTerms,
} from "../../utils/dashboardSearch";

const PharmacyDashboardPage = () => {
  const location = useLocation();
  const contentRef = useRef(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // إشعارات طلبات الأدوية من المرضى
  const [medicineRequests, setMedicineRequests] = useState([
    {
      id: 1,
      patientName: "أحمد محمد علي",
      patientPhone: "01234567890",
      medicines: [
        { name: "باراسيتامول 500mg", quantity: 2 },
        { name: "فيتامين د", quantity: 1 },
      ],
      location: { lat: 30.0444, lng: 31.2357 },
      distance: "0.5 كم",
      requestTime: "منذ 10 دقائق",
      status: "pending", // pending, accepted, declined
      alternativeOption: "nearest",
    },
    {
      id: 2,
      patientName: "فاطمة أحمد حسن",
      patientPhone: "01987654321",
      medicines: [
        { name: "إيبوبروفين 400mg", quantity: 1 },
        { name: "شراب كحة", quantity: 1 },
      ],
      location: { lat: 30.05, lng: 31.24 },
      distance: "1.2 كم",
      requestTime: "منذ 25 دقيقة",
      status: "pending",
      alternativeOption: "nearest",
    },
    {
      id: 3,
      patientName: "محمود سعد",
      patientPhone: "01122334455",
      medicines: [{ name: "أنسولين", quantity: 3 }],
      location: { lat: 30.04, lng: 31.23 },
      distance: "0.8 كم",
      requestTime: "منذ 5 دقائق",
      status: "accepted",
      alternativeOption: "nearest",
    },
  ]);

  // Mock data
  const pharmacyData = {
    name: "صيدلية الشفاء",
    branch: "فرع المدينة",
    manager: "د/أحمد محمد",
    // username: "ahmed_pharmacy",
    points: 2450,
    totalSales: 125000,
    monthlyOrders: 89,
    rating: 4.8,
    type: "pharmacy",
  };

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "محمد أحمد علي",
      doctorName: "د. أحمد محمد",
      medicines: ["باراسيتامول 500mg", "أموكسيسيلين 250mg", "فيتامين د"],
      status: "pending",
      points: 120,
      total: 85.5,
      date: "2024-01-15",
      phone: "01234567890",
    },
    {
      id: 2,
      patientName: "فاطمة علي حسن",
      doctorName: "د. سارة أحمد",
      medicines: ["إيبوبروفين 400mg", "شراب كحة"],
      status: "processing",
      points: 80,
      total: 45.0,
      date: "2024-01-15",
      phone: "01987654321",
    },
    {
      id: 3,
      patientName: "أحمد محمود",
      doctorName: "د. محمد علي",
      medicines: ["أنسولين", "شرائط قياس السكر"],
      status: "completed",
      points: 200,
      total: 150.0,
      date: "2024-01-14",
      phone: "01122334455",
    },
  ]);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "باراسيتامول 500mg",
      stock: 5,
      minStock: 20,
      expiry: "2024-12-31",
      price: 12.5,
      status: "low",
    },
    {
      id: 2,
      name: "أموكسيسيلين 250mg",
      stock: 45,
      minStock: 30,
      expiry: "2024-08-15",
      price: 25.0,
      status: "good",
    },
    {
      id: 3,
      name: "إيبوبروفين 400mg",
      stock: 0,
      minStock: 15,
      expiry: "2024-06-30",
      price: 18.75,
      status: "out",
    },
    {
      id: 4,
      name: "فيتامين د",
      stock: 25,
      minStock: 10,
      expiry: "2025-03-20",
      price: 35.0,
      status: "good",
    },
    {
      id: 5,
      name: "شراب كحة",
      stock: 8,
      minStock: 12,
      expiry: "2024-09-10",
      price: 22.5,
      status: "low",
    },
  ]);

  const [exchangeRequests, setExchangeRequests] = useState([
    {
      id: 1,
      pharmacy: "صيدلية النور",
      medicine: "باراسيتامول 500mg",
      quantity: 10,
      status: "pending",
    },
    {
      id: 2,
      pharmacy: "صيدلية الأمل",
      medicine: "إيبوبروفين 400mg",
      quantity: 5,
      status: "approved",
    },
  ]);

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      title: "طلب دواء جديد",
      message: "لديك طلب دواء جديد من مريض",
      time: "منذ 5 دقائق",
      isRead: false,
      type: "medicine_request",
    },
    {
      id: 2,
      title: "تحديث المخزون",
      message: "بعض الأدوية قربت من انتهاء الصلاحية",
      time: "منذ ساعة",
      isRead: false,
      type: "inventory",
    },
    {
      id: 3,
      title: "تقرير المبيعات",
      message: "تقرير المبيعات الشهري جاهز للمشاهدة",
      time: "منذ يومين",
      isRead: true,
      type: "report",
    },
  ];

  // Effect to handle navigation state
  useEffect(() => {
    if (location.state && location.state.activeSection) {
      setActiveSection(location.state.activeSection);
      // Clear the location state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoadingNotifications(false);
    }, 500);
  };

  const loadUnreadCount = () => {
    // Count unread notifications
    const unread = mockNotifications.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // Update unread count
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Handle notification action based on type
    if (notification.type === "medicine_request") {
      setActiveSection("medicine-requests");
    } else if (notification.type === "inventory") {
      setActiveSection("inventory");
    } else if (notification.type === "report") {
      setActiveSection("analytics");
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

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  // Utility functions
  const showNotification = (message, type = "success") => {
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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockColor = (status) => {
    switch (status) {
      case "low":
        return "text-yellow-600";
      case "out":
        return "text-red-600";
      case "good":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Event handlers
  const handlePrescriptionAction = (prescriptionId, action) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === prescriptionId
          ? {
              ...p,
              status:
                action === "accept"
                  ? "processing"
                  : action === "complete"
                  ? "completed"
                  : "rejected",
            }
          : p
      )
    );

    const actionText =
      action === "accept" ? "قبول" : action === "complete" ? "إكمال" : "رفض";
    showNotification(`تم ${actionText} الروشتة بنجاح`);
  };

  const handlePointsModal = (prescription) => {
    setSelectedPrescription(prescription);
    setPointsToUse(0);
    setShowPointsModal(true);
  };

  const applyPoints = (e) => {
    e.preventDefault();
    if (!selectedPrescription) return;

    const discount = pointsToUse * 0.5;
    const newTotal = Math.max(0, selectedPrescription.total - discount);

    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === selectedPrescription.id
          ? { ...p, total: newTotal, points: p.points - pointsToUse }
          : p
      )
    );

    showNotification(
      `تم تطبيق خصم ${discount.toFixed(2)} جنيه باستخدام ${pointsToUse} نقطة`
    );
    setShowPointsModal(false);
    setSelectedPrescription(null);
    setPointsToUse(0);
  };

  // TODO: ربط مع API هنا - POST /api/pharmacy/orders
  // نوع البيانات المطلوبة: { company, medicine, quantity }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { success: true, order: { id, company, medicine, quantity, status } }
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
      company: formData.get("company"),
      medicine: formData.get("medicine"),
      quantity: formData.get("quantity"),
    };

    showNotification(
      `تم إرسال طلب ${orderData.quantity} من ${orderData.medicine} بنجاح`
    );
    setShowOrderModal(false);
    e.target.reset();
  };

  const handleExchangeRequest = (requestId, action) => {
    setExchangeRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: action } : r))
    );

    const actionText = action === "approved" ? "قبول" : "رفض";
    showNotification(`تم ${actionText} طلب التبادل`);
  };

  // TODO: ربط مع API هنا - PUT /api/pharmacy/inventory/{itemId}
  // نوع البيانات المطلوبة: path param { itemId }, body { stock }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { success: true, item: { id, name, stock, minStock, expiry, price, status } }
  const handleInventoryUpdate = (itemId, updatedItem) => {
    // If updatedItem is an object with both stock and price, use it directly
    // Otherwise, maintain backward compatibility with just stock value
    if (typeof updatedItem === "object" && updatedItem !== null) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                stock: updatedItem.stock,
                price: updatedItem.price,
                status: updatedItem.status,
              }
            : item
        )
      );
    } else {
      // Backward compatibility for stock-only updates
      setInventory((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                stock: updatedItem,
                status:
                  updatedItem === 0
                    ? "out"
                    : updatedItem <= item.minStock
                    ? "low"
                    : "good",
              }
            : item
        )
      );
    }
    showNotification("تم تحديث المخزون بنجاح");
  };

  // تحميل طلبات الأدوية عند تحميل الصفحة
  useEffect(() => {
    const loadMedicineRequests = async () => {
      setIsLoadingRequests(true);
      try {
        // في التطبيق الحقيقي، سنمرر معرف الصيدلية
        const requests = await getPharmacyRequests(1); // معرف الصيدلية الحالية
        setMedicineRequests(requests);
      } catch (error) {
        console.error("خطأ في تحميل طلبات الأدوية:", error);
        showNotification("خطأ في تحميل طلبات الأدوية", "error");
      } finally {
        setIsLoadingRequests(false);
      }
    };

    loadMedicineRequests();
  }, []);

  // دالة للتعامل مع طلبات الأدوية من المرضى
  // TODO: ربط مع API هنا - POST /api/pharmacy/medicine-requests/{requestId}/respond
  // نوع البيانات المطلوبة: path param { requestId }, body { status, message, availableMedicines, totalPrice }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { success: true }
  const handleMedicineRequest = async (requestId, action) => {
    try {
      // إرسال الرد للخدمة
      await respondToMedicineRequest(requestId, 1, {
        status: action,
        message:
          action === "accepted" ? "الدواء متوفر" : "الدواء غير متوفر حالياً",
        availableMedicines: action === "accepted" ? [] : [],
        totalPrice: action === "accepted" ? 0 : 0,
      });

      // تحديث الحالة المحلية
      setMedicineRequests((prev) =>
        prev.map((request) =>
          request.id === requestId ? { ...request, status: action } : request
        )
      );

      const request = medicineRequests.find((r) => r.id === requestId);
      if (request) {
        const actionText = action === "accepted" ? "قبول" : "رفض";
        showNotification(`تم ${actionText} طلب ${request.patientName} بنجاح`);

        // إرسال إشعار للمريض
        try {
          if (action === "accepted") {
            await notifyMedicineAvailable(
              request.patientPhone,
              {
                id: 1, // معرف الصيدلية الحالية
                name: pharmacyData.name,
                phone: "02-25555555", // رقم الصيدلية
                address: "شارع التحرير، وسط البلد",
                distance: request.distance,
              },
              {
                medicines: request.medicines.map((m) => m.name),
                totalPrice: request.medicines.reduce(
                  (sum, m) => sum + m.quantity * 15,
                  0
                ), // سعر تقديري
                requestId: request.id,
              }
            );
          } else {
            await notifyMedicineUnavailable(
              request.patientPhone,
              {
                id: 1,
                name: pharmacyData.name,
                phone: "02-25555555",
              },
              {
                medicines: request.medicines.map((m) => m.name),
                requestId: request.id,
                reason: "غير متوفر في المخزون",
              }
            );
          }
        } catch (error) {
          console.error("خطأ في إرسال الإشعار:", error);
        }
      }
    } catch (error) {
      console.error("خطأ في الرد على الطلب:", error);
      showNotification("خطأ في الرد على الطلب", "error");
    }
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

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    {
      id: "dashboard",
      icon: FaTachometerAlt,
      label: "لوحة التحكم",
    },
    {
      id: "prescriptions",
      icon: FaPrescription,
      label: "الروشتات",
    },
    {
      id: "medicine-requests",
      icon: FaBell,
      label: "طلبات الأدوية",
      badge: medicineRequests.filter((r) => r.status === "pending").length,
    },
    { id: "inventory", icon: FaBoxes, label: "المخزون" },
    {
      id: "exchange",
      icon: FaExchangeAlt,
      label: "تبادل الأدوية",
    },
    {
      id: "order-medicines",
      icon: FaPlus,
      label: "طلب أدوية",
    },
    {
      id: "chat",
      icon: FaComments,
      label: "المحادثات",
    },
    { id: "analytics", icon: FaChartBar, label: "التقارير" },
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div ref={contentRef} className="min-h-screen bg-gray-50">
      <DashboardLayout
        sidebarItems={navItems}
        profileData={pharmacyData}
        title="لوحة تحكم الصيدلية"
        onSectionChange={setActiveSection}
        activeSection={activeSection} // Pass the activeSection value
        // Notification props
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onToggleNotifications={handleToggleNotifications}
        showNotifications={showNotifications}
        onGenerateSampleNotifications={generateSampleNotifications}
        // Color customization for Pharmacy Dashboard
        navbarColor="bg-green-900"
        sidebarColor="bg-green-800"
        textColor="text-white"
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === "dashboard" && "لوحة التحكم"}
                  {activeSection === "prescriptions" && "إدارة الروشتات"}
                  {activeSection === "medicine-requests" &&
                    "طلبات الأدوية من المرضى"}
                  {activeSection === "inventory" && "إدارة المخزون"}
                  {activeSection === "exchange" && "تبادل الأدوية"}
                  {activeSection === "order-medicines" &&
                    "طلب أدوية من الشركات"}
                  {activeSection === "chat" && "المحادثات"}
                  {activeSection === "analytics" && "التقارير والإحصائيات"}
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
              {/* Removed the "طلب أدوية" button from here */}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet /> {/* This will render nested routes */}
          {activeSection === "dashboard" && (
            <PharmacyDashboardSection
              prescriptions={prescriptions}
              medicineRequests={medicineRequests}
              inventory={inventory}
              exchangeRequests={exchangeRequests}
              pharmacyData={pharmacyData}
              getStatusColor={getStatusColor}
              getStockColor={getStockColor}
              setActiveSection={setActiveSection}
            />
          )}
          {activeSection === "prescriptions" && (
            <PharmacyPrescriptionsSection
              prescriptions={prescriptions}
              filteredPrescriptions={filteredPrescriptions}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              getStatusColor={getStatusColor}
              handlePrescriptionAction={handlePrescriptionAction}
              handlePointsModal={handlePointsModal}
            />
          )}
          {activeSection === "inventory" && (
            <PharmacyInventorySection
              inventory={inventory}
              setShowInventoryModal={setShowInventoryModal}
              handleInventoryUpdate={handleInventoryUpdate}
              setShowOrderModal={setShowOrderModal}
              getStockColor={getStockColor}
            />
          )}
          {activeSection === "exchange" && (
            <PharmacyExchangeSection
              exchangeRequests={exchangeRequests}
              setShowExchangeModal={setShowExchangeModal}
              handleExchangeRequest={handleExchangeRequest}
            />
          )}
          {activeSection === "medicine-requests" && (
            <PharmacyMedicineRequestsSection
              medicineRequests={medicineRequests}
              isLoadingRequests={isLoadingRequests}
              handleMedicineRequest={handleMedicineRequest}
            />
          )}
          {activeSection === "order-medicines" && (
            <PharmacyOrderMedicinesPage />
          )}
          {/* Chat Section */}
          {activeSection === "chat" && (
            <div className="h-[calc(100vh-12rem)]">
              <ChatPage
                userType={USER_TYPES.PHARMACY}
                userId={pharmacyData.id}
              />
            </div>
          )}
          {activeSection === "analytics" && (
            <div className="space-y-6">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        مبيعات اليوم
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        12,450 ج.م
                      </p>
                      <p className="text-sm text-green-600 mt-1">+15% من أمس</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaChartBar className="text-green-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        عدد العملاء
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        89
                      </p>
                      <p className="text-sm text-blue-600 mt-1">+8% من أمس</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        متوسط الطلب
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        140 ج.م
                      </p>
                      <p className="text-sm text-purple-600 mt-1">+5% من أمس</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaCalculator className="text-purple-600 text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  تقرير المبيعات الشهرية
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaChartBar className="text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      سيتم إضافة الرسوم البيانية قريباً
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Modals */}
        <OrderMedicineModal
          showOrderModal={showOrderModal}
          setShowOrderModal={setShowOrderModal}
          handleOrderSubmit={handleOrderSubmit}
        />

        <UsePointsModal
          showPointsModal={showPointsModal}
          setShowPointsModal={setShowPointsModal}
          selectedPrescription={selectedPrescription}
          pointsToUse={pointsToUse}
          setPointsToUse={setPointsToUse}
          applyPoints={applyPoints}
        />

        <NewExchangeRequestModal
          showExchangeModal={showExchangeModal}
          setShowExchangeModal={setShowExchangeModal}
          setExchangeRequests={setExchangeRequests}
          showNotification={showNotification}
        />

        <AddInventoryItemModal
          showInventoryModal={showInventoryModal}
          setShowInventoryModal={setShowInventoryModal}
          setInventory={setInventory}
          showNotification={showNotification}
        />
      </DashboardLayout>
    </div>
  );
};

export default PharmacyDashboardPage;
