# 🔄 Pharmacy Drug Exchange - تبادل الأدوية

## 🎯 **نظرة عامة:**

خانة **"تبادل الأدوية"** في لوحة تحكم الصيدلية:
- ✅ عرض دواء مش بيتبادل على صيدليات تانية
- ✅ طلب دواء من صيدليات تانية
- ✅ قبول أو رفض طلبات التبادل

---

## 📊 **المحتوى:**

### **العنوان:**
```
تبادل الأدوية
تبادل الأدوية مع الصيدليات الأخرى في الشبكة
```

### **قائمة الطلبات:**

| الصيدلية | الحالة | الدواء | الكمية | الإجراءات |
|----------|--------|--------|--------|-----------|
| صيدلية النور | في الانتظار | باراسيتامول 500mg | 10 علبة | ✅ موافقة / ❌ رفض |
| صيدلية الأمل | موافق عليه | إيبوبروفين 400mg | 5 علبة | - |

---

## 🌐 **API Endpoints:**

### **1. طلبات التبادل الواردة:**

```bash
GET /api/pharmacy/drugExchange/incoming
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalExchanges": 2,
  "pendingCount": 1,
  "approvedCount": 1,
  "rejectedCount": 0,
  "exchanges": [
    {
      "id": 1,
      "fromPharmacyName": "صيدلية النور",
      "fromPharmacyAddress": "15 شارع التحرير",
      "medicineName": "باراسيتامول 500mg",
      "quantity": 10,
      "suggestedPrice": 12.50,
      "expiryDate": "2026-12-31",
      "exchangeType": "Offer",
      "exchangeTypeArabic": "عرض",
      "reason": "قريب من الانتهاء",
      "status": "Pending",
      "statusArabic": "في الانتظار",
      "createdAt": "2026-04-14T10:00:00Z"
    }
  ]
}
```

---

### **2. طلبات التبادل الصادرة:**

```bash
GET /api/pharmacy/drugExchange/outgoing
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalExchanges": 3,
  "pendingCount": 2,
  "approvedCount": 1,
  "exchanges": [...]
}
```

---

### **3. إنشاء طلب تبادل:**

```bash
POST /api/pharmacy/drugExchange/create
Authorization: Bearer {pharmacy_token}
Content-Type: application/json

{
  "toPharmacyId": 5,
  "medicineName": "باراسيتامول 500mg",
  "quantity": 10,
  "suggestedPrice": 12.50,
  "expiryDate": "2026-12-31",
  "exchangeType": "Offer",
  "reason": "مش بيتباع عندي",
  "notes": "جاهز للتسليم فوراً"
}

Response:
{
  "message": "تم إرسال طلب التبادل بنجاح",
  "exchangeId": 1
}
```

---

### **4. الرد على طلب تبادل:**

```bash
POST /api/pharmacy/drugExchange/{id}/respond
Authorization: Bearer {pharmacy_token}
Content-Type: application/json

// ✅ موافقة
{
  "approved": true,
  "note": "موافق - متى التسليم؟"
}

// ❌ رفض
{
  "approved": false,
  "note": "مش محتاجين حالياً"
}

Response:
{
  "message": "تمت الموافقة على التبادل"
}
```

---

## 📱 **Frontend Example:**

```vue
<template>
  <div class="drug-exchange">
    <h1>تبادل الأدوية</h1>
    <p class="subtitle">تبادل الأدوية مع الصيدليات الأخرى في الشبكة</p>
    <p class="date">{{ formatDate(new Date()) }}</p>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- زر طلب تبادل جديد -->
    <!-- ═══════════════════════════════════════ -->
    <button @click="showCreateModal = true" class="btn-new">
      ➕ طلب تبادل جديد
    </button>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- قائمة طلبات التبادل -->
    <!-- ═══════════════════════════════════════ -->
    <section class="exchanges-list">
      <h2>طلبات التبادل</h2>
      
      <div v-for="exchange in exchanges" 
           :key="exchange.id" 
           class="exchange-card">
        
        <!-- معلومات الصيدلية -->
        <div class="pharmacy-info">
          <h3>{{ exchange.fromPharmacyName }}</h3>
          <p>{{ exchange.fromPharmacyAddress }}</p>
        </div>
        
        <!-- الحالة -->
        <div class="status">
          <span :class="['badge', exchange.status.toLowerCase()]">
            {{ exchange.statusArabic }}
          </span>
        </div>
        
        <!-- معلومات الدواء -->
        <div class="medicine-info">
          <p><strong>الدواء:</strong> {{ exchange.medicineName }}</p>
          <p><strong>الكمية:</strong> {{ exchange.quantity }} علبة</p>
          <p v-if="exchange.suggestedPrice">
            <strong>السعر المقترح:</strong> {{ exchange.suggestedPrice }} ج.م
          </p>
          <p v-if="exchange.expiryDate">
            <strong>تاريخ الانتهاء:</strong> {{ formatDate(exchange.expiryDate) }}
          </p>
        </div>
        
        <!-- سبب التبادل -->
        <p v-if="exchange.reason" class="reason">
          <strong>السبب:</strong> {{ exchange.reason }}
        </p>
        
        <!-- أزرار الرد (لو في الانتظار) -->
        <div v-if="exchange.status === 'Pending'" class="actions">
          <button @click="respond(exchange.id, true)" class="btn-approve">
            ✅ موافقة
          </button>
          <button @click="respond(exchange.id, false)" class="btn-reject">
            ❌ رفض
          </button>
        </div>
      </div>
    </section>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- Modal إنشاء طلب تبادل -->
    <!-- ═══════════════════════════════════════ -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h3>طلب تبادل جديد</h3>
        
        <form @submit.prevent="createExchange">
          <div class="form-group">
            <label>الصيدلية المستلمة *</label>
            <select v-model="newExchange.toPharmacyId" required>
              <option value="">اختر صيدلية...</option>
              <option v-for="pharmacy in pharmacies" 
                      :key="pharmacy.id" 
                      :value="pharmacy.id">
                {{ pharmacy.pharmacyName }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>اسم الدواء *</label>
            <input v-model="newExchange.medicineName" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>الكمية *</label>
              <input v-model.number="newExchange.quantity" type="number" required />
            </div>
            
            <div class="form-group">
              <label>السعر المقترح</label>
              <input v-model.number="newExchange.suggestedPrice" type="number" step="0.01" />
            </div>
          </div>
          
          <div class="form-group">
            <label>نوع التبادل *</label>
            <select v-model="newExchange.exchangeType" required>
              <option value="Offer">عرض دواء للبيع</option>
              <option value="Request">طلب دواء للشراء</option>
              <option value="Swap">تبادل مع دواء تاني</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>السبب</label>
            <textarea v-model="newExchange.reason" 
                      placeholder="مش بيتباع، قريب من الانتهاء..."></textarea>
          </div>
          
          <div class="form-group">
            <label>ملاحظات</label>
            <textarea v-model="newExchange.notes"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="btn-send">إرسال</button>
            <button type="button" @click="showCreateModal = false" class="btn-cancel">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const exchanges = ref([]);
const pharmacies = ref([]);
const showCreateModal = ref(false);

const newExchange = ref({
  toPharmacyId: '',
  medicineName: '',
  quantity: 1,
  suggestedPrice: null,
  exchangeType: 'Offer',
  reason: '',
  notes: ''
});

const loadExchanges = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/drugExchange/incoming', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  exchanges.value = data.exchanges;
};

const createExchange = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/drugExchange/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newExchange.value)
  });
  
  if (response.ok) {
    alert('تم إرسال طلب التبادل بنجاح');
    showCreateModal.value = false;
    await loadExchanges();
  }
};

const respond = async (exchangeId, approved) => {
  const token = localStorage.getItem('token');
  const note = prompt(approved ? 'أضف ملاحظة (اختياري):' : 'سبب الرفض:');
  
  const response = await fetch(`/api/pharmacy/drugExchange/${exchangeId}/respond`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      approved,
      note: note || ''
    })
  });
  
  if (response.ok) {
    alert(approved ? 'تمت الموافقة على التبادل' : 'تم رفض التبادل');
    await loadExchanges();
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ar-EG');
};

onMounted(() => {
  loadExchanges();
});
</script>

<style scoped>
.drug-exchange {
  padding: 2rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.date {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.btn-new {
  background: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
}

.exchanges-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.exchange-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.pharmacy-info h3 {
  color: #1e40af;
  margin-bottom: 0.25rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.badge.pending { background: #fef3c7; color: #92400e; }
.badge.approved { background: #d1fae5; color: #065f46; }
.badge.rejected { background: #fee2e2; color: #991b1b; }

.medicine-info {
  margin: 1rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 4px;
}

.medicine-info p {
  margin-bottom: 0.5rem;
}

.reason {
  color: #6b7280;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-approve {
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-send {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.btn-cancel {
  background: #6b7280;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}
</style>
```

---

## ✅ **الحالة:**

- ✅ **Model:** DrugExchange جاهز
- ✅ **Controller:** DrugExchangeController جاهز
- ✅ **Endpoints:** Incoming + Outgoing + Create + Respond
- ✅ **Database:** Migration تمت
- ✅ **Build:** نجح

---

## 🚀 **اختبار:**

```bash
# 1. شغّل المشروع
cd "d:\final project\HINN\HINN"
dotnet run

# 2. سجّل دخول كصيدلية
POST /api/auth/login

# 3. اعرض الطلبات الواردة
GET /api/pharmacy/drugExchange/incoming

# 4. أنشئ طلب تبادل
POST /api/pharmacy/drugExchange/create

# 5. رد على طلب
POST /api/pharmacy/drugExchange/{id}/respond
```

---

## 🎉 **الخلاصة**

**خانة "تبادل الأدوية" جاهزة!**

- ✅ عرض دواء على صيدليات تانية
- ✅ طلب دواء من صيدليات تانية
- ✅ قبول أو رفض الطلبات
- ✅ 3 أنواع (عرض/طلب/تبادل)
- ✅ إشعارات فورية

**جاهز للاستخدام!** 🔄🚀
