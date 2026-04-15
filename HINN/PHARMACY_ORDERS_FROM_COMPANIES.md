# 🏭 Pharmacy Orders from Companies - طلب أدوية من الشركات

## 🎯 **نظرة عامة:**

خانة **"طلب أدوية"** في لوحة تحكم الصيدلية:
- ✅ بحث عن أدوية من الشركات المصنعة
- ✅ إرسال طلبات للشركات
- ✅ متابعة حالة الطلبات

---

## 📊 **المحتوى:**

### **العنوان:**
```
طلب أدوية من الشركات
الثلاثاء، ١٤ أبريل ٢٠٢٦
```

### **البحث:**
```
البحث عن الأدوية
ابحث عن دواء أو شركة أو فئة...

يمكنك البحث بـ:
- اسم الدواء
- الشركة المصنعة
- الفئة العلاجية
```

### **ملخص الطلب:**
- الطلبات في الانتظار
- الطلبات المسلمة
- إجمالي الطلبات

---

## 🌐 **API Endpoints:**

### **1. بحث عن أدوية:**

```bash
GET /api/pharmacy/orders/search?searchTerm=باراسيتامول&category=مسكنات
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalItems": 10,
  "lowStockCount": 3,
  "items": [
    {
      "id": 1,
      "medicineName": "باراسيتامول 500mg",
      "manufacturer": "Egyphar",
      "quantity": 5,
      "price": 12.50,
      "minimumQuantity": 20,
      "isLowStock": true
    }
  ]
}
```

---

### **2. عرض طلباتي:**

```bash
GET /api/pharmacy/orders/my-orders?status=pending
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalOrders": 5,
  "pendingCount": 3,
  "deliveredCount": 2,
  "orders": [
    {
      "id": 1,
      "medicineName": "باراسيتامول 500mg",
      "quantity": 100,
      "category": "مسكنات",
      "expectedPrice": 10.00,
      "priority": "Normal",
      "companyName": "Egyphar",
      "status": "Pending",
      "statusArabic": "في الانتظار",
      "createdAt": "2026-04-14T10:00:00Z"
    }
  ]
}
```

---

### **3. إنشاء طلب جديد:**

```bash
POST /api/pharmacy/orders/create
Authorization: Bearer {pharmacy_token}
Content-Type: application/json

{
  "companyId": 5,
  "medicineName": "باراسيتامول 500mg",
  "quantity": 100,
  "category": "مسكنات",
  "expectedPrice": 10.00,
  "priority": "Urgent",
  "notes": "أحتاج تسليم سريع"
}

Response:
{
  "message": "تم إرسال الطلب بنجاح",
  "orderId": 1
}
```

---

### **4. إلغاء طلب:**

```bash
POST /api/pharmacy/orders/{id}/cancel
Authorization: Bearer {pharmacy_token}

Response:
{
  "message": "تم إلغاء الطلب بنجاح"
}
```

---

## 📱 **Frontend Example:**

```vue
<template>
  <div class="pharmacy-orders">
    <h1>طلب أدوية من الشركات</h1>
    <p class="date">{{ formatDate(new Date()) }}</p>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- البحث -->
    <!-- ═══════════════════════════════════════ -->
    <section class="search-section">
      <h2>البحث عن الأدوية</h2>
      <input v-model="searchTerm" 
             placeholder="ابحث عن دواء أو شركة أو فئة..." />
      
      <div class="search-hints">
        <p>يمكنك البحث بـ:</p>
        <ul>
          <li>اسم الدواء</li>
          <li>الشركة المصنعة</li>
          <li>الفئة العلاجية</li>
        </ul>
      </div>
      
      <button @click="search" class="btn-search">بحث</button>
    </section>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- ملخص الطلب -->
    <!-- ═══════════════════════════════════════ -->
    <section class="order-summary">
      <h2>ملخص الطلب</h2>
      
      <div class="stats">
        <div class="stat">
          <div class="value">{{ stats.pendingCount }}</div>
          <div class="label">في الانتظار</div>
        </div>
        <div class="stat">
          <div class="value">{{ stats.deliveredCount }}</div>
          <div class="label">تم التسليم</div>
        </div>
        <div class="stat">
          <div class="value">{{ stats.totalOrders }}</div>
          <div class="label">إجمالي الطلبات</div>
        </div>
      </div>
    </section>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- قائمة الطلبات -->
    <!-- ═══════════════════════════════════════ -->
    <section class="orders-list">
      <div class="header">
        <h2>طلباتي</h2>
        <button @click="showCreateModal = true" class="btn-new">
          ➕ طلب جديد
        </button>
      </div>
      
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-info">
          <h3>{{ order.medicineName }}</h3>
          <p>الكمية: {{ order.quantity }}</p>
          <p v-if="order.companyName">الشركة: {{ order.companyName }}</p>
          <p>الأولوية: {{ order.priority }}</p>
        </div>
        
        <div class="status">
          <span :class="['badge', order.status.toLowerCase()]">
            {{ order.statusArabic }}
          </span>
        </div>
        
        <button v-if="order.status === 'Pending'" 
                @click="cancelOrder(order.id)" 
                class="btn-cancel">
          إلغاء
        </button>
      </div>
    </section>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- Modal إنشاء طلب -->
    <!-- ═══════════════════════════════════════ -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h3>طلب دواء جديد</h3>
        
        <form @submit.prevent="createOrder">
          <div class="form-group">
            <label>اسم الدواء *</label>
            <input v-model="newOrder.medicineName" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>الكمية *</label>
              <input v-model.number="newOrder.quantity" type="number" required />
            </div>
            
            <div class="form-group">
              <label>الفئة</label>
              <input v-model="newOrder.category" placeholder="مسكنات، مضادات..." />
            </div>
          </div>
          
          <div class="form-group">
            <label>الشركة المصنعة</label>
            <select v-model="newOrder.companyId">
              <option value="">اختر شركة...</option>
              <option v-for="company in companies" 
                      :key="company.id" 
                      :value="company.id">
                {{ company.companyName }}
              </option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>السعر المتوقع</label>
              <input v-model.number="newOrder.expectedPrice" type="number" step="0.01" />
            </div>
            
            <div class="form-group">
              <label>الأولوية</label>
              <select v-model="newOrder.priority">
                <option value="Normal">عادي</option>
                <option value="Urgent">عاجل</option>
                <option value="Low">منخفض</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>ملاحظات</label>
            <textarea v-model="newOrder.notes"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="btn-send">إرسال الطلب</button>
            <button type="button" @click="showCreateModal = false" class="btn-cancel">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const searchTerm = ref('');
const orders = ref([]);
const companies = ref([]);
const stats = ref({
  pendingCount: 0,
  deliveredCount: 0,
  totalOrders: 0
});
const showCreateModal = ref(false);

const newOrder = ref({
  medicineName: '',
  quantity: 1,
  category: '',
  companyId: null,
  expectedPrice: null,
  priority: 'Normal',
  notes: ''
});

const search = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `/api/pharmacy/orders/search?searchTerm=${searchTerm.value}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const data = await response.json();
  // عرض نتائج البحث
};

const loadOrders = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/orders/my-orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  orders.value = data.orders;
  stats.value = {
    pendingCount: data.pendingCount,
    deliveredCount: data.deliveredCount,
    totalOrders: data.totalOrders
  };
};

const createOrder = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/orders/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newOrder.value)
  });
  
  if (response.ok) {
    alert('تم إرسال الطلب بنجاح');
    showCreateModal.value = false;
    await loadOrders();
  }
};

const cancelOrder = async (orderId) => {
  if (!confirm('هل أنت متأكد من إلغاء الطلب؟')) return;
  
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/pharmacy/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    alert('تم إلغاء الطلب بنجاح');
    await loadOrders();
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar-EG');
};

onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.pharmacy-orders {
  padding: 2rem;
}

.search-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.search-hints {
  color: #6b7280;
  margin: 1rem 0;
}

.search-hints ul {
  list-style: none;
  padding: 0;
}

.search-hints li:before {
  content: "✓ ";
  color: #10b981;
}

.btn-search {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.order-summary {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stat .value {
  font-size: 2rem;
  font-weight: bold;
}

.orders-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
}

.order-card {
  border: 1px solid #e5e7eb;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.badge.pending { background: #fef3c7; color: #92400e; }
.badge.confirmed { background: #dbeafe; color: #1e40af; }
.badge.delivered { background: #d1fae5; color: #065f46; }
.badge.cancelled { background: #fee2e2; color: #991b1b; }

.btn-cancel {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  background: #10b981;
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

- ✅ **Model:** PharmacyOrder جاهز
- ✅ **Controller:** OrdersController جاهز
- ✅ **Endpoints:** Search + My Orders + Create + Cancel
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

# 3. ابحث عن أدوية
GET /api/pharmacy/orders/search?searchTerm=باراسيتامول

# 4. اعرض طلباتي
GET /api/pharmacy/orders/my-orders

# 5. أنشئ طلب
POST /api/pharmacy/orders/create
```

---

## 🎉 **الخلاصة**

**خانة "طلب أدوية" جاهزة!**

- ✅ بحث عن أدوية
- ✅ إرسال طلبات للشركات
- ✅ متابعة حالة الطلبات
- ✅ إلغاء الطلبات
- ✅ 6 حالات (Pending/Confirmed/Shipped/Delivered/Cancelled/Rejected)

**جاهز للاستخدام!** 🏭🚀
