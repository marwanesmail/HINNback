// src/components/FeaturesSection.jsx
import React from "react";
import { FaUserMd, FaPills, FaUser, FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";

// Variants for container & stagger
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

// لكل عنصر داخل الكارت
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const FeaturesSection = () => {
  const features = [
    {
      icon: FaUser,
      title: "للمرضى",
      description:
        "استلام الأدوية الموصوفة بسهولة وتتبع تاريخ الوصفات الطبية.",
      gradient: "from-purple-400 to-pink-600",
    },
    {
      icon: FaUserMd,
      title: "للأطباء",
      description:
        "كتابة الروشتات بسهولة ومتابعة حالتها مع إمكانية الوصول إلى سجل المرضى.",
      gradient: "from-blue-400 to-indigo-600",
    },
    {
      icon: FaPills,
      title: "للصيدليات",
      description:
        "استقبال الروشتات إلكترونيًا وإدارة المخزون وعرض الأدوية المتوفرة.",
      gradient: "from-emerald-400 to-cyan-600",
    },
    {
      icon: FaBuilding,
      title: "لشركات الأدوية",
      description:
        "متابعة طلبات الصيدليات وتوفير المنتجات بشكل أسرع وأكثر فعالية.",
      gradient: "from-gray-500 to-gray-800",
    },
  ];

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden"
      id="features"
    >
      {/* خلفيات ديكورية */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* العنوان */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-6"
          >
            مميزات{" "}
            <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
              هيِّن
            </span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
          ></motion.div>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto"
          >
            نظام شامل يخدم جميع أطراف العملية الطبية بكفاءة وسهولة
          </motion.p>
        </motion.div>

        {/* الكروت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="group relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* خلفية عند الهوفر */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition duration-300 bg-gradient-to-r ${feature.gradient}`}
                ></div>

                <div className="relative text-center">
                  {/* الأيقونة */}
                  <motion.div
                    variants={itemVariants}
                    className={`inline-flex p-5 rounded-2xl mb-4 bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}
                  >
                    <IconComponent className="text-3xl" />
                  </motion.div>

                  {/* العنوان */}
                  <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold text-gray-800 mb-2"
                  >
                    {feature.title}
                  </motion.h3>

                  {/* الوصف */}
                  <motion.p
                    variants={itemVariants}
                    className="text-gray-600 text-sm leading-relaxed"
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
