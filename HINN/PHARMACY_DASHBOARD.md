# 🏥 Pharmacy Dashboard - لوحة تحكم الصيدلية

## 🎯 **نظرة عامة:**

عندما تسجل الصيدلية دخولها، تظهر لوحة تحكم بـ **8 خانات (Tabs):**

---

## 📋 **الخانات الثمانية:**

### **1. لوحة التحكم (Dashboard)** ✅
### **2. الروشتات (Prescriptions)**
### **3. طلبات الأدوية (Medicine Requests)**
### **4. المخزون (Inventory)**
### **5. تبادل الأدوية (Drug Exchange)**
### **6. طلب أدوية (Order Medicines)**
### **7. المحادثات (Messages)**
### **8. التقارير (Reports)**

---

## ✅ **1. لوحة التحكم (Dashboard)**

### **Endpoint:**
```
GET /api/PharmacyDashboard/stats
Authorization: Bearer {pharmacy_token}
```

### **Response:**
```json
{
  "stats": {
    "newPrescriptions": 1,
    "pendingReview": 1,
    "nearbyPatientRequests": 0,
    "lowStockItems": 3,
    "needsReorder": 3,
    "exchangeRequests": 1,
    "monthlySales": 125000.00,
    "todaySales": 280.50,
    "totalInventoryValue": 0,
    "completedToday": 0
  },
  "recentPrescriptions": [
    {
      "id": 1,
      "patientName": "محمد أحمد علي",
      "doctorName": "د. أحمد محمد",
      "medicineCount": 3,
      "status": "Pending",
      "statusArabic": "في الانتظار",
      "totalPrice": 85.50,
      "createdAt": "2026-04-11T10:00:00Z"
    }
  ]
}
```

---

## 📊 **بطاقات الإحصائيات في Dashboard:**

### **الصف الأول:**
| البطاقة | الوصف | القيمة |
|---------|-------|--------|
| 📋 الروشتات الجديدة | طلبات جديدة اليوم | 1 |
| ⏳ في انتظار المراجعة | تحتاج مراجعة من الصيدلية | 1 |
| 💊 طلبات أدوية جديدة | من المرضى القريبين | 0 |

### **الصف الثاني:**
| البطاقة | الوصف | القيمة |
|---------|-------|--------|
| ⚠️ المخزون المنخفض | يحتاج إعادة طلب | 3 |
| 🔄 طلبات التبادل | من صيدليات أخرى | 1 |
| 💰 إجمالي المبيعات | هذا الشهر (+15%) | 125,000 ج.م |

### **الصف الثالث:**
| البطاقة | الوصف | القيمة |
|---------|-------|--------|
| 📦 قيمة المخزون | إجمالي | 0 ج.م |
| ✅ الروشتات المكتملة اليوم | تم تجهيزها | 0 |

---

## 📝 **2. الروشتات (Prescriptions)**

### **الوظيفة:**
عرض كل الروشتات التي ردت عليها الصيدلية

### **Endpoints:**
```
GET /api/pharmacy/my-responses
```

### **البيانات المعروضة:**
- اسم المريض
- اسم الدواء
- حالة الرد (متوفر/غير متوفر)
- السعر
- حالة المريض (قبل/رفض/مشافش)
- التاريخ

---

## 💊 **3. طلبات الأدوية (Medicine Requests)**

### **الوظيفة:**
عرض الطلبات الجديدة من المرضى في النطاق

### **Endpoints:**
```
GET /api/pharmacy/nearby-requests
```

### **البيانات المعروضة:**
- اسم المريض
- اسم الدواء/الروشتة
- المسافة من الصيدلية
- وقت الطلب
- صورة الروشتة

---

## 📦 **4. المخزون (Inventory)**

### **الوظيفة:**
إدارة مخزون الأدوية في الصيدلية

### **⚠️ محتاج Inventory Model (بعدين):**

```csharp
public class PharmacyInventory
{
    public int Id { get; set; }
    public int PharmacyId { get; set; }
    public string MedicineName { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public DateTime ExpiryDate { get; set; }
    public int LowStockThreshold { get; set; } = 10;
}
```

### **البيانات المعروضة:**
- قائمة الأدوية
- الكمية المتوفرة
- تنبيه المخزون المنخفض
- الأدوية المنتهية قريباً

---

## 🔄 **5. تبادل الأدوية (Drug Exchange)**

### **الوظيفة:**
تبادل الأدوية بين الصيدليات

### **⚠️ محتاج DrugExchange Model (بعدين):**

```csharp
public class DrugExchange
{
    public int Id { get; set; }
    public int FromPharmacyId { get; set; }
    public int ToPharmacyId { get; set; }
    public string MedicineName { get; set; }
    public int Quantity { get; set; }
    public ExchangeStatus Status { get; set; }
    public DateTime RequestDate { get; set; }
}
```

### **البيانات المعروضة:**
- طلبات التبادل الواردة
- طلبات التبادل الصادرة
- حالة الطلب

---

## 🛒 **6. طلب أدوية (Order Medicines)**

### **الوظيفة:**
الصيدلية تطلب أدوية من الشركات/الموردين

### **⚠️ محتاج Order Model (بعدين):**

```csharp
public class PharmacyOrder
{
    public int Id { get; set; }
    public int PharmacyId { get; set; }
    public int? CompanyId { get; set; }
    public string MedicineName { get; set; }
    public int Quantity { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime OrderDate { get; set; }
}
```

### **البيانات المعروضة:**
- طلبات الأدوية المرسلة
- حالة الطلب
- تاريخ التسليم المتوقع

---

## 💬 **7. المحادثات (Messages)**

### **الوظيفة:**
التواصل مع المرضى والدكاترة

### **Endpoints:**
```
GET /api/messages/conversations
POST /api/messages/send
```

### **البيانات المعروضة:**
- قائمة المحادثات
- الرسائل الجديدة
- إرسال رسائل

---

## 📈 **8. التقارير (Reports)**

### **الوظيفة:**
تقارير إحصائية عن أداء الصيدلية

### **⚠️ محتاج Reports Endpoints (بعدين):**

### **التقارير المطلوبة:**
- تقرير المبيعات اليومي/الأسبوعي/الشهري
- تقرير الأدوية الأكثر طلباً
- تقرير الروشتات المكتملة
- تقرير المخزون
- تقرير التبادلات

---

## 🌐 **Frontend Example - Dashboard:**

```vue
<template>
  <div class="pharmacy-dashboard">
    <h1>لوحة التحكم</h1>
    
    <!-- بطاقات الإحصائيات -->
    <div class="stats-grid">
      <!-- الصف الأول -->
      <div class="stat-card">
        <div class="icon">📋</div>
        <div class="value">{{ stats.newPrescriptions }}</div>
        <div class="label">روشتات جديدة</div>
      </div>
      
      <div class="stat-card">
        <div class="icon">⏳</div>
        <div class="value">{{ stats.pendingReview }}</div>
        <div class="label">في انتظار المراجعة</div>
      </div>
      
      <div class="stat-card">
        <div class="icon">💊</div>
        <div class="value">{{ stats.nearbyPatientRequests }}</div>
        <div class="label">طلبات أدوية جديدة</div>
      </div>
      
      <!-- الصف الثاني -->
      <div class="stat-card warning">
        <div class="icon">⚠️</div>
        <div class="value">{{ stats.lowStockItems }}</div>
        <div class="label">المخزون المنخفض</div>
      </div>
      
      <div class="stat-card">
        <div class="icon">🔄</div>
        <div class="value">{{ stats.exchangeRequests }}</div>
        <div class="label">طلبات التبادل</div>
      </div>
      
      <div class="stat-card success">
        <div class="icon">💰</div>
        <div class="value">{{ formatPrice(stats.monthlySales) }}</div>
        <div class="label">إجمالي المبيعات</div>
        <div class="trend">+15% هذا الشهر</div>
      </div>
      
      <!-- الصف الثالث -->
      <div class="stat-card">
        <div class="icon">📦</div>
        <div class="value">{{ formatPrice(stats.totalInventoryValue) }}</div>
        <div class="label">قيمة المخزون</div>
      </div>
      
      <div class="stat-card success">
        <div class="icon">✅</div>
        <div class="value">{{ stats.completedToday }}</div>
        <div class="label">الروشتات المكتملة اليوم</div>
      </div>
    </div>
    
    <!-- الروشتات الحديثة -->
    <section class="recent-prescriptions">
      <div class="header">
        <h2>الروشتات الحديثة</h2>
        <button @click="viewAll">عرض الكل</button>
      </div>
      
      <div v-for="prescription in recentPrescriptions" 
           :key="prescription.id" 
           class="prescription-card">
        <div class="patient-info">
          <h3>{{ prescription.patientName }}</h3>
          <p>{{ prescription.doctorName }}</p>
        </div>
        
        <div class="details">
          <span class="medicine-count">
            {{ prescription.medicineCount }} أدوية
          </span>
          <span :class="['status', prescription.status.toLowerCase()]">
            {{ prescription.statusArabic }}
          </span>
          <span class="price">
            {{ prescription.totalPrice }} ج.م
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref({
  newPrescriptions: 0,
  pendingReview: 0,
  nearbyPatientRequests: 0,
  lowStockItems: 0,
  needsReorder: 0,
  exchangeRequests: 0,
  monthlySales: 0,
  todaySales: 0,
  totalInventoryValue: 0,
  completedToday: 0
});

const recentPrescriptions = ref([]);

const loadDashboard = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/PharmacyDashboard/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  stats.value = data.stats;
  recentPrescriptions.value = data.recentPrescriptions;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP'
  }).format(price);
};

onMounted(loadDashboard);
</script>

<style scoped>
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
}

.stat-card.success {
  border-left: 4px solid #10b981;
}

.stat-card.warning {
  border-left: 4px solid #f59e0b;
}

.stat-card .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-card .value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-card .label {
  color: #6b7280;
  font-size: 0.875rem;
}

.stat-card .trend {
  color: #10b981;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.recent-prescriptions {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recent-prescriptions .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.prescription-card {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.prescription-card:last-child {
  border-bottom: none;
}

.prescription-card .status.pending {
  color: #f59e0b;
}

.prescription-card .status.responded {
  color: #10b981;
}
</style>
```

---

## ✅ **الحالة:**

| الخانة | الحالة | الملاحظات |
|--------|--------|-----------|
| ✅ لوحة التحكم | جاهز | Endpoint موجود |
| ⚪ الروشتات | موجود | `/api/pharmacy/my-responses` |
| ⚪ طلبات الأدوية | موجود | `/api/pharmacy/nearby-requests` |
| ⚠️ المخزون | محتاج Model | بعدين |
| ⚠️ تبادل الأدوية | محتاج Model | بعدين |
| ⚠️ طلب أدوية | محتاج Model | بعدين |
| ✅ المحادثات | موجود | `/api/messages` |
| ⚠️ التقارير | محتاج Endpoints | بعدين |

---

## 🚀 **الخطوة التالية**

### **اختبار Dashboard:**

```bash
# 1. شغّل المشروع
cd "d:\final project\HINN\HINN"
dotnet run

# 2. سجّل دخول كصيدلية
POST /api/auth/login

# 3. اعرض Dashboard
GET /api/PharmacyDashboard/stats
Authorization: Bearer {token}
```

---

## 🎉 **الخلاصة**

**Pharmacy Dashboard جاهز!**

- ✅ Endpoint للـ Stats
- ✅ بطاقات الإحصائيات
- ✅ الروشتات الحديثة
- ✅ 8 خانات محددة
- ✅ 3 خانات جاهزة
- ⚠️ 5 خانات محتاجين Models إضافية

**جاهز للتطوير!** 🚀
