import React from "react";
import {
  FaUser,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const BasicInfoSection = ({
  formData,
  handleInputChange,
  errors,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  return (
    <div className="space-y-6">
      {(errors.general || Object.keys(errors).length > 0) && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-2xl mb-4">
          {errors.general || "الرجاء تصحيح الأخطاء المشار إليها"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            الاسم الكامل
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.fullName ? "border-red-500" : "border-white/20"
              } rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400`}
              placeholder="أدخل اسمك الكامل"
            />
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            اسم المستخدم
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.username ? "border-red-500" : "border-white/20"
              } rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400`}
              placeholder="أدخل اسم المستخدم"
            />
            <FaUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">{errors.username}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.email ? "border-red-500" : "border-white/20"
              } rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400`}
              placeholder="example@email.com"
            />
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            رقم الهاتف
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.phone ? "border-red-500" : "border-white/20"
              } rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400`}
              placeholder="01xxxxxxxxx"
            />
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.password ? "border-red-500" : "border-white/20"
              } rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400`}
              placeholder="أدخل كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white/10 border ${
                errors.confirmPassword ? "border-red-500" : "border-white/20"
              } rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400`}
              placeholder="أعد إدخال كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
