using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// Medicine catalogue entry managed by a pharmaceutical company.
    /// </summary>
    public class CompanyMedicine
    {
        [Key]
        public int Id { get; set; }

        // FK → Companies table
        [Required]
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // بيانات الدواء
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// اسم الدواء (مثال: باراسيتامول 500mg)
        /// </summary>
        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        /// <summary>
        /// الفئة العلاجية (مسكنات، مضادات حيوية، فيتامينات، إلخ)
        /// </summary>
        [MaxLength(100)]
        public string? Category { get; set; }

        /// <summary>
        /// وصف الدواء
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// صورة المنتج (مسار الملف)
        /// </summary>
        [MaxLength(500)]
        public string? ImagePath { get; set; }

        // ═══════════════════════════════════════════════════════
        // بيانات التسعير والمخزون
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// سعر الوحدة (للصيدلية)
        /// </summary>
        [Required]
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// المخزون المتاح (عدد الوحدات)
        /// </summary>
        public int StockQuantity { get; set; } = 0;

        /// <summary>
        /// الحد الأدنى للطلب الواحد
        /// </summary>
        public int MinimumOrderQuantity { get; set; } = 1;

        // ═══════════════════════════════════════════════════════
        // تواريخ الإنتاج والانتهاء
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// تاريخ الإنتاج
        /// </summary>
        public DateTime? ProductionDate { get; set; }

        /// <summary>
        /// تاريخ انتهاء الصلاحية
        /// </summary>
        public DateTime? ExpiryDate { get; set; }

        // ═══════════════════════════════════════════════════════
        // الحالة
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// هل الدواء متاح للطلب؟ (الشركة تتحكم فيه)
        /// </summary>
        public bool IsAvailable { get; set; } = true;

        /// <summary>
        /// حالة المخزون المحسوبة (متوفر / مخزون منخفض / غير متوفر)
        /// </summary>
        [NotMapped]
        public string Status
        {
            get
            {
                if (!IsAvailable || StockQuantity == 0)
                    return "غير متوفر";
                if (StockQuantity <= MinimumOrderQuantity * 2)
                    return "مخزون منخفض";
                return "متوفر";
            }
        }

        // ═══════════════════════════════════════════════════════
        // تواريخ السجل
        // ═══════════════════════════════════════════════════════

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // ═══════════════════════════════════════════════════════
        // بيانات المتجر (E-commerce)
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// نسبة الخصم (0-100)
        /// </summary>
        public int DiscountPercentage { get; set; } = 0;

        /// <summary>
        /// التقييم العام (من 5)
        /// </summary>
        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 5.00m;

        /// <summary>
        /// عدد المراجعات
        /// </summary>
        public int ReviewsCount { get; set; } = 0;

        /// <summary>
        /// هل المنتج مميز (يظهر في الصفحة الرئيسية أولاً)
        /// </summary>
        public bool IsFeatured { get; set; } = false;

        /// <summary>
        /// هل المنتج جديد (أقل من 30 يوم)
        /// </summary>
        [NotMapped]
        public bool IsNew => (DateTime.UtcNow - CreatedAt).TotalDays <= 30;
    }
}
