// src/utils/doctorData.js

export const defaultDoctors = [
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
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
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
    image:
      "https://drjulie.yolasite.com/resources/doctor-profile-pic.png.opt430x430o0%2C0s430x430.png",
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
    image:
      "https://elshrouk-care.com/wp-content/uploads/2024/01/%D8%B7%D9%84%D8%A8-%D8%AF%D9%83%D8%AA%D9%88%D8%B1-%D8%A8%D8%A7%D8%B7%D9%86%D8%A9-%D9%83%D8%B4%D9%81-%D9%85%D9%86%D8%B2%D9%84%D9%8A-e1706364819142.jpeg",
    clinicImages: [
      "/images/clinics/clinic3-1.jpg",
      "/images/clinics/clinic3-2.jpg",
    ],
    description: "استشاري جراحة العظام والمفاصل، متخصص في جراحات الركبة والكتف",
    education: "بكالوريوس الطب - جامعة عين شمس، زمالة جراحة العظام - ألمانيا",
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
    image:
      "https://doctorstorage.blob.core.windows.net/386671/Profile/passport_770ecaaf-1019-4cfc-8509-0aa93494a658.jpg?sig=qyS2CNI%2BvhrB25atW4Ult%2BuSeIy%2BXcMXa9TsRWqnHIA%3D&sv=2015-04-05&si=PrivatePolicy&sr=b",
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
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
    clinicImages: [
      "/images/clinics/clinic5-1.jpg",
      "/images/clinics/clinic5-2.jpg",
    ],
    description:
      "استشاري الأمراض الجلدية والتناسلية، متخصص في علاج الأمراض الجلدية المزمنة",
    education: "بكالوريوس الطب - جامعة الأزهر، دبلوم الأمراض الجلدية - إنجلترا",
    languages: ["العربية", "الإنجليزية"],
    consultationFee: 200,
    availableDays: ["saturday", "sunday", "tuesday", "wednesday", "thursday"],
    workingHours: {
      start: "10:00",
      end: "19:00",
    },
    appointmentDuration: 20,
    isAvailable: true,
  },
];

export default defaultDoctors;
