import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaPills,
  FaBuilding,
  FaUser,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

import Swal from "sweetalert2";

// Add a simplified navbar component for login page
const LoginNavbar = ({ title = "تسجيل الدخول" }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <motion.div
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md"
              >
                <FaUserMd className="text-white text-lg" />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-col"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Home Button */}
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleGoHome}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <FaUserMd className="ml-2" />
              <span className="font-medium">الصفحة الرئيسية</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const selectUserType = (type) => {
    setSelectedUserType(type);
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedUserType) {
      setError("الرجاء اختيار نوع المستخدم.");
      return;
    }

    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: ربط مع API هنا - POST /api/auth/login
      // نوع البيانات المطلوبة: { username, password, userType }
      // Headers: Content-Type: application/json
      // البيانات الراجعة: { token, user: { id, name, email, userType } }
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = {
        name: email.split('@')[0],
        email: email,
        userType: selectedUserType,
        loginTime: new Date().toISOString(),
      };

      login(userData);

let successMessages = {
  doctor: "تم تسجيل الدخول بنجاح دكتور! سيتم تحويلك الآن إلى لوحة التحكم الخاصة بك...",
  pharmacy: "تم تسجيل الدخول بنجاح صيدلي! سيتم تحويلك الآن إلى لوحة التحكم الخاصة بك...",
  company: "تم تسجيل الدخول بنجاح شركة! سيتم تحويلك الآن إلى لوحة التحكم الخاصة بك...",
  patient: "تم تسجيل الدخول بنجاح! سيتم تحويلك الآن إلى صفحتك...",
};

      Swal.fire({
        title: "تم تسجيل الدخول بنجاح ",
        text: successMessages[selectedUserType] || "سيتم تحويلك الآن...",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        switch (selectedUserType) {
          case "doctor":
            navigate("/doctor-dashboard");
            break;
          case "pharmacy":
            navigate("/pharmacy-dashboard");
            break;
          case "company":
            navigate("/company-dashboard");
            break;
          case "patient":
            navigate("/");
            break;
          default:
            navigate("/");
            break;
        }
      });
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const UserTypeIcon = ({ type }) => {
    const base = "text-3xl mb-2 mx-auto";
    switch (type) {
      case "doctor":
        return <FaUserMd className={`${base} text-blue-400`} />;
      case "pharmacy":
        return <FaPills className={`${base} text-green-400`} />;
      case "company":
        return <FaBuilding className={`${base} text-gray-800`} />;
      case "patient":
        return <FaUser className={`${base} text-purple-400`} />;
      default:
        return null;
    }
  };

  const userTypes = [
    {
      type: "patient",
      label: "مريض",
      // description: "متابعة الوصفات",
      gradient: "from-orange-400 to-red-500",
    },
    {
      type: "doctor",
      label: "طبيب",
      // description: "إدارة الوصفات الطبية",
      gradient: "from-emerald-400 to-cyan-600",
    },
    {
      type: "pharmacy",
      label: "صيدلية",
      // description: "تنفيذ الوصفات الطبية",
      gradient: "from-blue-400 to-indigo-600",
    },
    {
      type: "company",
      label: "شركة أدوية",
      // description: "توريد الأدوية",
      gradient: "from-purple-400 to-pink-600",
    },
  ];

  return (
    <motion.div
      className="h-screen w-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black relative overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* خلفية متحركة */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      >
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* النافبار */}
      <LoginNavbar title="تسجيل الدخول" />

      {/* الكونتينر */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10 overflow-hidden">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8"
              >
                <h2 className="text-center text-2xl font-bold text-white mb-6">
                  اختر نوع حسابك
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {userTypes.map((userType) => (
                    <motion.div
                      key={userType.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectUserType(userType.type)}
                      className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-2xl text-center text-white transition-all duration-300 shadow-2xl shadow-blue-600/80"
                    >
                      <UserTypeIcon type={userType.type} />
                      <h4 className="font-bold text-lg">{userType.label}</h4>
                    </motion.div>
                  ))}
                </div>
                {/* النص تحت نوع الحساب */}
                <p className="text-gray-300 mt-6 text-center">
                  مستخدم جديد؟{" "}
                  <Link
                    to="/signup"
                    className="text-blue-400 hover:text-blue-500 font-bold"
                  >
                    أنشئ حسابك الآن
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-lg mx-auto"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-center text-2xl font-bold text-white mb-6">
                    تسجيل الدخول كـ{" "}
                    <span className="text-blue-300">
                      {
                        userTypes.find((u) => u.type === selectedUserType)
                          ?.label
                      }
                    </span>
                  </h2>

                  {error && (
                    <motion.div
                      initial={{ x: -10 }}
                      animate={{ x: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.4 }}
                      className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-2xl mb-4"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-200">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
                        placeholder="أدخل البريد الإلكتروني"
                      />
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-200">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
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
                  </div>

                  {/* زرارين تسجيل الدخول + الرجوع */}
                  <div className="flex gap-4 mt-4 items-center">
                    {/* زرار تسجيل الدخول - أكبر */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.05 }}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                      className={`flex-[2] py-3 rounded-2xl font-bold shadow-xl flex items-center justify-center ${
                        isLoading
                          ? "bg-gray-500/40 cursor-not-allowed text-gray-300"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      }`}
                    >
                      {isLoading ? (
                        <motion.div className="rounded-full h-5 w-5 border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <FaSignInAlt className="ml-3" /> تسجيل الدخول
                        </>
                      )}
                    </motion.button>
                    {/* زرار الرجوع - أصغر */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setStep(1);
                        setSelectedUserType(null);
                        setError("");
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold shadow-md bg-gray-500/30 hover:bg-gray-500/50 text-white text-sm"
                    >
                      <FaArrowRight className="text-base" />
                      <span>السابق</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
