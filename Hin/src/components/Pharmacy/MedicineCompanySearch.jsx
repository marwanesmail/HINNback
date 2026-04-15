import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaBuilding,
  FaTag,
  FaGift,
  FaBoxes,
  FaPlus,
  FaLightbulb,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const MedicineCompanySearch = ({
  onSelect,
  placeholder = "ابحث عن دواء أو شركة...",
  initialSearchQuery = "", // Added prop for initial search query
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  // بيانات وهمية بسيطة لشركات الأدوية والأدوية
  const medicineData = [
    {
      id: 1,
      medicineName: "باراسيتامول 500mg",
      companyName: "شركة الدواء الوطني",
      offer: "خصم 10% على الطلبات أكثر من 100 علبة",
      price: 12.5,
      originalPrice: 15.0,
      category: "مسكنات",
      inStock: true,
      minQuantity: 10,
    },
    {
      id: 2,
      medicineName: "أموكسيسيلين 250mg",
      companyName: "شركة فارما الشرق الأوسط",
      offer: "اشتري 5 واحصل على 1 مجاناً",
      price: 25.0,
      originalPrice: 30.0,
      category: "مضادات حيوية",
      inStock: true,
      minQuantity: 20,
    },
    {
      id: 3,
      medicineName: "إيبوبروفين 400mg",
      companyName: "شركة الدواء العربي",
      offer: "خصم 15% لفترة محدودة",
      price: 18.75,
      originalPrice: 22.0,
      category: "مسكنات",
      inStock: true,
      minQuantity: 15,
    },
    {
      id: 4,
      medicineName: "فيتامين د3",
      companyName: "شركة نيوتراليف",
      offer: null,
      price: 35.0,
      originalPrice: 35.0,
      category: "فيتامينات",
      inStock: true,
      minQuantity: 5,
    },
    {
      id: 5,
      medicineName: "أوميغا 3",
      companyName: "شركة أوميغا فارما",
      offer: "خصم 20% على الكمية أكثر من 30 علبة",
      price: 45.0,
      originalPrice: 55.0,
      category: "مكملات غذائية",
      inStock: true,
      minQuantity: 10,
    },
    {
      id: 6,
      medicineName: "كلاريتين",
      companyName: "شركة جونسون آند جونسون",
      offer: "عرض خاص: خصم 12%",
      price: 28.5,
      originalPrice: 32.0,
      category: "أدوية الحساسية",
      inStock: true,
      minQuantity: 12,
    },
    {
      id: 7,
      medicineName: "زولفيد",
      companyName: "شركة الدواء الشامل",
      offer: "شحن مجاني على الطلبات أكثر من 200 جنية",
      price: 22.0,
      originalPrice: 25.0,
      category: "أدوية الجهاز التنفسي",
      inStock: false,
      minQuantity: 25,
    },
    {
      id: 8,
      medicineName: "ديجيستيل",
      companyName: "شركة فارما كير",
      offer: null,
      price: 19.5,
      originalPrice: 19.5,
      category: "أدوية الجهاز الهضمي",
      inStock: true,
      minQuantity: 15,
    },
    {
      id: 9,
      medicineName: "سيريتيدا",
      companyName: "شركة الدواء الحديث",
      offer: "خصم 18% على الطلبات أكثر من 50 علبة",
      price: 33.0,
      originalPrice: 40.0,
      category: "أدوية الحساسية",
      inStock: true,
      minQuantity: 8,
    },
    {
      id: 10,
      medicineName: "أسبرين كardio",
      companyName: "شركة باير العالمية",
      offer: "اشتري 3 واحصل على 1 مجاناً",
      price: 15.75,
      originalPrice: 20.0,
      category: "مسكنات",
      inStock: true,
      minQuantity: 30,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = medicineData.filter(
          (item) =>
            item.medicineName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [searchTerm]);

  // Effect to handle initial search query
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchTerm(initialSearchQuery);
      // Automatically trigger search if the initial query is long enough
      if (initialSearchQuery.length >= 2) {
        const timer = setTimeout(() => {
          const filtered = medicineData.filter(
            (item) =>
              item.medicineName
                .toLowerCase()
                .includes(initialSearchQuery.toLowerCase()) ||
              item.companyName
                .toLowerCase()
                .includes(initialSearchQuery.toLowerCase()) ||
              item.category
                .toLowerCase()
                .includes(initialSearchQuery.toLowerCase())
          );
          setSuggestions(filtered);
          setShowSuggestions(true);
          setIsLoading(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [initialSearchQuery]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) handleSelect(suggestions[selectedIndex]);
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSelect = (item) => {
    setSearchTerm(`${item.medicineName} - ${item.companyName}`);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSelect(item);
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaSearch className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown مع Animation */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 text-center text-gray-500"
              >
                <FaSearch className="text-2xl mb-2 block" />
                <p>لا توجد نتائج للبحث "{searchTerm}"</p>
              </motion.div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  تم العثور على {suggestions.length} نتيجة
                </div>
                {suggestions.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleSelect(item)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                      index === selectedIndex
                        ? "bg-blue-50 border-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {highlightText(item.medicineName, searchTerm)}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.inStock ? "متوفر" : "غير متوفر"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <FaBuilding className="ml-1" />
                          {highlightText(item.companyName, searchTerm)}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          <FaTag className="ml-1" />
                          {item.category}
                        </p>
                        {item.offer && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-2">
                            <p className="text-sm text-orange-800 font-medium">
                              <FaGift className="ml-1" />
                              {item.offer}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600">
                              {item.price.toFixed(2)} جنيه
                            </span>
                            {item.originalPrice !== item.price && (
                              <span className="text-gray-500 line-through text-xs">
                                {item.originalPrice.toFixed(2)} جنيه
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500">
                            <FaBoxes className="ml-1" />
                            الحد الأدنى: {item.minQuantity} علبة
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaPlus className="text-blue-600 text-sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Tips */}
      {searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-blue-50 border border-blue-200 rounded-xl p-3 z-40">
          <p className="text-blue-800 text-sm">
            <FaLightbulb className="ml-1" />
            اكتب حرفين على الأقل للبحث
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineCompanySearch;
