// src/components/Search/LocationModal.jsx
import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTimes, FaCheckCircle, FaCheck } from "react-icons/fa";
import LocationPicker from "../LocationPicker";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
};

const LocationModal = ({
  isOpen,
  onClose,
  onLocationSelect,
  currentLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    if (currentLocation) {
      setSelectedLocation(currentLocation.coordinates || null);
      setLocationData(currentLocation);
    } else {
      setSelectedLocation({ lat: 30.0444, lng: 31.2357 });
      setLocationData(null);
    }
  }, [currentLocation]);

  const handleLocationChange = (location) => {
    setLocationData(location);
    if (location.coordinates) {
      setSelectedLocation(location.coordinates);
    }
  };

  const handleConfirm = () => {
    if (locationData && locationData.address) {
      localStorage.setItem(
        "selectedDeliveryLocation",
        JSON.stringify(locationData)
      );
      onLocationSelect(locationData);
    }
  };

  const handleCancel = () => {
    setSelectedLocation(currentLocation?.coordinates || null);
    setLocationData(currentLocation || null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
          />

          {/* modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* رأس المودال */}
              <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  <FaMapMarkerAlt className="ml-2" />
                  تحديد موقع التوصيل
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* محتوى المودال */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="mb-4">
                  <p className="text-gray-600 text-center">
                    اختر موقعك لعرض الصيدليات القريبة منك وتقدير أوقات التوصيل
                  </p>
                </div>

                <LocationPicker
                  onLocationChange={handleLocationChange}
                  initialLocation={selectedLocation || { lat: 30.0444, lng: 31.2357 }}
                  showTitle={false}
                  showMap={true}
                  showMapToggle={false}
                />

                {locationData && locationData.address && (
                  <motion.div
                    className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <FaCheckCircle className="ml-2" />
                      الموقع المحدد:
                    </h3>
                    <p className="text-blue-700">{locationData.address}</p>
                    {locationData.coordinates && (
                      <p className="text-sm text-blue-600 mt-1">
                        الإحداثيات: {locationData.coordinates.lat.toFixed(6)},{" "}
                        {locationData.coordinates.lng.toFixed(6)}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* أزرار التحكم */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!locationData || !locationData.address}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    locationData && locationData.address
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaCheck className="ml-2" />
                  تأكيد الموقع
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LocationModal;
