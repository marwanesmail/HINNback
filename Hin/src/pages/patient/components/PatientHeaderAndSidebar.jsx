import React from "react";
import {
  FaBars,
  FaUserCircle,
  FaBell,
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaFileMedical,
  FaHistory,
  FaPrescription,
  FaPills,
  FaCalendarCheck,
  FaComments,
  FaCog,
} from "react-icons/fa";
import NotificationsDropdown from "./NotificationsDropdown";

const PatientHeaderAndSidebar = ({
  patientData,
  sidebarOpen,
  toggleSidebar,
  showNotifications,
  setShowNotifications,
  notifications,
  unreadCount,
  isLoadingNotifications,
  handleNotificationClick,
  generateSampleNotifications,
  setActiveSection,
  activeSection,
}) => {
  const navItems = [
    {
      id: "dashboard",
      icon: <FaTachometerAlt />,
      label: "لوحة التحكم",
    },
    {
      id: "medical-file",
      icon: <FaFileMedical />,
      label: "الملف الطبي",
    },
    {
      id: "medical-history",
      icon: <FaHistory />,
      label: "السجل الطبي",
    },
    {
      id: "current-prescriptions",
      icon: <FaPrescription />,
      label: "الروشتات الحالية",
    },
    {
      id: "dispensed-medications",
      icon: <FaPills />,
      label: "الأدوية المصروفة",
    },
    {
      id: "appointments",
      icon: <FaCalendarCheck />,
      label: "مواعيدي",
    },
    {
      id: "chats",
      icon: <FaComments />,
      label: "المحادثات",
    },
    { id: "settings", icon: <FaCog />, label: "الإعدادات" },
  ];

  return (
    <>
      {/* Custom CSS for notifications */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: slideInFromTop 0.3s ease-out;
        }

        .notification-item {
          animation: slideInFromTop 0.4s ease-out;
        }
      `}</style>

      {/* Enhanced Top Navigation with Notifications */}
      <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <FaBars className="text-xl" />
              </button>
              <div className="flex items-center space-x-2 space-x-reverse mr-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FaUserCircle className="text-white text-sm" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  صفحتي الشخصية
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Notifications Bell - Now in Topbar */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative transition-all duration-200 ${
                    unreadCount > 0 ? "animate-pulse bg-red-50" : ""
                  }`}
                  title="الإشعارات"
                >
                  <FaBell
                    className={`text-xl ${
                      unreadCount > 0 ? "text-red-500" : "text-gray-600"
                    }`}
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce shadow-lg">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <NotificationsDropdown
                    notifications={notifications}
                    unreadCount={unreadCount}
                    isLoadingNotifications={isLoadingNotifications}
                    handleNotificationClick={handleNotificationClick}
                    generateSampleNotifications={generateSampleNotifications}
                    setShowNotifications={setShowNotifications}
                    setActiveSection={setActiveSection}
                  />
                )}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 space-x-reverse"
                  title="رجوع إلى الصفحة الرئيسية"
                >
                  <FaHome className="text-sm" />
                  <span className="hidden sm:inline">الصفحة الرئيسية</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-16 bottom-0 right-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:block`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FaUser className="text-blue-600 text-lg" />
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg">{patientData.fullName}</h3>
                <p className="text-blue-100 text-sm">صفحتي</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-right rounded-lg transition-colors duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="font-medium ml-3">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-4 py-3 text-right rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200">
              <FaSignOutAlt className="ml-3 w-5 text-center" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default PatientHeaderAndSidebar;
