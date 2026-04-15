# 📧📱🚦📝 HINN - الخدمات الجديدة المضافة

## نظرة عامة

تم إضافة **4 خدمات جديدة** لتعزيز وظائف المنصة وتحسين الأمان والتتبع:

1. ✉️ **خدمة البريد الإلكتروني (Email Service)**
2. 📱 **خدمة الرسائل النصية (SMS Service)**  
3. 🚦 **خدمة تحديد المعدل (Rate Limiting Service)**
4. 📝 **خدمة تدقيق السجلات (Audit Logging Service)**

---

## 1. ✉️ خدمة البريد الإلكتروني - EmailService

### 📋 الوظيفة
إرسال رسائل بريد إلكتروني احترافية للمستخدمين بأنواع مختلفة.

### 🎯 الميزات
- ✅ **تصميم متجاوب** - يعمل على جميع الأجهزة
- ✅ **HTML غني** - رسائل بتنسيق جذاب
- ✅ **أنواع متعددة**:
  - 📨 بريد ترحيبي عند التسجيل
  - 🔐 استعادة كلمة المرور
  - ✅ إشعار الموافقة على الحساب
  - 💊 إشعار وصفة طبية جديدة

### 📁 الملفات
- **الواجهة**: `IEmailService`
- **التنفيذ**: `EmailService.cs`
- **الإعدادات**: `EmailSettings` class

### ⚙️ الإعداد في appsettings.json
```json
"EmailSettings": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": 587,
  "SenderEmail": "your-email@gmail.com",
  "SenderName": "HINN Healthcare Platform",
  "SmtpPassword": "your-app-password-here"
}
```

### 🚀 الاستخدام في Controllers
```csharp
// في Constructor
private readonly IEmailService _emailService;

public AuthController(..., IEmailService emailService)
{
    _emailService = emailService;
}

// إرسال بريد ترحيبي
await _emailService.SendWelcomeEmailAsync(user.Email, user.FullName);

// إرسال رابط استعادة كلمة المرور
await _emailService.SendPasswordResetEmailAsync(email, resetLink);
```

### 📧 أنواع البريد المتاحة

| الدالة | الوصف | المعاملات |
|--------|-------|-----------|
| `SendEmailAsync` | بريد عام | email, subject, message |
| `SendWelcomeEmailAsync` | ترحيبي | email, userName |
| `SendPasswordResetEmailAsync` | استعادة كلمة المرور | email, resetLink |
| `SendApprovalNotificationAsync` | إشعار الموافقة | email, entityType |
| `SendPrescriptionNotificationAsync` | وصفة جديدة | email, prescriptionTitle |

---

## 2. 📱 خدمة الرسائل النصية - SmsService

### 📋 الوظيفة
إرسال رسائل SMS باستخدام Twilio للإشعارات السريعة والمهمة.

### 🎯 الميزات
- ✅ **تكامل مع Twilio** - خدمة عالمية موثوقة
- ✅ **أنواع متعددة من الرسائل**
- ✅ **عدم كسر التدفق** - الفشل لا يوقف العملية الرئيسية
- ✅ **تسجيل شامل** - كل رسالة مسجلة في logs

### 📁 الملفات
- **الواجهة**: `ISmsService`
- **التنفيذ**: `SmsService.cs`
- **الإعدادات**: `SmsSettings` class

### ⚙️ الإعداد في appsettings.json
```json
"SmsSettings": {
  "AccountSid": "your-twilio-account-sid",
  "AuthToken": "your-twilio-auth-token",
  "SenderNumber": "+1234567890"
}
```

### 🚀 الحصول على Twilio Credentials
1. أنشئ حساب على https://www.twilio.com
2. احصل على Account SID و Auth Token من Dashboard
3. اشترِ رقم هاتف (Sender Number)
4. ⚠️ **ملاحظة**: Twilio خدمة مدفوعة

### 📱 أنواع الرسائل المتاحة

| الدالة | الوصف | المعاملات |
|--------|-------|-----------|
| `SendSmsAsync` | رسالة عامة | phoneNumber, message |
| `SendVerificationCodeAsync` | كود التحقق | phoneNumber, code |
| `SendAppointmentReminderAsync` | تذكير بالموعد | phoneNumber, doctorName, appointmentTime |
| `SendPrescriptionReadyAsync` | جاهزية الدواء | phoneNumber, pharmacyName |
| `SendPasswordResetCodeAsync` | كود الاستعادة | phoneNumber, code |

### مثال الاستخدام
```csharp
// إرسال كود التحقق
var code = new Random().Next(100000, 999999).ToString();
await _smsService.SendVerificationCodeAsync(phoneNumber, code);

// تذكير بموعد طبي
await _smsService.SendAppointmentReminderAsync(
    phoneNumber, 
    "د. أحمد محمد", 
    DateTime.Now.AddHours(2)
);
```

---

## 3. 🚦 خدمة تحديد المعدل - RateLimitService

### 📋 الوظيفة
منع التعدي والهجمات عن طريق تحديد عدد الطلبات المسموح بها في فترة زمنية.

### 🎯 الميزات
- ✅ **حماية من الهجمات** - DDoS, Brute Force
- ✅ **مرن وقابل للتكوين** | إعدادات مختلفة لكل إجراء
- ✅ **تخزين في الذاكرة** - سريع جداً
- ✅ **تنظيف تلقائي** - إزالة السجلات القديمة
- ✅ **معلومات تفصيلية** - معرفة حالة الـ Rate Limit

### 📁 الملفات
- **الواجهة**: `IRateLimitService`
- **التنفيذ**: `RateLimitService.cs`
- **الثوابت**: `RateLimitPresets` class

### ⚙️ الإعدادات الافتراضية (RateLimitPresets)

| الإجراء | الحد الأقصى | النافذة الزمنية |
|---------|-------------|-----------------|
| تسجيل الدخول | 5 محاولات | 15 دقيقة |
| البحث | 30 طلب | 1 دقيقة |
| رفع الروشتات | 10 طلبات | 1 ساعة |
| إرسال الرسائل | 20 رسالة | 1 ساعة |
| التقييمات | 5 تقييمات | 1 ساعة |
| API عام | 100 طلب | 1 دقيقة |

### 🚀 الاستخدام
```csharp
// في Constructor
private readonly IRateLimitService _rateLimitService;

// التحقق قبل تنفيذ الإجراء
if (!_rateLimitService.IsAllowed(userId, "login", 
    RateLimitPresets.LoginAttempts, 
    RateLimitPresets.LoginWindowSeconds))
{
    return StatusCode(429, new { 
        message = "محاولات كثيرة جداً. يرجى المحاولة بعد قليل" 
    });
}

// تنفيذ الإجراء إذا كان مسموحاً
// ...
```

### أمثلة متقدمة
```csharp
// الحصول على معلومات عن حالة الـ Rate Limit
var info = _rateLimitService.GetRateLimitInfo(userId, "search");
Console.WriteLine($"Remaining: {info.RemainingRequests}");
Console.WriteLine($"Reset in: {info.RetryAfter.TotalSeconds}s");

// إعادة تعيين حدود المستخدم
_rateLimitService.ResetLimits(userId);
```

### ⚠️ ملاحظات مهمة
- ✅ الخدمة **Thread-Safe** باستخدام `ConcurrentDictionary`
- ✅ التنظيف يتم **تلقائياً كل ساعة**
- ✅ الفشل **لا يرمي استثناء** - لا يكسر التدفق الرئيسي

---

## 4. 📝 خدمة تدقيق السجلات - AuditLogService

### 📋 الوظيفة
تسجيل وتتبع **جميع العمليات** في النظام للأمان والمراجعة.

### 🎯 الميزات
- ✅ **تسجيل شامل** - كل عملية تُسجل
- ✅ **بيانات كاملة** - من، ماذا، متى، أين
- ✅ **مقارنة البيانات** - Old vs New
- ✅ **تتبع IP و UserAgent** | معلومات الجهاز
- ✅ **قياس الأداء** - Execution Time
- ✅ **فهرسة سريعة** - بحث سريع في السجلات

### 📁 الملفات
- **النموذج**: `AuditLog.cs` (Model)
- **الواجهة**: `IAuditLogService`
- **التنفيذ**: `AuditLogService.cs`
- **المساعد**: `AuditHelper.cs`
- **الثوابت**: `AuditActionTypes` class

### 🗄️ قاعدة البيانات
جدول `AuditLogs` يحتوي على:

| الحقل | النوع | الوصف |
|------|------|--------|
| Id | int | معرف السجل |
| UserId | string | المستخدم |
| UserName | string | اسم المستخدم |
| ActionType | string | نوع الإجراء |
| EntityType | string | الكيان المتأثر |
| EntityId | int? | معرف الكيان |
| Description | string | الوصف |
| OldData | JSON | البيانات القديمة |
| NewData | JSON | البيانات الجديدة |
| IpAddress | string | عنوان IP |
| UserAgent | string | معلومات المتصفح |
| Success | bool | هل نجح؟ |
| ErrorMessage | string | رسالة الخطأ |
| ExecutionTimeMs | long | وقت التنفيذ |
| CreatedAt | DateTime | وقت الحدوث |

### 🚀 الاستخدام الأساسي
```csharp
// في Constructor
private readonly IAuditLogService _auditService;

// تسجيل عملية بسيطة
await _auditService.LogAsync(
    userId: user.Id,
    userName: user.Email!,
    actionType: AuditActionTypes.Login,
    description: "User logged in successfully",
    success: true
);

// تسجيل عملية مع بيانات
await _auditService.LogAsync(
    userId: user.Id,
    userName: user.Email!,
    actionType: AuditActionTypes.Update,
    entityType: "Pharmacy",
    entityId: pharmacyId,
    description: "Updated pharmacy information",
    oldData: oldPharmacyData,
    newData: newPharmacyData,
    success: true
);
```

### استخدام AuditHelper (أسهل)
```csharp
// تسجيل إنشاء
await AuditHelper.LogCreate(_auditService, userId, userName, newEntity);

// تسجيل تحديث
await AuditHelper.LogUpdate(_auditService, userId, userName, oldEntity, newEntity);

// تسجيل حذف
await AuditHelper.LogDelete(_auditService, userId, userName, entity);
```

### 📊 الاستعلام عن السجلات
```csharp
// سجلات مستخدم معين
var userLogs = await _auditService.GetUserLogsAsync(userId, count: 50);

// سجلات كيان معين
var entityLogs = await _auditService.GetEntityLogsAsync("Pharmacy", pharmacyId);

// آخر السجلات
var recentLogs = await _auditService.GetRecentLogsAsync(count: 100);

// السجلات الفاشلة
var failedLogs = await _auditService.GetFailedLogsAsync(count: 50);
```

### 🎯 أنواع الإجراءات (AuditActionTypes)

```csharp
AuditActionTypes.Create      // إنشاء
AuditActionTypes.Update      // تحديث
AuditActionTypes.Delete      // حذف
AuditActionTypes.Login       // تسجيل دخول
AuditActionTypes.Logout      // خروج
AuditActionTypes.Register    // تسجيل جديد
AuditActionTypes.Approve     // موافقة
AuditActionTypes.Reject      // رفض
AuditActionTypes.Upload      // رفع ملف
AuditActionTypes.Search      // بحث
AuditActionTypes.SendMessage // إرسال رسالة
AuditActionTypes.Rate        // تقييم
```

---

## 🔧 التكامل والاعتمادية (Dependency Injection)

### التسجيل في Program.cs

```csharp
// Email & SMS
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddSingleton<IEmailService, EmailService>();

builder.Services.Configure<SmsSettings>(builder.Configuration.GetSection("SmsSettings"));
builder.Services.AddSingleton<ISmsService, SmsService>();

// Rate Limiting
builder.Services.AddSingleton<IRateLimitService, RateLimitService>();

// Audit Logging
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
```

### ⚙️ نمط الخدمة (Service Lifetime)

| الخدمة | النمط | السبب |
|--------|-------|-------|
| EmailService | Singleton | Stateless - لا تحتفظ بحالة |
| SmsService | Singleton | Stateless - لا تحتفظ بحالة |
| RateLimitService | Singleton | **تحتفظ بحالة** - تتبع الطلبات |
| AuditLogService | Scoped | تحتاج DbContext (Scoped) |

---

## 📊 ملخص التكامل في AuthController

### ما تم إضافته:

#### 1. ✅ Rate Limiting لتسجيل الدخول
```csharp
// منع الهجمات الغاشمة
if (!_rateLimitService.IsAllowed(userId, "login", 
    RateLimitPresets.LoginAttempts, 
    RateLimitPresets.LoginWindowSeconds))
{
    return StatusCode(429, new { message = "محاولات كثيرة جداً" });
}
```

#### 2. ✅ Audit Logging لجميع العمليات
```csharp
// نجاح
await _auditService.LogAsync(userId, email, AuditActionTypes.Login, 
    description: "Login successful", success: true);

// فشل
await _auditService.LogAsync(userId, email, AuditActionTypes.Login, 
    description: "Invalid password", success: false, 
    errorMessage: "Invalid password");
```

#### 3. ✅ Email Notifications
```csharp
// بريد ترحيبي عند التسجيل
await _emailService.SendWelcomeEmailAsync(user.Email, user.FullName);
```

---

## 🎯 الخطوات التالية (اختياري)

### دمج الخدمات في Controllers أخرى:

#### 1. PatientController
- ✅ Rate Limiting على رفع الروشتات
- ✅ Email/SMS عند اختيار صيدلية
- ✅ Audit Log للعمليات

#### 2. PharmacyController
- ✅ Rate Limiting على الردود
- ✅ Email عند استقبال طلب جديد
- ✅ Audit Log للردود

#### 3. SearchController
- ✅ Rate Limiting على البحث
- ✅ Audit Log للبحث

#### 4. RatingController
- ✅ Rate Limiting على التقييمات
- ✅ Audit Log للتقييمات

---

## ⚠️ ملاحظات مهمة للتشغيل

### 1. إعداد Gmail SMTP
```
1. فعل 2FA في حساب Google
2. أنشئ App Password: https://myaccount.google.com/apppasswords
3. استخدم App Password بدلاً من كلمة المرور العادية
```

### 2. إعداد Twilio
```
1. أنشئ حساب: https://www.twilio.com
2. احصل على credentials من Dashboard
3. اشترِ رقم هاتف
4. ⚠️ هذه خدمة مدفوعة
```

### 3. Migration لقاعدة البيانات
```bash
# إنشاء Migration جديدة
dotnet ef migrations add AddAuditLogsTable

# تحديث قاعدة البيانات
dotnet ef database update
```

---

## 📈 الفوائد المتوقعة

### 1. الأمان 🔒
- منع هجمات Brute Force
- تتبع جميع العمليات المشبوهة
- كشف الأنماط غير الطبيعية

### 2. التواصل 📧📱
- إشعارات فورية للمستخدمين
- تقليل الاعتماد على SignalR فقط
- وصول حتى لو المستخدم Offline

### 3. التتبع 📝
- معرفة من عمل ماذا ومتى
- تحليل سلوك المستخدمين
- حل المشاكل بسرعة

### 4. الأداء 🚀
- تحسين استخدام الموارد
- منع الإفراط في الطلبات
- عدالة بين المستخدمين

---

## 🤔 الأسئلة الشائعة

### س: هل الخدمات تعمل بدون إعداد؟
ج: ✅ نعم، لكن:
- Email: لن يُرسل بدون SMTP settings
- SMS: لن يُرسل بدون Twilio credentials
- Rate Limiting: ✅ يعمل افتراضياً
- Audit Logging: ✅ يعمل افتراضياً

### س: هل SMS مجاني؟
ج: ❌ لا، Twilio خدمة مدفوعة. لكن:
- التجربة مجانية ($15 رصيد مجاني)
- الأسعار رخيصة (~$0.0075 للرسالة)

### س: Rate Limiting يؤثر على الأداء؟
ج: ❌ لا، العكس! يحسن الأداء بمنع الإفراط في الطلبات.

### س: Audit Logs تأخذ مساحة كبيرة؟
ج: ممكن. ننصح بـ:
- أرشفة السجلات القديمة
- حذف السجلات بعد 6 أشهر
- ضغط البيانات

---

**تم التطوير بواسطة فريق HINN** 🚀
**آخر تحديث**: مارس 2026
