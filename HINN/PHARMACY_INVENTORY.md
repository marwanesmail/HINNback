# 📦 Pharmacy Inventory Management - إدارة المخزون

## 🎯 **نظرة عامة:**

خانة **"المخزون"** في لوحة تحكم الصيدلية:
- ✅ جرد كامل للمخزون
- ✅ تنبيهات المخزون المنخفض
- ✅ متابعة تاريخ الانتهاء
- ✅ إضافة/تحديث/حذف أصناف

---

## 📊 **الإحصائيات:**

| البطاقة | الوصف | مثال |
|---------|-------|------|
| 📦 إجمالي الأصناف | عدد الأدوية | 5 |
| ⚠️ مخزون منخفض | أقل من الحد الأدنى | 2 |
| ❌ نفد المخزون | الكمية = 0 | 1 |

---

## 📝 **قائمة المخزون:**

### **الأعمدة:**

| العمود | الوصف |
|--------|-------|
| اسم الدواء | باراسيتامول 500mg |
| الكمية | 5 علبة |
| الحد الأدنى | 20 علبة |
| تاريخ الانتهاء | 2024-12-31 |
| السعر | 12.50 ج.م |
| الحالة | متوفر/منخفض/نفد |
| الإجراءات | تحديث / طلب |

---

## 🌐 **API Endpoints:**

### **1. إحصائيات المخزون:**

```bash
GET /api/pharmacy/inventory/stats
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalItems": 5,
  "lowStockItems": 2,
  "outOfStockItems": 1,
  "expiredItems": 0,
  "totalValue": 2437.50,
  "date": "2026-04-14"
}
```

---

### **2. عرض قائمة المخزون:**

```bash
GET /api/pharmacy/inventory/list?status=low&searchTerm=باراسيتامول
Authorization: Bearer {pharmacy_token}

Response:
{
  "totalItems": 3,
  "items": [
    {
      "id": 1,
      "medicineName": "باراسيتامول 500mg",
      "quantity": 5,
      "minimumQuantity": 20,
      "expiryDate": "2024-12-31",
      "price": 12.50,
      "batchNumber": "BATCH001",
      "manufacturer": "Egyphar",
      "storageLocation": "رف 1",
      "notes": "",
      "status": "Low",
      "statusArabic": "منخفض",
      "isExpired": false,
      "createdAt": "2026-04-14T10:00:00Z",
      "lastUpdated": null
    }
  ]
}
```

---

### **3. إضافة صنف جديد:**

```bash
POST /api/pharmacy/inventory/add
Authorization: Bearer {pharmacy_token}
Content-Type: application/json

{
  "medicineName": "باراسيتامول 500mg",
  "quantity": 50,
  "minimumQuantity": 20,
  "expiryDate": "2026-12-31",
  "price": 12.50,
  "batchNumber": "BATCH001",
  "manufacturer": "Egyphar",
  "storageLocation": "رف 1",
  "notes": "مسكن وخافض حرارة"
}

Response:
{
  "message": "تم إضافة الصنف بنجاح",
  "itemId": 1
}
```

---

### **4. تحديث صنف:**

```bash
PUT /api/pharmacy/inventory/update/{id}
Authorization: Bearer {pharmacy_token}
Content-Type: application/json

{
  "quantity": 45,
  "price": 13.00,
  "notes": "تم التحديث"
}

Response:
{
  "message": "تم تحديث الصنف بنجاح"
}
```

---

### **5. حذف صنف:**

```bash
DELETE /api/pharmacy/inventory/delete/{id}
Authorization: Bearer {pharmacy_token}

Response:
{
  "message": "تم حذف الصنف بنجاح"
}
```

---

## 📱 **Frontend Example:**

```vue
<template>
  <div class="inventory-management">
    <h1>إدارة المخزون</h1>
    <p class="date">{{ formatDate(new Date()) }}</p>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- الإحصائيات -->
    <!-- ═══════════════════════════════════════ -->
    <div class="stats-grid">
      <div class="stat-card info">
        <div class="icon">📦</div>
        <div class="value">{{ stats.totalItems }}</div>
        <div class="label">إجمالي الأصناف</div>
      </div>
      
      <div class="stat-card warning">
        <div class="icon">⚠️</div>
        <div class="value">{{ stats.lowStockItems }}</div>
        <div class="label">مخزون منخفض</div>
      </div>
      
      <div class="stat-card danger">
        <div class="icon">❌</div>
        <div class="value">{{ stats.outOfStockItems }}</div>
        <div class="label">نفد المخزون</div>
      </div>
    </div>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- قائمة المخزون -->
    <!-- ═══════════════════════════════════════ -->
    <section class="inventory-list">
      <div class="header">
        <h2>قائمة المخزون</h2>
        <button @click="showAddModal = true" class="btn-add">
          ➕ إضافة صنف
        </button>
      </div>
      
      <!-- فلاتر -->
      <div class="filters">
        <input v-model="searchTerm" placeholder="بحث باسم الدواء..." />
        <select v-model="statusFilter">
          <option value="">كل الحالات</option>
          <option value="available">متوفر</option>
          <option value="low">منخفض</option>
          <option value="outofstock">نفد</option>
        </select>
      </div>
      
      <!-- جدول المخزون -->
      <table>
        <thead>
          <tr>
            <th>اسم الدواء</th>
            <th>الكمية</th>
            <th>الحد الأدنى</th>
            <th>تاريخ الانتهاء</th>
            <th>السعر</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" :class="getRowClass(item.status)">
            <td>
              <strong>{{ item.medicineName }}</strong>
              <div v-if="item.manufacturer" class="manufacturer">
                {{ item.manufacturer }}
              </div>
            </td>
            <td>
              <span :class="['quantity', item.status.toLowerCase()]">
                {{ item.quantity }} علبة
              </span>
            </td>
            <td>{{ item.minimumQuantity }} علبة</td>
            <td>
              <span :class="{ expired: item.isExpired }">
                {{ formatDate(item.expiryDate) }}
              </span>
            </td>
            <td>{{ item.price }} ج.م</td>
            <td>
              <span :class="['badge', item.status.toLowerCase()]">
                {{ item.statusArabic }}
              </span>
            </td>
            <td>
              <button @click="editItem(item)" class="btn-update">تحديث</button>
              <button v-if="item.status === 'OutOfStock' || item.status === 'Low'" 
                      @click="requestMore(item)" class="btn-request">
                طلب
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    
    <!-- ═══════════════════════════════════════ -->
    <!-- Modal إضافة صنف -->
    <!-- ═══════════════════════════════════════ -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>إضافة صنف جديد</h3>
        
        <form @submit.prevent="addItem">
          <div class="form-group">
            <label>اسم الدواء *</label>
            <input v-model="newItem.medicineName" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>الكمية *</label>
              <input v-model.number="newItem.quantity" type="number" required />
            </div>
            
            <div class="form-group">
              <label>الحد الأدنى *</label>
              <input v-model.number="newItem.minimumQuantity" type="number" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>السعر *</label>
              <input v-model.number="newItem.price" type="number" step="0.01" required />
            </div>
            
            <div class="form-group">
              <label>تاريخ الانتهاء</label>
              <input v-model="newItem.expiryDate" type="date" />
            </div>
          </div>
          
          <div class="form-group">
            <label>الشركة المصنعة</label>
            <input v-model="newItem.manufacturer" />
          </div>
          
          <div class="form-group">
            <label>مكان التخزين</label>
            <input v-model="newItem.storageLocation" placeholder="رف 1، رف 2..." />
          </div>
          
          <div class="form-group">
            <label>ملاحظات</label>
            <textarea v-model="newItem.notes"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="btn-save">حفظ</button>
            <button type="button" @click="showAddModal = false" class="btn-cancel">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const stats = ref({
  totalItems: 0,
  lowStockItems: 0,
  outOfStockItems: 0,
  expiredItems: 0,
  totalValue: 0
});

const items = ref([]);
const searchTerm = ref('');
const statusFilter = ref('');
const showAddModal = ref(false);

const newItem = ref({
  medicineName: '',
  quantity: 0,
  minimumQuantity: 10,
  expiryDate: '',
  price: 0,
  manufacturer: '',
  storageLocation: '',
  notes: ''
});

const loadStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/inventory/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  stats.value = data;
};

const loadItems = async () => {
  const token = localStorage.getItem('token');
  let url = '/api/pharmacy/inventory/list';
  
  const params = [];
  if (statusFilter.value) params.push(`status=${statusFilter.value}`);
  if (searchTerm.value) params.push(`searchTerm=${searchTerm.value}`);
  
  if (params.length > 0) url += '?' + params.join('&');
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  items.value = data.items;
};

const addItem = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/pharmacy/inventory/add', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newItem.value)
  });
  
  if (response.ok) {
    alert('تم إضافة الصنف بنجاح');
    showAddModal.value = false;
    await Promise.all([loadStats(), loadItems()]);
  }
};

const editItem = (item) => {
  // فتح modal التعديل
};

const requestMore = (item) => {
  // طلب كمية إضافية
};

const getRowClass = (status) => {
  if (status === 'OutOfStock') return 'row-outofstock';
  if (status === 'Low') return 'row-low';
  return '';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ar-EG');
};

watch([searchTerm, statusFilter], loadItems);
onMounted(() => {
  loadStats();
  loadItems();
});
</script>

<style scoped>
.inventory-management {
  padding: 2rem;
}

.date {
  color: #6b7280;
  margin-bottom: 1rem;
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

.stat-card.info { border-top: 4px solid #3b82f6; }
.stat-card.warning { border-top: 4px solid #f59e0b; }
.stat-card.danger { border-top: 4px solid #ef4444; }

.stat-card .icon { font-size: 2rem; margin-bottom: 0.5rem; }
.stat-card .value { font-size: 2.5rem; font-weight: bold; }
.stat-card .label { color: #6b7280; margin-top: 0.25rem; }

.inventory-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-add {
  background: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filters input,
.filters select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: right;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-weight: 600;
}

.row-low { background: #fef3c7; }
.row-outofstock { background: #fee2e2; }

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.badge.available { background: #d1fae5; color: #065f46; }
.badge.low { background: #fef3c7; color: #92400e; }
.badge.outofstock { background: #fee2e2; color: #991b1b; }

.btn-update,
.btn-request {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
}

.btn-update { background: #3b82f6; color: white; }
.btn-request { background: #f59e0b; color: white; }

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

.btn-save {
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

- ✅ **Model:** PharmacyInventory جاهز
- ✅ **Controller:** InventoryController جاهز
- ✅ **Endpoints:** Stats + List + Add + Update + Delete
- ✅ **Database:** Migration تمت
- ✅ **Build:** نجح
- ✅ **Computed Properties:** Status + IsExpired

---

## 🚀 **اختبار:**

```bash
# 1. شغّل المشروع
cd "d:\final project\HINN\HINN"
dotnet run

# 2. سجّل دخول كصيدلية
POST /api/auth/login

# 3. اعرض الإحصائيات
GET /api/pharmacy/inventory/stats

# 4. اعرض المخزون
GET /api/pharmacy/inventory/list

# 5. أضف صنف
POST /api/pharmacy/inventory/add
```

---

## 🎉 **الخلاصة**

**خانة "المخزون" جاهزة!**

- ✅ إحصائيات المخزون
- ✅ قائمة كاملة
- ✅ إضافة صنف جديد
- ✅ تحديث صنف
- ✅ حذف صنف
- ✅ تنبيهات المخزون المنخفض
- ✅ متابعة تاريخ الانتهاء

**جاهز للاستخدام!** 📦🚀
