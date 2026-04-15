# 💊 طلب دواء أونلاين - Online Medicine Order

## 🎯 **نظرة عامة:**

هذا النظام هو **صفحة واحدة** تجمع بين:
1. **رفع الروشتة** (Prescription Upload)
2. **إضافة يدوية** للأدوية
3. **تحديد موقع التوصيل**
4. **خيارات بديل الدواء**

---

## 📝 **البيانات المطلوبة:**

### **1. بيانات المريض:**
- ✅ اسم المريض *
- ✅ رقم الهاتف *

### **2. عنوان التوصيل:**
- ✅ تحديد موقعي الحالي (GPS)
- ✅ إضافة عنوان يدوي
- ✅ إظهار الخريطة

### **3. معلومات الدواء:**
- ✅ رفع صورة الروشتة (PNG, JPG, JPEG حتى 10MB)
- ✅ إضافة يدوية لأسماء الأدوية

### **4. خيارات بديل الدواء:** (مطلوب الاختيار)
- 🔘 **بحث عن بديل** - نختار لك بديل مناسب إن وجد
- 🔘 **إكمال بدون الناقص** - تجهيز الطلب بدون الأدوية غير المتوفرة
- 🔘 **التواصل الهاتفي** - نتواصل معك عبر الهاتف لمناقشة البدائل

---

## 🔧 **التحديثات في Backend:**

### **1. Prescription Model - حقول جديدة:**

```csharp
// بيانات التوصيل
public string? PatientName { get; set; }          // اسم المريض
public string? PhoneNumber { get; set; }          // رقم الهاتف
public string? DeliveryAddress { get; set; }      // عنوان التوصيل

// خيارات بديل الدواء
public string? AlternativePreference { get; set; } // SearchAlternative, CompleteWithoutMissing, PhoneConsultation
```

### **2. PrescriptionRequestDto:**

```csharp
public class PrescriptionRequestDto
{
    // بيانات المريض
    [Required] public string PatientName { get; set; }
    [Required, Phone] public string PhoneNumber { get; set; }
    
    // بيانات الروشتة
    public string? Title { get; set; }
    public string? Notes { get; set; }
    public IFormFile? PrescriptionImage { get; set; }
    
    // عنوان التوصيل
    public string? DeliveryAddress { get; set; }
    [Required] public double Latitude { get; set; }
    [Required] public double Longitude { get; set; }
    public double SearchRadiusKm { get; set; } = 5;
    
    // خيارات بديل الدواء
    [Required] public string AlternativePreference { get; set; } = "PhoneConsultation";
}
```

---

## 🌐 **API Endpoint:**

### **طلب دواء أونلاين:**

```bash
POST /api/patient/request-medicine
Authorization: Bearer {patient_token}
Content-Type: multipart/form-data

Form Data:
{
  "patientName": "أحمد محمد",
  "phoneNumber": "01234567890",
  "deliveryAddress": "15 شارع التحرير، الدقي",
  "latitude": 30.0444,
  "longitude": 31.2357,
  "searchRadiusKm": 10,
  "alternativePreference": "SearchAlternative",
  "title": "أدوية روشتة",
  "notes": "أحتاج توصيل سريع",
  "prescriptionImage": [File]
}
```

### **Response:**

```json
{
  "message": "تم إرسال الطلب بنجاح! سيتم إشعار الصيدليات القريبة",
  "prescriptionId": 1,
  "searchRadius": 10
}
```

---

## 🎯 **خيارات بديل الدواء:**

### **1. SearchAlternative (بحث عن بديل):**
```
إذا كان الدواء غير متوفر:
→ الصيدلية تبحث عن بديل مناسب
→ ترد على المريض بالبديل والسعر
```

### **2. CompleteWithoutMissing (إكمال بدون الناقص):**
```
إذا كان الدواء غير متوفر:
→ الصيدلية تصرف المتاح فقط
→ المريض يستلم الجزء المتوفر
```

### **3. PhoneConsultation (التواصل الهاتفي):**
```
إذا كان الدواء غير متوفر:
→ الصيدلية تتصل بالمريض
→ يناقشوا البدائل معاً
→ يتفقوا على الأنسب
```

---

## 📱 **Frontend Example:**

### **صفحة طلب دواء أونلاين:**

```vue
<template>
  <div class="medicine-order-page">
    <h2>طلب دواء أونلاين</h2>
    
    <!-- بيانات المريض -->
    <section class="patient-info">
      <input v-model="form.patientName" placeholder="اسم المريض *" required />
      <input v-model="form.phoneNumber" placeholder="رقم الهاتف *" type="tel" required />
    </section>
    
    <!-- عنوان التوصيل -->
    <section class="delivery-address">
      <button @click="getCurrentLocation">📍 تحديد موقعي الحالي</button>
      <input v-model="form.deliveryAddress" placeholder="إضافة عنوان يدوي" />
      <button @click="showMap = !showMap">🗺️ إظهار الخريطة</button>
      <MapComponent v-if="showMap" @location-selected="onLocationSelected" />
    </section>
    
    <!-- معلومات الدواء -->
    <section class="medicine-info">
      <h3>ارفع صورة الروشتة</h3>
      <input type="file" @change="onImageUpload" accept=".png,.jpg,.jpeg" />
      <small>PNG, JPG, JPEG حتى 10MB</small>
    </section>
    
    <!-- خيارات بديل الدواء -->
    <section class="alternative-options">
      <h3>إذا كان الدواء غير متوفر؟ *</h3>
      
      <label>
        <input type="radio" v-model="form.alternativePreference" value="SearchAlternative" />
        <strong>بحث عن بديل</strong>
        <p>نختار لك بديل مناسب إن وجد</p>
      </label>
      
      <label>
        <input type="radio" v-model="form.alternativePreference" value="CompleteWithoutMissing" />
        <strong>إكمال بدون الناقص</strong>
        <p>تجهيز الطلب بدون الأدوية غير المتوفرة</p>
      </label>
      
      <label>
        <input type="radio" v-model="form.alternativePreference" value="PhoneConsultation" />
        <strong>التواصل الهاتفي</strong>
        <p>نتواصل معك عبر الهاتف لمناقشة البدائل</p>
      </label>
    </section>
    
    <button @click="submitOrder" :disabled="!isFormValid">
      إرسال الطلب الآن
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const form = ref({
  patientName: '',
  phoneNumber: '',
  deliveryAddress: '',
  latitude: null,
  longitude: null,
  searchRadiusKm: 10,
  alternativePreference: 'PhoneConsultation',
  title: '',
  notes: '',
  prescriptionImage: null
});

const showMap = ref(false);

const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    form.value.latitude = position.coords.latitude;
    form.value.longitude = position.coords.longitude;
    form.value.deliveryAddress = 'تم تحديد الموقع الحالي';
  });
};

const onLocationSelected = (location) => {
  form.value.latitude = location.lat;
  form.value.longitude = location.lng;
  form.value.deliveryAddress = location.address;
};

const onImageUpload = (event) => {
  form.value.prescriptionImage = event.target.files[0];
};

const isFormValid = computed(() => {
  return form.value.patientName && 
         form.value.phoneNumber && 
         form.value.latitude && 
         form.value.longitude &&
         form.value.prescriptionImage;
});

const submitOrder = async () => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  formData.append('patientName', form.value.patientName);
  formData.append('phoneNumber', form.value.phoneNumber);
  formData.append('deliveryAddress', form.value.deliveryAddress);
  formData.append('latitude', form.value.latitude);
  formData.append('longitude', form.value.longitude);
  formData.append('searchRadiusKm', form.value.searchRadiusKm);
  formData.append('alternativePreference', form.value.alternativePreference);
  formData.append('title', 'طلب أدوية');
  formData.append('prescriptionImage', form.value.prescriptionImage);
  
  const response = await fetch('/api/patient/request-medicine', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (response.ok) {
    alert('تم إرسال الطلب بنجاح!');
    // الانتقال لصفحة الأدوية المصروفة
  }
};
</script>
```

---

## 🔄 **Workflow الكامل:**

```
1. المريض يملأ النموذج:
   ├── اسم المريض
   ├── رقم الهاتف
   ├── عنوان التوصيل (GPS أو يدوي)
   ├── صورة الروشتة
   └── خيار بديل الدواء
   ↓
2. Backend يحفظ الروشتة مع:
   ├── الموقع الجغرافي
   ├── نطاق البحث
   └── تفضيلات البديل
   ↓
3. إشعار للصيدليات في النطاق
   ↓
4. الصيدليات ترد:
   ├── متوفر ✅
   ├── غير متوفر + بديل 🔄
   └── غير متوفر ❌
   ↓
5. المريض يشوف الردود في "الأدوية المصروفة"
   ↓
6. حسب خيار البديل:
   ├── SearchAlternative → يقبل البديل أو يرفض
   ├── CompleteWithoutMissing → يتصرف المتاح
   └── PhoneConsultation → الصيدلية تتصل بيه
   ↓
7. التوصيل للمريض
```

---

## 📊 **Database Updates:**

### **Prescription Table - أعمدة جديدة:**

```sql
ALTER TABLE Prescriptions ADD PatientName NVARCHAR(200) NULL;
ALTER TABLE Prescriptions ADD PhoneNumber NVARCHAR(MAX) NULL;
ALTER TABLE Prescriptions ADD DeliveryAddress NVARCHAR(500) NULL;
ALTER TABLE Prescriptions ADD AlternativePreference NVARCHAR(50) NULL;
```

---

## ✅ **الحالة:**

- ✅ **Model:** Prescription محدّث
- ✅ **DTO:** PrescriptionRequestDto محدّث
- ✅ **Database:** Migration تمت
- ✅ **Build:** نجح
- ✅ **Endpoint:** موجود (`/api/patient/request-medicine`)

---

## 🚀 **الخطوة التالية**

### **اختبار:**

```bash
# 1. شغّل المشروع
cd "d:\final project\HINN\HINN"
dotnet run

# 2. افتح Swagger
https://localhost:5176/swagger

# 3. اختبر endpoint
POST /api/patient/request-medicine
```

---

## 🎉 **الخلاصة**

**صفحة "طلب دواء أونلاين" دلوقتي:**
- ✅ اسم المريض ورقم الهاتف
- ✅ عنوان التوصيل (GPS أو يدوي)
- ✅ رفع صورة الروشتة
- ✅ 3 خيارات لبديل الدواء
- ✅ البحث بالنطاق الجغرافي
- ✅ إشعار الصيدليات القريبة
- ✅ الردود تظهر في "الأدوية المصروفة"

**جاهز للاستخدام!** 💊🚀
