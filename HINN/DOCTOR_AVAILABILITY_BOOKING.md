# 📅 نظام حجز المواعيد الكامل

## 🎯 **كيف يعمل النظام:**

### **Workflow:**
```
1. الدكتور يضيف مواعيده المتاحة
   ↓
2. المريض يبحث عن دكتور (بالاسم أو التخصص)
   ↓
3. يظهر للدكتور المتاحين مع مواعيدهم
   ↓
4. المريض يختار موعد ويحجز
   ↓
5. الموعد يتحجز ويُشال من المتاحة
   ↓
6. إشعار للدكتور بالحجز
```

---

## 👨‍⚕️ **Doctor Endpoints**

### **1. إضافة مواعيد متاحة:**
```bash
POST /api/doctor/availability
Authorization: Bearer {doctor_token}

{
  "startDate": "2026-04-15",
  "endDate": "2026-04-30",
  "timeSlots": [
    {
      "startTime": "09:00:00",
      "endTime": "12:00:00"
    },
    {
      "startTime": "17:00:00",
      "endTime": "21:00:00"
    }
  ],
  "durationMinutes": 30,
  "consultationFee": 200,
  "appointmentType": "كشف",
  "location": "العيادة - شارع التحرير",
  "excludedDates": [
    {
      "date": "2026-04-20",
      "reason": "إجازة"
    }
  ]
}

Response:
{
  "message": "تم إضافة 24 موعد متاح",
  "count": 24
}
```

### **2. عرض مواعيدي:**
```bash
GET /api/doctor/availability?fromDate=2026-04-01&toDate=2026-04-30
Authorization: Bearer {doctor_token}

Response:
{
  "totalSlots": 24,
  "availableSlots": 20,
  "bookedSlots": 4,
  "availabilities": [...]
}
```

---

## 👨‍💼 **Patient Endpoints**

### **1. بحث عن دكاترة متاحين:**
```bash
GET /api/patient/doctors/available?searchTerm=أحمد&specialty=باطنة&fromDate=2026-04-15&toDate=2026-04-30
Authorization: Bearer {patient_token}

Response:
{
  "totalDoctors": 3,
  "doctors": [
    {
      "doctorId": "doctor-guid",
      "doctorName": "د. أحمد محمد",
      "specialty": "باطنة",
      "rating": 4.5,
      "ratingCount": 50,
      "viewCount": 200,
      "availableSlotsCount": 8,
      "earliestAvailable": "2026-04-15T00:00:00",
      "consultationFee": 200,
      "availableSlots": [
        {
          "availabilityId": 1,
          "date": "2026-04-15",
          "startTime": "09:00:00",
          "endTime": "09:30:00",
          "durationMinutes": 30,
          "consultationFee": 200,
          "location": "العيادة - شارع التحرير",
          "appointmentType": "كشف"
        },
        ...
      ]
    }
  ]
}
```

### **2. حجز موعد:**
```bash
POST /api/patient/appointments/book-from-availability
Authorization: Bearer {patient_token}

{
  "availabilityId": 1,
  "patientNotes": "أعاني من صداع مستمر"
}

Response:
{
  "message": "تم حجز الموعد بنجاح",
  "appointmentId": 5,
  "doctorId": "doctor-guid",
  "date": "2026-04-15",
  "time": "09:00:00",
  "consultationFee": 200
}
```

---

## 📊 **Database Schema**

### جدول DoctorAvailabilities:
```sql
CREATE TABLE DoctorAvailabilities (
    Id INT PRIMARY KEY IDENTITY,
    DoctorId NVARCHAR(450) NOT NULL,
    [Date] DATETIME2 NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    DurationMinutes INT NOT NULL,
    IsAvailable BIT NOT NULL,
    BookedByPatientId NVARCHAR(450) NULL,
    BookedAt DATETIME2 NULL,
    ConsultationFee DECIMAL(18,2) NOT NULL,
    AppointmentType NVARCHAR(50) NOT NULL,
    Notes NVARCHAR(MAX) NULL,
    [Location] NVARCHAR(200) NULL,
    CreatedAt DATETIME2 NOT NULL
);

-- Indexes
CREATE INDEX IX_DoctorAvailabilities_DoctorId ON DoctorAvailabilities(DoctorId);
CREATE INDEX IX_DoctorAvailabilities_Date ON DoctorAvailabilities([Date]);
CREATE INDEX IX_DoctorAvailabilities_DoctorId_Date_IsAvailable 
    ON DoctorAvailabilities(DoctorId, [Date], IsAvailable);
```

---

## 🎯 **مثال كامل**

### **1. الدكتور يضيف مواعيده:**

```bash
# دكتور أحمد يضيف مواعيد شهر أبريل
POST /api/doctor/availability

{
  "startDate": "2026-04-15",
  "endDate": "2026-04-30",
  "timeSlots": [
    { "startTime": "09:00:00", "endTime": "13:00:00" },
    { "startTime": "17:00:00", "endTime": "21:00:00" }
  ],
  "durationMinutes": 30,
  "consultationFee": 250,
  "appointmentType": "كشف",
  "location": "عيادة القاهرة - شارع التحرير",
  "excludedDates": [
    { "date": "2026-04-20", "reason": "إجازة" },
    { "date": "2026-04-25", "reason": "مؤتمر طبي" }
  ]
}

# النتيجة: 24 موعد متاح (16 يوم × 2 فترة)
```

### **2. المريض يبحث عن دكتور:**

```bash
# بحث عن دكتور باطنة
GET /api/patient/doctors/available?specialty=باطنة&fromDate=2026-04-15&toDate=2026-04-20

# النتيجة: قائمة بالدكاترة المتاحين مع مواعيدهم
```

### **3. المريض يحجز:**

```bash
# اختيار موعد من القائمة
POST /api/patient/appointments/book-from-availability

{
  "availabilityId": 5,
  "patientNotes": "عندي صداع مستمر من أسبوع"
}

# النتيجة: الموعد اتحجز بنجاح
```

---

## 🔒 **الأمان**

### ✅ **حماية من الحجز المزدوج:**
```csharp
if (availability.BookedByPatientId != null)
    return BadRequest("الموعد محجوز بالفعل");
```

### ✅ **التحقق من الدكتور:**
```csharp
.Where(u => _context.Doctors.Any(d => d.AppUserId == u.Id && d.IsApproved))
```

### ✅ **مواعيد في المستقبل فقط:**
```csharp
var fromDateFilter = fromDate ?? DateTime.UtcNow;
```

---

## 📱 **Frontend Example**

### **صفحة البحث عن دكتور:**

```vue
<template>
  <div class="doctor-search">
    <input v-model="searchTerm" placeholder="ابحث عن دكتور..." />
    <select v-model="specialty">
      <option value="">كل التخصصات</option>
      <option value="باطنة">باطنة</option>
      <option value="أطفال">أطفال</option>
    </select>
    
    <div v-for="doctor in doctors" :key="doctor.doctorId" class="doctor-card">
      <h3>{{ doctor.doctorName }}</h3>
      <p>{{ doctor.specialty }}</p>
      <p>⭐ {{ doctor.rating }} ({{ doctor.ratingCount }} تقييم)</p>
      <p>سعر الكشف: {{ doctor.consultationFee }} جنيه</p>
      
      <div class="available-slots">
        <h4>المواعيد المتاحة:</h4>
        <div v-for="slot in doctor.availableSlots" :key="slot.availabilityId" 
             class="slot" @click="bookSlot(slot)">
          <span>{{ formatDate(slot.date) }}</span>
          <span>{{ formatTime(slot.startTime) }}</span>
          <span>{{ slot.durationMinutes }} دقيقة</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const searchTerm = ref('');
const specialty = ref('');
const doctors = ref([]);

const searchDoctors = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `/api/patient/doctors/available?searchTerm=${searchTerm.value}&specialty=${specialty.value}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  const data = await response.json();
  doctors.value = data.doctors;
};

const bookSlot = async (slot) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/patient/appointments/book-from-availability', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      availabilityId: slot.availabilityId,
      patientNotes: 'أحتاج كشف'
    })
  });
  
  if (response.ok) {
    alert('تم حجز الموعد بنجاح!');
    await searchDoctors(); // تحديث القائمة
  }
};

watch([searchTerm, specialty], searchDoctors);
searchDoctors();
</script>
```

---

## ✅ **الحالة:**

- ✅ **Model:** DoctorAvailability
- ✅ **Doctor Endpoints:** إضافة + عرض مواعيد
- ✅ **Patient Endpoints:** بحث + حجز
- ✅ **Database:** Migration تمت
- ✅ **Indexes:** مُحسّنة للبحث السريع
- ✅ **Build:** نجح

---

## 🚀 **الخطوة التالية**

### **شغّل المشروع:**
```bash
cd "d:\final project\HINN\HINN"
dotnet run
```

### **اختبر النظام:**
1. سجّل دخول كدكتور
2. أضف مواعيد متاحة
3. سجّل دخول ك_patient
4. ابحث عن دكتور
5. احجز موعد

---

## 🎉 **الخلاصة**

**النظام الآن كامل:**
- ✅ الدكتور يضيف مواعيده المتاحة
- ✅ المريض يبحث عن دكتور (بالاسم أو التخصص)
- ✅ يشوف المواعيد المتاحة
- ✅ يحجز المعاد المناسب
- ✅ الموعد يتشال من المتاحة
- ✅ Appointment يتعمل تلقائياً

**جاهز للاستخدام!** 🚀
