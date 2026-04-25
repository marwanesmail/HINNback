using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// طلب أدوية من شركة مصنعة (يدعم أصناف متعددة)
    /// </summary>
    public class PharmacyOrder
    {
        [Key]
        public int Id { get; set; }

        // ═══════════════════════════════════════════════════════
        // الصيدلية
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// الصيدلية اللي طلبت
        /// </summary>
        [Required]
        public int PharmacyId { get; set; }
        public virtual Pharmacy Pharmacy { get; set; } = null!;

        // ملاحظة: تم حذف CompanyId لأن كل صنف مرتبط بشركته الخاصة عبر CompanyMedicine

        // ═══════════════════════════════════════════════════════
        // أصناف الطلب
        // ═══════════════════════════════════════════════════════

        public virtual ICollection<PharmacyOrderItem> Items { get; set; } = new List<PharmacyOrderItem>();

        /// <summary>
        /// السعر الإجمالي للطلب بالكامل
        /// </summary>
        public decimal TotalAmount => Items.Sum(i => i.TotalPrice);

        // ═══════════════════════════════════════════════════════
        // حالة الطلب
        // ═══════════════════════════════════════════════════════

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        /// <summary>
        /// رد الشركة العام (اختياري)
        /// </summary>
        public string? CompanyResponse { get; set; }

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

        [MaxLength(50)]
        public string Priority { get; set; } = "Normal";

        public string? Notes { get; set; }

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
