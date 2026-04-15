# 💊 Pharmacy Medicine Requests - طلبات الأدوية

## 🎯 **نظرة عامة:**

خانة **"طلبات الأدوية"** في لوحة تحكم الصيدلية:
- ✅ استقبال طلبات الأدوية من المرضى
- ✅ البحث بالنطاق الجغرافي (نفس نظام المريض)
- ✅ إحصائيات الطلبات
- ✅ الرد بالقبول أو الرفض

---

## 📊 **الإحصائيات المعروضة:**

| البطاقة | الوصف | مثال |
|---------|-------|------|
| 📋 طلبات جديدة | في انتظار الرد | 0 |
| ✅ طلبات مقبولة | تم قبولها | 0 |
| 📈 إجمالي الطلبات | اليوم | 0 |

---

## 📝 **قائمة الطلبات:**

### **العنوان:**
```
طلبات الأدوية من المرضى القريبين منك
```

### **بيانات كل طلب:**
- 👤 اسم المريض
- 📱 رقم الهاتف
- 💊 اسم الدواء
- 📝 ملاحظات
- 🖼️ صورة الروشتة (لو موجودة)
- 📍 عنوان التوصيل
- 📏 المسافة من الصيدلية
- ⏰ وقت الطلب
- 🔄 بديل الدواء (SearchAlternative/CompleteWithoutMissing/PhoneConsultation)

---

## 🌐 **API Endpoints:**

### **1. إحصائيات الطلبات:**

```bash
GET /api/pharmacy/medicineRequests/stats
Authorization: Bearer {pharmacy_token}

Response:
{
  "newRequests": 0,
  "acceptedRequests": 0,
  "totalRequests": 0,
  "date": "2026-04-14"
}
```

---

### **2. عرض الطلبات القريبة:**

```bash
GET /api/pharmacy/medicineRequests/nearby
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalRequests": 3,
  "pharmacyLocation": {
    "latitude": 30.0444,
    "longitude": 31.2357,
    "pharmacyName": "صيدلية النور",
    "address": "15 شارع التحرير"
  },
  "requests": [
    {
      "id": 1,
      "patientName": "محمد أحمد",
      "patientPhone": "01234567890",
      "medicineTitle": "Panadol Extra",
      "notes": "أحتاج توصيل سريع",
      "prescriptionImagePath": "/uploads/recipe.jpg",
      "deliveryAddress": "20 شارع الجامعة، الدقي",
      "latitude": 30.0450,
      "longitude": 31.2360,
      "searchRadiusKm": 5,
      "alternativePreference": "SearchAlternative",
      "createdAt": "2026-04-14T10:00:00Z",
      "distance": 0.8,
      "hasResponded": false
    }
  ]
}
```

---

### **3. الرد على طلب:**

```bash
POST /api/pharmacy/medicineRequests/{id}/respond
Authorization: Bearer {pharmacy_token}
Content-Type: application/json

// ✅ قبول
{
  "isAvailable": true,
  "price": 85.50,
  "note": "متوفر - جاهز للاستلام"
}

// ❌ رفض
{
  "isAvailable": false,
  "note": "غير متوفر حالياً"
}

Response:
{
  "message": "تم قبول الطلب بنجاح",
  "responseId": 5,
  "pointsEarned": 0
}
```

---

## 📱 **Frontend Example:**

```vue
<template>
  <div class="medicine-requests">
    <h1>طلبات الأدوية</h1>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- الإحصائيات -->
    <!-- ═══════════════════════════════════════ -->
    <div class="stats-grid">
      <div class="stat-card warning">
        <div class="icon">📋</div>
        <div class="value">{{ stats.newRequests }}</div>
        <div class="label">طلبات جديدة</div>
        <div class="sublabel">في انتظار الرد</div>
      </div>
      
      <div class="stat-card success">
        <div class="icon">✅</div>
        <div class="value">{{ stats.acceptedRequests }}</div>
        <div class="label">طلبات مقبولة</div>
        <div class="sublabel">تم قبولها</div>
      </div>
      
      <div class="stat-card info">
        <div class="icon">📈</div>
        <div class="value">{{ stats.totalRequests }}</div>
        <div class="label">إجمالي الطلبات</div>
        <div class="sublabel">اليوم</div>
      </div>
    </div>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- قائمة الطلبات -->
    <!-- ═══════════════════════════════════════ -->
    <section class="requests-list">
      <h2>طلبات الأدوية من المرضى القريبين منك</h2>
      
      <!-- لا توجد طلبات -->
      <div v-if="requests.length === 0" class="empty-state">
        <div class="icon">📭</div>
        <h3>لا توجد طلبات أدوية حالياً</h3>
        <p>ستظهر الطلبات هنا عندما يرسل مرضى قريبين طلبات</p>
      </div>
      
      <!-- قائمة الطلبات -->
      <div v-else class="requests-grid">
        <div v-for="request in requests" 
             :key="request.id" 
             class="request-card">
          
          <!-- معلومات المريض -->
          <div class="patient-info">
            <h3>{{ request.patientName }}</h3>
            <p>📱 {{ request.patientPhone }}</p>
          </div>
          
          <!-- معلومات الدواء -->
          <div class="medicine-info">
            <p><strong>الدواء:</strong> {{ request.medicineTitle }}</p>
            <p v-if="request.notes"><strong>ملاحظات:</strong> {{ request.notes }}</p>
          </div>
          
          <!-- عنوان التوصيل -->
          <div v-if="request.deliveryAddress" class="delivery-info">
            <p>📍 {{ request.deliveryAddress }}</p>
          </div>
          
          <!-- صورة الروشتة -->
          <div v-if="request.prescriptionImagePath" class="prescription-image">
            <img :src="request.prescriptionImagePath" alt="روشتة" />
          </div>
          
          <!-- معلومات إضافية -->
          <div class="meta-info">
            <span class="distance">📏 {{ request.distance.toFixed(1) }} كم</span>
            <span class="time">⏰ {{ formatTime(request.createdAt) }}</span>
            <span class="alternative">
              🔄 {{ getAlternativeText(request.alternativePreference) }}
            </span>
          </div>
          
          <!-- أزرار الرد -->
          <div v-if="!request.hasResponded" class="actions">
            <button @click="respond(request.id, true)" class="btn-accept">
              ✅ قبول
            </button>
            <button @click="respond(request.id, false)" class="btn-reject">
              ❌ رفض
            </button>
          </div>
          
          <!-- تم الرد -->
          <div v-else class="responded-badge">
            ✅ تم الرد
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref({
  newRequests: 0,
  acceptedRequests: 0,
  totalRequests: 0
});

const requests = ref([]);

const loadStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/medicineRequests/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  stats.value = data;
};

const loadRequests = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/medicineRequests/nearby', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  requests.value = data.requests;
};

const respond = async (requestId, isAvailable) => {
  const token = localStorage.getItem('token');
  
  let price = null;
  let note = '';
  
  if (isAvailable) {
    price = prompt('أدخل سعر الدواء:');
    if (!price) return;
    note = 'متوفر - جاهز للاستلام';
  } else {
    note = 'غير متوفر حالياً';
  }
  
  const response = await fetch(`/api/pharmacy/medicineRequests/${requestId}/respond`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      isAvailable,
      price: price ? parseFloat(price) : null,
      note
    })
  });
  
  if (response.ok) {
    alert(isAvailable ? 'تم قبول الطلب بنجاح!' : 'تم رفض الطلب');
    await Promise.all([loadStats(), loadRequests()]);
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000; // seconds
  
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return date.toLocaleDateString('ar-EG');
};

const getAlternativeText = (preference) => {
  const map = {
    'SearchAlternative': 'بحث عن بديل',
    'CompleteWithoutMissing': 'إكمال بدون الناقص',
    'PhoneConsultation': 'التواصل الهاتفي'
  };
  return map[preference] || preference;
};

onMounted(() => {
  loadStats();
  loadRequests();
});
</script>

<style scoped>
.medicine-requests {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card.warning {
  border-top: 4px solid #f59e0b;
}

.stat-card.success {
  border-top: 4px solid #10b981;
}

.stat-card.info {
  border-top: 4px solid #3b82f6;
}

.stat-card .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-card .value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-card .label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-card .sublabel {
  font-size: 0.875rem;
  color: #6b7280;
}

.requests-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.requests-grid {
  display: grid;
  gap: 1rem;
}

.request-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.patient-info h3 {
  color: #1e40af;
  margin-bottom: 0.25rem;
}

.medicine-info,
.delivery-info {
  margin: 0.75rem 0;
}

.prescription-image img {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  margin: 0.5rem 0;
}

.meta-info {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.875rem;
  color: #6b7280;
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
  flex: 1;
}

.btn-reject {
  background: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
}

.responded-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  margin-top: 1rem;
}
</style>
```

---

## 🔄 **Workflow الكامل:**

```
1. المريض يرسل طلب دواء (مع الموقع)
   ↓
2. النظام يبحث عن صيدليات في النطاق
   ↓
3. الطلب يظهر عند الصيدليات القريبة
   ↓
4. الصيدلية تشوف:
   ├── إحصائيات الطلبات
   └── قائمة الطلبات القريبة
   ↓
5. الصيدلية ترد:
   ├── ✅ قبول → تحدد السعر → نقاط للمريض
   └── ❌ رفض → إشعار للمريض
   ↓
6. المريض يستلم الرد
```

---

## 📊 **مثال بيانات الطلب:**

```
┌─────────────────────────────────────────────┐
│  محمد أحمد                                  │
│  📱 01234567890                             │
├─────────────────────────────────────────────┤
│  💊 الدواء: Panadol Extra                   │
│  📝 ملاحظات: أحتاج توصيل سريع              │
│  📍 20 شارع الجامعة، الدقي                 │
│  🖼️ [صورة الروشتة]                         │
├─────────────────────────────────────────────┤
│  📏 0.8 كم  ⏰ منذ 5 دقائق                 │
│  🔄 بحث عن بديل                            │
├─────────────────────────────────────────────┤
│  [✅ قبول]        [❌ رفض]                  │
└─────────────────────────────────────────────┘
```

---

## ✅ **الحالة:**

- ✅ **Controller:** MedicineRequestsController جاهز
- ✅ **Endpoints:** إحصائيات + قائمة + رد
- ✅ **Geographic Search:** نفس نظام المريض
- ✅ **Loyalty Points:** نقاط عند القبول
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

# 3. اعرض الإحصائيات
GET /api/pharmacy/medicineRequests/stats

# 4. اعرض الطلبات القريبة
GET /api/pharmacy/medicineRequests/nearby

# 5. رد على طلب
POST /api/pharmacy/medicineRequests/{id}/respond
```

---

## 🎉 **الخلاصة**

**خانة "طلبات الأدوية" جاهزة!**

- ✅ إحصائيات الطلبات
- ✅ قائمة الطلبات القريبة
- ✅ البحث بالنطاق الجغرافي
- ✅ الرد بالقبول أو الرفض
- ✅ نظام النقاط
- ✅ إشعارات فورية

**جاهز للاستخدام!** 💊🚀
