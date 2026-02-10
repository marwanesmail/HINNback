// src/components/Home/OffersCarousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaPills,
  FaShippingFast,
  FaUserMd,
  FaHeart,
  FaMicroscope,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
  FaPlay,
  FaIndustry
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const OffersCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const offers = [
    {
      id: 1,
      title: "خصم 30% على جميع الأدوية",
      subtitle: "عرض خاص من صيدلية النهدي",
      description: "احصل على خصم 30% على جميع الأدوية والمكملات الغذائية",
      image:
        "https://vid.alarabiya.net/images/2021/11/20/d6f2e84f-d475-4504-b6b5-3f577621d35d/d6f2e84f-d475-4504-b6b5-3f577621d35d.jpg?crop=4:3&width=1200",
      buttonText: "اطلب الآن",
      bgGradient: "from-blue-600 via-purple-600 to-blue-700",
      icon: FaPills,
      badge: "وفر 1500 جنيه",
    },
    {
      id: 2,
      title: "توصيل مجاني للأدوية",
      subtitle: "خدمة سريعة وآمنة",
      description: "توصيل مجاني لجميع الطلبات أكثر من 600 جنيه في نفس اليوم",
      image:
        "https://www.yelowsoft.com/static/a156867eb4e8d4ef5063dff2410742f8/78d47/medicine-delivery-app-to-streamline-main.png",
      buttonText: "اعرف المزيد",
      bgGradient: "from-green-600 via-emerald-600 to-green-700",
      icon: FaShippingFast,
      badge: "توصيل سريع",
    },
    {
      id: 3,
      title: "استشارة طبية مجانية",
      subtitle: "مع أفضل الأطباء",
      description: "احجز استشارة طبية مجانية مع أطباء متخصصين عبر المنصة",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80",
      buttonText: "احجز الآن",
      bgGradient: "from-purple-600 via-pink-600 to-purple-700",
      icon: FaUserMd,
      badge: "استشارة فورية",
    },
  {
    id: 4,
    title: "عروض حصرية للصيدليات",
    subtitle: "خصومات كبيرة على الطلبات بالجملة",
    description: "استفيدوا من خصومات خاصة عند طلب الأدوية والمستلزمات الطبية بكميات كبيرة من شركتنا",
    image:
      "https://media.gemini.media/img/Medium/2025/1/7/2025_1_7_19_59_27_575.webp",
    buttonText: "استفد الآن",
    bgGradient: "from-indigo-500 via-blue-500 to-indigo-600",
    icon: FaIndustry,
    badge: "خصومات للصيدليات",
  }
  ];

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying || isPaused || isLoading) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length, isAutoPlaying, isPaused, isLoading]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  }, [offers.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  }, [offers.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying]);

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">جاري التحميل...</div>;
  }

  const slideVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  return (
    <div
      className="relative w-full h-64 md:h-80 overflow-hidden rounded-3xl shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${offers[currentSlide].image})` }}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
          <div className="relative z-10 p-6 max-w-xl text-white">
            <motion.div
              custom={0}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mb-3"
            >
              <span className="px-4 py-1 bg-white/20 rounded-full text-sm">
                {offers[currentSlide].badge}
              </span>
            </motion.div>
            <motion.h2
              custom={1}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl font-bold mb-2"
            >
              {offers[currentSlide].title}
            </motion.h2>
            <motion.p
              custom={2}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="mb-4 text-lg opacity-90"
            >
              {offers[currentSlide].description}
            </motion.p>
            <motion.button
              custom={3}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              {offers[currentSlide].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full text-white hover:bg-black/60"
      >
        <FaChevronRight />
      </button>

      {/* Play / Pause */}
      <button
        onClick={toggleAutoPlay}
        className="absolute top-4 left-4 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
      >
        {isAutoPlaying ? <FaPause /> : <FaPlay />}
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {offers.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-gray-400"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersCarousel;
