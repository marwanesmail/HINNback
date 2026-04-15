import React from 'react';
import { FaTag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MedicineInfo = ({ medicine, className = "" }) => {
  if (!medicine) return null;

  return (
    <AnimatePresence>
      {medicine && (
        <motion.div
          className={`bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2 ${className}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 text-sm">{medicine.name}</h4>

              {medicine.genericName && medicine.genericName !== medicine.name && (
                <p className="text-blue-700 text-xs mt-1">
                  <span className="font-medium">الاسم العلمي:</span> {medicine.genericName}
                </p>
              )}

              {medicine.company && (
                <p className="text-blue-600 text-xs mt-1">
                  <span className="font-medium">الشركة:</span> {medicine.company}
                </p>
              )}

              {medicine.description && (
                <p className="text-blue-600 text-xs mt-1">{medicine.description}</p>
              )}
            </div>

            <div className="flex flex-col items-end text-xs text-blue-600 ml-3">
              {medicine.strength && (
                <span className="bg-blue-100 px-2 py-1 rounded-full mb-1 font-medium">
                  {medicine.strength}
                </span>
              )}
              {medicine.form && <span className="text-blue-500">{medicine.form}</span>}
            </div>
          </div>

          {medicine.category && (
            <div className="mt-2 pt-2 border-t border-blue-200">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                <FaTag className="mr-1" />
                {medicine.category}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicineInfo;
