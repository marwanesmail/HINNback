import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaPills,
  FaBuilding,
  FaUser,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaArrowRight,
  FaFileMedical,
  FaCloudUploadAlt,
  FaFile,
  FaCheck,
  FaHeart,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Swal from "sweetalert2";

// Import the new components
import BasicInfoSection from "./signup/BasicInfoSection";
import PatientInfoSection from "./signup/PatientInfoSection";
import DoctorInfoSection from "./signup/DoctorInfoSection";
import PharmacyInfoSection from "./signup/PharmacyInfoSection";
import CompanyInfoSection from "./signup/CompanyInfoSection";
import PharmacyBasicInfoSection from "./signup/PharmacyBasicInfoSection";
import DoctorDocumentsSection from "./signup/DoctorDocumentsSection";
import CompanyDocumentsSection from "./signup/CompanyDocumentsSection";

// Add a simplified navbar component for signup page
const SignupNavbar = ({ title = "إنشاء حساب جديد" }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <motion.div
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md"
              >
                <FaUserPlus className="text-white text-lg" />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex flex-col"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Home Button */}
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleGoHome}
              className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm"
            >
              <FaUserMd className="ml-2" />
              <span className="font-medium">الصفحة الرئيسية</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    // Doctor fields
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    // Pharmacy fields
    pharmacyName: "",
    pharmacyPhone: "",
    openingHours: "",
    deliveryArea: "",
    // Company fields
    companyName: "",
    companyActivityType: "",
    companyAddress: "",
    // Patient fields
    age: "",
    gender: "",
    weight: "",
    height: "",
    bloodType: "",
    chronicDiseases: "",
    currentMedications: "",
    allergies: "",
  });

  const [medicalFile, setMedicalFile] = useState(null);
  const [commercialRegFile, setCommercialRegFile] = useState(null);
  const [taxCardFile, setTaxCardFile] = useState(null);
  const [pharmacyLicenseFile, setPharmacyLicenseFile] = useState(null);
  
  // Doctor document files
  const [doctorDocuments, setDoctorDocuments] = useState({
    nationalId: null,
    medicalLicense: null,
    syndicateMembership: null,
    medicalTraining: null,
    photoProof: null,
    additionalCertificates: null,
  });
  
  // Company document files
  const [companyDocuments, setCompanyDocuments] = useState({
    commercialReg: null,
    taxCard: null,
    activityLicense: null,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const selectUserType = (type) => {
    setSelectedUserType(type);
    setErrors({});
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "حجم الملف كبير جداً",
          text: "يجب ألا يتجاوز حجم الملف 5 ميجا بايت",
        });
        return;
      }

      switch (fileType) {
        case "medical":
          setMedicalFile(file);
          break;
        case "commercialReg":
          setCommercialRegFile(file);
          break;
        case "taxCard":
          setTaxCardFile(file);
          break;
        case "pharmacyLicense":
          setPharmacyLicenseFile(file);
          break;
        // Doctor documents
        case "nationalId":
        case "medicalLicense":
        case "universityDegree":
        case "medicalCertificate":
        case "syndicateMembership":
        case "medicalTraining":
        case "photoProof":
        case "additionalCertificates":
          setDoctorDocuments((prev) => ({ ...prev, [fileType]: file }));
          break;
        // Company documents
        case "companyCommercialReg":
        case "companyTaxCard":
        case "companyActivityLicense":
          setCompanyDocuments((prev) => ({
            ...prev,
            [fileType.replace("company", "").charAt(0).toLowerCase() +
              fileType.replace("company", "").slice(1)]: file,
          }));
          break;
        default:
          break;
      }
    }
  };

  const getTotalSteps = () => {
    switch (selectedUserType) {
      case "patient":
        return 4; // اختيار نوع + أساسية + إضافية + طبية
      case "doctor":
        return 4; // اختيار نوع + أساسية + إضافية + مستندات
      case "pharmacy":
        return 4; // اختيار نوع + أساسية + إضافية + وثائق رسمية
      case "company":
        return 4; // اختيار نوع + أساسية + إضافية + وثائق رسمية
      default:
        return 3; // اختيار نوع + أساسية + إضافية
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (step === 2) {
      // Basic info validation
      if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
      if (!formData.username.trim()) newErrors.username = "اسم المستخدم مطلوب";
      else if (formData.username.length < 3)
        newErrors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
      if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "البريد الإلكتروني غير صحيح";
      if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
      else if (!/^[0-9]{10,11}$/.test(formData.phone))
        newErrors.phone = "رقم الهاتف غير صحيح";
      if (!formData.password) newErrors.password = "كلمة المرور مطلوبة";
      else if (formData.password.length < 6)
        newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    } else if (step === 3 && selectedUserType === "patient") {
      // Patient additional info validation
      if (!formData.age) newErrors.age = "العمر مطلوب";
    } else if (step === 3 && selectedUserType === "doctor") {
      // Doctor info validation
      if (!formData.yearsOfExperience)
        newErrors.yearsOfExperience = "عدد سنوات الخبرة مطلوب";
    } else if (step === 4 && selectedUserType === "doctor") {
      // Doctor documents validation
      if (!doctorDocuments.nationalId)
        newErrors.nationalId = "صورة بطاقة الهوية مطلوبة";
      if (!doctorDocuments.medicalLicense)
        newErrors.medicalLicense = "رخصة مزاولة المهنة مطلوبة";
      if (!doctorDocuments.syndicateMembership)
        newErrors.syndicateMembership = "صورة عضوية النقابة مطلوبة";
      if (!doctorDocuments.medicalTraining)
        newErrors.medicalTraining = "شهادات التخرج الطبي مطلوبة";
    } else if (step === 4 && selectedUserType === "pharmacy") {
      // Official documents validation for pharmacies
      if (!commercialRegFile)
        newErrors.commercialRegFile = "صورة السجل التجاري مطلوبة";
      if (!taxCardFile) newErrors.taxCardFile = "صورة البطاقة الضريبية مطلوبة";
      if (!pharmacyLicenseFile)
        newErrors.pharmacyLicenseFile = "صورة رخصة الصيدلية مطلوبة";
    } else if (step === 4 && selectedUserType === "company") {
      // Company documents validation
      if (!companyDocuments.commercialReg)
        newErrors.companyCommercialReg = "صورة السجل التجاري مطلوبة";
      if (!companyDocuments.taxCard)
        newErrors.companyTaxCard = "صورة البطاقة الضريبية مطلوبة";
      if (!companyDocuments.activityLicense)
        newErrors.companyActivityLicense = "رقم مزاولة النشاط مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: ربط مع API هنا - POST /api/auth/signup
      // نوع البيانات المطلوبة: { fullName, username, email, phone, password, userType, additionalInfo }
      // Headers: Content-Type: application/json
      // البيانات الراجعة: { token, user: { id, name, email, userType } }
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const userData = {
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        userType: selectedUserType,
        signupTime: new Date().toISOString(),
        additionalInfo: formData,
        medicalFile:
          selectedUserType === "patient"
            ? {
                age: formData.age,
                gender: formData.gender,
                weight: formData.weight,
                height: formData.height,
                bloodType: formData.bloodType,
                chronicDiseases: formData.chronicDiseases,
                currentMedications: formData.currentMedications,
                allergies: formData.allergies,
                uploadedFile: medicalFile,
              }
            : null,
        officialDocuments:
          selectedUserType === "pharmacy"
            ? {
                commercialReg: commercialRegFile,
                taxCard: taxCardFile,
                pharmacyLicense: pharmacyLicenseFile,
              }
            : null,
      };

      // Save to localStorage for patients
      if (selectedUserType === "patient") {
        localStorage.setItem(
          "patientMedicalFile",
          JSON.stringify(userData.medicalFile)
        );
        localStorage.setItem(
          "patientBasicInfo",
          JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          })
        );
      }

      login(userData);

      let signupMessages = {
        doctor: {
          title: "تم إنشاء الحساب بنجاح!",
          text: "مرحباً بك دكتور، تم تجهيز لوحة التحكم الخاصة بك.",
        },
        pharmacy: {
          title: "تم إنشاء الحساب بنجاح! ",
          text: "مرحباً بك صيدلي، تم تفعيل حسابك على المنصة.",
        },
        company: {
          title: "تم إنشاء الحساب بنجاح! ",
          text: "مرحباً بك شركة، يمكنك الآن إدارة منتجاتك.",
        },
        patient: {
          title: "تم إنشاء الحساب بنجاح!",
          text: "تم حفظ ملفك الطبي بأمان.",
        },
      };

      Swal.fire({
        title:
          signupMessages[selectedUserType]?.title || "تم إنشاء الحساب بنجاح!",
        text:
          signupMessages[selectedUserType]?.text || "مرحباً بك في منصة هيِّن",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      }).then(() => {
        switch (selectedUserType) {
          case "doctor":
            navigate("/doctor-dashboard");
            break;
          case "pharmacy":
            navigate("/pharmacy-dashboard");
            break;
          case "company":
            navigate("/company-dashboard");
            break;
          case "patient":
            navigate("/");
            break;
          default:
            navigate("/");
            break;
        }
      });
    } catch (error) {
      setErrors({ general: "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى." });
    } finally {
      setIsLoading(false);
    }
  };

  const UserTypeIcon = ({ type }) => {
    const base = "text-3xl mb-2 mx-auto";
    switch (type) {
      case "doctor":
        return <FaUserMd className={`${base} text-blue-400`} />;
      case "pharmacy":
        return <FaPills className={`${base} text-green-400`} />;
      case "company":
        return <FaBuilding className={`${base} text-gray-800`} />;
      case "patient":
        return <FaUser className={`${base} text-purple-400`} />;
      default:
        return null;
    }
  };

  const userTypes = [
    {
      type: "patient",
      label: "مريض",
      // description: "متابعة الوصفات",
      gradient: "from-orange-400 to-red-500",
    },
    {
      type: "doctor",
      label: "طبيب",
      // description: "إدارة الوصفات الطبية",
      gradient: "from-emerald-400 to-cyan-600",
    },
    {
      type: "pharmacy",
      label: "صيدلية",
      // description: "تنفيذ الوصفات الطبية",
      gradient: "from-blue-400 to-indigo-600",
    },
    {
      type: "company",
      label: "شركة أدوية",
      // description: "توريد الأدوية",
      gradient: "from-purple-400 to-pink-600",
    },
  ];

  const getStepTitle = () => {
    if (step === 1) return "اختر نوع حسابك";
    if (step === 2) return "المعلومات الأساسية";
    if (step === 3) return "معلومات إضافية";
    if (step === 4) {
      if (selectedUserType === "patient") return "البيانات الطبية";
      if (selectedUserType === "pharmacy") return "الوثائق الرسمية";
      if (selectedUserType === "doctor") return "الوثائق الرسمية";
      if (selectedUserType === "company") return "الوثائق الرسمية";
    }
    return "";
  };

  const renderProgressBar = () => {
    if (step === 1) return null;

    const totalSteps = getTotalSteps();
    const currentStep = step - 1; // Exclude user type selection from progress

    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 mb-0">
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          {Array.from({ length: totalSteps - 1 }).map((_, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= index + 1
                    ? "bg-white border-white text-blue-600"
                    : "border-blue-300 text-blue-200"
                }`}
              >
                {currentStep > index + 1 ? (
                  <FaCheck className="text-sm" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </motion.div>
              {index < totalSteps - 2 && (
                <div
                  className={`w-16 h-1 transition-all duration-300 ${
                    currentStep >= index + 2 ? "bg-white" : "bg-blue-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="text-center mt-4">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/90 text-sm"
          >
            {getStepTitle()}
          </motion.p>
        </div>
      </div>
    );
  };

 const renderFileUpload = (fileState, fileType, label, error) => (
  <div className="w-full">
    <label className="block mb-1 text-sm font-semibold text-gray-200">{label}</label>

    <div
      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 ${
        error
          ? "border-red-500 hover:border-red-400"
          : "border-gray-600 hover:border-blue-400 hover:bg-blue-500/10"
      }`}
    >
      <input
        type="file"
        id={fileType}
        onChange={(e) => handleFileUpload(e, fileType)}
        accept="image/*,application/pdf"
        className="hidden"
      />

      <label htmlFor={fileType} className="cursor-pointer flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full flex items-center justify-center mb-3">
          <FaCloudUploadAlt className="text-blue-300 text-xl" />
        </div>
        <span className="text-gray-300 font-medium mb-1 text-xs">
          اضغط لاختيار ملف أو اسحبه هنا
        </span>
        <span className="text-[11px] text-gray-400">
          {fileType === "medical" ? "PDF, JPG, PNG, DOC" : "JPG, PNG, PDF"} (حد أقصى 5 ميغا بايت)
        </span>
      </label>

      {fileState && (
        <div className="mt-4 p-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
          <div className="flex items-center justify-center">
            <FaFile className="text-green-300 ml-2 text-base" />
            <span className="text-green-200 text-xs font-medium">{fileState.name}</span>
          </div>
        </div>
      )}
    </div>

    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black relative overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      >
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
      </motion.div>

      <SignupNavbar title="إنشاء حساب جديد" />

      <div className="flex-1 flex items-center justify-center px-4 relative z-10 overflow-hidden">
        <div className="w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            {renderProgressBar()}

            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: User Type Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-center text-2xl font-bold text-white mb-6">
                      اختر نوع حسابك
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {userTypes.map((userType) => (
                        <motion.div
                          key={userType.type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => selectUserType(userType.type)}
                          className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-2xl text-center text-white transition-all duration-300 shadow-2xl shadow-blue-600/80"
                        >
                          <UserTypeIcon type={userType.type} />
                          <h4 className="font-bold text-lg">
                            {userType.label}
                          </h4>
                        </motion.div>
                      ))}
                    </div>
                    {/* النص تحت نوع الحساب */}
                    <p className="text-gray-300 mt-6 text-center">
                      لديك حساب بالفعل؟{" "}
                      <Link
                        to="/login"
                        className="text-blue-400 hover:text-blue-500 font-bold transition-colors duration-200"
                      >
                        تسجيل الدخول
                      </Link>
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Basic Information */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <BasicInfoSection
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      showConfirmPassword={showConfirmPassword}
                      setShowConfirmPassword={setShowConfirmPassword}
                    />
                  </motion.div>
                )}

                {/* Step 3: Additional Information */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    {selectedUserType === "patient" && (
                      <div className="space-y-6">
                        {/* الصف الأول: العمر والنوع */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-200">
                              العمر *
                            </label>
                            <input
                              type="number"
                              name="age"
                              value={formData.age || ""}
                              onChange={handleInputChange}
                              min="1"
                              max="120"
                              className={`w-full px-4 py-3 bg-white/10 border ${
                                errors.age ? "border-red-500" : "border-white/20"
                              } rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400`}
                              placeholder="أدخل عمرك"
                              required
                            />
                            {errors.age && (
                              <p className="text-red-400 text-xs mt-1">{errors.age}</p>
                            )}
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-200">
                              النوع
                            </label>
                            <select
                              name="gender"
                              value={formData.gender || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3  bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100"
                            >
                              <option value="" className="text-black">
                                اختر النوع
                              </option>
                              <option value="male" className="text-black">
                                ذكر
                              </option>
                              <option value="female" className="text-black">
                                أنثى
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* الصف الثاني: الطول والوزن */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-200">
                              الطول (سم)
                            </label>
                            <input
                              type="number"
                              name="height"
                              value={formData.height || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
                              placeholder="الطول بالسنتيمتر"
                            />
                          </div>

                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-200">
                              الوزن (كجم)
                            </label>
                            <input
                              type="number"
                              name="weight"
                              value={formData.weight || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100 placeholder-gray-400"
                              placeholder="الوزن بالكيلوجرام"
                            />
                          </div>
                        </div>

                        {/* الصف الثالث: فصيلة الدم   */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                          <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-200">
                              فصيلة الدم
                            </label>
                            <select
                              name="bloodType"
                              value={formData.bloodType || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 text-gray-100"
                            >
                              <option value="" className="text-black">
                                اختر فصيلة الدم
                              </option>
                              <option value="A+" className="text-black">
                                A+
                              </option>
                              <option value="A-" className="text-black">
                                A-
                              </option>
                              <option value="B+" className="text-black">
                                B+
                              </option>
                              <option value="B-" className="text-black">
                                B-
                              </option>
                              <option value="O+" className="text-black">
                                O+
                              </option>
                              <option value="O-" className="text-black">
                                O-
                              </option>
                              <option value="AB+" className="text-black">
                                AB+
                              </option>
                              <option value="AB-" className="text-black">
                                AB-
                              </option>
                            </select>
                          </div>

                        </div>
                      </div>
                    )}

                    {selectedUserType === "doctor" && (
                      <DoctorInfoSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                      />
                    )}

                    {selectedUserType === "pharmacy" && (
                      <PharmacyBasicInfoSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                      />
                    )}

                    {selectedUserType === "company" && (
                      <CompanyInfoSection
                        formData={formData}
                        handleInputChange={handleInputChange}
                      />
                    )}
                  </motion.div>
                )}

                {/* Step 4: Medical Information (Patient only) */}
                {step === 4 && selectedUserType === "patient" && (
                  <motion.div
                    key="step4-patient"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <PatientInfoSection
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      medicalFile={medicalFile}
                      handleFileUpload={handleFileUpload}
                      renderFileUpload={renderFileUpload}
                    />
                  </motion.div>
                )}

                {/* Step 4: Doctor Documents (Doctor only) */}
                {step === 4 && selectedUserType === "doctor" && (
                  <motion.div
                    key="step4-doctor"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <DoctorDocumentsSection
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      documentFiles={doctorDocuments}
                      handleFileUpload={handleFileUpload}
                    />
                  </motion.div>
                )}

                {/* Step 4: Official Documents (Pharmacy only) */}
                {step === 4 && selectedUserType === "pharmacy" && (
                  <motion.div
                    key="step4-pharmacy"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <PharmacyInfoSection
                      errors={errors}
                      commercialRegFile={commercialRegFile}
                      taxCardFile={taxCardFile}
                      pharmacyLicenseFile={pharmacyLicenseFile}
                      handleFileUpload={handleFileUpload}
                    />
                  </motion.div>
                )}

                {/* Step 4: Official Documents (Company only) */}
                {step === 4 && selectedUserType === "company" && (
                  <motion.div
                    key="step4-company"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CompanyDocumentsSection
                      errors={errors}
                      companyDocuments={companyDocuments}
                      handleFileUpload={handleFileUpload}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              {step > 1 && (
                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-6 py-3 bg-gray-500/30 hover:bg-gray-500/50 text-white rounded-2xl transition-all duration-300 font-medium"
                  >
                    <FaArrowRight className="ml-2" />
                    السابق
                  </motion.button>

                  {step < getTotalSteps() ? (
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold"
                    >
                      <FaArrowLeft className="ml-2" />
                      التالي
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.05 }}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                      className={`flex items-center px-10 py-3 rounded-2xl font-bold transition-all duration-300 ${
                        isLoading
                          ? "bg-gray-500/40 cursor-not-allowed text-gray-300"
                          : "bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white hover:shadow-2xl"
                      }`}
                    >
                      {isLoading ? (
                        <motion.div className="rounded-full h-5 w-5 border-2 border-white border-t-transparent animate-spin ml-2" />
                      ) : (
                        <FaUserPlus className="ml-2" />
                      )}
                      {isLoading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;
