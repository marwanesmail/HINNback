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

const DashboardOverview = ({ onNavigateToUsers }) => {
  // Sample data - in real app this would come from API
  const stats = [
    {
      id: 1,
      title: "عدد الأطباء",
      value: 42,
      icon: <FaUserMd className="text-blue-500" />,
      color: "bg-blue-100",
      change: "+12%",
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      textColor: "text-blue-700",
      valueColor: "text-blue-900",
    },
    {
      id: 2,
      title: "عدد الصيدليات",
      value: 28,
      icon: <FaPills className="text-green-500" />,
      color: "bg-green-100",
      change: "+8%",
      gradient: "from-green-50 to-green-100",
      border: "border-green-200",
      textColor: "text-green-700",
      valueColor: "text-green-900",
    },
    {
      id: 3,
      title: "عدد الشركات",
      value: 15,
      icon: <FaBuilding className="text-purple-500" />,
      color: "bg-purple-100",
      change: "+5%",
      gradient: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      textColor: "text-purple-700",
      valueColor: "text-purple-900",
    },
    {
      id: 4,
      title: "الحسابات الموثقة",
      value: 78,
      icon: <FaUserCheck className="text-teal-500" />,
      color: "bg-teal-100",
      change: "+15%",
      gradient: "from-teal-50 to-teal-100",
      border: "border-teal-200",
      textColor: "text-teal-700",
      valueColor: "text-teal-900",
    },
    {
      id: 5,
      title: "الحسابات غير الموثقة",
      value: 12,
      icon: <FaUserTimes className="text-yellow-500" />,
      color: "bg-yellow-100",
      change: "-3%",
      gradient: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      textColor: "text-yellow-700",
      valueColor: "text-yellow-900",
    },
    {
      id: 6,
      title: "إجمالي المستخدمين",
      value: 90,
      icon: <FaUser className="text-red-500" />,
      color: "bg-red-100",
      change: "+10%",
      gradient: "from-red-50 to-red-100",
      border: "border-red-200",
      textColor: "text-red-700",
      valueColor: "text-red-900",
    },
  ];

  // Variants for the staggered animation
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-xl shadow-sm p-6 border ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.valueColor} mt-2`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <FaChartLine
                className={`text-sm ml-1 ${
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              />
              <p className={`text-sm font-medium ${stat.textColor}`}>
                {stat.change} من الشهر الماضي
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

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
