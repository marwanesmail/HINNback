import React from "react";

const DoctorInfoSection = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            التخصص
          </label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
            placeholder="مثال: طب باطني، جراحة عامة"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            عدد سنين الخبرة <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience || ""}
            onChange={handleInputChange}
            min="0"
            max="60"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
            placeholder="أدخل عدد سنوات الخبرة"
          />
        </div>
      </div>

      {/* Biography Section */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-200">
          السيرة الذاتية
        </label>
        <textarea
          name="biography"
          value={formData.biography || ""}
          onChange={handleInputChange}
          rows="4"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400 resize-none"
          placeholder="اكتب نبذة مختصرة عن خبراتك ومؤهلاتك الطبية..."
        />
      </div>
    </div>
  );
};

export default DoctorInfoSection;
