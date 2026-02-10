// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل بيانات المستخدم من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // حفظ بيانات المستخدم في localStorage عند تغييرها
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // تسجيل الدخول - هنا هيكون ربط بالباك اند بعدين
  const login = (userData) => {
    // TODO: ربط مع API هنا - POST /api/auth/login
    // نوع البيانات المطلوبة: { username, password }
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { user: { id, name, email, userType } }
    // في المستقبل سيتم استبدال هذا بطلب API فعلي
    const userWithId = {
      ...userData,
      id: Date.now(), // معرف مؤقت
      loginTime: new Date().toISOString(),
    };
    setUser(userWithId);
    return userWithId;
  };

  // تسجيل الخروج - هنا هيكون ربط بالباك اند بعدين
  const logout = () => {
    // TODO: ربط مع API هنا - POST /api/auth/logout
    // نوع البيانات المطلوبة: {}
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { success: true }
    // في المستقبل سيتم استبدال هذا بطلب API فعلي
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };

  // تحديث بيانات المستخدم - هنا هيكون ربط بالباك اند بعدين
  const updateUser = (updatedData) => {
    // TODO: ربط مع API هنا - PUT /api/users/{id}
    // نوع البيانات المطلوبة: { userData }
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { user: { id, name, email, userType } }
    // في المستقبل سيتم استبدال هذا بطلب API فعلي
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // التحقق من حالة المصادقة
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
