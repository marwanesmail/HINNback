# 💊 Pharmacy Prescriptions from Doctors - روشتات الدكاترة

## 🎯 **نظرة عامة:**

خانة **"الروشتات"** في لوحة تحكم الصيدلية تعرض:
- ✅ روشتات مرسلة من **الدكاترة** (مش من المرضى)
- ✅ بيانات كاملة (دكتور + مريض + دواء)
- ✅ نظام **النقاط والولاء**
- ✅ 3 خيارات للرد (قبول / رفض / اتصال)

---

## 📊 **بيانات الروشتة المعروضة:**

| الحقل | الوصف |
|-------|-------|
| 👨‍⚕️ اسم الدكتور | اللي كتب الروشتة |
| 🎓 تخصص الدكتور | باطنة، أطفال، إلخ |
| 👤 اسم المريض | المريض اللي الروشتة له |
| 📱 رقم المريض | للتواصل |
| 💊 اسم الدواء | من الروشتة |
| 📝 التشخيص | Diagnosis |
| 📅 تاريخ الزيارة | Visit Date |
| 🏷️ نوع الروشتة | عادية، عاجلة، متكررة |
| ⭐ نقاط المريض | Loyalty Points |
| 💰 الخصم المتاح | Discount % |

---

## 🎮 **خيارات الرد للصيدلية:**

### **1. ✅ قبول (Accept)**
```
الصيدلية تقبل الروشتة
→ تحدد السعر
→ المريض يستلم إشعار
→ نقاط تُضاف للمريض
```

### **2. ❌ رفض (Reject)**
```
الصيدلية مش عندها الدواء
→ ترسل رفض
→ المريض يستلم إشعار
```

### **3. 📞 اتصال (Call)**
```
الصيدلية تتصل بالمريض
→ تناقش البدائل
→ تتفق على الأنسب
```

---

## 🌟 **نظام النقاط والولاء:**

### **كيف يعمل:**

```
كل عملية شراء = نقاط
كل 100 جنيه = 1 نقطة

مثال:
- اشتري بـ 250 جنيه = 2 نقطة
- اشتري بـ 1,500 جنيه = 15 نقطة
```

### **نظام الخصم:**

```
كل نقطة = 1% خصم
حد أقصى = 20% خصم

مثال:
- 5 نقاط = 5% خصم
- 15 نقطة = 15% خصم
- 25 نقطة = 20% خصم (الحد الأقصى)
```

### **مثال عملي:**

```
محمد اشترى أدوية بـ 1,200 جنيه من صيدلية النور

→ يحصل على 12 نقطة
→ يحصل على 12% خصم على الطلبات القادمة

الطلب القادم بـ 500 جنيه:
- الخصم: 500 × 12% = 60 جنيه
- يدفع: 440 جنيه فقط!
```

---

## 🌐 **API Endpoints:**

### **1. عرض الروشتات من الدكاترة:**

```bash
GET /api/pharmacy/prescriptions/from-doctors?status=pending
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalPrescriptions": 5,
  "pendingCount": 3,
  "respondedCount": 2,
  "prescriptions": [
    {
      "id": 1,
      "doctorName": "د. أحمد محمد",
      "doctorSpecialty": "باطنة",
      "patientName": "محمد أحمد علي",
      "patientPhone": "01234567890",
      "medicineTitle": "Panadol Extra",
      "diagnosis": "صداع مزمن",
      "visitDate": "2026-04-14",
      "prescriptionType": "Normal",
      "notes": "يؤخذ بعد الأكل",
      "status": "Pending",
      "statusArabic": "في الانتظار",
      "createdAt": "2026-04-14T10:00:00Z",
      "patientPoints": 12,
      "patientDiscount": 12
    }
  ]
}
```

---

### **2. الرد على روشتة:**

```bash
POST /api/pharmacy/prescriptions/{id}/respond
Authorization: Bearer {pharmacy_token}
Content-Type: application/json

// ✅ قبول
{
  "action": "accept",
  "price": 85.50,
  "note": "متوفر - جاهز للاستلام"
}

// ❌ رفض
{
  "action": "reject",
  "note": "غير متوفر حالياً"
}

// 📞 اتصال
{
  "action": "call",
  "note": "سنتواصل معك خلال ساعة"
}

Response:
{
  "message": "تم قبول الروشتة بنجاح",
  "responseId": 5,
  "pointsEarned": 0
}
```

---

## 📱 **Frontend Example:**

```vue
<template>
  <div class="pharmacy-prescriptions">
    <h1>الروشتات من الدكاترة</h1>
    
    <!-- فلترة -->
    <div class="filters">
      <button @click="filter = 'all'" :class="{ active: filter === 'all' }">
        الكل
      </button>
      <button @click="filter = 'pending'" :class="{ active: filter === 'pending' }">
        في الانتظار
      </button>
      <button @click="filter = 'responded'" :class="{ active: filter === 'responded' }">
        تم الرد
      </button>
    </div>
    
    <!-- قائمة الروشتات -->
    <div v-for="prescription in prescriptions" 
         :key="prescription.id" 
         class="prescription-card">
      
      <!-- معلومات الدكتور -->
      <div class="doctor-info">
        <h3>{{ prescription.doctorName }}</h3>
        <p class="specialty">{{ prescription.doctorSpecialty }}</p>
      </div>
      
      <!-- معلومات المريض -->
      <div class="patient-info">
        <p><strong>المريض:</strong> {{ prescription.patientName }}</p>
        <p><strong>الهاتف:</strong> {{ prescription.patientPhone }}</p>
      </div>
      
      <!-- معلومات الدواء -->
      <div class="medicine-info">
        <p><strong>الدواء:</strong> {{ prescription.medicineTitle }}</p>
        <p v-if="prescription.diagnosis"><strong>التشخيص:</strong> {{ prescription.diagnosis }}</p>
      </div>
      
      <!-- نقاط المريض والخصم -->
      <div class="loyalty-info">
        <div class="points">
          <span class="icon">⭐</span>
          <span class="value">{{ prescription.patientPoints }} نقطة</span>
        </div>
        <div class="discount">
          <span class="icon">💰</span>
          <span class="value">{{ prescription.patientDiscount }}% خصم</span>
        </div>
      </div>
      
      <!-- حالة الروشتة -->
      <div class="status">
        <span :class="['badge', prescription.status.toLowerCase()]">
          {{ prescription.statusArabic }}
        </span>
      </div>
      
      <!-- أزرار الرد (لو في الانتظار) -->
      <div v-if="prescription.status === 'Pending'" class="actions">
        <button @click="respond(prescription.id, 'accept')" class="btn-accept">
          ✅ قبول
        </button>
        <button @click="respond(prescription.id, 'reject')" class="btn-reject">
          ❌ رفض
        </button>
        <button @click="respond(prescription.id, 'call')" class="btn-call">
          📞 اتصال
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const prescriptions = ref([]);
const filter = ref('all');

const loadPrescriptions = async () => {
  const token = localStorage.getItem('token');
  const url = filter.value === 'all' 
    ? '/api/pharmacy/prescriptions/from-doctors'
    : `/api/pharmacy/prescriptions/from-doctors?status=${filter.value}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  prescriptions.value = data.prescriptions;
};

const respond = async (prescriptionId, action) => {
  const token = localStorage.getItem('token');
  
  let price = null;
  let note = '';
  
  if (action === 'accept') {
    price = prompt('أدخل سعر الدواء:');
    if (!price) return;
    note = 'متوفر - جاهز للاستلام';
  } else if (action === 'reject') {
    note = 'غير متوفر حالياً';
  } else if (action === 'call') {
    note = 'سنتواصل معك خلال ساعة';
  }
  
  const response = await fetch(`/api/pharmacy/prescriptions/${prescriptionId}/respond`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action,
      price: price ? parseFloat(price) : null,
      note
    })
  });
  
  if (response.ok) {
    alert(action === 'accept' ? 'تم قبول الروشتة بنجاح!' : 'تم الرد بنجاح');
    await loadPrescriptions();
  }
};

watch(filter, loadPrescriptions);
onMounted(loadPrescriptions);
</script>

<style scoped>
.pharmacy-prescriptions {
  padding: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters button {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.filters button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.prescription-card {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.doctor-info h3 {
  color: #1e40af;
  margin-bottom: 0.25rem;
}

.specialty {
  color: #6b7280;
  font-size: 0.875rem;
}

.loyalty-info {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.75rem;
  background: #fef3c7;
  border-radius: 8px;
}

.loyalty-info .points,
.loyalty-info .discount {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-accept {
  background: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-reject {
  background: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-call {
  background: #f59e0b;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.badge.pending {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.badge.responded {
  background: #d1fae5;
  color: #065f46;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}
</style>
```

---

## 📊 **Database - الحقول الجديدة:**

### **AspNetUsers Table:**

```sql
ALTER TABLE AspNetUsers ADD LoyaltyPoints INT NOT NULL DEFAULT 0;
ALTER TABLE AspNetUsers ADD TotalPurchases DECIMAL(18,2) NOT NULL DEFAULT 0;
ALTER TABLE AspNetUsers ADD DiscountPercentage DECIMAL(18,2) NOT NULL DEFAULT 0;
```

---

## 🔄 **Workflow الكامل:**

```
1. الدكتور يكتب روشتة من حسابه
   ↓
2. الروشتة تظهر عند الصيدليات في النطاق
   ↓
3. الصيدلية تشوف:
   ├── بيانات الدكتور
   ├── بيانات المريض
   ├── اسم الدواء
   └── نقاط المريض + الخصم
   ↓
4. الصيدلية تختار:
   ├── ✅ قبول → تحدد السعر → نقاط للمريض
   ├── ❌ رفض → إشعار للمريض
   └── 📞 اتصال → تتصل بالمريض
   ↓
5. إذا قبول:
   ├── المريض يستلم إشعار
   ├── نقاط تُضاف (كل 100 جنيه = 1 نقطة)
   └── الخصم يتحديث (كل نقطة = 1%)
   ↓
6. المريض يستخدم الخصم في الطلبات القادمة
```

---

## ✅ **الحالة:**

- ✅ **Model:** AppUser محدّث (LoyaltyPoints, TotalPurchases, DiscountPercentage)
- ✅ **Controller:** Pharmacy/PrescriptionsController جاهز
- ✅ **Endpoints:** عرض + رد
- ✅ **Loyalty System:** نقاط + خصم
- ✅ **Database:** Migration تمت
- ✅ **Build:** نجح

---

## 🚀 **الخطوة التالية**

### **اختبار:**

```bash
# 1. شغّل المشروع
cd "d:\final project\HINN\HINN"
dotnet run

# 2. سجّل دخول كصيدلية
POST /api/auth/login

# 3. اعرض الروشتات من الدكاترة
GET /api/pharmacy/prescriptions/from-doctors

# 4. رد على روشتة
POST /api/pharmacy/prescriptions/{id}/respond
```

---

## 🎉 **الخلاصة**

**خانة "الروشتات" جاهزة!**

- ✅ روشتات من الدكاترة
- ✅ بيانات كاملة (دكتور + مريض + دواء)
- ✅ 3 خيارات للرد (قبول / رفض / اتصال)
- ✅ نظام نقاط ولاء
- ✅ خصم تلقائي
- ✅ إشعارات فورية

**جاهز للاستخدام!** 💊🌟
