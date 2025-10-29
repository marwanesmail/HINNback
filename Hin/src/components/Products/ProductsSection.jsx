// src/components/Products/ProductsSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import {
  FaThLarge,
  FaPills,
  FaLeaf,
  FaSpa,
  FaHeartbeat,
  FaBoxOpen,
  FaFilter,
  FaSort,
} from "react-icons/fa";

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // المنتجات التجريبية
  const products = [
    {
      id: 1,
      name: "باراسيتامول 500 مجم",
      description: "مسكن للألم وخافض للحرارة، آمن وفعال للاستخدام اليومي",
      price: 15,
      originalPrice: 20,
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "medicines",
      inStock: true,
      rating: 4.5,
      reviewsCount: 128,
      discount: 25,
      isNew: false,
    },
    {
      id: 2,
      name: "فيتامين د3 1000 وحدة",
      description: "مكمل غذائي لتقوية العظام والمناعة، جرعة يومية واحدة",
      price: 45,
      image:
        "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "supplements",
      inStock: true,
      rating: 4.8,
      reviewsCount: 89,
      isNew: true,
    },
    {
      id: 3,
      name: "كريم مرطب للبشرة الجافة",
      description: "كريم طبي مرطب للبشرة الحساسة والجافة، خالي من العطور",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "skincare",
      inStock: true,
      rating: 4.3,
      reviewsCount: 67,
    },
    {
      id: 4,
      name: "شراب السعال للأطفال",
      description: "شراب طبيعي لعلاج السعال عند الأطفال، طعم الفراولة",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "medicines",
      inStock: false,
      rating: 4.6,
      reviewsCount: 45,
    },
    {
      id: 5,
      name: "أوميجا 3 كبسولات",
      description: "مكمل غذائي لصحة القلب والدماغ، زيت السمك النقي",
      price: 65,
      originalPrice: 75,
      image:
        "https://yourgreen.shop/wp-content/uploads/2023/12/Omega-3-Ultra-Now.webp",
      category: "supplements",
      inStock: true,
      rating: 4.7,
      reviewsCount: 156,
      discount: 13,
    },
  ];

  const categories = [
    { id: "all", name: "جميع المنتجات", icon: FaThLarge },
    { id: "medicines", name: "الأدوية", icon: FaPills },
    { id: "supplements", name: "المكملات الغذائية", icon: FaLeaf },
    { id: "skincare", name: "العناية بالبشرة", icon: FaSpa },
    { id: "devices", name: "الأجهزة الطبية", icon: FaHeartbeat },
  ];

  const sortOptions = [
    { id: "name", name: "الاسم" },
    { id: "price-low", name: "السعر: من الأقل للأعلى" },
    { id: "price-high", name: "السعر: من الأعلى للأقل" },
    { id: "rating", name: "التقييم" },
  ];

  // تصفية وترتيب المنتجات
  const filteredAndSortedProducts = products
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return a.name.localeCompare(b.name, "ar");
      }
    });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* عنوان القسم */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4">
              منتجاتنا المميزة
            </h2>

            {/* Decorative Line */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-3"></div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              اكتشف مجموعة واسعة من المنتجات الطبية والصحية عالية الجودة
            </p>
          </div>
        </motion.div>

        {/* فلاتر وترتيب */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* فلتر الفئات */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 border border-white/20">
            <div className="flex items-center mb-3">
              <FaFilter className="text-blue-600 ml-2" />
              <h3 className="text-lg font-bold text-gray-800">الفئات</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:-translate-y-1 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-xl scale-105"
                        : "bg-white/60 text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200"
                    }`}
                  >
                    <IconComponent className="ml-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ترتيب */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <FaSort className="text-purple-600" />
              <span className="text-gray-700 font-semibold">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-0 bg-white/60 rounded-2xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-lg shadow-lg"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* عدد المنتجات */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/20 inline-block">
            <p className="text-gray-700 font-semibold">
              عرض{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold">
                {filteredAndSortedProducts.length}
              </span>{" "}
              من{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold">
                {products.length}
              </span>{" "}
              منتج
            </p>
          </div>
        </motion.div>

        {/* شبكة المنتجات */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {filteredAndSortedProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-2xl">
                <ProductCard product={product} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* رسالة عدم وجود منتجات */}
        {filteredAndSortedProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/20 max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30"></div>
                <FaBoxOpen className="relative text-8xl text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                لا توجد منتجات في هذه الفئة
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                جرب تغيير الفلتر أو البحث في فئة أخرى للعثور على ما تبحث عنه
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                عرض جميع المنتجات
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductsSection;
