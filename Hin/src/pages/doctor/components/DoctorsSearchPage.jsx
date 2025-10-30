// src/pages/DoctorsSearchPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserMd, FaStar, FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.12)" },
};

// Doctor Card
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    Swal.fire({
      html: `
        <div style="text-align:right; direction:rtl">
          <h3 style="font-size:22px; font-weight:bold; margin-bottom:10px;">${doctor.name}</h3>
          <p><strong>التخصص:</strong> ${doctor.specialty}</p>
          <p><strong>العنوان:</strong> ${doctor.address}</p>
          <p><strong>الخبرة:</strong> ${doctor.experience}</p>
          <p><strong>سعر الكشف:</strong> ${doctor.consultationFee} جنيه</p>
          <p style="margin-top:15px; padding:10px; background-color:#f0f9ff; border-radius:8px;"><strong>معلومات عن الدكتور:</strong> ${doctor.description}</p>
        </div>
      `,
      confirmButtonText: "إغلاق",
    });
  };

  const handleBookNow = () => {
    navigate(`/book-appointment/${doctor.id}`);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 cursor-pointer flex flex-col items-center"
    >
      {/* صورة الطبيب */}
      <img 
        src={doctor.image || "https://via.placeholder.com/96"} 
        alt={doctor.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4"
      />

      {/* الاسم + التخصص */}
      <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
      <p className="text-gray-600 mb-2">{doctor.specialty}</p>

      {/* التقييم */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm ${
              i < Math.floor(doctor.rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-gray-600 text-sm mr-2">
          ({doctor.reviewsCount})
        </span>
      </div>

      {/* أزرار */}
      <div className="flex gap-2 w-full">
        <button
          onClick={handleViewDetails}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          عرض التفاصيل
        </button>
        <button
          onClick={handleBookNow}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          احجز الآن
        </button>
      </div>
    </motion.div>
  );
};

const DoctorsSearchPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("جميع التخصصات");
  const [selectedCity, setSelectedCity] = useState("جميع المدن");
  const [sortBy, setSortBy] = useState("rating");

  // Initialize doctors data from localStorage or use default data
  useEffect(() => {
    // هنا هيكون ربط بالباك اند بعدين
    // البيانات التالية سيتم استبدالها بطلب API فعلي في المستقبل
    const defaultDoctors = [
      {
        id: 1,
        name: "د. أحمد محمد علي",
        specialty: "طب القلب",
        experience: "15 سنة",
        rating: 4.8,
        reviewsCount: 127,
        address: "شارع التحرير، القاهرة",
        phone: "+20 12 345 6789",
        email: "ahmed.ali@clinic.com",
        image: "/images/doctors/doctor1.jpg",
        clinicImages: [
          "/images/clinics/clinic1-1.jpg",
          "/images/clinics/clinic1-2.jpg",
        ],
        description:
          "استشاري أمراض القلب والأوعية الدموية، خبرة واسعة في علاج أمراض القلب المختلفة",
        education:
          "بكالوريوس الطب - جامعة القاهرة، ماجستير أمراض القلب - جامعة عين شمس",
        languages: ["العربية", "الإنجليزية"],
        consultationFee: 300,
        availableDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
        workingHours: {
          start: "09:00",
          end: "17:00",
        },
        appointmentDuration: 30, // minutes
        isAvailable: true,
      },
      {
        id: 2,
        name: "د. فاطمة حسن",
        specialty: "طب الأطفال",
        experience: "12 سنة",
        rating: 4.9,
        reviewsCount: 89,
        address: "شارع الجمهورية، الإسكندرية",
        phone: "+20 11 234 5678",
        email: "fatma.hassan@clinic.com",
        image: "/images/doctors/doctor2.jpg",
        clinicImages: [
          "/images/clinics/clinic2-1.jpg",
          "/images/clinics/clinic2-2.jpg",
        ],
        description:
          "استشارية طب الأطفال وحديثي الولادة، متخصصة في رعاية الأطفال من الولادة حتى 18 سنة",
        education:
          "بكالوريوس الطب - جامعة الإسكندرية، دكتوراه طب الأطفال - جامعة القاهرة",
        languages: ["العربية", "الإنجليزية", "الفرنسية"],
        consultationFee: 250,
        availableDays: ["saturday", "sunday", "monday", "tuesday", "wednesday"],
        workingHours: {
          start: "10:00",
          end: "18:00",
        },
        appointmentDuration: 25,
        isAvailable: true,
      },
      {
        id: 3,
        name: "د. محمد عبد الرحمن",
        specialty: "طب العظام",
        experience: "18 سنة",
        rating: 4.7,
        reviewsCount: 156,
        address: "شارع النيل، الجيزة",
        phone: "+20 10 987 6543",
        email: "mohamed.abdelrahman@clinic.com",
        image: "/images/doctors/doctor3.jpg",
        clinicImages: [
          "/images/clinics/clinic3-1.jpg",
          "/images/clinics/clinic3-2.jpg",
        ],
        description:
          "استشاري جراحة العظام والمفاصل، متخصص في جراحات الركبة والكتف",
        education:
          "بكالوريوس الطب - جامعة عين شمس، زمالة جراحة العظام - ألمانيا",
        languages: ["العربية", "الإنجليزية", "الألمانية"],
        consultationFee: 400,
        availableDays: ["sunday", "tuesday", "thursday"],
        workingHours: {
          start: "11:00",
          end: "16:00",
        },
        appointmentDuration: 45,
        isAvailable: true,
      },
      {
        id: 4,
        name: "د. سارة أحمد",
        specialty: "طب النساء والتوليد",
        experience: "10 سنة",
        rating: 4.6,
        reviewsCount: 98,
        address: "شارع الهرم، الجيزة",
        phone: "+20 12 876 5432",
        email: "sara.ahmed@clinic.com",
        image: "/images/doctors/doctor4.jpg",
        clinicImages: [
          "/images/clinics/clinic4-1.jpg",
          "/images/clinics/clinic4-2.jpg",
        ],
        description:
          "استشارية أمراض النساء والتوليد، متخصصة في متابعة الحمل والولادة الطبيعية",
        education:
          "بكالوريوس الطب - جامعة القاهرة، ماجستير النساء والتوليد - جامعة عين شمس",
        languages: ["العربية", "الإنجليزية"],
        consultationFee: 280,
        availableDays: ["saturday", "monday", "wednesday", "thursday"],
        workingHours: {
          start: "09:30",
          end: "17:30",
        },
        appointmentDuration: 30,
        isAvailable: true,
      },
      {
        id: 5,
        name: "د. خالد محمود",
        specialty: "طب الجلدية",
        experience: "8 سنة",
        rating: 4.5,
        reviewsCount: 73,
        address: "شارع المعز، القاهرة",
        phone: "+20 11 765 4321",
        email: "khaled.mahmoud@clinic.com",
        image: "/images/doctors/doctor5.jpg",
        clinicImages: [
          "/images/clinics/clinic5-1.jpg",
          "/images/clinics/clinic5-2.jpg",
        ],
        description:
          "استشاري الأمراض الجلدية والتناسلية، متخصص في علاج الأمراض الجلدية المزمنة",
        education:
          "بكالوريوس الطب - جامعة الأزهر، دبلوم الأمراض الجلدية - إنجلترا",
        languages: ["العربية", "الإنجليزية"],
        consultationFee: 200,
        availableDays: [
          "saturday",
          "sunday",
          "tuesday",
          "wednesday",
          "thursday",
        ],
        workingHours: {
          start: "10:00",
          end: "19:00",
        },
        appointmentDuration: 20,
        isAvailable: true,
      },
    ];

    const defaultSpecialties = [
      "جميع التخصصات",
      "طب القلب",
      "طب الأطفال",
      "طب العظام",
      "طب النساء والتوليد",
      "طب الجلدية",
      "طب العيون",
      "طب الأنف والأذن والحنجرة",
      "طب الأسنان",
      "الطب النفسي",
      "طب الباطنة",
    ];

    const defaultCities = [
      "جميع المدن",
      "القاهرة",
      "الإسكندرية",
      "الجيزة",
      "شبرا الخيمة",
      "بورسعيد",
      "السويس",
      "الأقصر",
      "أسوان",
      "المنصورة",
      "طنطا",
    ];

    // Save default data to localStorage if not exists
    if (!localStorage.getItem("doctors")) {
      localStorage.setItem("doctors", JSON.stringify(defaultDoctors));
    }

    if (!localStorage.getItem("specialties")) {
      localStorage.setItem("specialties", JSON.stringify(defaultSpecialties));
    }

    if (!localStorage.getItem("cities")) {
      localStorage.setItem("cities", JSON.stringify(defaultCities));
    }

    // Load data from localStorage
    const storedDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    setDoctors(storedDoctors);
    setFilteredDoctors(storedDoctors);
  }, []);

  // Search doctors function - هنا هيكون ربط بالباك اند بعدين
  const searchDoctors = (query) => {
    // في المستقبل سيتم استبدال هذا بطلب API فعلي
    const searchTerm = query.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.address.toLowerCase().includes(searchTerm)
    );
  };

  // Filter doctors based on search criteria
  useEffect(() => {
    let result = doctors;

    if (searchQuery.trim()) result = searchDoctors(searchQuery);
    if (selectedSpecialty !== "جميع التخصصات")
      result = result.filter((d) => d.specialty === selectedSpecialty);
    if (selectedCity !== "جميع المدن")
      result = result.filter((d) => d.address.includes(selectedCity));

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return parseInt(b.experience) - parseInt(a.experience);
        case "price-low":
          return a.consultationFee - b.consultationFee;
        case "price-high":
          return b.consultationFee - a.consultationFee;
        case "name":
          return a.name.localeCompare(b.name, "ar");
        default:
          return 0;
      }
    });

    setFilteredDoctors(result);
  }, [searchQuery, selectedSpecialty, selectedCity, sortBy, doctors]);

  // Load specialties and cities from localStorage
  const specialties = JSON.parse(
    localStorage.getItem("specialties") || '["جميع التخصصات"]'
  );
  const cities = JSON.parse(localStorage.getItem("cities") || '["جميع المدن"]');

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("جميع التخصصات");
    setSelectedCity("جميع المدن");
    setSortBy("rating");
    Swal.fire({
      icon: "success",
      title: "تم مسح الفلاتر",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b"
        variants={cardVariants}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
احجز دكتورك الآن         </h1>
          <p className="text-gray-600">
رعاية صحية لحياة أفضل ليك</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="max-w-7xl mx-auto px-4 mt-6 mb-8"
        variants={cardVariants}
      >
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <input
                type="text"
                placeholder="ابحث بالاسم أو التخصص أو المنطقة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="experience">الأكثر خبرة</option>
              <option value="price-low">الأقل سعراً</option>
              <option value="price-high">الأعلى سعراً</option>
              <option value="name">الاسم (أ-ي)</option>
            </select>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center"
            >
              <FaTimes className="ml-2" /> مسح الفلاتر
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {filteredDoctors.length === 0 ? (
          <motion.div
            className="text-center py-12 col-span-full"
            variants={cardVariants}
          >
            <FaSearch className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500">جرب تغيير معايير البحث</p>
          </motion.div>
        ) : (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default DoctorsSearchPage;
