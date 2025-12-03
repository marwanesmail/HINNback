import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
} from "react-icons/fa";

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [activityLogs] = useState([
    {
      id: 1,
      user: "أحمد محمد",
      action: "تم التحقق من الحساب",
      type: "approve",
      timestamp: "2025-11-05 14:30",
      details: "تم التحقق من وثائق الطبيب واعتماد الحساب",
    },
    {
      id: 2,
      user: "سارة عبدالله",
      action: "تم رفض الحساب",
      type: "reject",
      timestamp: "2025-11-05 13:45",
      details: "تم رفض حساب الصيدلية لعدم اكتمال الوثائق",
    },
    {
      id: 3,
      user: "خالد علي",
      action: "تم التحقق من الحساب",
      type: "approve",
      timestamp: "2025-11-05 12:15",
      details: "تم التحقق من وثائق شركة الأدوية واعتماد الحساب",
    },
    {
      id: 4,
      user: "فاطمة أحمد",
      action: "طلب تسجيل جديد",
      type: "request",
      timestamp: "2025-11-05 11:20",
      details: "تم استلام طلب تسجيل حساب طبيب جديد",
    },
    {
      id: 5,
      user: "محمد حسن",
      action: "تم التحقق من الحساب",
      type: "approve",
      timestamp: "2025-11-05 10:05",
      details: "تم التحقق من وثائق الصيدلية واعتماد الحساب",
    },
    {
      id: 6,
      user: "نورا عبدالعزيز",
      action: "تم رفض الحساب",
      type: "reject",
      timestamp: "2025-11-05 09:30",
      details: "تم رفض حساب طبيب لعدم مطابقة الوثائق",
    },
  ]);

  const filteredLogs = activityLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionIcon = (type) => {
    switch (type) {
      case "approve":
        return (
          <div className="bg-green-100 p-2 rounded-full shadow-sm">
            <FaUserCheck className="text-green-600" />
          </div>
        );
      case "reject":
        return (
          <div className="bg-red-100 p-2 rounded-full shadow-sm">
            <FaUserTimes className="text-red-600" />
          </div>
        );
      default:
        return (
          <div className="bg-blue-100 p-2 rounded-full shadow-sm">
            <FaClipboardList className="text-blue-600" />
          </div>
        );
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case "approve":
        return "border-l-4 border-green-500 bg-green-50";
      case "reject":
        return "border-l-4 border-red-500 bg-red-50";
      default:
        return "border-l-4 border-blue-500 bg-blue-50";
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6"
      >
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="البحث في السجل..."
          />
        </div>
      </motion.div>

      {/* Activity Logs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 rounded-xl shadow-sm border ${getActionColor(
                log.type
              )} hover:shadow-md transition`}
            >
              <div className="flex items-start gap-4">
                {getActionIcon(log.type)}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {log.action}
                    </h3>
                    <span className="text-sm text-gray-500 mt-1 md:mt-0">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {log.details}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border text-gray-700 shadow-sm">
                      👤 {log.user}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">لا توجد نتائج مطابقة للبحث</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ActivityLogs;
