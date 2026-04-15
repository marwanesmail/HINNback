import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";
import Swal from "sweetalert2";
// Import Framer Motion for animations
import { motion } from "framer-motion";

// إصلاح أيقونات Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// مكون لالتقاط النظقات على الخريطة
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

const LocationPicker = ({
  onLocationSelect,
  onLocationChange,
  initialLocation = { lat: 30.0444, lng: 31.2357 }, // القاهرة كموقع افتراضي
  showMap = true,
  showMapToggle = false, // إظهار زر التحكم في الخريطة
  showTitle = true, // إظهار العنوان
}) => {
  const [currentLocation, setCurrentLocation] = useState(
    initialLocation || { lat: 30.0444, lng: 31.2357 }
  );
  const [address, setAddress] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMapVisible, setIsMapVisible] = useState(showMap && !showMapToggle);
  // States for manual address entry
  const [showManualAddressModal, setShowManualAddressModal] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    name: "",
    city: "",
    street: "",
    building: "",
    notes: "",
  });
  const [manualAddressErrors, setManualAddressErrors] = useState({});
  const searchTimeoutRef = useRef(null);

  // تحديث الموقع الحالي عند تغيير initialLocation
  React.useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      setCurrentLocation(initialLocation);
    }
  }, [initialLocation]);

  // دالة لتبديل إظهار/إخفاء الخريطة
  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  // دالة للحصول على الموقع الحالي من GPS
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      Swal.fire({
        icon: "info",
        text: "المتصفح لا يدعم تحديد الموقع الجغرافي",
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };

        setCurrentLocation(newLocation);
        onLocationSelect && onLocationSelect(newLocation);

        // الحصول على العنوان من localStorage أو استخدام عنوان افتراضي
        try {
          const addressText = await reverseGeocode(latitude, longitude);
          setAddress(addressText);
          setSearchQuery(addressText);

          // استدعاء onLocationChange مع البيانات الكاملة
          const locationData = {
            coordinates: newLocation,
            address: addressText,
          };
          onLocationChange && onLocationChange(locationData);
        } catch (error) {
          console.error("خطأ في الحصول على العنوان:", error);
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("خطأ في تحديد الموقع:", error);
        let errorMessage = "حدث خطأ أثناء تحديد موقعك";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "تم رفض الإذن لتحديد الموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "معلومات الموقع غير متاحة حالياً";
            break;
          case error.TIMEOUT:
            errorMessage = "انتهت مهلة تحديد الموقع";
            break;
          default:
            errorMessage = "حدث خطأ غير متوقع في تحديد الموقع";
            break;
        }

        Swal.fire({ icon: "error", text: errorMessage });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // دالة للحصول على العنوان من الإحداثيات (Reverse Geocoding)
  // TODO: ربط مع API هنا - GET /api/location/reverse-geocode?lat={lat}&lng={lng}
  // نوع البيانات المطلوبة: query params { lat, lng }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: { address: string }
  const reverseGeocode = async (lat, lng) => {
    try {
      // استخدام Nominatim API (مجاني) - لكن نستبدلها ببيانات من localStorage
      const storedAddresses = JSON.parse(
        localStorage.getItem("geocodedAddresses") || "{}"
      );
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;

      if (storedAddresses[key]) {
        return storedAddresses[key];
      }

      // إذا لم نجد العنوان في localStorage، نستخدم عنوان افتراضي
      const defaultAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      // حفظ العنوان الافتراضي في localStorage
      storedAddresses[key] = defaultAddress;
      localStorage.setItem(
        "geocodedAddresses",
        JSON.stringify(storedAddresses)
      );

      return defaultAddress;
    } catch (error) {
      console.error("خطأ في Reverse Geocoding:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // دالة البحث عن الأماكن (Geocoding)
  // TODO: ربط مع API هنا - GET /api/location/search?query={query}
  // نوع البيانات المطلوبة: query params { query }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ name, lat, lng, address }]
  const searchPlaces = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // استخدام Nominatim API للبحث - لكن نستبدلها ببيانات من localStorage
      const storedSearchResults = JSON.parse(
        localStorage.getItem("locationSearchResults") || "{}"
      );

      if (storedSearchResults[query]) {
        setSearchResults(storedSearchResults[query]);
        setShowSearchResults(storedSearchResults[query].length > 0);
        return;
      }

      // الحصول على العناوين المحفوظة يدوياً
      const savedManualAddresses = JSON.parse(
        localStorage.getItem("manualAddresses") || "[]"
      );

      // تصفية العناوين المحفوظة حسب مطابقة البحث
      const filteredManualAddresses = savedManualAddresses
        .filter(
          (addr) =>
            addr.name.includes(query) ||
            addr.city.includes(query) ||
            addr.street.includes(query)
        )
        .map((addr) => ({
          id: `manual-${addr.id}`,
          name: `${addr.name} - ${addr.city}, ${addr.street} ${addr.building}`,
          lat: 30.0444, // استخدام إحداثيات افتراضية
          lng: 31.2357, // استخدام إحداثيات افتراضية
          isManual: true,
        }));

      // إذا لم نجد نتائج البحث في localStorage، نستخدم نتائج افتراضية
      const defaultResults = [
        {
          id: 1,
          name: "القاهرة، مصر",
          lat: 30.0444,
          lng: 31.2357,
        },
        {
          id: 2,
          name: "الإسكندرية، مصر",
          lat: 31.2001,
          lng: 29.9187,
        },
        {
          id: 3,
          name: "الجيزة، مصر",
          lat: 30.0444,
          lng: 31.2357,
        },
      ];

      // دمج النتائج الافتراضية مع العناوين المحفوظة يدوياً
      const combinedResults = [...filteredManualAddresses, ...defaultResults];

      // حفظ النتائج الافتراضية في localStorage
      storedSearchResults[query] = combinedResults;
      localStorage.setItem(
        "locationSearchResults",
        JSON.stringify(storedSearchResults)
      );

      setSearchResults(combinedResults);
      setShowSearchResults(combinedResults.length > 0);
    } catch (error) {
      console.error("خطأ في البحث:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // معالج تغيير نص البحث
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // إلغاء البحث السابق
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // بحث جديد بعد تأخير
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 500);
  };

  // اختيار مكان من نتائج البحث
  const selectSearchResult = async (result) => {
    const newLocation = { lat: result.lat, lng: result.lng };
    setCurrentLocation(newLocation);
    setAddress(result.name);
    setSearchQuery(result.name);
    setShowSearchResults(false);
    onLocationSelect && onLocationSelect(newLocation);

    // استدعاء onLocationChange مع البيانات الكاملة
    const locationData = {
      coordinates: newLocation,
      address: result.name,
    };
    onLocationChange && onLocationChange(locationData);
  };

  // معالج النقر على الخريطة
  const handleMapClick = async (location) => {
    setCurrentLocation(location);
    onLocationSelect && onLocationSelect(location);

    // الحصول على العنوان
    try {
      const addressText = await reverseGeocode(location.lat, location.lng);
      setAddress(addressText);
      setSearchQuery(addressText);

      // استدعاء onLocationChange مع البيانات الكاملة
      const locationData = {
        coordinates: location,
        address: addressText,
      };
      onLocationChange && onLocationChange(locationData);
    } catch (error) {
      console.error("خطأ في الحصول على العنوان:", error);
    }
  };

  // دالة لفتح نموذج العنوان اليدوي
  const openManualAddressModal = () => {
    setShowManualAddressModal(true);
    // إعادة تعيين حالة النموذج
    setManualAddress({
      name: "",
      city: "",
      street: "",
      building: "",
      notes: "",
    });
    setManualAddressErrors({});
  };

  // دالة لإغلاق نموذج العنوان اليدوي
  const closeManualAddressModal = () => {
    setShowManualAddressModal(false);
  };

  // دالة لمعالجة تغييرات حقول النموذج
  const handleManualAddressChange = (field, value) => {
    setManualAddress((prev) => ({
      ...prev,
      [field]: value,
    }));

    // مسح الخطأ عند الكتابة
    if (manualAddressErrors[field]) {
      setManualAddressErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // دالة للتحقق من صحة النموذج
  const validateManualAddress = () => {
    const errors = {};

    if (!manualAddress.name.trim()) {
      errors.name = "اسم العنوان مطلوب";
    }

    if (!manualAddress.city.trim()) {
      errors.city = "المدينة مطلوبة";
    }

    if (!manualAddress.street.trim()) {
      errors.street = "الشارع مطلوب";
    }

    if (!manualAddress.building.trim()) {
      errors.building = "رقم العمارة مطلوب";
    }

    setManualAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // دالة لحفظ العنوان اليدوي
  const saveManualAddress = () => {
    if (!validateManualAddress()) {
      return;
    }

    try {
      // الحصول على العناوين المحفوظة
      const savedAddresses = JSON.parse(
        localStorage.getItem("manualAddresses") || "[]"
      );

      // إنشاء معرف فريد جديد
      const newId = Date.now();

      // إنشاء كائن العنوان الجديد
      const newAddress = {
        id: newId,
        ...manualAddress,
      };

      // إضافة العنوان الجديد إلى المصفوفة
      const updatedAddresses = [...savedAddresses, newAddress];

      // حفظ المصفوفة المحدثة في localStorage
      localStorage.setItem("manualAddresses", JSON.stringify(updatedAddresses));

      // إغلاق النموذج وإظهار رسالة نجاح
      closeManualAddressModal();
      Swal.fire({
        icon: "success",
        text: "تم حفظ العنوان بنجاح",
      });
    } catch (error) {
      console.error("خطأ في حفظ العنوان:", error);
      Swal.fire({
        icon: "error",
        text: "حدث خطأ أثناء حفظ العنوان",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="location-picker-container space-y-4"
    >
      {/* أزرار تحديد الموقع */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="btn-medical-success flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingLocation ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>جاري تحديد الموقع...</span>
            </>
          ) : (
            <>
              <i className="fas fa-location-arrow"></i>
              <span>تحديد موقعي الحالي</span>
            </>
          )}
        </button>

        {/* زر إضافة عنوان يدوي */}
        <button
          type="button"
          onClick={openManualAddressModal}
          className="btn-medical-primary flex items-center justify-center gap-2"
        >
          <i className="fas fa-plus"></i>
          <span>إضافة عنوان يدوي</span>
        </button>

        {/* إخفاء حقل البحث عند فتح النموذج */}
        {!showManualAddressModal && (
          <div className="search-container flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="input-medical w-full pr-12 text-readable"
              placeholder="ابحث عن عنوان أو مكان..."
            />
            <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

            {/* نتائج البحث مع z-index عالي جداً */}
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="search-dropdown absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => selectSearchResult(result)}
                    className="search-result-item w-full text-right px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <i
                        className={`fas ${
                          result.isManual ? "fa-home" : "fa-map-marker-alt"
                        } text-red-500 mt-1`}
                      ></i>
                      <span className="text-sm text-gray-700 line-clamp-2">
                        {result.name}
                      </span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      {/* زر إظهار/إخفاء الخريطة */}
      {showMapToggle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <button
            type="button"
            onClick={toggleMapVisibility}
            className="btn-medical-primary flex items-center gap-3 px-8 py-4 font-medium text-lg"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i
                className={`fas ${
                  isMapVisible ? "fa-eye-slash" : "fa-map"
                } text-lg`}
              ></i>
            </div>
            <span>{isMapVisible ? "إخفاء الخريطة" : "🗺️ إظهار الخريطة"}</span>
          </button>
        </motion.div>
      )}

      {/* الخريطة */}
      {showMap &&
        isMapVisible &&
        currentLocation &&
        currentLocation.lat &&
        currentLocation.lng && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="map-container bg-white rounded-xl border-2 border-gray-300 overflow-hidden"
          >
            <MapContainer
              center={[currentLocation.lat, currentLocation.lng]}
              zoom={15}
              scrollWheelZoom={true}
              style={{ height: "400px", width: "100%" }}
              key={`${currentLocation.lat}-${currentLocation.lng}`}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[currentLocation.lat, currentLocation.lng]} />
              <MapClickHandler onLocationSelect={handleMapClick} />
            </MapContainer>
          </motion.div>
        )}

      {/* عرض العنوان المحدد */}
      {address && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card-medical-blue p-4"
        >
          <div className="flex items-start gap-3">
            <i className="fas fa-map-marker-alt text-primary mt-1"></i>
            <div className="rtl-text">
              <h4 className="font-medical-title text-primary mb-1">
                الموقع المحدد:
              </h4>
              <p className="text-readable text-dark-soft">{address}</p>
              {currentLocation &&
                currentLocation.lat &&
                currentLocation.lng && (
                  <p className="text-sm text-soft mt-1">
                    الإحداثيات: {currentLocation.lat.toFixed(6)},{" "}
                    {currentLocation.lng.toFixed(6)}
                  </p>
                )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal إضافة عنوان يدوي */}
      {showManualAddressModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">
                  إضافة عنوان يدوي
                </h3>
                <button
                  onClick={closeManualAddressModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم العنوان (مثال: المنزل، العمل)
                  </label>
                  <input
                    type="text"
                    value={manualAddress.name}
                    onChange={(e) =>
                      handleManualAddressChange("name", e.target.value)
                    }
                    className={`input-medical w-full ${
                      manualAddressErrors.name ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل اسم العنوان"
                  />
                  {manualAddressErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {manualAddressErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={manualAddress.city}
                    onChange={(e) =>
                      handleManualAddressChange("city", e.target.value)
                    }
                    className={`input-medical w-full ${
                      manualAddressErrors.city ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل المدينة"
                  />
                  {manualAddressErrors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {manualAddressErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الشارع
                  </label>
                  <input
                    type="text"
                    value={manualAddress.street}
                    onChange={(e) =>
                      handleManualAddressChange("street", e.target.value)
                    }
                    className={`input-medical w-full ${
                      manualAddressErrors.street ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل اسم الشارع"
                  />
                  {manualAddressErrors.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {manualAddressErrors.street}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم العمارة
                  </label>
                  <input
                    type="text"
                    value={manualAddress.building}
                    onChange={(e) =>
                      handleManualAddressChange("building", e.target.value)
                    }
                    className={`input-medical w-full ${
                      manualAddressErrors.building ? "border-red-500" : ""
                    }`}
                    placeholder="أدخل رقم العمارة"
                  />
                  {manualAddressErrors.building && (
                    <p className="text-red-500 text-sm mt-1">
                      {manualAddressErrors.building}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    value={manualAddress.notes}
                    onChange={(e) =>
                      handleManualAddressChange("notes", e.target.value)
                    }
                    className="input-medical w-full"
                    placeholder="أدخل أي ملاحظات إضافية"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeManualAddressModal}
                  className="btn-medical-secondary px-6 py-2"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={saveManualAddress}
                  className="btn-medical-primary px-6 py-2 "
                >
                  حفظ العنوان
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LocationPicker;
