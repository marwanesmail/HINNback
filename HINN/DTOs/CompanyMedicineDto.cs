using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    // ═══════════════════════════════════════════════════════
    // Response DTO — بييجي في الـ Response بس
    // ═══════════════════════════════════════════════════════

    /// <summary>بيانات الدواء في الـ Response</summary>
    public class CompanyMedicineDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }

        public string MedicineName { get; set; } = null!;
        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? ImagePath { get; set; }

        public decimal UnitPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinimumOrderQuantity { get; set; }

        public bool IsAvailable { get; set; }
        public string Status { get; set; } = null!; // متوفر / مخزون منخفض / غير متوفر

        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ═══════════════════════════════════════════════════════
    // Input DTO — إضافة دواء جديد (بدون CompanyId — هيتحدد من التوكن)
    // ═══════════════════════════════════════════════════════

    /// <summary>بيانات إضافة دواء جديد</summary>
    public class CreateMedicineDto
    {
        [Required(ErrorMessage = "اسم الدواء مطلوب")]
        [MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        [MaxLength(100)]
        public string? Category { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "السعر مطلوب")]
        [Range(0.01, double.MaxValue, ErrorMessage = "السعر يجب أن يكون أكبر من صفر")]
        public decimal UnitPrice { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "الكمية لا يمكن أن تكون سالبة")]
        public int StockQuantity { get; set; } = 0;

        [Range(1, int.MaxValue, ErrorMessage = "الحد الأدنى للطلب يجب أن يكون 1 على الأقل")]
        public int MinimumOrderQuantity { get; set; } = 1;

        public bool IsAvailable { get; set; } = true;

        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    // ═══════════════════════════════════════════════════════
    // Input DTO — تعديل دواء موجود (كل الحقول اختيارية)
    // ═══════════════════════════════════════════════════════

    /// <summary>بيانات تعديل دواء (كل الحقول اختيارية)</summary>
    public class UpdateMedicineDto
    {
        [MaxLength(200)]
        public string? MedicineName { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        public string? Description { get; set; }

        public string? ImagePath { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "السعر يجب أن يكون أكبر من صفر")]
        public decimal? UnitPrice { get; set; }

        [Range(0, int.MaxValue)]
        public int? StockQuantity { get; set; }

        [Range(1, int.MaxValue)]
        public int? MinimumOrderQuantity { get; set; }

        public bool? IsAvailable { get; set; }

        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
