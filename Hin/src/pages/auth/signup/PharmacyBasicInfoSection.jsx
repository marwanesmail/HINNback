import React from "react";

const PharmacyBasicInfoSection = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            اسم الصيدلية
          </label>
          <input
            type="text"
            name="pharmacyName"
            value={formData.pharmacyName || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
            placeholder="اسم الصيدلية التجاري"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            تليفون الصيدلية
          </label>
          <input
            type="tel"
            name="pharmacyPhone"
            value={formData.pharmacyPhone || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
            placeholder="رقم هاتف الصيدلية"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-200">
          مواعيد عمل الصيدلية
        </label>
        <input
          type="text"
          name="openingHours"
          value={formData.openingHours || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
          placeholder="مثال: من 9 صباحاً إلى 11 مساءً"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-200">
          منطقة التوصيل
        </label>
        <textarea
          name="deliveryArea"
          rows="3"
          value={formData.deliveryArea || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
          placeholder="المناطق التي تغطيها خدمة التوصيل"
        ></textarea>
      </div>
    </div>
  );
};

export default PharmacyBasicInfoSection;
