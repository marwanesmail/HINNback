import React, { useState, useCallback } from "react";
import { FaStethoscope, FaShippingFast } from "react-icons/fa";
import { motion } from "framer-motion";
import OffersCarousel from "../components/Home/OffersCarousel";
import QuickOrderCard from "../components/Home/QuickOrderCard";
import FeaturesSection from "../components/Home/FeaturesSection";
import HowItWorksSection from "../components/Home/HowItWorksSection";
import CtaSection from "../components/Home/CtaSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import ProductsSection from "../components/Products/ProductsSection";
import SearchBar from "../components/Search/SearchBar";
import SearchResults from "../components/Search/SearchResults";
import { searchProducts } from "../services/searchService";

const fadeInUpOnView = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  React.useEffect(() => {
    const savedLocation = localStorage.getItem("selectedDeliveryLocation");
    if (savedLocation) {
      try {
        setSelectedLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error("خطأ في تحميل الموقع المحفوظ:", error);
      }
    }
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchProducts(query, selectedLocation);
        setSearchResults(results);
      } catch (error) {
        console.error("خطأ في البحث:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [selectedLocation]
  );

  const handleLocationChange = useCallback(
    (location) => {
      setSelectedLocation(location);
      if (searchQuery) handleSearch(searchQuery);
    },
    [searchQuery, handleSearch]
  );

  const isInSearchMode = searchQuery.trim().length > 0;

  return (
    <>
      {/* شريط البحث */}
      <SearchBar
        onSearch={handleSearch}
        onLocationChange={handleLocationChange}
        selectedLocation={selectedLocation}
      />

      {isInSearchMode ? (
        <SearchResults
          results={searchResults}
          isLoading={isSearching}
          searchQuery={searchQuery}
        />
      ) : (
        <>
          {/* قسم العروض والخدمات */}
          <motion.section
            className="section-medical-alt"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUpOnView}
          >
            <div className="container-medical">
              <motion.div
                className="text-center mb-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpOnView}
              >
                <h2 className="text-2xl md:text-3xl font-medical-title text-dark-soft mb-3">
                  عروض وخدمات مميزة
                </h2>
                <p className="text-readable font-medical-body max-w-xl mx-auto">
                  اكتشف أحدث العروض والخدمات الطبية المتاحة من صيدليات وشركات
                  الأدوية الرائدة
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Carousel */}
                <motion.div
                  className="lg:col-span-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUpOnView}
                >
                  <OffersCarousel />
                </motion.div>

                {/* الصور الجانبية */}
                <div className="lg:col-span-1 space-y-4">
                  {[
                    {
                      img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                      title: "خدمات طبية متميزة",
                      subtitle: "رعاية صحية شاملة",
                      icon: <FaStethoscope className="text-white text-sm" />,
                    },
                    {
                      img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                      title: "توصيل سريع وآمن",
                      subtitle: "خدمة على مدار الساعة",
                      icon: <FaShippingFast className="text-white text-sm" />,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="relative h-32 md:h-36 lg:h-[152px] overflow-hidden rounded-lg shadow-lg group cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={fadeInUpOnView}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          {item.icon}
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                        <p className="text-xs opacity-90">{item.subtitle}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            اعرف المزيد
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* باقي السكاشن مع انيمشن عند scroll */}
          {[QuickOrderCard, ProductsSection, FeaturesSection, HowItWorksSection, CtaSection, TestimonialsSection].map(
            (Section, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUpOnView}
              >
                <Section />
              </motion.div>
            )
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
