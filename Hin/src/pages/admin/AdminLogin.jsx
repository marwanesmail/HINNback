import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: connect with API
      // Simulate API call with static credentials for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, using static credentials
      if (email === "admin@hin.com" && password === "admin123") {
        // Show SweetAlert2 notification
        MySwal.fire({
          title: "تسجيل الدخول ناجح",
          text: "سيتم تحويلك إلى لوحة مدير النظام ",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            container: "rtl-text",
          },
        }).then(() => {
          // Successful login - redirect to admin dashboard
          navigate("/admin/dashboard");
        });
      } else {
        setError("بيانات الدخول غير صحيحة. الرجاء المحاولة مرة أخرى.");
      }
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-red-900 via-red-800 to-black relative overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      dir="rtl"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      >
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-red-600/20 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-red-200/30 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <motion.div
                  initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                  className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-md"
                >
                  <FaUserShield className="text-white text-lg" />
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex flex-col"
                >
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                    تسجيل دخول المدير
                  </span>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-gray-200 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 shadow-sm"
              >
                <FaUserShield className="ml-2" />
                <span className="font-medium">الصفحة الرئيسية</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-red-200/30 shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4"
            >
              <FaUserShield className="text-white text-3xl" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">مدير نظام HIN</h2>
            <p className="text-red-200 mt-2">تسجيل الدخول للوحة التحكم</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.4 }}
                className="bg-red-500/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl text-center"
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
                  className="w-full px-4 py-3 bg-white/10 border border-red-200/30 rounded-2xl focus:ring-2 focus:ring-red-400 text-gray-100 placeholder-gray-400"
                  placeholder="admin@hin.com"
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
                  className="w-full px-4 py-3 bg-white/10 border border-red-200/30 rounded-2xl focus:ring-2 focus:ring-red-400 text-gray-100 placeholder-gray-400"
                  placeholder="••••••••"
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

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.03 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={`w-full py-3 rounded-2xl font-bold shadow-xl flex items-center justify-center ${
                isLoading
                  ? "bg-gray-500/40 cursor-not-allowed text-gray-300"
                  : "bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900"
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
          </form>

          <div className="mt-6 text-center text-gray-300 text-sm">
            <p>بيانات الدخول التجريبية:</p>
            <p className="mt-1">admin@hin.com / admin123</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
