using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// تبادل الأدوية بين الصيدليات
    /// </summary>
    public class DrugExchange
    {
        [Key]
        public int Id { get; set; }

        // ═══════════════════════════════════════════════════════
        // الصيدليات المشاركة
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// الصيدلية اللي عرضت/طلبت التبادل
        /// </summary>
        [Required]
        public int FromPharmacyId { get; set; }
        public virtual Pharmacy FromPharmacy { get; set; } = null!;

        /// <summary>
        /// الصيدلية اللي وصلتله العرض/الطلب
        /// </summary>
        [Required]
        public int ToPharmacyId { get; set; }
        public virtual Pharmacy ToPharmacy { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // بيانات الدواء
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// اسم الدواء
        /// </summary>
        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        /// <summary>
        /// الكمية المطلوبة/المعروضة
        /// </summary>
        [Required]
        public int Quantity { get; set; }

        /// <summary>
        /// سعر الوحدة المقترح
        /// </summary>
        public decimal? SuggestedPrice { get; set; }

        /// <summary>
        /// تاريخ انتهاء الصلاحية
        /// </summary>
        public DateTime? ExpiryDate { get; set; }

        /// <summary>
        /// رقم الدفعة
        /// </summary>
        [MaxLength(50)]
        public string? BatchNumber { get; set; }

        // ═══════════════════════════════════════════════════════
        // نوع التبادل
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// نوع التبادل
        /// Offer: عرض دواء للبيع
        /// Request: طلب دواء للشراء
        /// Swap: تبادل مع دواء تاني
        /// </summary>
        [Required, MaxLength(50)]
        public string ExchangeType { get; set; } = "Offer";

        // ═══════════════════════════════════════════════════════
        // حالة الطلب
        // ═══════════════════════════════════════════════════════

        public ExchangeStatus Status { get; set; } = ExchangeStatus.Pending;

        /// <summary>
        /// رد الصيدلية المستلمة
        /// </summary>
        public string? ResponseNote { get; set; }

        /// <summary>
        /// وقت الرد
        /// </summary>
        public DateTime? RespondedAt { get; set; }

        // ═══════════════════════════════════════════════════════
        // معلومات إضافية
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// سبب التبادل (مش بيتباع، قريب من الانتهاء، إلخ)
        /// </summary>
        [MaxLength(500)]
        public string? Reason { get; set; }

        /// <summary>
        /// ملاحظات
        /// </summary>
        public string? Notes { get; set; }

        // ═══════════════════════════════════════════════════════
        // تواريخ
        // ═══════════════════════════════════════════════════════

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// حالة تبادل الأدوية
    /// </summary>
    public enum ExchangeStatus
    {
        Pending,      // في الانتظار
        Approved,     // موافق عليه
        Rejected,     // مرفوض
        Completed     // تم التبادل
    }
}
