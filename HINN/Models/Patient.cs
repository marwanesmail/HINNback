using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;
        public string? MedicalRecordNumber { get; set; }

        // ═══════════════════════════════════════════════════════
        // البيانات الشخصية
        // ═══════════════════════════════════════════════════════
        
        /// <summary>
        /// رقم الهاتف
        /// </summary>
        [Phone]
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// النوع: Male, Female
        /// </summary>
        [MaxLength(10)]
        public string? Gender { get; set; }

        /// <summary>
        /// تاريخ الميلاد
        /// </summary>
        public DateTime? DateOfBirth { get; set; }

        /// <summary>
        /// العمر (يتم حسابه تلقائياً)
        /// </summary>
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

        // ═══════════════════════════════════════════════════════
        // البيانات الصحية الأساسية
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// الطول بالسنتيمتر
        /// </summary>
        public double? HeightCm { get; set; }

        /// <summary>
        /// الوزن بالكيلوجرام
        /// </summary>
        public double? WeightKg { get; set; }

        /// <summary>
        /// مؤشر كتلة الجسم (يتم حسابه تلقائياً)
        /// </summary>
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

        /// <summary>
        /// فصيلة الدم: A+, A-, B+, B-, AB+, AB-, O+, O-
        /// </summary>
        [MaxLength(5)]
        public string? BloodType { get; set; }

        // ═══════════════════════════════════════════════════════
        // التاريخ الطبي
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// الحساسية (مفصولة بفاصلة)
        /// مثال: "Penicillin,Peanuts,Dust"
        /// </summary>
        public string? Allergies { get; set; }

        /// <summary>
        /// الأمراض المزمنة (مفصولة بفاصلة)
        /// مثال: "Diabetes,Hypertension,Asthma"
        /// </summary>
        public string? ChronicDiseases { get; set; }

        /// <summary>
        /// الأدوية الحالية (مفصولة بفاصلة)
        /// مثال: "Aspirin,Metformin,Lisinopril"
        /// </summary>
        public string? CurrentMedications { get; set; }

        /// <summary>
        /// عمليات سابقة (مفصولة بفاصلة)
        /// </summary>
        public string? Surgeries { get; set; }

        /// <summary>
        /// ملاحظات طبية إضافية
        /// </summary>
        public string? MedicalNotes { get; set; }

        /// <summary>
        /// اسم الطوارئ
        /// </summary>
        public string? EmergencyContactName { get; set; }

        /// <summary>
        /// رقم طوارئ
        /// </summary>
        [Phone]
        public string? EmergencyContactPhone { get; set; }

        /// <summary>
        /// تاريخ آخر تحديث للملف الصحي
       
        public DateTime? LastMedicalUpdate { get; set; }
    }
}
