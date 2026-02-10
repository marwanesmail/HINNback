import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ShoppingCart from "./components/Cart/ShoppingCart";

// استيراد نظام الألوان الطبي
import "./styles/medical-theme.css";

// صفحات خفيفة (import عادي)
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import SearchResultsPage from "./pages/SearchResultsPage";

// مكونات التخطيط
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// صفحات ثقيلة (Lazy Loading)
const DoctorDashboardPage = lazy(() =>
  import("./pages/doctor/DoctorDashboardPage")
);
const PatientProfilePage = lazy(() =>
  import("./pages/patient/PatientProfilePage")
);
const PharmacyDashboardPage = lazy(() =>
  import("./pages/pharmacy/PharmacyDashboardPage")
);
const CompanyDashboardPage = lazy(() =>
  import("./pages/company/CompanyDashboardPage")
);
const PrescriptionUploadPage = lazy(() =>
  import("./pages/patient/components/PrescriptionUploadPage")
);
const DoctorsSearchPage = lazy(() =>
  import("./pages/doctor/components/DoctorsSearchPage")
);
const BookAppointmentPage = lazy(() =>
  import("./pages/patient/components/BookAppointmentPage")
);
const PatientAppointmentsPage = lazy(() =>
  import("./pages/patient/components/PatientAppointmentsPage")
);
const DoctorAppointmentsPage = lazy(() =>
  import("./pages/doctor/components/DoctorAppointmentsPage")
);
const LocationTestPage = lazy(() => import("./components/LocationTestPage"));

// Profile Pages (Lazy)
const DoctorProfilePage = lazy(() =>
  import("./pages/doctor/DoctorProfilePage")
);
const PharmacyProfilePage = lazy(() =>
  import("./pages/pharmacy/PharmacyProfilePage")
);
const CompanyProfilePage = lazy(() =>
  import("./pages/company/CompanyProfilePage")
);

// مكون للتحكم في عرض الـ Layout
function Layout({ children }) {
  const location = useLocation();

  const pagesWithoutLayout = [
    "/login",
    "/signup",
    "/doctor-dashboard",
    "/patient-profile",
    "/pharmacy-dashboard",
    "/company-dashboard",
    "/prescription-upload",
    "/doctor/profile",
    "/pharmacy/profile",
    "/company/profile",
    "/patient/profile-page",
  ];

  const shouldShowLayout = !pagesWithoutLayout.includes(location.pathname);

  return (
    <>
      {shouldShowLayout && <Navbar />}
      {children}
      {shouldShowLayout && <Footer />}
    </>
  );
}

// شاشة التحميل الرايقة ✨
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        {/* spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-gray-700">جاري التحميل...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router basename="/">
          <Layout>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                {/* Light pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route index element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route path="/search" element={<SearchResultsPage />} />

                {/* Heavy pages (Lazy) */}
                <Route
                  path="/doctor-dashboard"
                  element={<DoctorDashboardPage />}
                />
                <Route
                  path="/patient-profile"
                  element={<PatientProfilePage />}
                />
                <Route
                  path="/pharmacy-dashboard"
                  element={<PharmacyDashboardPage />}
                />
                <Route
                  path="/company-dashboard"
                  element={<CompanyDashboardPage />}
                />
                {/* Profile Pages */}
                <Route path="/doctor/profile" element={<DoctorProfilePage />} />
                <Route
                  path="/pharmacy/profile"
                  element={<PharmacyProfilePage />}
                />
                <Route
                  path="/company/profile"
                  element={<CompanyProfilePage />}
                />
                <Route
                  path="/patient/profile-page"
                  element={<PatientProfilePage profileMode={true} />}
                />
                <Route
                  path="/prescription-upload"
                  element={<PrescriptionUploadPage />}
                />
                <Route path="/doctors" element={<DoctorsSearchPage />} />
                <Route
                  path="/book-appointment/:id"
                  element={<BookAppointmentPage />}
                />
                <Route
                  path="/my-appointments"
                  element={<PatientAppointmentsPage />}
                />
                <Route
                  path="/doctor-appointments"
                  element={<DoctorAppointmentsPage />}
                />
                <Route path="/location-test" element={<LocationTestPage />} />

                {/* Fallback route for 404 */}
                <Route
                  path="*"
                  element={
                    <div className="p-10 text-center">
                      <h1 className="text-3xl font-bold">404</h1>
                      <p className="text-gray-600">الصفحة غير موجودة</p>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </Layout>
          <ShoppingCart />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
