// خدمة إدارة الإشعارات للمرضى والصيدليات
// TODO: ربط مع API هنا - سيتم استبدال جميع الوظائف بطلبات API فعلية

// إنشاء إشعار جديد
export const createNotification = async (notificationData) => {
  try {
    // TODO: ربط مع API هنا - POST /api/notifications
    // نوع البيانات المطلوبة: { recipientType, recipientId, type, title, message, data }
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { id, recipientType, recipientId, type, title, message, data, timestamp, isRead, createdAt }
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    const {
      recipientType, // 'patient' or 'pharmacy'
      recipientId, // patient phone or pharmacy id
      type, // 'medicine_request', 'medicine_available', 'medicine_unavailable', etc.
      title,
      message,
      data = {}, // additional data like pharmacy info, medicines, etc.
    } = notificationData;

    // الحصول على الإشعارات من localStorage
    const notifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );

    // الحصول على معرف الإشعار التالي
    const notificationIdCounter = parseInt(
      localStorage.getItem("notificationIdCounter") || "1"
    );

    const newNotification = {
      id: notificationIdCounter,
      recipientType,
      recipientId,
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      isRead: false,
      createdAt: new Date().toISOString(),
      // إضافة معلومات الشات إذا كان الإشعار متعلق برسالة
      chatId: data.chatId || null,
      messageId: data.messageId || null,
      senderId: data.senderId || null,
      senderType: data.senderType || null,
      senderName: data.senderName || null,
      // نوع الإجراء المطلوب عند الضغط على الإشعار
      actionType: data.actionType || null, // 'open_chat', 'open_prescription', etc.
      actionData: data.actionData || {},
    };

    // حفظ الإشعار الجديد
    notifications.push(newNotification);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // تحديث معرف الإشعار التالي
    localStorage.setItem(
      "notificationIdCounter",
      (notificationIdCounter + 1).toString()
    );

    // محاكاة إرسال الإشعار
    console.log(`إشعار جديد لـ ${recipientType} ${recipientId}:`, {
      title,
      message,
    });

    return newNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// إنشاء إشعار رسالة شات جديدة
export const createChatMessageNotification = async (messageData) => {
  const {
    recipientId,
    recipientType,
    senderId,
    senderType,
    senderName,
    chatId,
    messageId,
    messageText,
  } = messageData;

  // تحديد نوع الإشعار حسب نوع المرسل
  let notificationType = "chat_message";
  let title = "";
  let message = "";

  if (senderType === "doctor") {
    notificationType = "doctor_message";
    title = `رسالة جديدة من ${senderName}`;
    message =
      messageText.length > 50
        ? `${messageText.substring(0, 50)}...`
        : messageText;
  } else if (senderType === "pharmacy") {
    notificationType = "pharmacy_message";
    title = `رسالة جديدة من ${senderName}`;
    message =
      messageText.length > 50
        ? `${messageText.substring(0, 50)}...`
        : messageText;
  } else if (senderType === "patient") {
    notificationType = "patient_message";
    title = `رسالة جديدة من المريض`;
    message =
      messageText.length > 50
        ? `${messageText.substring(0, 50)}...`
        : messageText;
  }

  const notificationData = {
    recipientType,
    recipientId,
    type: notificationType,
    title,
    message,
    data: {
      chatId,
      messageId,
      senderId,
      senderType,
      senderName,
      actionType: "open_chat",
      actionData: {
        chatId,
        participantId: senderId,
        participantType: senderType,
        participantName: senderName,
      },
    },
  };

  return await createNotification(notificationData);
};

// الحصول على إشعارات المستخدم
export const getUserNotifications = async (recipientType, recipientId) => {
  try {
    // TODO: ربط مع API هنا - GET /api/notifications?recipientType={recipientType}&recipientId={recipientId}
    // نوع البيانات المطلوبة: query params { recipientType, recipientId }
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: [{ id, recipientType, recipientId, type, title, message, data, timestamp, isRead, createdAt }]
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300));

    // الحصول على الإشعارات من localStorage
    const notifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );

    return notifications
      .filter(
        (n) =>
          n.recipientType === recipientType && n.recipientId === recipientId
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
};

// تحديد إشعار كمقروء
export const markNotificationAsRead = async (notificationId) => {
  try {
    // TODO: ربط مع API هنا - PUT /api/notifications/{notificationId}/read
    // نوع البيانات المطلوبة: path param { notificationId }
    // Headers: Content-Type: application/json, Authorization: Bearer {token}
    // البيانات الراجعة: { id, isRead, readAt }
    // سيتم استبدال هذا بطلب API فعلي في المستقبل

    // تأخير مؤقت لمحاكاة طلب الشبكة
    await new Promise((resolve) => setTimeout(resolve, 100));

    // الحصول على الإشعارات من localStorage
    const notifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );

    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();

      // حفظ التحديثات
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }

    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// تحديد جميع الإشعارات كمقروءة
// TODO: ربط مع API هنا - PUT /api/notifications/read-all?recipientType={recipientType}&recipientId={recipientId}
// نوع البيانات المطلوبة: query params { recipientType, recipientId }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: { count: number }
export const markAllNotificationsAsRead = async (
  recipientType,
  recipientId
) => {
  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 200));

  // الحصول على الإشعارات من localStorage
  const notifications = JSON.parse(
    localStorage.getItem("notifications") || "[]"
  );

  const userNotifications = notifications.filter(
    (n) => n.recipientType === recipientType && n.recipientId === recipientId
  );

  userNotifications.forEach((notification) => {
    notification.isRead = true;
    notification.readAt = new Date().toISOString();
  });

  // حفظ التحديثات
  localStorage.setItem("notifications", JSON.stringify(notifications));

  return userNotifications.length;
};

// حذف إشعار
// TODO: ربط مع API هنا - DELETE /api/notifications/{notificationId}
// نوع البيانات المطلوبة: path param { notificationId }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: { success: true }
export const deleteNotification = async (notificationId) => {
  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 100));

  // الحصول على الإشعارات من localStorage
  const notifications = JSON.parse(
    localStorage.getItem("notifications") || "[]"
  );

  const index = notifications.findIndex((n) => n.id === notificationId);
  if (index !== -1) {
    notifications.splice(index, 1);

    // حفظ التحديثات
    localStorage.setItem("notifications", JSON.stringify(notifications));
    return true;
  }

  return false;
};

// الحصول على عدد الإشعارات غير المقروءة
// TODO: ربط مع API هنا - GET /api/notifications/unread-count?recipientType={recipientType}&recipientId={recipientId}
// نوع البيانات المطلوبة: query params { recipientType, recipientId }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: { count: number }
export const getUnreadCount = async (recipientType, recipientId) => {
  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 100));

  // الحصول على الإشعارات من localStorage
  const notifications = JSON.parse(
    localStorage.getItem("notifications") || "[]"
  );

  return notifications.filter(
    (n) =>
      n.recipientType === recipientType &&
      n.recipientId === recipientId &&
      !n.isRead
  ).length;
};

// إرسال إشعار عند توفر الدواء
export const notifyMedicineAvailable = async (
  patientPhone,
  pharmacyData,
  medicineData
) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "medicine_available",
    title: "دواء متوفر!",
    message: `${pharmacyData.name} لديها الأدوية المطلوبة`,
    data: {
      pharmacyId: pharmacyData.id,
      pharmacyName: pharmacyData.name,
      pharmacyPhone: pharmacyData.phone,
      pharmacyAddress: pharmacyData.address,
      medicines: medicineData.medicines,
      totalPrice: medicineData.totalPrice,
      distance: pharmacyData.distance,
      requestId: medicineData.requestId,
    },
  });

  return notification;
};

// إرسال إشعار عند عدم توفر الدواء
export const notifyMedicineUnavailable = async (
  patientPhone,
  pharmacyData,
  medicineData
) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "medicine_unavailable",
    title: "دواء غير متوفر",
    message: `${pharmacyData.name}: الدواء غير متوفر حالياً`,
    data: {
      pharmacyId: pharmacyData.id,
      pharmacyName: pharmacyData.name,
      pharmacyPhone: pharmacyData.phone,
      medicines: medicineData.medicines,
      requestId: medicineData.requestId,
      reason: medicineData.reason || "غير متوفر",
    },
  });

  return notification;
};

// إرسال إشعار للصيدلية عند وصول طلب جديد
export const notifyPharmacyNewRequest = async (
  pharmacyId,
  patientData,
  medicineData
) => {
  const notification = await createNotification({
    recipientType: "pharmacy",
    recipientId: pharmacyId.toString(),
    type: "medicine_request",
    title: "طلب دواء جديد",
    message: `طلب جديد من ${patientData.name} (${patientData.distance})`,
    data: {
      patientName: patientData.name,
      patientPhone: patientData.phone,
      patientLocation: patientData.location,
      distance: patientData.distance,
      medicines: medicineData.medicines,
      requestId: medicineData.requestId,
      alternativeOption: medicineData.alternativeOption,
    },
  });

  return notification;
};

// إرسال إشعار تأكيد الطلب
export const notifyOrderConfirmation = async (patientPhone, orderData) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "order_confirmation",
    title: "تم تأكيد طلبك",
    message: `تم تأكيد طلبك من ${orderData.pharmacyName}`,
    data: {
      orderId: orderData.orderId,
      pharmacyName: orderData.pharmacyName,
      pharmacyPhone: orderData.pharmacyPhone,
      estimatedDelivery: orderData.estimatedDelivery,
      totalPrice: orderData.totalPrice,
      medicines: orderData.medicines,
    },
  });

  return notification;
};

// إرسال إشعار حالة التوصيل
export const notifyDeliveryStatus = async (patientPhone, deliveryData) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "delivery_status",
    title: `حالة التوصيل: ${deliveryData.status}`,
    message: deliveryData.message,
    data: {
      orderId: deliveryData.orderId,
      status: deliveryData.status, // 'preparing', 'on_way', 'delivered'
      estimatedTime: deliveryData.estimatedTime,
      driverName: deliveryData.driverName,
      driverPhone: deliveryData.driverPhone,
    },
  });

  return notification;
};

// إرسال إشعار تأكيد موعد من الطبيب
export const notifyAppointmentConfirmed = async (
  patientPhone,
  appointmentData
) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "appointment_confirmed",
    title: "تم تأكيد موعدك",
    message: `تم تأكيد موعدك مع ${appointmentData.doctorName}`,
    data: {
      appointmentId: appointmentData.appointmentId,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      doctorSpecialty: appointmentData.specialty,
      appointmentDate: appointmentData.date,
      appointmentTime: appointmentData.time,
      clinicLocation: appointmentData.location,
      doctorPhone: appointmentData.doctorPhone,
      notes: appointmentData.notes || "",
    },
  });

  return notification;
};

// إرسال إشعار رفض موعد من الطبيب
export const notifyAppointmentRejected = async (
  patientPhone,
  appointmentData
) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "appointment_rejected",
    title: "تم رفض الموعد",
    message: `تم رفض موعدك مع ${appointmentData.doctorName}`,
    data: {
      appointmentId: appointmentData.appointmentId,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      doctorSpecialty: appointmentData.specialty,
      rejectionReason: appointmentData.reason || "غير محدد",
      doctorPhone: appointmentData.doctorPhone,
      suggestedAlternatives: appointmentData.alternatives || [],
    },
  });

  return notification;
};

// إرسال إشعار ملاحظة من الطبيب
export const notifyDoctorNote = async (patientPhone, noteData) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "doctor_note",
    title: "ملاحظة من الطبيب",
    message: `${noteData.doctorName} أرسل لك ملاحظة جديدة`,
    data: {
      doctorId: noteData.doctorId,
      doctorName: noteData.doctorName,
      doctorSpecialty: noteData.specialty,
      noteContent: noteData.content,
      noteType: noteData.type, // 'prescription', 'advice', 'follow_up', 'test_results'
      appointmentId: noteData.appointmentId,
      doctorPhone: noteData.doctorPhone,
      attachments: noteData.attachments || [],
    },
  });

  return notification;
};

// إرسال إشعار تذكير بالموعد
export const notifyAppointmentReminder = async (
  patientPhone,
  appointmentData
) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "appointment_reminder",
    title: "تذكير بالموعد",
    message: `موعدك مع ${appointmentData.doctorName} غداً في ${appointmentData.time}`,
    data: {
      appointmentId: appointmentData.appointmentId,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      doctorSpecialty: appointmentData.specialty,
      appointmentDate: appointmentData.date,
      appointmentTime: appointmentData.time,
      clinicLocation: appointmentData.location,
      doctorPhone: appointmentData.doctorPhone,
      reminderType: appointmentData.reminderType, // '24h', '2h', '30m'
    },
  });

  return notification;
};

// إرسال إشعار تغيير موعد
export const notifyAppointmentRescheduled = async (
  patientPhone,
  appointmentData
) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "appointment_rescheduled",
    title: "تم تغيير موعدك",
    message: `تم تغيير موعدك مع ${appointmentData.doctorName} إلى ${appointmentData.newDate}`,
    data: {
      appointmentId: appointmentData.appointmentId,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      doctorSpecialty: appointmentData.specialty,
      oldDate: appointmentData.oldDate,
      oldTime: appointmentData.oldTime,
      newDate: appointmentData.newDate,
      newTime: appointmentData.newTime,
      reason: appointmentData.reason || "",
      doctorPhone: appointmentData.doctorPhone,
    },
  });

  return notification;
};

// إرسال إشعار نتائج التحاليل
export const notifyTestResults = async (patientPhone, testData) => {
  const notification = await createNotification({
    recipientType: "patient",
    recipientId: patientPhone,
    type: "test_results",
    title: "نتائج التحاليل جاهزة",
    message: `نتائج ${testData.testName} جاهزة للمراجعة`,
    data: {
      testId: testData.testId,
      testName: testData.testName,
      testDate: testData.testDate,
      doctorId: testData.doctorId,
      doctorName: testData.doctorName,
      labName: testData.labName,
      results: testData.results,
      normalRange: testData.normalRange,
      status: testData.status, // 'normal', 'abnormal', 'critical'
      doctorNotes: testData.doctorNotes || "",
      followUpRequired: testData.followUpRequired || false,
    },
  });

  return notification;
};

// محاكاة إرسال إشعارات تلقائية للاختبار
export const simulateNotifications = async (patientPhone, pharmacyId) => {
  // إشعار للمريض: دواء متوفر
  await notifyMedicineAvailable(
    patientPhone,
    {
      id: 1,
      name: "صيدلية الشفاء",
      phone: "02-25555555",
      address: "شارع التحرير، وسط البلد",
      distance: "0.5 كم",
    },
    {
      medicines: ["باراسيتامول 500mg", "فيتامين د"],
      totalPrice: 45.5,
      requestId: 1,
    }
  );

  // إشعار للصيدلية: طلب جديد
  await notifyPharmacyNewRequest(
    pharmacyId,
    {
      name: "أحمد محمد علي",
      phone: patientPhone,
      location: { lat: 30.0444, lng: 31.2357 },
      distance: "0.5 كم",
    },
    {
      medicines: [
        { name: "باراسيتامول 500mg", quantity: 2 },
        { name: "فيتامين د", quantity: 1 },
      ],
      requestId: 2,
      alternativeOption: "nearest",
    }
  );

  return { message: "تم إرسال الإشعارات التجريبية" };
};

// محاكاة إشعارات شاملة للمريض (للاختبار)
export const simulatePatientNotifications = async (patientPhone) => {
  // إشعار دواء متوفر
  await notifyMedicineAvailable(
    patientPhone,
    {
      id: 1,
      name: "صيدلية الشفاء",
      phone: "02-25555555",
      address: "شارع التحرير، وسط البلد",
      distance: "0.5 كم",
    },
    {
      medicines: ["باراسيتامول 500mg", "فيتامين د"],
      totalPrice: 45.5,
      requestId: 1,
    }
  );

  // إشعار تأكيد موعد
  await notifyAppointmentConfirmed(patientPhone, {
    appointmentId: 1,
    doctorId: 1,
    doctorName: "د. أحمد محمد",
    specialty: "باطنة",
    date: "2024-01-25",
    time: "10:00 ص",
    location: "عيادة النور الطبية",
    doctorPhone: "01111111111",
    notes: "يرجى الحضور قبل الموعد بـ 15 دقيقة",
  });

  // إشعار ملاحظة من الطبيب
  await notifyDoctorNote(patientPhone, {
    doctorId: 1,
    doctorName: "د. أحمد محمد",
    specialty: "باطنة",
    content: "يرجى الالتزام بالأدوية المحددة وتجنب الأطعمة الدسمة",
    type: "advice",
    appointmentId: 1,
    doctorPhone: "01111111111",
  });

  // إشعار نتائج تحاليل
  await notifyTestResults(patientPhone, {
    testId: 1,
    testName: "تحليل السكر في الدم",
    testDate: "2024-01-20",
    doctorId: 1,
    doctorName: "د. أحمد محمد",
    labName: "معمل الشفاء",
    results: "95 mg/dL",
    normalRange: "70-100 mg/dL",
    status: "normal",
    doctorNotes: "النتائج طبيعية، استمر على النظام الغذائي الحالي",
    followUpRequired: false,
  });

  // إشعار تذكير بموعد
  await notifyAppointmentReminder(patientPhone, {
    appointmentId: 2,
    doctorId: 2,
    doctorName: "د. فاطمة علي",
    specialty: "أطفال",
    date: "2024-01-26",
    time: "2:00 م",
    location: "مستشفى الشفاء",
    doctorPhone: "01222222222",
    reminderType: "24h",
  });

  return { message: "تم إرسال جميع أنواع الإشعارات التجريبية للمريض" };
};

// إعادة تعيين البيانات (للاختبار فقط)
export const resetNotifications = () => {
  localStorage.setItem("notifications", "[]");
  localStorage.setItem("notificationIdCounter", "1");
  return { message: "تم إعادة تعيين الإشعارات" };
};

// الحصول على جميع الإشعارات (للاختبار فقط)
export const getAllNotifications = async () => {
  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 100));

  // الحصول على الإشعارات من localStorage
  return JSON.parse(localStorage.getItem("notifications") || "[]");
};

// إحصائيات الإشعارات
export const getNotificationStats = async (recipientType, recipientId) => {
  // تأخير مؤقت لمحاكاة طلب الشبكة
  await new Promise((resolve) => setTimeout(resolve, 200));

  // الحصول على الإشعارات من localStorage
  const notifications = JSON.parse(
    localStorage.getItem("notifications") || "[]"
  );

  const userNotifications = notifications.filter(
    (n) => n.recipientType === recipientType && n.recipientId === recipientId
  );

  const total = userNotifications.length;
  const unread = userNotifications.filter((n) => !n.isRead).length;
  const byType = userNotifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    unread,
    read: total - unread,
    byType,
  };
};
