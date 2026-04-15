# 🏥 دليل استخدام Patient Profile APIs

## 📋 ملخص التحديثات

تم إضافة نظام ملف المريض الصحي الكامل الذي يتيح للمريض:
- إدخال جميع بياناته الشخصية والصحية عند التسجيل
- عرض وتحديث ملفه الشخصي
- متابعة وزنه وطوله وحساب BMI تلقائياً

---

## 🗃️ قاعدة البيانات

### الجدول: `Patients`

#### البيانات الشخصية:
| العمود | النوع | الوصف |
|--------|-------|-------|
| `PhoneNumber` | string | رقم الهاتف |
| `Gender` | string | النوع (Male/Female) |
| `DateOfBirth` | DateTime | تاريخ الميلاد |
| `Age` | int | العمر (يُحسب تلقائياً) |

#### البيانات الصحية:
| العمود | النوع | الوصف |
|--------|-------|-------|
| `HeightCm` | double | الطول بالسنتيمتر |
| `WeightKg` | double | الوزن بالكيلوجرام |
| `BMI` | double | مؤشر كتلة الجسم (يُحسب تلقائياً) |
| `BloodType` | string | فصيلة الدم |

#### التاريخ الطبي:
| العمود | النوع | الوصف |
|--------|-------|-------|
| `Allergies` | string | الحساسية |
| `ChronicDiseases` | string | الأمراض المزمنة |
| `CurrentMedications` | string | الأدوية الحالية |
| `Surgeries` | string | العمليات السابقة |
| `MedicalNotes` | string | ملاحظات طبية |

#### بيانات الطوارئ:
| العمود | النوع | الوصف |
|--------|-------|-------|
| `EmergencyContactName` | string | اسم جهة اتصال الطوارئ |
| `EmergencyContactPhone` | string | رقم هاتف الطوارئ |

---

## 🌐 API Endpoints

### 1️⃣ تسجيل مريض جديد

**Endpoint:** `POST /api/auth/register-patient`

**Description:** تسجيل مريض جديد مع جميع البيانات الصحية

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "SecurePass123!",
  "fullName": "أحمد محمد",
  "phoneNumber": "+201234567890",
  "gender": "Male",
  "dateOfBirth": "1990-05-15",
  "heightCm": 175,
  "weightKg": 80,
  "bloodType": "O+",
  "allergies": "Penicillin,Peanuts",
  "chronicDiseases": "Diabetes",
  "currentMedications": "Metformin",
  "surgeries": "Appendectomy",
  "medicalNotes": "Patient needs regular monitoring",
  "emergencyContactName": "محمد أحمد",
  "emergencyContactPhone": "+201111111111"
}
```

**Response (200 OK):**
```json
{
  "message": "تم تسجيل المريض بنجاح",
  "patientId": 1,
  "medicalRecordNumber": "PAT-20260326-ABC12345"
}
```

**ملاحظات:**
- يتم إرسال بريد ترحيبي تلقائياً
- يتم إنشاء رقم سجل طبي تلقائياً
- يتم تسجيل العملية في Audit Logs

---

### 2️⃣ عرض الملف الشخصي

**Endpoint:** `GET /api/patient/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "user-guid-here",
  "fullName": "أحمد محمد",
  "email": "patient@example.com",
  "phoneNumber": "+201234567890",
  "gender": "Male",
  "dateOfBirth": "1990-05-15T00:00:00",
  "age": 35,
  "heightCm": 175,
  "weightKg": 80,
  "bmi": 26.12,
  "bloodType": "O+",
  "allergies": "Penicillin,Peanuts",
  "chronicDiseases": "Diabetes",
  "currentMedications": "Metformin",
  "surgeries": "Appendectomy",
  "medicalNotes": "Patient needs regular monitoring",
  "emergencyContactName": "محمد أحمد",
  "emergencyContactPhone": "+201111111111",
  "lastMedicalUpdate": "2026-03-26T10:30:00Z",
  "medicalRecordNumber": "PAT-20260326-ABC12345"
}
```

---

### 3️⃣ تحديث الملف الشخصي

**Endpoint:** `PUT /api/patient/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "phoneNumber": "+201234567899",
  "gender": "Male",
  "dateOfBirth": "1990-05-15",
  "heightCm": 176,
  "weightKg": 82,
  "bloodType": "O+",
  "allergies": "Penicillin,Peanuts,Dust",
  "chronicDiseases": "Diabetes,Hypertension",
  "currentMedications": "Metformin,Lisinopril",
  "surgeries": "Appendectomy",
  "medicalNotes": "Updated notes",
  "emergencyContactName": "فاطمة أحمد",
  "emergencyContactPhone": "+201222222222"
}
```

**Response (200 OK):**
```json
{
  "message": "تم تحديث الملف الشخصي بنجاح"
}
```

**ملاحظات:**
- يتم تحديث `LastMedicalUpdate` تلقائياً
- فقط القيم المُرسَلة سيتم تحديثها
- رقم الهاتف يتزامن مع جدول Users

---

### 4️⃣ تحديث البيانات الحيوية فقط

**Endpoint:** `PUT /api/patient/profile/vitals`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "heightCm": 175,
  "weightKg": 78
}
```

**Response (200 OK):**
```json
{
  "message": "تم تحديث البيانات الحيوية بنجاح",
  "bmi": 25.47
}
```

**الاستخدام:**
مثالي لتطبيقات المتابعة الصحية اليومية حيث يُحدّث المريض وزنه بانتظام

---

## 💡 أمثلة عملية

### مثال 1: تسجيل مريض جديد من Frontend

```javascript
// React/Vue/Angular
const registerPatient = async (formData) => {
  const response = await fetch('https://localhost:5176/api/auth/register-patient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      heightCm: parseFloat(formData.height),
      weightKg: parseFloat(formData.weight),
      bloodType: formData.bloodType,
      allergies: formData.allergies?.join(','),
      chronicDiseases: formData.chronicDiseases?.join(','),
      currentMedications: formData.medications?.join(','),
    })
  });

  const data = await response.json();
  return data;
};
```

### مثال 2: عرض الملف الشخصي

```javascript
const getPatientProfile = async (token) => {
  const response = await fetch('https://localhost:5176/api/patient/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const profile = await response.json();
  
  // حساب BMI تلقائياً من الـ Backend
  console.log('Your BMI:', profile.bmi);
  console.log('Your Age:', profile.age);
  
  return profile;
};
```

### مثال 3: تحديث الوزن اليومي

```javascript
const updateDailyWeight = async (token, newWeight) => {
  const response = await fetch('https://localhost:5176/api/patient/profile/vitals', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      weightKg: newWeight,
      // heightCm: يمكنك إرساله إذا تغير
    })
  });

  const data = await response.json();
  console.log('New BMI:', data.bmi);
  return data;
};
```

---

## 🎯 المميزات التلقائية

### 1. حساب العمر
```csharp
// يُحسب تلقائياً من DateOfBirth
public int? Age
{
    get
    {
        if (DateOfBirth.HasValue)
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Value.Year;
            if (DateOfBirth.Value.Date > today.AddYears(-age)) age--;
            return age;
        }
        return null;
    }
}
```

### 2. حساب BMI
```csharp
// يُحسب تلقائياً من الطول والوزن
public double? BMI
{
    get
    {
        if (HeightCm.HasValue && WeightKg.HasValue && HeightCm > 0)
        {
            var heightInMeters = HeightCm.Value / 100.0;
            return Math.Round(WeightKg.Value / (heightInMeters * heightInMeters), 2);
        }
        return null;
    }
}
```

---

## 📊 تصنيفات BMI

| التصنيف | BMI Range |
|---------|-----------|
| نقص الوزن | < 18.5 |
| طبيعي | 18.5 - 24.9 |
| زيادة وزن | 25 - 29.9 |
| سمنة درجة 1 | 30 - 34.9 |
| سمنة درجة 2 | 35 - 39.9 |
| سمنة مفرطة | ≥ 40 |

---

## 🔒 الأمان

### Authorization
- جميع endpoints تتطلب `Bearer Token`
- Role: `Patient` فقط

### Audit Logging
كل عملية يتم تسجيلها في AuditLogs:
- تسجيل المريض الجديد
- تحديث الملف الشخصي
- تحديث البيانات الحيوية

### Rate Limiting
- تسجيل المريض: محمي ضد الـ Spam
- تحديث الملف الشخصي: محدود لمنع الـ Abuse

---

## 📱 مثال UI للـ Frontend

### شاشة الملف الشخصي:

```html
<!-- Patient Profile Page -->
<div class="profile-container">
  <h2>الملف الشخصي</h2>
  
  <!-- البيانات الأساسية -->
  <section class="basic-info">
    <input type="text" v-model="profile.fullName" readonly />
    <input type="email" v-model="profile.email" readonly />
    <input type="tel" v-model="profile.phoneNumber" />
    <select v-model="profile.gender">
      <option value="Male">ذكر</option>
      <option value="Female">أنثى</option>
    </select>
    <input type="date" v-model="profile.dateOfBirth" />
  </section>
  
  <!-- البيانات الصحية -->
  <section class="health-info">
    <input type="number" v-model="profile.heightCm" placeholder="الطول (سم)" />
    <input type="number" v-model="profile.weightKg" placeholder="الوزن (كجم)" />
    <div class="bmi-display">
      BMI: {{ profile.bmi }}
    </div>
    <select v-model="profile.bloodType">
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
    </select>
  </section>
  
  <!-- التاريخ الطبي -->
  <section class="medical-history">
    <textarea v-model="profile.allergies" placeholder="الحساسية (افصل بفاصلة)"></textarea>
    <textarea v-model="profile.chronicDiseases" placeholder="الأمراض المزمنة"></textarea>
    <textarea v-model="profile.currentMedications" placeholder="الأدوية الحالية"></textarea>
  </section>
  
  <!-- بيانات الطوارئ -->
  <section class="emergency-info">
    <input type="text" v-model="profile.emergencyContactName" />
    <input type="tel" v-model="profile.emergencyContactPhone" />
  </section>
  
  <button @click="saveProfile">حفظ</button>
</div>
```

---

## 🚀 الخطوات التالية

### في الـ Frontend:
1. إنشاء صفحة تسجيل المريض مع كل الحقول
2. إنشاء صفحة الملف الشخصي
3. إضافة validation لكل حقل
4. عرض BMI بشكل مرئي (Gauge/Chart)
5. إضافة متابعة تاريخية للوزن و BMI

### في الـ Backend (إضافات مستقبلية):
- [ ] حفظ تاريخ تغييرات الوزن/الوزن (Weight History)
- [ ] رفع تقارير طبية (PDFs)
- [ ] ربط مع أطباء لمشاركة الملف الصحي
- [ ] إشعارات عند تغيرات مهمة في BMI
- [ ] تحليلات صحية مبنية على البيانات

---

## 📝 ملاحظات مهمة

1. **الحقول المفصولة بفاصلة:**
   - الحساسية، الأمراض، الأدوية تُخزن كنصوص مفصولة بفاصلة
   - Frontend يمكنه استخدامها كـ Arrays

2. **الحقول التلقائية:**
   - `Age` يُحسب من `DateOfBirth`
   - `BMI` يُحسب من `HeightCm` و `WeightKg`
   - `MedicalRecordNumber` يُنشأ تلقائياً عند التسجيل

3. **البيانات المطلوبة:**
   - عند التسجيل: `email`, `password`, `fullName` فقط
   - باقي الحقول اختيارية ويمكن تحديثها لاحقاً

---


الـ APIs جاهزة تماماً! يمكنك الآن:
1. تسجيل مرضى ببيانات صحية كاملة
2. عرض ملفات المرضى
3. تحديث البيانات الصحية
4. متابعة الوزن والطول اليومي

```
https://localhost:5176/swagger
```
