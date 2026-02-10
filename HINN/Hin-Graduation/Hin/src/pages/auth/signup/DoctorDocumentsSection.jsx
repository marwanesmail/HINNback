import React from "react";
import { motion } from "framer-motion";

const DoctorDocumentsSection = ({
  formData,
  handleInputChange,
  errors,
  documentFiles,
  handleFileUpload,
}) => {
  const renderDocumentUpload = (fileKey, label, required = true) => {
    const file = documentFiles[fileKey];
    const error = errors[fileKey];

    return (
      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold text-gray-200">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            id={fileKey}
            onChange={(e) => handleFileUpload(e, fileKey)}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <label
            htmlFor={fileKey}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Choose File
          </label>
          <span className="text-sm text-gray-400">
            {file ? file.name : 'No file chosen'}
          </span>
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <h3 className="text-red-400 font-bold text-lg mb-4">
        مستندات مطلوبة للتوثيق
      </h3>

      {/* Documents Grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* صورة بطاقة الهوية الشخصية */}
        {renderDocumentUpload(
          "nationalId",
          "صورة البطاقة الشخصية",
          true
        )}

        {/* صورة رخصة مزاولة المهنة */}
        {renderDocumentUpload(
          "medicalLicense",
          "صورة رخصة مزاولة المهنة",
          true
        )}

        {/* صورة عضوية النقابة */}
        {renderDocumentUpload(
          "syndicateMembership",
          "صورة عضوية النقابة",
          true
        )}

        {/* شهادات التدريب الطبي */}
        {renderDocumentUpload(
          "medicalTraining",
          "شهادات التخرج الطبي",
          true
        )}

      </div>
    </div>
  );
};

export default DoctorDocumentsSection;
