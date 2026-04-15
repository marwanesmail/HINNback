using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    public class PharmacyResponse
    {
        [Key]
        public int Id { get; set; }

        //  ربط الصيدلية بالرد
        [Required]
        public int PharmacyId { get; set; }
        public virtual Pharmacy Pharmacy { get; set; } = null!;

        //  ربط المريض اللي طلب الدواء
        [Required]
        public string PatientId { get; set; } = null!;

        //  ربط بالروشتة (لو البحث كان عن طريق روشتة)
        public int? PrescriptionId { get; set; }
        public virtual Prescription? Prescription { get; set; }

        //  اسم الدواء المطلوب (لو البحث كان بالاسم مباشرة)
        [MaxLength(200)]
        public string? MedicineName { get; set; }

        //  هل الدواء متاح؟
        public bool IsAvailable { get; set; }

        //  السعر (اختياري)
        public decimal? Price { get; set; }

        //  ملاحظات اختيارية من الصيدلية
        public string? Note { get; set; }

        //  هل المريض شاف الرد؟
        public bool IsSeenByPatient { get; set; } = false;

        //  وقت الرد
        public DateTime RespondedAt { get; set; } = DateTime.UtcNow;

        // ═══════════════════════════════════════════════════════
        // بيانات إضافية للأدوية المصروفة
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// هل تم صرف الدواء فعلاً؟
        /// </summary>
        public bool IsDispensed { get; set; } = false;

        /// <summary>
        /// تاريخ الصرف
        /// </summary>
        public DateTime? DispensedAt { get; set; }

        /// <summary>
        /// كمية الدواء المصروفة
        /// </summary>
        public int? Quantity { get; set; }

        /// <summary>
        /// تعليمات الاستخدام من الصيدلي
        /// </summary>
        public string? UsageInstructions { get; set; }

        /// <summary>
        /// تاريخ انتهاء الصلاحية
        /// </summary>
        public DateTime? ExpiryDate { get; set; }

        /// <summary>
        /// رقم التشغيلة (Batch Number)
        /// </summary>
        [MaxLength(100)]
        public string? BatchNumber { get; set; }

        /// <summary>
        /// حالة الطلب من المريض
        /// </summary>
        public ResponsePatientStatus PatientStatus { get; set; } = ResponsePatientStatus.Pending;
    }

    /// <summary>
    /// حالة الرد من منظور المريض
    /// </summary>
    public enum ResponsePatientStatus
    {
        Pending,      // لسه ما شافش
        Viewed,       // شاف الرد
        Accepted,     // قبل العرض
        Rejected      // رفض العرض
    }
}
