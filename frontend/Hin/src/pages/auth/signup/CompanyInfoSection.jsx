import React from "react";

const CompanyInfoSection = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            اسم الشركة
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
            placeholder="الاسم التجاري للشركة"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            نوع النشاط
          </label>
          <select
            name="companyActivityType"
            value={formData.companyActivityType || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100"
          >
            <option value="" className="text-black">
              اختر نوع النشاط
            </option>
            <option value="توزيع" className="text-black">
              توزيع
            </option>
            <option value="تصنيع" className="text-black">
              تصنيع
            </option>
            <option value="استيراد" className="text-black">
              استيراد
            </option>
            <option value="تسويق" className="text-black">
              تسويق
            </option>
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-200">
          عنوان الشركة
        </label>
        <textarea
          name="companyAddress"
          rows="3"
          value={formData.companyAddress || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
          placeholder="العنوان التفصيلي للشركة"
        ></textarea>
      </div>
    </div>
  );
};

export default CompanyInfoSection;
