import React from "react";
import {
  FaBell,
  FaTimes,
  FaInbox,
  FaClock,
  FaEye,
  FaList,
  FaPlus,
  FaUserMd,
  FaPills,
  FaComments,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarAlt,
  FaNotesMedical,
  FaFlask,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

const NotificationIcon = ({ type, className }) => {
  const iconProps = { className };
  switch (type) {
    case "doctor_message":
      return <FaUserMd {...iconProps} />;
    case "pharmacy_message":
      return <FaPills {...iconProps} />;
    case "chat_message":
      return <FaComments {...iconProps} />;
    case "medicine_available":
      return <FaPills {...iconProps} />;
    case "medicine_unavailable":
      return <FaExclamationTriangle {...iconProps} />;
    case "appointment_confirmed":
      return <FaCalendarCheck {...iconProps} />;
    case "appointment_rejected":
      return <FaCalendarTimes {...iconProps} />;
    case "appointment_reminder":
      return <FaClock {...iconProps} />;
    case "appointment_rescheduled":
      return <FaCalendarAlt {...iconProps} />;
    case "doctor_note":
      return <FaNotesMedical {...iconProps} />;
    case "test_results":
      return <FaFlask {...iconProps} />;
    case "delivery_status":
      return <FaTruck {...iconProps} />;
    case "order_confirmation":
      return <FaCheckCircle {...iconProps} />;
    default:
      return <FaBell {...iconProps} />;
  }
};

const NotificationsDropdown = ({
  notifications,
  unreadCount,
  isLoadingNotifications,
  handleNotificationClick,
  generateSampleNotifications,
  setShowNotifications,
  setActiveSection,
}) => {
  return (
    <React.Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={() => setShowNotifications(false)}
      ></div>

      <div className="notifications-dropdown fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-5rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200 sm:top-16 sm:right-4 sm:w-96 xs:top-14 xs:left-4 xs:right-4 xs:w-auto">
        {/* Custom CSS for better positioning */}
        <style>{`
          .notifications-dropdown {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          @media (max-width: 640px) {
            .notifications-dropdown {
              position: fixed !important;
              top: 4rem !important;
              left: 1rem !important;
              right: 1rem !important;
              width: auto !important;
              max-width: none !important;
            }
          }
          @media (max-width: 480px) {
            .notifications-dropdown {
              top: 3.5rem !important;
              left: 0.5rem !important;
              right: 0.5rem !important;
            }
          }
        `}</style>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-5 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white bg-opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
                            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaBell className="text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold">الإشعارات</h3>
                <p className="text-blue-100 text-sm">آخر التحديثات</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              {unreadCount > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  {unreadCount} جديد
                </div>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200 hover:rotate-90"
                title="إغلاق"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
          {isLoadingNotifications ? (
            <div className="p-8 text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBell className="text-blue-600 text-sm" />
                </div>
              </div>
              <p className="text-gray-600 mt-4 font-medium">
                جاري تحميل الإشعارات...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInbox className="text-3xl text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">
                لا توجد إشعارات
              </h4>
              <p className="text-gray-500">
                ستظهر هنا الإشعارات عند ورود تحديثات جديدة
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    handleNotificationClick(notification);
                    setShowNotifications(false);
                  }}
                  className={`notification-item p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    !notification.isRead
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-r-blue-500 shadow-sm"
                      : "hover:shadow-sm"
                  } ${index === 0 ? "rounded-t-lg" : ""}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="relative">
                      <div
                        className={`p-3 rounded-xl shadow-sm ${
                          !notification.isRead
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <NotificationIcon type={notification.type} />
                      </div>
                      {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className={`text-base font-semibold leading-tight ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 mr-2">
                            جديد
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                          <FaClock />
                          <span>
                            {new Date(notification.timestamp).toLocaleString(
                              "ar-EG"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors">
                            <FaEye className="ml-1" />
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-5 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  // Navigate to notifications section if available
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-2 space-x-reverse bg-white hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaList />
                <span>عرض جميع الإشعارات</span>
              </button>
              <button
                onClick={generateSampleNotifications}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-2 space-x-reverse bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaPlus />
                <span>إضافة تجريبية</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default NotificationsDropdown;
