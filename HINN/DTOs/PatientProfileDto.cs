using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    /// <summary>
    /// DTO لتسجيل مريض جديد
    /// </summary>
    public class PatientRegisterDto
    {
        // ═══════════════════════════════════════════════════════
        // بيانات الحساب الأساسية
        // ═══════════════════════════════════════════════════════
        
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, MinLength(6)]
        public string Password { get; set; } = null!;

        [Required, MaxLength(150)]
        public string FullName { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // البيانات الشخصية
        // ═══════════════════════════════════════════════════════
        
        [Phone]
        public string? PhoneNumber { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; } // Male, Female

        public DateTime? DateOfBirth { get; set; }

        // ═══════════════════════════════════════════════════════
        // البيانات الصحية
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// الطول بالسنتيمتر
        /// </summary>
        [Range(30, 300)]
        public double? HeightCm { get; set; }

        /// <summary>
        /// الوزن بالكيلوجرام
        /// </summary>
        [Range(1, 500)]
        public double? WeightKg { get; set; }

        /// <summary>
        /// فصيلة الدم
        /// </summary>
        [MaxLength(5)]
        public string? BloodType { get; set; } // A+, A-, B+, B-, AB+, AB-, O+, O-

        /// <summary>
        /// الحساسية (مفصولة بفاصلة)
        /// </summary>
        public string? Allergies { get; set; }

        /// <summary>
        /// الأمراض المزمنة (مفصولة بفاصلة)
        /// </summary>
        public string? ChronicDiseases { get; set; }

        /// <summary>
        /// الأدوية الحالية (مفصولة بفاصلة)
        /// </summary>
        public string? CurrentMedications { get; set; }

        /// <summary>
        /// عمليات سابقة
        /// </summary>
        public string? Surgeries { get; set; }

        /// <summary>
        /// ملاحظات طبية
        /// </summary>
        public string? MedicalNotes { get; set; }

        /// <summary>
        /// اسم جهة اتصال الطوارئ
        /// </summary>
        public string? EmergencyContactName { get; set; }

        /// <summary>
        /// رقم هاتف الطوارئ
        /// </summary>
        [Phone]
        public string? EmergencyContactPhone { get; set; }
    }

    /// <summary>
    /// DTO لتحديث الملف الشخصي للمريض
    /// </summary>
    public class UpdatePatientProfileDto
    {
        // ═══════════════════════════════════════════════════════
        // البيانات الشخصية
        // ═══════════════════════════════════════════════════════
        
        [Phone]
        public string? PhoneNumber { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        // ═══════════════════════════════════════════════════════
        // البيانات الصحية
        // ═══════════════════════════════════════════════════════

        [Range(30, 300)]
        public double? HeightCm { get; set; }

        [Range(1, 500)]
        public double? WeightKg { get; set; }

        [MaxLength(5)]
        public string? BloodType { get; set; }

        public string? Allergies { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? CurrentMedications { get; set; }
        public string? Surgeries { get; set; }
        public string? MedicalNotes { get; set; }

        public string? EmergencyContactName { get; set; }

        [Phone]
        public string? EmergencyContactPhone { get; set; }
    }

    /// <summary>
    /// DTO لعرض بيانات المريض الكاملة
    /// </summary>
    public class PatientProfileResponseDto
    {
        // ═══════════════════════════════════════════════════════
        // بيانات الحساب
        // ═══════════════════════════════════════════════════════
        
        public string Id { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // البيانات الشخصية
        // ═══════════════════════════════════════════════════════
        
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public int? Age { get; set; }

        // ═══════════════════════════════════════════════════════
        // البيانات الصحية
        // ═══════════════════════════════════════════════════════
        
        public double? HeightCm { get; set; }
        public double? WeightKg { get; set; }
        public double? BMI { get; set; }
        public string? BloodType { get; set; }
        public string? Allergies { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? CurrentMedications { get; set; }
        public string? Surgeries { get; set; }
        public string? MedicalNotes { get; set; }

        // ═══════════════════════════════════════════════════════
        // بيانات الطوارئ
        // ═══════════════════════════════════════════════════════
        
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }

        // ═══════════════════════════════════════════════════════
        // معلومات أخرى
        // ═══════════════════════════════════════════════════════
        
        public DateTime? LastMedicalUpdate { get; set; }
        public string? MedicalRecordNumber { get; set; }
    }

    /// <summary>
    /// DTO لتحديث البيانات الحيوية (الوزن والطول)
    /// </summary>
    public class UpdateVitalsDto
    {
        [Range(30, 300)]
        public double? HeightCm { get; set; }

        [Range(1, 500)]
        public double? WeightKg { get; set; }
    }

    /// <summary>
    /// DTO لإحصائيات لوحة تحكم المريض
    /// </summary>
    public class PatientDashboardStatsDto
    {
        // ═══════════════════════════════════════════════════════
        // الإحصائيات الرئيسية
        // ═══════════════════════════════════════════════════════
        
        /// <summary>
        /// عدد الروشتات النشطة
        /// </summary>
        public int ActivePrescriptions { get; set; }

        /// <summary>
        /// عدد الأدوية الحالية
        /// </summary>
        public int CurrentMedicationsCount { get; set; }

        /// <summary>
        /// عدد المواعيد القادمة
        /// </summary>
        public int UpcomingAppointments { get; set; }

        /// <summary>
        /// عدد الزيارات المكتملة
        /// </summary>
        public int CompletedVisits { get; set; }

        /// <summary>
        /// عدد المواعيد الملغاة
        /// </summary>
        public int CancelledAppointments { get; set; }

        // ═══════════════════════════════════════════════════════
        // معلومات صحية
        // ═══════════════════════════════════════════════════════
        
        /// <summary>
        /// مؤشر كتلة الجسم
        /// </summary>
        public double? BMI { get; set; }

        /// <summary>
        /// تصنيف BMI (نقص وزن، طبيعي، زيادة وزن، سمنة)
        /// </summary>
        public string? BMICategory { get; set; }

        /// <summary>
        /// فصيلة الدم
        /// </summary>
        public string? BloodType { get; set; }

        /// <summary>
        /// هل عند أمراض مزمنة؟
        /// </summary>
        public bool HasChronicDiseases { get; set; }

        /// <summary>
        /// هل عند حساسية؟
        /// </summary>
        public bool HasAllergies { get; set; }
    }

    /// <summary>
    /// مساعد لحساب تصنيف BMI
    /// </summary>
    public static class BMICalculator
    {
        public static string GetCategory(double? bmi)
        {
            if (!bmi.HasValue)
                return "غير محدد";

            return bmi.Value switch
            {
                < 18.5 => "نقص وزن",
                >= 18.5 and < 25 => "طبيعي",
                >= 25 and < 30 => "زيادة وزن",
                >= 30 and < 35 => "سمنة درجة 1",
                >= 35 and < 40 => "سمنة درجة 2",
                _ => "سمنة مفرطة"
            };
        }

        public static string GetCategoryArabicWithIcon(double? bmi)
        {
            if (!bmi.HasValue)
                return "⚠️ غير محدد";

            return bmi.Value switch
            {
                < 18.5 => "⚠️ نقص وزن",
                >= 18.5 and < 25 => "✅ طبيعي",
                >= 25 and < 30 => "⚠️ زيادة وزن",
                >= 30 and < 35 => "🔴 سمنة درجة 1",
                >= 35 and < 40 => "🔴 سمنة درجة 2",
                _ => "🚨 سمنة مفرطة"
            };
        }
    }
}
