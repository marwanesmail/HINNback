// src/components/Home/HowItWorksSection.jsx
import React from "react";
import { FaUserMd, FaPills, FaUser, FaCheckCircle } from "react-icons/fa";
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

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "الطبيب يكتب الروشتة",
      description: "يقوم الطبيب بإنشاء وصفة طبية إلكترونية وإرسالها إلى النظام.",
      icon: FaUserMd,
      gradient: "from-blue-400 to-indigo-600",
    },
    {
      number: 2,
      title: "الصيدلية تستقبل الطلب",
      description: "تستلم الصيدلية الروشتة وتجهز الأدوية المطلوبة للمريض.",
      icon: FaPills,
      gradient: "from-emerald-400 to-cyan-600",
    },
    {
      number: 3,
      title: "المريض يستلم الدواء",
      description: "يتم إشعار المريض عند جاهزية الأدوية للاستلام من الصيدلية.",
      icon: FaUser,
      gradient: "from-purple-400 to-pink-600",
    },
    {
      number: 4,
      title: "متابعة الحالة",
      description: "يمكن للطبيب متابعة حالة الروشتة والتأكد من استلام المريض للدواء.",
      icon: FaCheckCircle,
      gradient: "from-orange-400 to-red-500",
    },
  ];

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden"
      id="how-it-works"
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
            كيف يعمل{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              النظام؟
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
            خطوات مترابطة تضمن سير العمل بسلاسة بين الطبيب، الصيدلية، المريض
            والشركة
          </motion.p>
        </motion.div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
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
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition duration-300 bg-gradient-to-r ${step.gradient}`}
                ></div>

                <div className="relative text-center">
                  {/* رقم الخطوة */}
                  <motion.div
                    variants={itemVariants}
                    className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg"
                  >
                    {step.number}
                  </motion.div>

                  {/* الأيقونة */}
                  <motion.div
                    variants={itemVariants}
                    className={`inline-flex p-5 rounded-2xl mb-4 bg-gradient-to-r ${step.gradient} text-white shadow-lg`}
                  >
                    <IconComponent className="text-3xl" />
                  </motion.div>

                  {/* العنوان */}
                  <motion.h3
                    variants={itemVariants}
                    className="text-xl font-bold text-gray-800 mb-2"
                  >
                    {step.title}
                  </motion.h3>

                  {/* الوصف */}
                  <motion.p
                    variants={itemVariants}
                    className="text-gray-600 text-sm leading-relaxed"
                  >
                    {step.description}
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

export default HowItWorksSection;
