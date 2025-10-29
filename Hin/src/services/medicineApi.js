// خدمة API للبحث عن الأدوية
// TODO: ربط مع API هنا - سيتم استبدال جميع الوظائف بطلبات API فعلية

// البحث عن الأدوية بالاسم
export const searchMedicinesByName = async (query) => {
  try {
    // هنا هيكون ربط بالباك اند بعدين
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!query || query.trim().length < 2) {
      return [];
    }

    // الحصول على الأدوية من localStorage
    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    const searchTerm = query.toLowerCase().trim();

    const results = medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(searchTerm) ||
        medicine.genericName.toLowerCase().includes(searchTerm) ||
        medicine.category.toLowerCase().includes(searchTerm) ||
        (medicine.company &&
          medicine.company.toLowerCase().includes(searchTerm)) ||
        (medicine.strength &&
          medicine.strength.toLowerCase().includes(searchTerm)) ||
        (medicine.form && medicine.form.toLowerCase().includes(searchTerm))
    );

    // ترتيب النتائج حسب الصلة
    return results.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().indexOf(searchTerm);
      const bNameMatch = b.name.toLowerCase().indexOf(searchTerm);

      // إعطاء أولوية للمطابقات في بداية الاسم
      if (aNameMatch === 0 && bNameMatch !== 0) return -1;
      if (bNameMatch === 0 && aNameMatch !== 0) return 1;

      return aNameMatch - bNameMatch;
    });
  } catch (error) {
    console.error("Error searching medicines:", error);
    throw error;
  }
};

// الحصول على دواء بالمعرف
export const getMedicineById = async (id) => {
  try {
    // هنا هيكون ربط بالباك اند بعدين
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    // الحصول على الأدوية من localStorage
    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    return medicines.find((medicine) => medicine.id === id);
  } catch (error) {
    console.error("Error fetching medicine by ID:", error);
    throw error;
  }
};

// الحصول على جميع الأدوية
export const getAllMedicines = async () => {
  try {
    // هنا هيكون ربط بالباك اند بعدين
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    // الحصول على الأدوية من localStorage
    return JSON.parse(localStorage.getItem("medicines") || "[]");
  } catch (error) {
    console.error("Error fetching all medicines:", error);
    throw error;
  }
};

// الحصول على الأدوية حسب الفئة
export const getMedicinesByCategory = async (category) => {
  try {
    // هنا هيكون ربط بالباك اند بعدين
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    // الحصول على الأدوية من localStorage
    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    return medicines.filter((medicine) => medicine.category === category);
  } catch (error) {
    console.error("Error fetching medicines by category:", error);
    throw error;
  }
};

// الحصول على الفئات المتاحة
export const getMedicineCategories = async () => {
  try {
    // هنا هيكون ربط بالباك اند بعدين
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    // الحصول على الأدوية من localStorage
    const medicines = JSON.parse(localStorage.getItem("medicines") || "[]");
    const categories = [
      ...new Set(medicines.map((medicine) => medicine.category)),
    ];
    return categories.sort();
  } catch (error) {
    console.error("Error fetching medicine categories:", error);
    throw error;
  }
};

// Initialize default medicines data in localStorage if not exists
const initializeMedicinesData = () => {
  // هنا هيكون ربط بالباك اند بعدين
  // البيانات التالية سيتم استبدالها بطلب API فعلي في المستقبل

  const defaultMedicines = [
    // مسكنات وخافضات الحرارة
    {
      id: 1,
      name: "باراسيتامول 500mg",
      genericName: "Paracetamol",
      category: "مسكنات",
      company: "شركة فارما",
      strength: "500mg",
      form: "أقراص",
      price: 15.5,
      description: "مسكن للألم وخافض للحرارة",
    },
    {
      id: 2,
      name: "بانادول إكسترا",
      genericName: "Paracetamol + Caffeine",
      category: "مسكنات",
      company: "GSK",
      strength: "500mg + 65mg",
      form: "أقراص",
      price: 18.0,
      description: "مسكن قوي للألم مع الكافيين",
    },
    {
      id: 3,
      name: "إيبوبروفين 400mg",
      genericName: "Ibuprofen",
      category: "مسكنات",
      company: "شركة الحكمة",
      strength: "400mg",
      form: "أقراص",
      price: 12.0,
      description: "مضاد للالتهاب ومسكن للألم",
    },
    {
      id: 4,
      name: "بروفين شراب",
      genericName: "Ibuprofen",
      category: "مسكنات",
      company: "Abbott",
      strength: "100mg/5ml",
      form: "شراب",
      price: 22.0,
      description: "مسكن للأطفال",
    },

    // مضادات حيوية
    {
      id: 5,
      name: "أموكسيسيلين 250mg",
      genericName: "Amoxicillin",
      category: "مضادات حيوية",
      company: "شركة ميديكال",
      strength: "250mg",
      form: "كبسولات",
      price: 25.0,
      description: "مضاد حيوي واسع المجال",
    },
    {
      id: 6,
      name: "أموكسيسيلين 500mg",
      genericName: "Amoxicillin",
      category: "مضادات حيوية",
      company: "شركة ميديكال",
      strength: "500mg",
      form: "كبسولات",
      price: 35.0,
      description: "مضاد حيوي واسع المجال",
    },
    {
      id: 7,
      name: "أوجمنتين 625mg",
      genericName: "Amoxicillin + Clavulanic Acid",
      category: "مضادات حيوية",
      company: "GSK",
      strength: "500mg + 125mg",
      form: "أقراص",
      price: 45.0,
      description: "مضاد حيوي قوي",
    },
    {
      id: 8,
      name: "أزيثروميسين 250mg",
      genericName: "Azithromycin",
      category: "مضادات حيوية",
      company: "Pfizer",
      strength: "250mg",
      form: "كبسولات",
      price: 55.0,
      description: "مضاد حيوي للجهاز التنفسي",
    },

    // أدوية الجهاز الهضمي
    {
      id: 9,
      name: "أوميبرازول 20mg",
      genericName: "Omeprazole",
      category: "أدوية الجهاز الهضمي",
      company: "AstraZeneca",
      strength: "20mg",
      form: "كبسولات",
      price: 28.0,
      description: "لعلاج قرحة المعدة والحموضة",
    },
    {
      id: 10,
      name: "انتودين 150mg",
      genericName: "Ranitidine",
      category: "أدوية الجهاز الهضمي",
      company: "شركة الدوائية",
      strength: "150mg",
      form: "أقراص",
      price: 15.0,
      description: "لعلاج الحموضة وقرحة المعدة",
    },
    {
      id: 11,
      name: "موتيليوم 10mg",
      genericName: "Domperidone",
      category: "أدوية الجهاز الهضمي",
      company: "Janssen",
      strength: "10mg",
      form: "أقراص",
      price: 20.0,
      description: "لعلاج الغثيان والقيء",
    },

    // أدوية الجهاز التنفسي
    {
      id: 12,
      name: "فنتولين بخاخ",
      genericName: "Salbutamol",
      category: "أدوية الجهاز التنفسي",
      company: "GSK",
      strength: "100mcg/dose",
      form: "بخاخ",
      price: 35.0,
      description: "موسع للشعب الهوائية",
    },
    {
      id: 13,
      name: "كلاريتين 10mg",
      genericName: "Loratadine",
      category: "مضادات الحساسية",
      company: "Bayer",
      strength: "10mg",
      form: "أقراص",
      price: 25.0,
      description: "مضاد للحساسية",
    },
    {
      id: 14,
      name: "ديكساميثازون 0.5mg",
      genericName: "Dexamethasone",
      category: "كورتيكوستيرويد",
      company: "شركة الحكمة",
      strength: "0.5mg",
      form: "أقراص",
      price: 18.0,
      description: "مضاد للالتهاب",
    },

    // فيتامينات ومكملات
    {
      id: 15,
      name: "فيتامين د3 1000 وحدة",
      genericName: "Cholecalciferol",
      category: "فيتامينات",
      company: "شركة الصحة",
      strength: "1000 IU",
      form: "كبسولات",
      price: 30.0,
      description: "فيتامين د لتقوية العظام",
    },
    {
      id: 16,
      name: "فيتامين ب12",
      genericName: "Cyanocobalamin",
      category: "فيتامينات",
      company: "شركة الصحة",
      strength: "1000mcg",
      form: "أقراص",
      price: 25.0,
      description: "فيتامين ب12 لعلاج الأنيميا",
    },
    {
      id: 17,
      name: "حديد + فوليك أسيد",
      genericName: "Iron + Folic Acid",
      category: "مكملات",
      company: "شركة الدوائية",
      strength: "65mg + 1mg",
      form: "أقراص",
      price: 20.0,
      description: "لعلاج الأنيميا",
    },

    // أدوية القلب والضغط
    {
      id: 18,
      name: "أملوديبين 5mg",
      genericName: "Amlodipine",
      category: "أدوية الضغط",
      company: "Pfizer",
      strength: "5mg",
      form: "أقراص",
      price: 22.0,
      description: "لعلاج ضغط الدم المرتفع",
    },
    {
      id: 19,
      name: "كونكور 2.5mg",
      genericName: "Bisoprolol",
      category: "أدوية القلب",
      company: "Merck",
      strength: "2.5mg",
      form: "أقراص",
      price: 40.0,
      description: "لعلاج ضغط الدم وأمراض القلب",
    },
    {
      id: 20,
      name: "أسبرين 75mg",
      genericName: "Aspirin",
      category: "مضادات التجلط",
      company: "Bayer",
      strength: "75mg",
      form: "أقراص",
      price: 8.0,
      description: "لمنع تجلط الدم",
    },
    {
      id: 21,
      name: "إيبوبروفين 400mg",
      genericName: "Ibuprofen",
      category: "مضادات الالتهاب",
      manufacturer: "شركة الصحة",
      price: 18.75,
      description: "مضاد للالتهاب ومسكن للألم",
      dosage: "400mg",
      form: "أقراص",
    },
    {
      id: 22,
      name: "فيتامين د 1000 وحدة",
      genericName: "Vitamin D3",
      category: "فيتامينات",
      manufacturer: "شركة فارما",
      price: 30.0,
      description: "مكمل غذائي لفيتامين د",
      dosage: "1000 IU",
      form: "كبسولات",
    },
    {
      id: 23,
      name: "شراب كحة للأطفال",
      genericName: "Dextromethorphan",
      category: "أدوية الجهاز التنفسي",
      manufacturer: "شركة ميديكال",
      price: 22.5,
      description: "شراب مهدئ للكحة للأطفال",
      dosage: "15mg/5ml",
      form: "شراب",
    },
    {
      id: 24,
      name: "أنسولين سريع المفعول",
      genericName: "Insulin Aspart",
      category: "أدوية السكري",
      manufacturer: "شركة الصحة",
      price: 85.0,
      description: "أنسولين سريع المفعول لمرضى السكري",
      dosage: "100 وحدة/مل",
      form: "حقن",
    },
    {
      id: 25,
      name: "كريم مضاد للالتهابات",
      genericName: "Hydrocortisone",
      category: "أدوية الجلد",
      manufacturer: "شركة فارما",
      price: 12.25,
      description: "كريم موضعي مضاد للالتهابات",
      dosage: "1%",
      form: "كريم",
    },
    {
      id: 26,
      name: "أقراص الضغط",
      genericName: "Amlodipine",
      category: "أدوية القلب والأوعية الدموية",
      manufacturer: "شركة ميديكال",
      price: 35.0,
      description: "دواء لعلاج ارتفاع ضغط الدم",
      dosage: "5mg",
      form: "أقراص",
    },
    {
      id: 27,
      name: "شرائط قياس السكر",
      genericName: "Glucose Test Strips",
      category: "مستلزمات طبية",
      manufacturer: "شركة الصحة",
      price: 45.0,
      description: "شرائط لقياس مستوى السكر في الدم",
      dosage: "-",
      form: "شرائط",
    },
    {
      id: 28,
      name: "دواء الحموضة",
      genericName: "Omeprazole",
      category: "أدوية الجهاز الهضمي",
      manufacturer: "شركة فارما",
      price: 28.0,
      description: "دواء لعلاج الحموضة وقرحة المعدة",
      dosage: "20mg",
      form: "كبسولات",
    },
    {
      id: 29,
      name: "باراسيتامول شراب للأطفال",
      genericName: "Paracetamol Syrup",
      category: "مسكنات",
      manufacturer: "شركة ميديكال",
      price: 18.0,
      description: "مسكن وخافض حرارة للأطفال",
      dosage: "120mg/5ml",
      form: "شراب",
    },
    {
      id: 30,
      name: "أقراص الكالسيوم",
      genericName: "Calcium Carbonate",
      category: "مكملات غذائية",
      manufacturer: "شركة الصحة",
      price: 20.0,
      description: "مكمل غذائي للكالسيوم",
      dosage: "500mg",
      form: "أقراص",
    },
  ];

  // Save default data to localStorage if not exists
  if (!localStorage.getItem("medicines")) {
    localStorage.setItem("medicines", JSON.stringify(defaultMedicines));
  }
};

// Initialize medicines data when the module is loaded
initializeMedicinesData();

// Alias للاستخدام في Autocomplete
export const searchMedicines = searchMedicinesByName;
