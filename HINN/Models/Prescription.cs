using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Prescription
    {
        [Key]
        public int Id { get; set; }

        // ═══════════════════════════════════════════════════════
        // بيانات المريض
        // ═══════════════════════════════════════════════════════
        
        // المريض اللي الروشتة له
        [Required]
        public string PatientId { get; set; } = null!;
        public virtual AppUser Patient { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // بيانات الطبيب ( اللي كتب الروشتة)
        // ═══════════════════════════════════════════════════════
        
        /// <summary>
        /// ID الطبيب اللي كتب الروشتة (اختياري لو المريض بيطلب دواء من غير روشتة دكتور)
        /// </summary>
        public string? DoctorId { get; set; }
        
        /// <summary>
        /// بيانات الطبيب
        /// </summary>
        public virtual AppUser? Doctor { get; set; }

        // عنوان الروشتة أو اسم الدواء الرئيسي
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = null!;

        // ملاحظات إضافية
        public string? Notes { get; set; }

        // صورة الروشتة
        public string? PrescriptionImagePath { get; set; }

        // موقع المريض وقت البحث
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // نطاق البحث بالكيلومتر
        public double SearchRadiusKm { get; set; } = 5;

        // ═══════════════════════════════════════════════════════
        // بيانات إضافية لطلب الدواء أونلاين
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// اسم المريض (للتوصيل)
        /// </summary>
        [MaxLength(200)]
        public string? PatientName { get; set; }

        /// <summary>
        /// رقم الهاتف (للتوصيل)
        /// </summary>
        [Phone]
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// عنوان التوصيل
        /// </summary>
        [MaxLength(500)]
        public string? DeliveryAddress { get; set; }

        /// <summary>
        /// تفضيلات بديل الدواء
        /// SearchAlternative, CompleteWithoutMissing, PhoneConsultation
        /// </summary>
        [MaxLength(50)]
        public string? AlternativePreference { get; set; } = "PhoneConsultation";

        // حالة الطلب
        public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Pending;

        // وقت الإنشاء
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ═══════════════════════════════════════════════════════
        // بيانات إضافية للروشتة (مطلوبة للـ UI)
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// تاريخ الزيارة للطبيب
        /// </summary>
        public DateTime? VisitDate { get; set; }

        /// <summary>
        /// التشخيص الطبي
        /// </summary>
        [MaxLength(500)]
        public string? Diagnosis { get; set; }

        /// <summary>
        /// تعليمات خاصة من الطبيب
        /// </summary>
        public string? SpecialInstructions { get; set; }

        /// <summary>
        /// نوع الروشتة: عادية، عاجلة، متكررة
        /// </summary>
        [MaxLength(50)]
        public string? PrescriptionType { get; set; } // Normal, Urgent, Recurring

        /// <summary>
        /// مدة صلاحية الروشتة بالأيام
        /// </summary>
        public int? ValidityDays { get; set; } = 30;

        /// <summary>
        /// هل الروشتة لسه سارية؟
        /// </summary>
        public bool IsActive
        {
            get
            {
                if (!ValidityDays.HasValue || !VisitDate.HasValue)
                    return Status == PrescriptionStatus.Pending || Status == PrescriptionStatus.Responded;
                
                var expiryDate = VisitDate.Value.AddDays(ValidityDays.Value);
                return DateTime.UtcNow <= expiryDate && 
                       (Status == PrescriptionStatus.Pending || Status == PrescriptionStatus.Responded);
            }
        }

        // الردود اللي جات من الصيدليات
        public virtual ICollection<PharmacyResponse>? Responses { get; set; }
    }

    public enum PrescriptionStatus
    {
        Pending,      // لسه منتظر ردود
        Responded,    // فيه صيدلية ردت
        Completed,    // المريض اختار صيدلية
        Cancelled     // اتلغي
    }
}
