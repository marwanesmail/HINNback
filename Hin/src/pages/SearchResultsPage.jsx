import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserMd,
  FaPills,
  FaBuilding,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const performSearch = (query) => {
    setLoading(true);

    // استبدال البيانات الوهمية ببيانات من localStorage
    // هنا هيكون ربط بالباك اند بعدين
    setTimeout(() => {
      // الحصول على البيانات من localStorage
      const storedSearchData = localStorage.getItem("searchResultsData");
      let searchResults = [];

      if (storedSearchData) {
        searchResults = JSON.parse(storedSearchData);
      } else {
        // بيانات افتراضية إذا لم توجد بيانات في localStorage
        searchResults = [
          {
            id: 1,
            type: "doctor",
            name: "د. محمد أحمد",
            specialty: "طب القلب",
            location: "القاهرة",
            rating: 4.8,
            image: null,
          },
          {
            id: 2,
            type: "pharmacy",
            name: "صيدلية النيل",
            location: "الجيزة",
            phone: "01234567890",
            image: null,
          },
          {
            id: 3,
            type: "company",
            name: "شركة الدواء العربي",
            location: "الإسكندرية",
            description: "شركة متخصصة في تصنيع الأدوية",
            image: null,
          },
          {
            id: 4,
            type: "doctor",
            name: "د. سارة محمود",
            specialty: "طب الأطفال",
            location: "القاهرة",
            rating: 4.9,
            image: null,
          },
        ];

        // حفظ البيانات الافتراضية في localStorage
        localStorage.setItem(
          "searchResultsData",
          JSON.stringify(searchResults)
        );
      }

      // Filter results based on query
      const filteredResults = searchResults.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.specialty &&
            item.specialty.toLowerCase().includes(query.toLowerCase())) ||
          item.location.toLowerCase().includes(query.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(query.toLowerCase()))
      );

      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "doctor":
        return <FaUserMd className="text-blue-600" />;
      case "pharmacy":
        return <FaPills className="text-green-600" />;
      case "company":
        return <FaBuilding className="text-purple-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "doctor":
        return "طبيب";
      case "pharmacy":
        return "صيدلية";
      case "company":
        return "شركة";
      default:
        return "مستخدم";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <button
                onClick={handleGoBack}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 mr-4"
              >
                <FaArrowLeft className="ml-2" />
                العودة
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  نتائج البحث
                </h1>
                <p className="text-gray-600 mt-1">
                  نتائج البحث عن:{" "}
                  <span className="font-medium text-blue-600">
                    "{searchQuery}"
                  </span>
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    performSearch(searchQuery);
                  }
                }}
                placeholder="ابحث..."
                className="w-full md:w-80 px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch
                onClick={() => performSearch(searchQuery)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 mt-4">جاري البحث...</p>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <p className="text-gray-700">
                تم العثور على{" "}
                <span className="font-bold">{results.length}</span> نتيجة
              </p>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-600">
                  لم نتمكن من العثور على أي نتائج لبحثك عن "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                              {item.name}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getTypeLabel(item.type)}
                            </span>
                          </div>

                          {item.specialty && (
                            <p className="text-gray-600 mt-1">
                              {item.specialty}
                            </p>
                          )}

                          {item.description && (
                            <p className="text-gray-600 mt-1 text-sm">
                              {item.description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <span>{item.location}</span>
                            {item.rating && (
                              <span className="mr-3 flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="mr-1">{item.rating}</span>
                              </span>
                            )}
                          </div>

                          {item.phone && (
                            <p className="mt-2 text-sm text-gray-500">
                              هاتف: {item.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                          عرض التفاصيل
                        </button>
                        <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 text-sm font-medium">
                          اتصل
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
