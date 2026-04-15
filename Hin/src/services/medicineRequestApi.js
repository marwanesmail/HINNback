// خدمة API لإدارة طلبات الأدوية بين المرضى والصيدليات
// TODO: ربط مع API هنا - سيتم استبدال جميع الوظائف بطلبات API فعلية

// حساب المسافة بين نقطتين (بالكيلومتر)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// العثور على الصيدليات القريبة
export const findNearbyPharmacies = async (
  patientLocation,
  maxDistance = 5
) => {
  // TODO: ربط مع API هنا - GET /api/pharmacies/nearby?lat={lat}&lng={lng}&maxDistance={maxDistance}
  // نوع البيانات المطلوبة: query params { lat, lng, maxDistance }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, name, location: { lat, lng }, distance, distanceText }]
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!patientLocation || !patientLocation.lat || !patientLocation.lng) {
    throw new Error("موقع المريض غير صحيح");
  }

  // الحصول على الصيدليات من localStorage
  const pharmacies = JSON.parse(localStorage.getItem("pharmacies") || "[]");

  const nearbyPharmacies = pharmacies
    .map((pharmacy) => {
      const distance = calculateDistance(
        patientLocation.lat,
        patientLocation.lng,
        pharmacy.location.lat,
        pharmacy.location.lng
      );

      return {
        ...pharmacy,
        distance: distance,
        distanceText:
          distance < 1
            ? `${Math.round(distance * 1000)} متر`
            : `${distance.toFixed(1)} كم`,
      };
    })
    .filter((pharmacy) => pharmacy.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);

  return nearbyPharmacies;
};

// إرسال طلب دواء للصيدليات القريبة
export const sendMedicineRequest = async (requestData) => {
  // TODO: ربط مع API هنا - POST /api/medicine-requests
  // نوع البيانات المطلوبة: { patientName, patientPhone, medicines, location, alternativeOption, maxDistance }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: { requestId, message, targetPharmacies, status }
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 500));

  const {
    patientName,
    patientPhone,
    medicines,
    location,
    alternativeOption,
    maxDistance = 3,
  } = requestData;

  // التحقق من صحة البيانات
  if (!patientName || !patientPhone || !medicines || medicines.length === 0) {
    throw new Error("بيانات الطلب غير مكتملة");
  }

  if (!location || !location.lat || !location.lng) {
    throw new Error("موقع المريض مطلوب");
  }

  // العثور على الصيدليات القريبة
  const nearbyPharmacies = await findNearbyPharmacies(location, maxDistance);

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  // الحصول على معرف الطلب التالي
  const requestIdCounter = parseInt(
    localStorage.getItem("requestIdCounter") || "1"
  );

  // إنشاء طلب جديد حتى لو لم توجد صيدليات قريبة
  const newRequest = {
    id: requestIdCounter,
    patientName,
    patientPhone,
    medicines,
    location,
    alternativeOption,
    requestTime: new Date().toISOString(),
    status: nearbyPharmacies.length > 0 ? "sent" : "pending",
    targetPharmacies: nearbyPharmacies.slice(0, 5), // إرسال لأقرب 5 صيدليات
    responses: [],
    pharmacyResponses: [], // إضافة هذا الحقل للتوافق
  };

  // حفظ الطلب الجديد
  medicineRequests.push(newRequest);
  localStorage.setItem("medicineRequests", JSON.stringify(medicineRequests));

  // تحديث معرف الطلب التالي
  localStorage.setItem("requestIdCounter", (requestIdCounter + 1).toString());

  if (nearbyPharmacies.length > 0) {
    // محاكاة إرسال الطلب للصيدليات
    console.log(`تم إرسال طلب الدواء للصيدليات التالية:`);
    nearbyPharmacies.slice(0, 5).forEach((pharmacy) => {
      console.log(`- ${pharmacy.name} (${pharmacy.distanceText})`);
    });

    return {
      requestId: newRequest.id,
      message: `تم إرسال طلبك إلى ${
        nearbyPharmacies.slice(0, 5).length
      } صيدليات قريبة`,
      targetPharmacies: nearbyPharmacies.slice(0, 5),
      status: "sent",
    };
  } else {
    // لا توجد صيدليات قريبة، لكن نحفظ الطلب للمتابعة
    console.log("لا توجد صيدليات قريبة، تم حفظ الطلب للمراجعة والبحث الموسع");

    return {
      requestId: newRequest.id,
      message: "تم استلام طلبك وسيتم البحث عن صيدليات مناسبة في منطقة أوسع",
      targetPharmacies: [],
      status: "pending",
    };
  }
};

// الحصول على طلب دواء بالمعرف
export const getMedicineRequest = async (requestId) => {
  // TODO: ربط مع API هنا - GET /api/medicine-requests/{requestId}
  // نوع البيانات المطلوبة: path param { requestId }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: { id, patientName, patientPhone, medicines, location, alternativeOption, requestTime, status, targetPharmacies, responses }
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 200));

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  const request = medicineRequests.find((r) => r.id === requestId);
  if (!request) {
    throw new Error("الطلب غير موجود");
  }

  return request;
};

// الحصول على جميع طلبات المريض
export const getPatientRequests = async (patientPhone) => {
  // TODO: ربط مع API هنا - GET /api/medicine-requests/patient/{patientPhone}
  // نوع البيانات المطلوبة: path param { patientPhone }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, patientName, patientPhone, medicines, location, alternativeOption, requestTime, status, targetPharmacies, responses }]
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 300));

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  return medicineRequests.filter((r) => r.patientPhone === patientPhone);
};

// رد الصيدلية على طلب الدواء
export const respondToMedicineRequest = async (
  requestId,
  pharmacyId,
  response
) => {
  // TODO: ربط مع API هنا - POST /api/medicine-requests/{requestId}/respond
  // نوع البيانات المطلوبة: path param { requestId }, body { pharmacyId, response: { status, price, estimatedTime, notes } }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: { success: true, updatedRequest: { id, status, responses } }
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 500));

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  const request = medicineRequests.find((r) => r.id === requestId);
  if (!request) {
    throw new Error("الطلب غير موجود");
  }

  // الحصول على الصيدليات من localStorage
  const pharmacies = JSON.parse(localStorage.getItem("pharmacies") || "[]");

  const pharmacy = pharmacies.find((p) => p.id === pharmacyId);
  if (!pharmacy) {
    throw new Error("الصيدلية غير موجودة");
  }

  // التحقق من أن الصيدلية من ضمن المستهدفة
  const isTargetPharmacy = request.targetPharmacies.some(
    (p) => p.id === pharmacyId
  );
  if (!isTargetPharmacy) {
    throw new Error("هذا الطلب غير مرسل لهذه الصيدلية");
  }

  // إضافة الرد
  const newResponse = {
    pharmacyId,
    pharmacyName: pharmacy.name,
    response: response.status, // 'accepted' or 'declined'
    message: response.message || "",
    availableMedicines: response.availableMedicines || [],
    totalPrice: response.totalPrice || 0,
    responseTime: new Date().toISOString(),
  };

  request.responses.push(newResponse);

  // تحديث حالة الطلب إذا كان هناك رد إيجابي
  if (response.status === "accepted" && request.status === "pending") {
    request.status = "accepted";
  }

  // حفظ التحديثات
  localStorage.setItem("medicineRequests", JSON.stringify(medicineRequests));

  return {
    message: `تم ${
      response.status === "accepted" ? "قبول" : "رفض"
    } الطلب بنجاح`,
    request: request,
  };
};

// الحصول على طلبات الأدوية للصيدلية
export const getPharmacyRequests = async (pharmacyId, patientLocation) => {
  // TODO: ربط مع API هنا - GET /api/medicine-requests/pharmacy/{pharmacyId}
  // نوع البيانات المطلوبة: path param { pharmacyId }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: [{ id, patientName, patientPhone, medicines, location, alternativeOption, requestTime, status, targetPharmacies, responses }]
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 400));

  // الحصول على الصيدليات من localStorage
  const pharmacies = JSON.parse(localStorage.getItem("pharmacies") || "[]");

  // في التطبيق الحقيقي، سيتم جلب الطلبات من قاعدة البيانات
  // هنا نحاكي الطلبات القريبة من الصيدلية
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId);
  if (!pharmacy) {
    throw new Error("الصيدلية غير موجودة");
  }

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  // محاكاة طلبات قريبة من الصيدلية
  const nearbyRequests = medicineRequests.filter((request) => {
    const distance = calculateDistance(
      pharmacy.location.lat,
      pharmacy.location.lng,
      request.location.lat,
      request.location.lng
    );
    return distance <= 3; // في نطاق 3 كم
  });

  return nearbyRequests.map((request) => ({
    ...request,
    distance: calculateDistance(
      pharmacy.location.lat,
      pharmacy.location.lng,
      request.location.lat,
      request.location.lng
    ),
  }));
};

// الحصول على إحصائيات الطلبات
export const getRequestsStats = async () => {
  // TODO: ربط مع API هنا - GET /api/medicine-requests/stats
  // نوع البيانات المطلوبة: {}
  // Headers: Content-Type: application/json
  // البيانات الراجعة: { total, pending, accepted, completed }
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 200));

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  const totalRequests = medicineRequests.length;
  const pendingRequests = medicineRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const acceptedRequests = medicineRequests.filter(
    (r) => r.status === "accepted"
  ).length;
  const completedRequests = medicineRequests.filter(
    (r) => r.status === "completed"
  ).length;

  return {
    total: totalRequests,
    pending: pendingRequests,
    accepted: acceptedRequests,
    completed: completedRequests,
  };
};

// تحديث حالة الطلب
export const updateRequestStatus = async (requestId, newStatus) => {
  // TODO: ربط مع API هنا - PUT /api/medicine-requests/{requestId}/status
  // نوع البيانات المطلوبة: path param { requestId }, body { status }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: { id, status, updatedAt }
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 200));

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  const request = medicineRequests.find((r) => r.id === requestId);
  if (!request) {
    throw new Error("الطلب غير موجود");
  }

  request.status = newStatus;
  request.updatedAt = new Date().toISOString();

  // حفظ التحديثات
  localStorage.setItem("medicineRequests", JSON.stringify(medicineRequests));

  return request;
};

// حذف طلب (للاختبار فقط)
export const deleteRequest = async (requestId) => {
  // TODO: ربط مع API هنا - DELETE /api/medicine-requests/{requestId}
  // نوع البيانات المطلوبة: path param { requestId }
  // Headers: Content-Type: application/json
  // البيانات الراجعة: { success: true, message }
  // سيتم استبدال هذا بطلب API فعلي في المستقبل

  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 200));

  // الحصول على طلبات الأدوية من localStorage
  const medicineRequests = JSON.parse(
    localStorage.getItem("medicineRequests") || "[]"
  );

  const index = medicineRequests.findIndex((r) => r.id === requestId);
  if (index === -1) {
    throw new Error("الطلب غير موجود");
  }

  medicineRequests.splice(index, 1);

  // حفظ التحديثات
  localStorage.setItem("medicineRequests", JSON.stringify(medicineRequests));

  return { message: "تم حذف الطلب بنجاح" };
};

// إعادة تعيين البيانات (للاختبار فقط)
export const resetData = () => {
  localStorage.setItem("medicineRequests", "[]");
  localStorage.setItem("requestIdCounter", "1");
  return { message: "تم إعادة تعيين البيانات" };
};

// Initialize default pharmacies data in localStorage if not exists
const initializePharmaciesData = () => {
  // هنا هيكون ربط بالباك اند بعدين
  // البيانات التالية سيتم استبدالها بطلب API فعلي في المستقبل

  const defaultPharmacies = [
    {
      id: 1,
      name: "صيدلية الشفاء",
      location: { lat: 30.0444, lng: 31.2357 },
      address: "شارع التحرير، وسط البلد",
      phone: "02-25555555",
      rating: 4.8,
      isOpen: true,
      workingHours: "24 ساعة",
    },
    {
      id: 2,
      name: "صيدلية النور",
      location: { lat: 30.05, lng: 31.24 },
      address: "شارع الجمهورية، العتبة",
      phone: "02-25666666",
      rating: 4.5,
      isOpen: true,
      workingHours: "8 ص - 12 م",
    },
    {
      id: 3,
      name: "صيدلية الأمل",
      location: { lat: 30.04, lng: 31.23 },
      address: "شارع قصر العيني، المنيل",
      phone: "02-25777777",
      rating: 4.6,
      isOpen: true,
      workingHours: "9 ص - 11 م",
    },
    {
      id: 4,
      name: "صيدلية الحياة",
      location: { lat: 30.06, lng: 31.25 },
      address: "شارع رمسيس، العباسية",
      phone: "02-25888888",
      rating: 4.3,
      isOpen: false,
      workingHours: "8 ص - 10 م",
    },
    {
      id: 5,
      name: "صيدلية المستقبل",
      location: { lat: 30.035, lng: 31.225 },
      address: "كورنيش النيل، المعادي",
      phone: "02-25999999",
      rating: 4.7,
      isOpen: true,
      workingHours: "24 ساعة",
    },
  ];

  // Save default data to localStorage if not exists
  if (!localStorage.getItem("pharmacies")) {
    localStorage.setItem("pharmacies", JSON.stringify(defaultPharmacies));
  }
};

// Initialize pharmacies data when the module is loaded
initializePharmaciesData();
