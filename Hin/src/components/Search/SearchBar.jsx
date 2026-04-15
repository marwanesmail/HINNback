// src/components/Search/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LocationModal from './LocationModal';

const SearchBar = ({ onSearch, onLocationChange, selectedLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const searchInputRef = useRef(null);

  // تنفيذ البحث المباشر عند تغيير النص
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(searchQuery.trim());
      } else {
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, onSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setShowLocationModal(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <>
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            className="flex flex-col lg:flex-row gap-4 items-center"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {/* شريط البحث */}
            <motion.div
              className="flex-1 relative"
              variants={{
                hidden: { opacity: 0, x: 30 },
                show: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="ابحث عن الأدوية والمنتجات الطبية..."
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* اختيار الموقع */}
            <motion.div
              className="flex items-center gap-2"
              variants={{
                hidden: { opacity: 0, x: -30 },
                show: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <FaMapMarkerAlt className="text-blue-600" />
              <span className="text-gray-700 font-medium">توصيل إلى:</span>
              <button
                onClick={() => setShowLocationModal(true)}
                className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors duration-200"
              >
                {selectedLocation ? selectedLocation.address : 'حدد موقعك'}
              </button>
            </motion.div>
          </motion.div>

          {/* مؤشر البحث */}
          {searchQuery && (
            <motion.div
              className="mt-2 text-sm text-gray-600 flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <FaSearch className="text-gray-500" />
              <span>البحث عن: "{searchQuery}"</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* مودال اختيار الموقع */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={selectedLocation}
      />
    </>
  );
};

export default SearchBar;
