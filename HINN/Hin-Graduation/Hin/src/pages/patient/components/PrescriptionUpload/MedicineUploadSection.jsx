import React from "react";
import { FaCloudUploadAlt, FaTimes, FaUpload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const MedicineUploadSection = ({
  selectedFile,
  showPreview,
  handleFileChange,
  setSelectedFile,
  setShowPreview,
}) => {
  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div // Make the entire upload area animatable
        className={`upload-area p-4 text-center cursor-pointer ${
          selectedFile ? "active" : ""
        }`}
        onClick={() => document.getElementById("file-upload").click()}
        whileHover={{ scale: 1.01, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }} // Slight lift and shadow on hover
        whileTap={{ scale: 0.99 }} // Slight press effect on click
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center">
          <motion.div // Animate the icon container
            className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FaCloudUploadAlt className="text-2xl text-indigo-600" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ارفع صورة الروشتة
          </h3>
          <p className="text-gray-600 mb-4">PNG, JPG, JPEG حتى 10MB</p>
          <motion.button // Animate the "Choose File" button
            type="button"
            className="secondary-button px-6 py-2"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById("file-upload").click();
            }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            
          </motion.button>
        </div>
      </motion.div>

      {/* Image Preview */}
      <AnimatePresence>
        {showPreview && selectedFile && (
          <motion.div
            key="image-preview" // Unique key for AnimatePresence
            initial={{ opacity: 0, y: 20, scale: 0.95 }} // Initial state (hidden, slightly lower, smaller)
            animate={{ opacity: 1, y: 0, scale: 1 }} // Animation when it appears
            exit={{ opacity: 0, y: -20, scale: 0.95 }} // Animation when it disappears
            transition={{ duration: 0.3 }}
            className="mt-4 relative"
          >
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="معاينة الروشتة"
              className="rounded-xl shadow-lg border border-gray-200 max-h-80 w-full object-contain"
            />
            <motion.button // Animate the remove button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setSelectedFile(null);
                setShowPreview(false);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }} // Scale up and rotate on hover
              whileTap={{ scale: 0.9 }} // Scale down on click
            >
              <FaTimes className="text-sm" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicineUploadSection;