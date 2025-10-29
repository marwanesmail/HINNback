import React from "react";
import { FaChartLine } from "react-icons/fa";

const CompanyReportsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
      <FaChartLine className="text-6xl text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        التقارير والإحصائيات
      </h3>
      <p className="text-gray-500">هذا القسم قيد التطوير</p>
    </div>
  );
};

export default CompanyReportsSection;
