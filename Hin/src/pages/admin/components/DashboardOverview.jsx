import React from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaPills,
  FaBuilding,
  FaUser,
  FaUserCheck,
  FaUserTimes,
  FaChartLine,
} from "react-icons/fa";
import StatsGrid from "../../../components/Layout/StatsGrid"; // Import the new StatsGrid component

const DashboardOverview = ({ onNavigateToUsers }) => {
  // Sample data - in real app this would come from API
  const statsData = [
    {
      id: 1,
      title: "عدد الأطباء",
      value: 42,
      icon: <FaUserMd className="text-blue-500 text-xl" />,
      iconBg: "bg-blue-100",
      borderLeft: "border-blue-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: 12,
      trendIcon: FaChartLine,
      trendText: "من الشهر الماضي",
    },
    {
      id: 2,
      title: "عدد الصيدليات",
      value: 28,
      icon: <FaPills className="text-green-500 text-xl" />,
      iconBg: "bg-green-100",
      borderLeft: "border-green-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: 8,
      trendIcon: FaChartLine,
      trendText: "من الشهر الماضي",
    },
    {
      id: 3,
      title: "عدد الشركات",
      value: 15,
      icon: <FaBuilding className="text-purple-500 text-xl" />,
      iconBg: "bg-purple-100",
      borderLeft: "border-purple-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: 5,
      trendIcon: FaChartLine,
      trendText: "من الشهر الماضي",
    },
    {
      id: 4,
      title: "الحسابات الموثقة",
      value: 78,
      icon: <FaUserCheck className="text-teal-500 text-xl" />,
      iconBg: "bg-teal-100",
      borderLeft: "border-teal-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: 15,
      trendIcon: FaChartLine,
      trendText: "من الشهر الماضي",
    },
    {
      id: 5,
      title: "الحسابات غير الموثقة",
      value: 12,
      icon: <FaUserTimes className="text-yellow-500 text-xl" />,
      iconBg: "bg-yellow-100",
      borderLeft: "border-yellow-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: -3,
      trendIcon: FaChartLine,
      trendText: "من الشهر الماضي",
    },
    {
      id: 6,
      title: "إجمالي المستخدمين",
      value: 90,
      icon: <FaUser className="text-red-500 text-xl" />,
      iconBg: "bg-red-100",
      borderLeft: "border-red-500",
      textColor: "text-gray-600",
      valueColor: "text-gray-900",
      trend: 10,
      trendIcon: FaChartLine,
      trendText: "من الشهر الماضي",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards - Using the new reusable component */}
      <StatsGrid stats={statsData} columns={3} />

      {/* Recent Registration Requests */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            أحدث طلبات التسجيل
          </h2>
          <button
            onClick={() => onNavigateToUsers && onNavigateToUsers("users")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            عرض الكل
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Sample registration requests - in real app this would come from API */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <FaUserMd className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">أحمد محمد</h3>
                  <p className="text-sm text-gray-500">طبيب - جراحة عامة</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mr-3">
                  قيد الانتظار
                </span>
                <button
                  onClick={() =>
                    onNavigateToUsers && onNavigateToUsers("users")
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  عرض
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <FaPills className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">سارة عبدالله</h3>
                  <p className="text-sm text-gray-500">صيدلية - الرحمة</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mr-3">
                  قيد الانتظار
                </span>
                <button
                  onClick={() =>
                    onNavigateToUsers && onNavigateToUsers("users")
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  عرض
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <FaBuilding className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">خالد علي</h3>
                  <p className="text-sm text-gray-500">
                    شركة أدوية - الأدوية المتقدمة
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mr-3">
                  قيد الانتظار
                </span>
                <button
                  onClick={() =>
                    onNavigateToUsers && onNavigateToUsers("users")
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  عرض
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <FaUserMd className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">فاطمة أحمد</h3>
                  <p className="text-sm text-gray-500">طبيب - طب الأطفال</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mr-3">
                  قيد الانتظار
                </span>
                <button
                  onClick={() =>
                    onNavigateToUsers && onNavigateToUsers("users")
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  عرض
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
