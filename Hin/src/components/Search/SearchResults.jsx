// src/components/Search/SearchResults.jsx
import React from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import ProductCard from "../Products/ProductCard";
import { useAuth } from "../../hooks/useAuth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const SearchResults = ({ results, isLoading, searchQuery }) => {
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mr-3 text-gray-600">جاري البحث...</span>
        </div>
      </div>
    );
  }

  if (!searchQuery) return null;

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* رأس النتائج */}
      <motion.div className="mb-6" variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          نتائج البحث عن "{searchQuery}"
        </h2>
        <p className="text-gray-600">
          {results.length > 0
            ? `تم العثور على ${results.length} منتج`
            : "لم يتم العثور على نتائج"}
        </p>
      </motion.div>

      {/* النتائج */}
      {results.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {results.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* رسالة عدم وجود نتائج */
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-4">
            <FaSearch className="text-6xl text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            لم يتم العثور على نتائج
          </h3>
          <p className="text-gray-600 mb-4">
            جرب البحث بكلمات مختلفة أو تحقق من الإملاء
          </p>
          <div className="text-sm text-gray-500">
            <p>نصائح للبحث:</p>
            <ul className="mt-2 space-y-1">
              <li>• استخدم كلمات أبسط</li>
              <li>• تأكد من الإملاء الصحيح</li>
              <li>• جرب البحث باسم الشركة المصنعة</li>
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchResults;
