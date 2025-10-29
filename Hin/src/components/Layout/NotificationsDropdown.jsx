import React from "react";
import {
  FaBell,
  FaTimes,
  FaInbox,
  FaClock,
  FaEye,
  FaList,
  FaPlus,
  FaCheckCircle,
} from "react-icons/fa";

const NotificationsDropdown = ({
  notifications,
  unreadCount,
  isLoadingNotifications,
  onNotificationClick,
  onGenerateSampleNotifications,
  onToggleNotifications,
}) => {
  return (
    <React.Fragment>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onToggleNotifications}
      ></div>

      <div className="notifications-dropdown fixed top-20 left-6 w-[420px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl z-50 overflow-hidden border border-white/20 flex flex-col">
        <style>{`
          .notifications-dropdown {
            box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
            animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .notification-item {
            animation: fadeIn 0.3s ease-out forwards;
            opacity: 0;
          }

          @media (max-width: 640px) {
            .notifications-dropdown {
              top: 4rem !important;
              left: 1rem !important;
              right: 1rem !important;
              width: auto !important;
            }
          }

          .glass-effect {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            backdrop-filter: blur(10px);
          }
        `}</style>

        {/* Minimalist Header */}
        <div className="relative p-6 pb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaBell className="text-white text-lg" />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">الإشعارات</h3>
                <p className="text-sm text-gray-500">لديك {notifications.length} إشعار</p>
              </div>
            </div>
            <button
              onClick={onToggleNotifications}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <style>{`
            .notifications-dropdown > div::-webkit-scrollbar {
              width: 5px;
            }
            .notifications-dropdown > div::-webkit-scrollbar-track {
              background: transparent;
            }
            .notifications-dropdown > div::-webkit-scrollbar-thumb {
              background: #e5e7eb;
              border-radius: 10px;
            }
            .notifications-dropdown > div::-webkit-scrollbar-thumb:hover {
              background: #d1d5db;
            }
          `}</style>

          {isLoadingNotifications ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-medium">جاري التحميل...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-4">
                <FaInbox className="text-4xl text-gray-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                لا توجد إشعارات
              </h4>
              <p className="text-sm text-gray-500">
                سنخبرك عند وصول شيء جديد
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 5).map((notification, index) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    onNotificationClick(notification);
                    onToggleNotifications();
                  }}
                  className={`notification-item group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    !notification.isRead
                      ? "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
                      : "bg-gray-50/50 hover:bg-gray-100/80"
                  }`}
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                  )}

                  <div className="flex items-start gap-3 pr-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                      !notification.isRead
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        : "bg-white text-gray-600"
                    }`}>
                      {notification.isRead ? <FaCheckCircle /> : <FaBell />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-gray-900 mb-1 leading-tight">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaClock className="text-[10px]" />
                        <span>{notification.time || new Date().toLocaleString("ar-EG")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-200 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clean Footer */}
        {notifications.length > 0 && (
          <div className="p-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onToggleNotifications();
                }}
                className="flex-1 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
              >
                <FaList />
                <span>عرض الكل</span>
              </button>
              <button
                onClick={onGenerateSampleNotifications}
                className="w-11 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 flex items-center justify-center"
                title="إضافة تجريبية"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default NotificationsDropdown;