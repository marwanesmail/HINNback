import React from "react";
import {
  FaHeart,
  FaPills,
  FaShieldAlt,
  FaInfoCircle,
  FaFileMedical,
} from "react-icons/fa";

const PatientInfoSection = ({
  formData,
  handleInputChange,
  errors,
  medicalFile,
  handleFileUpload,
  renderFileUpload,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* الحقلين جنب بعض */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* الأمراض المزمنة */}
          <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-semibold text-gray-200">
              <div className="flex items-center">
                <FaHeart className="text-red-400 ml-2" />
                الأمراض المزمنة
              </div>
            </label>
            <textarea
              name="chronicDiseases"
              rows="4"
              value={formData.chronicDiseases || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
              placeholder="اذكر أي أمراض مزمنة تعاني منها (مثل: السكري، ضغط الدم، أمراض القلب، إلخ...)"
            ></textarea>
          </div>

          {/* الأدوية الحالية */}
          <div className="w-full md:w-1/2">
            <label className="block mb-2 text-sm font-semibold text-gray-200">
              <div className="flex items-center">
                <FaPills className="text-blue-400 ml-2" />
                الأدوية التي أتناولها حالياً
              </div>
            </label>
            <textarea
              name="currentMedications"
              rows="4"
              value={formData.currentMedications || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
              placeholder="اذكر جميع الأدوية والمكملات الغذائية التي تتناولها حالياً مع الجرعات"
            ></textarea>
          </div>
        </div>

        {/* الحساسية */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            <div className="flex items-center">
              <FaShieldAlt className="text-yellow-400 ml-2" />
              الحساسية
            </div>
          </label>
          <textarea
            name="allergies"
            rows="3"
            value={formData.allergies || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
            placeholder="اذكر أي حساسية لديك من أدوية أو أطعمة أو مواد أخرى"
          ></textarea>
        </div>

        {/* تحميل الملفات - مفعل إذا تم تمريره */}
        {/* 
        {renderFileUpload(
          medicalFile,
          "medical",
          "التحاليل أو الأشعة الأخيرة (اختياري)",
          null
        )} 
        */}

        {/* المعلومة المهمة */}
        {/* <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
              <FaInfoCircle className="text-blue-300" />
            </div>
            <div>
              <h5 className="font-bold text-blue-200 mb-2">معلومة مهمة</h5>
              <p className="text-blue-300 text-sm leading-relaxed">
                جميع المعلومات الطبية التي تقدمها محمية وسرية، وستستخدم فقط
                لتحسين الرعاية الطبية المقدمة لك. نحن نلتزم بأعلى معايير
                الخصوصية والأمان.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PatientInfoSection;
