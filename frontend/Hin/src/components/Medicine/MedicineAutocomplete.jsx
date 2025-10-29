import React, { useState, useEffect, useRef } from "react";
import { FaPills, FaSearch, FaKeyboard } from "react-icons/fa";
import { searchMedicines } from "../../services/medicineApi";
import MedicineInfo from "./MedicineInfo";
import { motion, AnimatePresence } from "framer-motion";

const MedicineAutocomplete = ({
  value,
  onChange,
  placeholder = "اسم الدواء",
  className = "",
  required = false,
  disabled = false,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // البحث عن الأدوية
  useEffect(() => {
    const searchMeds = async () => {
      if (value && value.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchMedicines(value);
          setSuggestions(results);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error("Error searching medicines:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchMeds, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  // إخفاء القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (selectedMedicine && newValue !== selectedMedicine.name) {
      setSelectedMedicine(null);
    }
  };

  const handleSuggestionClick = (medicine) => {
    onChange(medicine.name);
    setSelectedMedicine(medicine);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  // Variants للأنيميشن
  const listVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative">
      {/* حقل الإدخال */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          required={required}
          disabled={disabled}
          autoComplete="off"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          ) : (
            <FaPills className="text-gray-400 text-sm" />
          )}
        </div>
      </div>

      {/* قائمة الاقتراحات مع أنيميشن */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={listVariants}
          >
            {suggestions.map((medicine, index) => (
              <motion.div
                key={medicine.id || index}
                onClick={() => handleSuggestionClick(medicine)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                  index === selectedIndex ? "bg-blue-50 border-blue-200" : ""
                }`}
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{medicine.name}</div>
                    {medicine.genericName && medicine.genericName !== medicine.name && (
                      <div className="text-sm text-gray-600">{medicine.genericName}</div>
                    )}
                    {medicine.company && <div className="text-xs text-gray-500">{medicine.company}</div>}
                  </div>
                  <div className="flex flex-col items-end text-xs text-gray-500">
                    {medicine.strength && (
                      <span className="bg-gray-100 px-2 py-1 rounded-full mb-1">{medicine.strength}</span>
                    )}
                    {medicine.form && <span className="text-gray-400">{medicine.form}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* رسالة عدم وجود نتائج */}
        {showSuggestions && !isLoading && value.length >= 2 && suggestions.length === 0 && (
          <motion.div
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <FaSearch className="text-gray-300 text-2xl mb-2" />
            <div>لا توجد أدوية تطابق البحث</div>
            <div className="text-xs text-gray-400 mt-1">جرب كتابة اسم مختلف أو تحقق من الإملاء</div>
          </motion.div>
        )}

        {/* رسالة البحث القصير */}
        {value.length > 0 && value.length < 2 && (
          <motion.div
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-400 text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <FaKeyboard className="text-gray-300 mr-2" />
            اكتب حرفين على الأقل للبحث
          </motion.div>
        )}
      </AnimatePresence>

      {/* معلومات الدواء المختار */}
      {selectedMedicine && value === selectedMedicine.name && <MedicineInfo medicine={selectedMedicine} />}
    </div>
  );
};

export default MedicineAutocomplete;
