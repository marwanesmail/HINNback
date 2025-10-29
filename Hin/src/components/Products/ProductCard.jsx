// src/components/Products/ProductCard.jsx
import React, { useState } from "react";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Show alert for unauthenticated users
      setShowAlert(true);
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    // Add to cart for authenticated users
    setIsAdding(true);
    addToCart(product);

    // Reset adding state after a short delay
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Animation variants for the alert
  const alertVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image || "https://placehold.co/300x300?text=Product"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
            خصم {product.discount}%
          </div>
        )}

        {/* New Badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-medical-green text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
            جديد
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-xs mr-1">
              ({product.reviewsCount || 0})
            </span>
          </div>
        )}

        {/* Price and Availability */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 line-through text-sm ml-1">
                {product.originalPrice} جنيه
              </span>
            )}
            <span className="text-lg font-bold text-blue-600">
              {product.price} جنيه
            </span>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.inStock ? "متوفر" : "غير متوفر"}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center ${
            !product.inStock
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : !isAuthenticated()
              ? "bg-gray-400 text-white cursor-not-allowed"
              : isAdding
              ? "bg-blue-700 text-white cursor-wait"
              : "bg-medical-green text-white hover:bg-green-600"
          }`}
        >
          {isAdding ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              جاري الإضافة...
            </div>
          ) : !product.inStock ? (
            "غير متوفر"
          ) : (
            <div className="flex items-center">
              <FaShoppingCart className="ml-2 text-sm" />
              أضف للسلة
            </div>
          )}
        </button>
      </div>

      {/* Authentication Alert */}
      {showAlert && (
        <motion.div
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-20 left-2 right-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-10"
        >
          <p className="text-red-600 text-sm font-medium text-center">
            يجب تسجيل الدخول أولاً لإضافة المنتجات إلى السلة
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductCard;
