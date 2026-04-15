using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// إدارة مخزون الأدوية في الصيدلية
    /// </summary>
    public class PharmacyInventory
    {
        [Key]
        public int Id { get; set; }

        // الصيدلية
        [Required]
        public int PharmacyId { get; set; }
        public virtual Pharmacy Pharmacy { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // بيانات الدواء
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// اسم الدواء (مثال: باراسيتامول 500mg)
        /// </summary>
        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        /// <summary>
        /// الكمية المتوفرة (عدد العلب)
        /// </summary>
        [Required]
        public int Quantity { get; set; } = 0;

        /// <summary>
        /// الحد الأدنى للتنبيه (Low Stock Threshold)
        /// </summary>
        [Required]
        public int MinimumQuantity { get; set; } = 10;

        /// <summary>
        /// تاريخ انتهاء الصلاحية
        /// </summary>
        public DateTime? ExpiryDate { get; set; }

        /// <summary>
        /// سعر الوحدة (جنيه)
        /// </summary>
        [Required]
        public decimal Price { get; set; }

        /// <summary>
        /// رقم الدفعة (Batch Number)
        /// </summary>
        [MaxLength(50)]
        public string? BatchNumber { get; set; }

        /// <summary>
        /// اسم الشركة المصنعة
        /// </summary>
        [MaxLength(200)]
        public string? Manufacturer { get; set; }

        /// <summary>
        /// مكان التخزين (رف 1، رف 2، إلخ)
        /// </summary>
        [MaxLength(100)]
        public string? StorageLocation { get; set; }

        /// <summary>
        /// ملاحظات
        /// </summary>
        public string? Notes { get; set; }

        // ═══════════════════════════════════════════════════════
        // الحالة
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// حالة المخزون (محسوبة تلقائياً)
        /// Available: Quantity > MinimumQuantity
        /// Low: Quantity <= MinimumQuantity && Quantity > 0
        /// OutOfStock: Quantity == 0
        /// </summary>
        [NotMapped]
        public InventoryStatus Status
        {
            get
            {
                if (Quantity == 0)
                    return InventoryStatus.OutOfStock;
                else if (Quantity <= MinimumQuantity)
                    return InventoryStatus.Low;
                else
                    return InventoryStatus.Available;
            }
        }

        /// <summary>
        /// هل الدواء منتهي الصلاحية؟
        /// </summary>
        [NotMapped]
        public bool IsExpired
        {
            get
            {
                return ExpiryDate.HasValue && ExpiryDate.Value < DateTime.Today;
            }
        }

        // ═══════════════════════════════════════════════════════
        // تواريخ
        // ═══════════════════════════════════════════════════════

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastUpdated { get; set; }
    }

    /// <summary>
    /// حالة المخزون
    /// </summary>
    public enum InventoryStatus
    {
        Available,    // متوفر
        Low,          // منخفض
        OutOfStock    // نفد
    }
}
