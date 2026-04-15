using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// طلب أدوية من شركة مصنعة
    /// </summary>
    public class PharmacyOrder
    {
        [Key]
        public int Id { get; set; }

        // ═══════════════════════════════════════════════════════
        // الصيدلية والشركة
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// الصيدلية اللي طلبت
        /// </summary>
        [Required]
        public int PharmacyId { get; set; }
        public virtual Pharmacy Pharmacy { get; set; } = null!;

        /// <summary>
        /// الشركة المصنعة
        /// </summary>
        public int? CompanyId { get; set; }
        public virtual Company? Company { get; set; }

        // ═══════════════════════════════════════════════════════
        // بيانات الطلب
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// اسم الدواء المطلوب
        /// </summary>
        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        /// <summary>
        /// الكمية المطلوبة
        /// </summary>
        [Required]
        public int Quantity { get; set; }

        /// <summary>
        /// الفئة العلاجية (مسكنات، مضادات حيوية، إلخ)
        /// </summary>
        [MaxLength(100)]
        public string? Category { get; set; }

        /// <summary>
        /// السعر المتوقع للوحدة
        /// </summary>
        public decimal? ExpectedPrice { get; set; }

        /// <summary>
        /// الأولوية
        /// Normal, Urgent, Low
        /// </summary>
        [MaxLength(50)]
        public string Priority { get; set; } = "Normal";

        // ═══════════════════════════════════════════════════════
        // حالة الطلب
        // ═══════════════════════════════════════════════════════

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        /// <summary>
        /// رد الشركة
        /// </summary>
        public string? CompanyResponse { get; set; }

        /// <summary>
        /// السعر الفعلي
        /// </summary>
        public decimal? FinalPrice { get; set; }

        /// <summary>
        /// وقت الرد
        /// </summary>
        public DateTime? RespondedAt { get; set; }

        /// <summary>
        /// تاريخ التسليم المتوقع
        /// </summary>
        public DateTime? ExpectedDeliveryDate { get; set; }

        /// <summary>
        /// تاريخ التسليم الفعلي
        /// </summary>
        public DateTime? ActualDeliveryDate { get; set; }

        // ═══════════════════════════════════════════════════════
        // معلومات إضافية
        // ═══════════════════════════════════════════════════════

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
    /// حالة طلب الأدوية
    /// </summary>
    public enum OrderStatus
    {
        Pending,        // في الانتظار
        Confirmed,      // مؤكد
        Shipped,        // تم الشحن
        Delivered,      // تم التسليم
        Cancelled,      // ملغي
        Rejected        // مرفوض
    }
}
