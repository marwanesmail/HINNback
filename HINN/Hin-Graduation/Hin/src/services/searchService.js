// src/services/searchService.js
// TODO: ربط مع API هنا - سيتم استبدال جميع الوظائف بطلبات API فعلية

// الحصول على بيانات المنتجات من localStorage
const getProductsData = () => {
  // TODO: ربط مع API هنا - GET /api/search/products
  // نوع البيانات المطلوبة: {}
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, name, company, price, originalPrice, discount, image, pharmacy, inStock, rating, category }]
  const storedData = localStorage.getItem("searchProductsData");
  if (storedData) {
    return JSON.parse(storedData);
  }

  // بيانات افتراضية إذا لم توجد بيانات في localStorage
  const defaultProducts = [
    {
      id: 1,
      name: "باراسيتامول 500 مجم",
      company: "شركة الإسكندرية للأدوية",
      price: 15,
      originalPrice: 20,
      discount: 25,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية النهضة",
      inStock: true,
      rating: 4.5,
      category: "مسكنات",
    },
    {
      id: 2,
      name: "أسبرين 100 مجم",
      company: "شركة القاهرة للأدوية",
      price: 12,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية الشفاء",
      inStock: true,
      rating: 4.2,
      category: "مسكنات",
    },
    {
      id: 3,
      name: "فيتامين د 1000 وحدة",
      company: "شركة الدلتا للأدوية",
      price: 45,
      originalPrice: 50,
      discount: 10,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية الأمل",
      inStock: true,
      rating: 4.8,
      category: "فيتامينات",
    },
    {
      id: 4,
      name: "أوميجا 3",
      company: "شركة النيل للأدوية",
      price: 85,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية السلام",
      inStock: false,
      rating: 4.3,
      category: "مكملات غذائية",
    },
    {
      id: 5,
      name: "كريم مرطب للبشرة",
      company: "شركة الجمال الطبي",
      price: 35,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية النور",
      inStock: true,
      rating: 4.6,
      category: "العناية بالبشرة",
    },
    {
      id: 6,
      name: "شامبو طبي للشعر",
      company: "شركة العناية الطبية",
      price: 55,
      originalPrice: 65,
      discount: 15,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية الحياة",
      inStock: true,
      rating: 4.4,
      category: "العناية بالشعر",
    },
    {
      id: 7,
      name: "مضاد حيوي أموكسيسيلين",
      company: "شركة المضادات الحيوية",
      price: 25,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية الشفاء",
      inStock: true,
      rating: 4.1,
      category: "مضادات حيوية",
    },
    {
      id: 8,
      name: "كالسيوم + مغنيسيوم",
      company: "شركة المعادن الطبية",
      price: 40,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية الأمل",
      inStock: true,
      rating: 4.7,
      category: "مكملات غذائية",
    },
    {
      id: 9,
      name: "قطرة عين مرطبة",
      company: "شركة العيون الطبية",
      price: 30,
      originalPrice: 35,
      discount: 14,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية النهضة",
      inStock: true,
      rating: 4.5,
      category: "قطرات العين",
    },
    {
      id: 10,
      name: "مرهم للجروح",
      company: "شركة الجراحة الطبية",
      price: 20,
      image: "/api/placeholder/200/150",
      pharmacy: "صيدلية السلام",
      inStock: false,
      rating: 4.3,
      category: "مراهم",
    },
  ];

  // حفظ البيانات الافتراضية في localStorage
  localStorage.setItem("searchProductsData", JSON.stringify(defaultProducts));
  return defaultProducts;
};

// دالة البحث الرئيسية
export const searchProducts = async (query, location = null) => {
  // TODO: ربط مع API هنا - GET /api/search/products?query={query}&location={location}
  // نوع البيانات المطلوبة: query params { query, location }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, name, company, price, originalPrice, discount, image, pharmacy, inStock, rating, category }]
  // محاكاة تأخير API
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!query || query.trim().length === 0) {
    return [];
  }

  const products = getProductsData();
  const searchTerm = query.toLowerCase().trim();

  // البحث في اسم المنتج، اسم الشركة، والفئة
  const results = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.company.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.pharmacy.toLowerCase().includes(searchTerm)
  );

  // ترتيب النتائج حسب الصلة (المنتجات المتوفرة أولاً، ثم حسب التقييم)
  results.sort((a, b) => {
    // المنتجات المتوفرة أولاً
    if (a.inStock && !b.inStock) return -1;
    if (!a.inStock && b.inStock) return 1;

    // ثم حسب التقييم
    return (b.rating || 0) - (a.rating || 0);
  });

  // إذا كان هناك موقع محدد، يمكن فلترة النتائج حسب الصيدليات القريبة
  if (location) {
    // هنا يمكن إضافة منطق فلترة حسب الموقع
    // مثلاً: فلترة الصيدليات ضمن نطاق معين من الموقع المحدد
  }

  return results;
};

// دالة للحصول على اقتراحات البحث
export const getSearchSuggestions = async (query) => {
  // TODO: ربط مع API هنا - GET /api/search/suggestions?query={query}
  // نوع البيانات المطلوبة: query params { query }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [string]
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!query || query.trim().length < 2) {
    return [];
  }

  const products = getProductsData();
  const searchTerm = query.toLowerCase().trim();

  // استخراج الاقتراحات من أسماء المنتجات والشركات
  const suggestions = new Set();

  products.forEach((product) => {
    // إضافة اسم المنتج إذا كان يحتوي على النص المبحوث عنه
    if (product.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.name);
    }

    // إضافة اسم الشركة
    if (product.company.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.company);
    }

    // إضافة الفئة
    if (product.category.toLowerCase().includes(searchTerm)) {
      suggestions.add(product.category);
    }
  });

  return Array.from(suggestions).slice(0, 5); // أول 5 اقتراحات
};

// دالة للحصول على المنتجات الشائعة
export const getPopularProducts = async () => {
  // TODO: ربط مع API هنا - GET /api/search/products/popular
  // نوع البيانات المطلوبة: {}
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, name, company, price, originalPrice, discount, image, pharmacy, inStock, rating, category }]
  await new Promise((resolve) => setTimeout(resolve, 300));

  const products = getProductsData();

  // إرجاع المنتجات مرتبة حسب التقييم
  return products
    .filter((product) => product.inStock)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);
};

// دالة للحصول على المنتجات حسب الفئة
export const getProductsByCategory = async (category) => {
  // TODO: ربط مع API هنا - GET /api/search/products/category/{category}
  // نوع البيانات المطلوبة: path param { category }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, name, company, price, originalPrice, discount, image, pharmacy, inStock, rating, category }]
  await new Promise((resolve) => setTimeout(resolve, 300));

  const products = getProductsData();

  return products.filter(
    (product) =>
      product.category.toLowerCase() === category.toLowerCase() &&
      product.inStock
  );
};

// دالة للحصول على العروض
export const getDiscountedProducts = async () => {
  // TODO: ربط مع API هنا - GET /api/search/products/discounted
  // نوع البيانات المطلوبة: {}
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, name, company, price, originalPrice, discount, image, pharmacy, inStock, rating, category }]
  await new Promise((resolve) => setTimeout(resolve, 300));

  const products = getProductsData();

  return products
    .filter((product) => product.discount && product.inStock)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0));
};
