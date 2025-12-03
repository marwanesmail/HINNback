import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaLanguage,
  FaBell,
  FaLock,
  FaPalette,
  FaSave,
  FaEnvelope,
  FaKey,
  FaCheckCircle,
} from "react-icons/fa";

const Settings = () => {
  const [settings, setSettings] = useState({
    language: "ar",
    notifications: true,
    darkMode: false,
    autoSave: true,
  });

  const [emailForm, setEmailForm] = useState({
    currentEmail: "admin@hin.com",
    newEmail: "",
    confirmEmail: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showAlert, setShowAlert] = useState(null);

  const showMessage = (type, title, text) => {
    setShowAlert({ type, title, text });
    setTimeout(() => setShowAlert(null), 3000);
  };

  const handleSave = () => {
    showMessage("success", "تم حفظ الإعدادات", "تم حفظ إعداداتك بنجاح!");
  };

  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({
      ...emailForm,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handleEmailSubmit = () => {
    if (!emailForm.newEmail || !emailForm.confirmEmail) {
      showMessage("error", "خطأ", "يرجى ملء جميع الحقول!");
      return;
    }

    if (emailForm.newEmail !== emailForm.confirmEmail) {
      showMessage("error", "خطأ", "البريد الإلكتروني الجديد غير متطابق!");
      return;
    }

    showMessage("success", "تم تغيير البريد الإلكتروني", "تم تغيير بريدك الإلكتروني بنجاح!");

    setEmailForm({
      currentEmail: emailForm.newEmail,
      newEmail: "",
      confirmEmail: "",
    });
  };

  const handlePasswordSubmit = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showMessage("error", "خطأ", "يرجى ملء جميع الحقول!");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("error", "خطأ", "كلمة المرور الجديدة غير متطابقة!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage("error", "خطأ", "كلمة المرور يجب أن تكون على الأقل 6 أحرف!");
      return;
    }

    showMessage("success", "تم تغيير كلمة المرور", "تم تغيير كلمة مرورك بنجاح!");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Alert */}
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              showAlert.type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-red-600 to-rose-700"
            } text-white`}
          >
            <FaCheckCircle className="text-2xl" />
            <div>
              <h4 className="font-bold text-lg">{showAlert.title}</h4>
              <p className="text-sm opacity-90">{showAlert.text}</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">
            إعدادات الحساب
          </h1>
          <p className="text-gray-700">قم بإدارة حسابك وتفضيلاتك الشخصية</p>
        </motion.div> */}

        {/* Email Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden mb-6 hover:shadow-2xl transition-all duration-300"
        >
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <FaEnvelope className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">تغيير البريد الإلكتروني</h2>
                <p className="text-red-50 text-sm">قم بتحديث عنوان بريدك الإلكتروني</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  البريد الإلكتروني الحالي
                </label>
                <input
                  type="email"
                  value={emailForm.currentEmail}
                  disabled
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    البريد الإلكتروني الجديد
                  </label>
                  <input
                    type="email"
                    name="newEmail"
                    value={emailForm.newEmail}
                    onChange={handleEmailChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all outline-none"
                    placeholder="أدخل البريد الإلكتروني الجديد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    تأكيد البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="confirmEmail"
                    value={emailForm.confirmEmail}
                    onChange={handleEmailChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all outline-none"
                    placeholder="أدخل البريد الإلكتروني مرة أخرى"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleEmailSubmit}
                className="group relative px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <FaEnvelope className="group-hover:rotate-12 transition-transform" />
                تغيير البريد الإلكتروني
              </button>
            </div>
          </div>
        </motion.div>

        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <FaKey className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">تغيير كلمة المرور</h2>
                <p className="text-red-50 text-sm">قم بتحديث كلمة المرور الخاصة بك</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all outline-none"
                  placeholder="أدخل كلمة المرور الحالية"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all outline-none"
                    placeholder="أدخل كلمة المرور الجديدة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all outline-none"
                    placeholder="أدخل كلمة المرور مرة أخرى"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>ملاحظة:</strong> كلمة المرور يجب أن تكون على الأقل 6 أحرف
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handlePasswordSubmit}
                className="group relative px-8 py-3 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <FaLock className="group-hover:rotate-12 transition-transform" />
                تغيير كلمة المرور
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;