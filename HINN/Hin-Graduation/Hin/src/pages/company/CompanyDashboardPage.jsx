import React, { useState, useMemo, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  FaIndustry,
  FaTachometerAlt,
  FaPills,
  FaShoppingCart,
  FaChartLine,
  FaBullhorn,
  FaPlus,
  FaCapsules,
  FaTablets,
  FaPrescriptionBottle,
  FaPumpMedical,
  FaBuilding,
  FaComments,
} from "react-icons/fa";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  searchInElement,
  removeHighlights,
  highlightSearchTerms,
} from "../../utils/dashboardSearch";

// Import chat components
import ChatPage from "../ChatPage";
import { USER_TYPES } from "../../services/chatService";

// Import the new components
import CompanyDashboardSection from "./components/CompanyDashboardSection";
import CompanyProductsSection from "./components/CompanyProductsSection";
import CompanyOrdersSection from "./components/CompanyOrdersSection";
import CompanyReportsSection from "./components/CompanyReportsSection";
import CompanyPromotionsSection from "./components/CompanyPromotionsSection";
import CompanyPharmaciesSection from "./components/CompanyPharmaciesSection";
import AddProductModal from "./components/AddProductModal";
import EditProductModal from "./components/EditProductModal";
import ProductDetailsModal from "./components/ProductDetailsModal";

const CompanyDashboardPage = () => {
  const contentRef = useRef(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Mock data for products
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "باراسيتامول 500mg",
      price: 50,
      stock: 1000,
      category: "مسكنات",
      productionDate: "2024-01-15",
      expiryDate: "2026-01-15",
      description: "مسكن للألم وخافض للحرارة",
      status: "متوفر",
      image: FaPills,
    },
    {
      id: 2,
      name: "أموكسيسيلين 250mg",
      price: 75,
      stock: 800,
      category: "مضادات حيوية",
      productionDate: "2024-01-10",
      expiryDate: "2025-12-31",
      description: "مضاد حيوي واسع المجال",
      status: "متوفر",
      image: FaCapsules,
    },
    {
      id: 3,
      name: "فيتامين د 1000 وحدة",
      price: 120,
      stock: 0,
      category: "فيتامينات",
      productionDate: "2024-02-01",
      expiryDate: "2026-02-01",
      description: "مكمل غذائي لتقوية العظام",
      status: "غير متوفر",
      image: FaTablets,
    },
    {
      id: 4,
      name: "شراب كحة للأطفال",
      price: 35,
      stock: 15,
      category: "أدوية الأطفال",
      productionDate: "2024-01-20",
      expiryDate: "2025-06-20",
      description: "شراب طبيعي لعلاج الكحة عند الأطفال",
      status: "مخزون منخفض",
      image: FaPrescriptionBottle,
    },
    {
      id: 5,
      name: "كريم مضاد للالتهابات",
      price: 85,
      stock: 200,
      category: "كريمات ومراهم",
      productionDate: "2024-01-25",
      expiryDate: "2025-08-25",
      description: "كريم موضعي لعلاج الالتهابات الجلدية",
      status: "متوفر",
      image: FaPumpMedical,
    },
  ]);

  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      pharmacy: "صيدلية الشفاء",
      products: ["باراسيتامول 500mg", "أموكسيسيلين 250mg"],
      total: 2500,
      status: "جديد",
      date: "2024-01-15",
      phone: "01234567890",
    },
    {
      id: 2,
      pharmacy: "صيدلية الرحمة",
      products: ["فيتامين د", "شراب كحة"],
      total: 1800,
      status: "قيد المعالجة",
      date: "2024-01-14",
      phone: "01987654321",
    },
    {
      id: 3,
      pharmacy: "صيدلية النور",
      products: ["كريم مضاد للالتهابات"],
      total: 850,
      status: "مكتمل",
      date: "2024-01-13",
      phone: "01122334455",
    },
  ]);

  // Mock data for pharmacies
  const [pharmacies, setPharmacies] = useState([
    {
      id: 1,
      name: "صيدلية الشفاء",
      location: "القاهرة، شارع التسعين",
      phone: "01234567890",
      email: "shifa@example.com",
      manager: "أحمد محمد",
      status: "active",
      licenseNumber: "PH-2024-001",
      joinDate: "2024-01-15",
      features: ["delivery", "online", "insurance"],
    },
    {
      id: 2,
      name: "صيدلية الرحمة",
      location: "الإسكندرية، شارع سعد زغلول",
      phone: "01987654321",
      email: "rahma@example.com",
      manager: "سارة عبدالله",
      status: "active",
      licenseNumber: "PH-2024-002",
      joinDate: "2024-01-10",
      features: ["consultation", "emergency"],
    },
    {
      id: 3,
      name: "صيدلية النور",
      location: "الجيزة، شارع الهرم",
      phone: "01122334455",
      email: "noor@example.com",
      manager: "محمد حسن",
      status: "pending",
      licenseNumber: "PH-2024-003",
      joinDate: "2024-01-20",
      features: ["homeCare"],
    },
  ]);

  // Company data
  const companyData = useMemo(
    () => ({
      id: "company_001",
      name: "شركة فارما للصناعات الدوائية",
      branch: "الفرع الرئيسي",
      totalProducts: products.length,
      totalOrders: 25,
      dailySales: 15000,
      activePharmacies: 150,
      type: "company",
      activity: "توزيع"
    }),
    [products.length]
  );

  // Categories
  const categories = [
    "مسكنات",
    "مضادات حيوية",
    "فيتامينات",
    "أدوية الأطفال",
    "كريمات ومراهم",
  ];

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      title: "طلب جديد",
      message: "لديك طلب جديد من صيدلية الشفاء",
      time: "منذ 5 دقائق",
      isRead: false,
      type: "order",
    },
    {
      id: 2,
      title: "مورد جديد",
      message: "تم إضافة مورد جديد لنوع المنتجات",
      time: "منذ ساعة",
      isRead: false,
      type: "supplier",
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

  // Notification handlers
  const handleNotificationClick = (notification) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );

    // Update unread count
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Handle notification action based on type
    if (notification.type === "order") {
      setActiveSection("orders");
    } else if (notification.type === "report") {
      setActiveSection("reports");
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
      case "متوفر":
        return "bg-green-100 text-green-800";
      case "غير متوفر":
        return "bg-red-100 text-red-800";
      case "مخزون منخفض":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-800";
      case "قيد المعالجة":
        return "bg-yellow-100 text-yellow-800";
      case "مكتمل":
        return "bg-green-100 text-green-800";
      case "ملغي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Product management functions
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    productionDate: "",
    expiryDate: "",
    description: "",
  });

  const handleNewProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // TODO: ربط مع API هنا - POST /api/company/products
  // نوع البيانات المطلوبة: { name, price, stock, category, productionDate, expiryDate, description }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { id, name, price, stock, category, productionDate, expiryDate, description, status }
  const addProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category
    ) {
      showNotificationMessage("الرجاء تعبئة جميع الحقول المطلوبة", "error");
      return;
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) > 0 ? "متوفر" : "غير متوفر",
      image: FaPills,
    };

    setProducts((prev) => [...prev, product]);
    showNotificationMessage("تم إضافة المنتج بنجاح");
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      category: "",
      productionDate: "",
      expiryDate: "",
      description: "",
    });
    setShowAddProductModal(false);
  };

  const editProduct = (product) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      productionDate: product.productionDate,
      expiryDate: product.expiryDate,
      description: product.description,
    });
  };

  // TODO: ربط مع API هنا - PUT /api/company/products/{id}
  // نوع البيانات المطلوبة: path param { id }, body { name, price, stock, category, productionDate, expiryDate, description }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { id, name, price, stock, category, productionDate, expiryDate, description, status }
  const updateProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category
    ) {
      showNotificationMessage("الرجاء تعبئة جميع الحقول المطلوبة", "error");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) > 0 ? "متوفر" : "غير متوفر",
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
    );
    showNotificationMessage("تم تحديث المنتج بنجاح");
    setShowEditProductModal(false);
    setSelectedProduct(null);
  };

  // TODO: ربط مع API هنا - DELETE /api/company/products/{id}
  // نوع البيانات المطلوبة: path param { id }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { success: true }
  const deleteProduct = (id) => {
    Swal.fire({
      title: "هل أنت متأكد من حذف هذا المنتج؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotificationMessage("تم حذف المنتج بنجاح");
      }
    });
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetailsModal(true);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get products by status
  const availableProducts = products.filter((p) => p.status === "متوفر");
  const unavailableProducts = products.filter((p) => p.status === "غير متوفر");
  const lowStockProducts = products.filter((p) => p.status === "مخزون منخفض");

  // Order management
  // TODO: ربط مع API هنا - PUT /api/company/orders/{orderId}/status
  // نوع البيانات المطلوبة: path param { orderId }, body { status }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { success: true, order: { id, status } }
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    showNotificationMessage(`تم تحديث حالة الطلب إلى: ${newStatus}`);
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: FaTachometerAlt,
      label: "لوحة التحكم",
    },
    { id: "products", icon: FaPills, label: "المنتجات" },
    { id: "orders", icon: FaShoppingCart, label: "الطلبات" },
    { id: "pharmacies", icon: FaBuilding, label: "الصيدليات" },
    { id: "chat", icon: FaComments, label: "المحادثات" }, // Add chat menu item
    { id: "reports", icon: FaChartLine, label: "التقارير" },
    {
      id: "promotions",
      icon: FaBullhorn,
      label: "الحملات الترويجية",
    },
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div ref={contentRef} className="min-h-screen bg-gray-50">
      <DashboardLayout
        sidebarItems={menuItems}
        profileData={companyData}
        title="لوحة تحكم الشركة"
        onSectionChange={handleSectionChange}
        activeSection={activeSection} // Pass the activeSection value
        // Notification props
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onToggleNotifications={handleToggleNotifications}
        showNotifications={showNotifications}
        onGenerateSampleNotifications={generateSampleNotifications}
        // Color customization for Company Dashboard
        navbarColor="bg-gray-900"
        sidebarColor="bg-gray-800"
        textColor="text-white"
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === "dashboard" && "لوحة التحكم"}
                  {activeSection === "products" && "إدارة المنتجات"}
                  {activeSection === "orders" && "إدارة الطلبات"}
                  {activeSection === "pharmacies" && "إدارة الصيدليات"}
                  {activeSection === "chat" && "المحادثات"}
                  {activeSection === "reports" && "التقارير والإحصائيات"}
                  {activeSection === "promotions" && "الحملات الترويجية"}
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
              <div className="flex items-center space-x-4 space-x-reverse">
                {activeSection === "products" && (
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <FaPlus className="ml-2" />
                    إضافة منتج
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6" ref={contentRef}>
          {activeSection === "dashboard" && (
            <CompanyDashboardSection
              orders={orders}
              companyData={companyData}
              getOrderStatusColor={getOrderStatusColor}
              updateOrderStatus={updateOrderStatus}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === "products" && (
            <CompanyProductsSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
              filteredProducts={filteredProducts}
              products={products}
              availableProducts={availableProducts}
              lowStockProducts={lowStockProducts}
              unavailableProducts={unavailableProducts}
              getStatusColor={getStatusColor}
              viewProductDetails={viewProductDetails}
              editProduct={editProduct}
              deleteProduct={deleteProduct}
            />
          )}

          {activeSection === "orders" && (
            <CompanyOrdersSection
              orders={orders}
              getOrderStatusColor={getOrderStatusColor}
              updateOrderStatus={updateOrderStatus}
            />
          )}

          {activeSection === "pharmacies" && (
            <CompanyPharmaciesSection
              pharmacies={pharmacies}
              setPharmacies={setPharmacies}
              showNotificationMessage={showNotificationMessage}
            />
          )}

          {activeSection === "reports" && <CompanyReportsSection />}

          {activeSection === "promotions" && <CompanyPromotionsSection />}

          {/* Chat Section */}
          {activeSection === "chat" && (
            <div className="h-[calc(100vh-12rem)]">
              <ChatPage userType={USER_TYPES.COMPANY} userId={companyData.id} />
            </div>
          )}
        </main>

        {/* Modals */}
        <AddProductModal
          showAddProductModal={showAddProductModal}
          setShowAddProductModal={setShowAddProductModal}
          newProduct={newProduct}
          handleNewProductChange={handleNewProductChange}
          addProduct={addProduct}
          categories={categories}
        />

        <EditProductModal
          showEditProductModal={showEditProductModal}
          setShowEditProductModal={setShowEditProductModal}
          newProduct={newProduct}
          handleNewProductChange={handleNewProductChange}
          updateProduct={updateProduct}
          categories={categories}
        />

        <ProductDetailsModal
          showProductDetailsModal={showProductDetailsModal}
          setShowProductDetailsModal={setShowProductDetailsModal}
          selectedProduct={selectedProduct}
          getStatusColor={getStatusColor}
          editProduct={editProduct}
        />
      </DashboardLayout>
    </div>
  );
};

export default CompanyDashboardPage;
