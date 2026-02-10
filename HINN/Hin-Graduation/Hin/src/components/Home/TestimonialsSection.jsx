// src/components/Home/TestimonialsCarousel.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Variants for container & stagger (لتحريك العنوان والخط بشكل متدرج)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

// لكل عنصر داخل الكارت (لحركة العنوان والخط)
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const testimonials = [
  {
    id: 1,
    name: "Mohamed Zokla",
    date: "1/11/2025",
    comment:
      "تجربة ممتازة جدًا، التطبيق سهل وبسيط وقدرت أطلب الأدوية اللي محتاجها من غير ما أتعب أو ألف على الصيدليات.",
  },
  {
    id: 2,
    name: "Marwan Ismail",
    date: "18/9/2025",
    comment:
      "الخدمة سريعة جداً والتوصيل في الميعاد بالظبط، وكمان الأسعار مناسبة وخدمة العملاء محترمة للغاية.",
  },
  {
    id: 3,
    name: "Mahmoud Elkahky",
    date: "26/9/2025",
    comment:
      "بصراحة تطبيق منظم وسهل، بيخليني أتابع الروشتات بتاعتي وأطلب أي دواء بسهولة من البيت.",
  },
  {
    id: 4,
    name: "Mahmoud Abdo",
    date: "26/9/2025",
    comment:
      "أول مرة أجرب طلب الأدوية أونلاين وكانت تجربة رائعة، التوصيل سريع والتعامل راقي جداً.",
  },
  {
    id: 5,
    name: "Mohamed Samir",
    date: "10/6/2022",
    comment:
      "خدمة فوق الممتازة، التطبيق سهل جداً والتوصيل دايماً في ميعاده، تجربة هتتكرر أكيد.",
  },
  {
    id: 6,
    name: "Mostafa Ahmed",
    date: "10/6/2022",
    comment:
      "تجربة رائعة جدًا، التطبيق سهل جداً والتوصيل دايماً في ميعاده، تجربة هتتكرر أكيد.",
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-100">
      <div className="max-w-4xl mx-auto text-center">
        {/* العنوان - تم تطبيق انيميشن الرؤية عند التمرير هنا */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }} // يُعرض الانيميشن بمجرد رؤية 30% من القسم
          variants={containerVariants}
          className="mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4"
          >
            ما رأي عملاء <span className="text-blue-600">هيِّن</span> عن خدماتنا
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
          ></motion.div>
        </motion.div>

        {/* الكارت */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[currentIndex].id}
              // أنيميشن الكاروسيل للتحويل بين الآراء
              initial={{ opacity: 0, x: currentIndex > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentIndex > 0 ? -50 : 50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white rounded-3xl shadow-xl p-8 mx-auto max-w-xl"
            >
              <FaQuoteLeft className="text-blue-500 text-3xl mb-4 mx-auto" />
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {testimonials[currentIndex].comment}
              </p>
              <hr className="my-4" />
              <h3 className="font-bold text-lg text-gray-900">
                {testimonials[currentIndex].name}
              </h3>
              <p className="text-sm text-gray-500">
                {testimonials[currentIndex].date}
              </p>
            </motion.div>
          </AnimatePresence>
          {/* أزرار التنقل */}
          <div className="flex justify-between mt-8 max-w-xl mx-auto">
            <button
              onClick={prevSlide}
              className="px-4 py-2 rounded-full bg-white shadow hover:bg-gray-100 transition text-gray-700 text-xl flex items-center justify-center"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="px-4 py-2 rounded-full bg-white shadow hover:bg-gray-100 transition text-gray-700 text-xl flex items-center justify-center"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Dots Indicators */}
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  currentIndex === i ? "bg-blue-600 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
