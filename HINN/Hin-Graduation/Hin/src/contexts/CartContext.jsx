// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const CartContext = createContext();

export { CartContext };

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // تحميل سلة الشراء من localStorage عند تسجيل الدخول
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing saved cart:", error);
          setCartItems([]);
        }
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  // حفظ سلة الشراء في localStorage عند تغييرها
  useEffect(() => {
    if (user && cartItems.length >= 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // إضافة منتج إلى السلة - هنا هيكون ربط بالباك اند بعدين
  const addToCart = (product) => {
    // TODO: ربط مع API هنا - POST /api/cart/items
    // نوع البيانات المطلوبة: { productId, quantity }
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { success: true, cartItem: { id, productId, quantity, addedAt } }
    if (!isAuthenticated()) {
      return {
        success: false,
        message: "يجب تسجيل الدخول أولاً لإضافة المنتجات إلى السلة",
      };
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          { ...product, quantity: 1, addedAt: new Date().toISOString() },
        ];
      }
    });

    return { success: true, message: "تم إضافة المنتج إلى السلة بنجاح" };
  };

  // إزالة منتج من السلة - هنا هيكون ربط بالباك اند بعدين
  const removeFromCart = (productId) => {
    // TODO: ربط مع API هنا - DELETE /api/cart/items/{productId}
    // نوع البيانات المطلوبة: {}
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { success: true }
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // تحديث كمية المنتج - هنا هيكون ربط بالباك اند بعدين
  const updateQuantity = (productId, newQuantity) => {
    // TODO: ربط مع API هنا - PUT /api/cart/items/{productId}
    // نوع البيانات المطلوبة: { quantity }
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { success: true, cartItem: { id, productId, quantity } }
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // مسح السلة - هنا هيكون ربط بالباك اند بعدين
  const clearCart = () => {
    // TODO: ربط مع API هنا - DELETE /api/cart
    // نوع البيانات المطلوبة: {}
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { success: true }
    setCartItems([]);
  };

  // حساب إجمالي السعر - هنا هيكون ربط بالباك اند بعدين
  const getCartTotal = () => {
    // TODO: ربط مع API هنا - GET /api/cart/total
    // نوع البيانات المطلوبة: {}
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { total: number }
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // حساب عدد العناصر في السلة - هنا هيكون ربط بالباك اند بعدين
  const getCartItemsCount = () => {
    // TODO: ربط مع API هنا - GET /api/cart/count
    // نوع البيانات المطلوبة: {}
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { count: number }
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    toggleCart,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
