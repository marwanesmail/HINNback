import React from "react";

const CompanyDocumentsSection = ({
  errors,
  companyDocuments,
  handleFileUpload,
}) => {
  const renderDocumentUpload = (file, fileKey, label, required = true) => {
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
      <h3 className="text-red-400 font-bold text-lg mb-4">
        مستندات مطلوبة للتوثيق
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* صورة السجل التجاري */}
        {renderDocumentUpload(
          companyDocuments?.commercialReg,
          "companyCommercialReg",
          "صورة السجل التجاري للشركة",
          true
        )}

        {/* صورة البطاقة الضريبية */}
        {renderDocumentUpload(
          companyDocuments?.taxCard,
          "companyTaxCard",
          "صورة البطاقة الضريبية",
          true
        )}

        {/* رقم مزاولة النشاط */}
        {renderDocumentUpload(
          companyDocuments?.activityLicense,
          "companyActivityLicense",
          "رقم مزاولة النشاط أو التصريح الرسمي",
          true
        )}
      </div>
    </div>
  );
};

export default CompanyDocumentsSection;
