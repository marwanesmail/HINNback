using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    // ═══════════════════════════════════════════════════════
    // Profile
    // ═══════════════════════════════════════════════════════

    public class CompanyProfileDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = null!;
        public string LicenseNumber { get; set; } = null!;
        public string? LicenseDocumentPath { get; set; }
        public bool IsApproved { get; set; }
        public double Rating { get; set; }
        public int RatingCount { get; set; }
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
    }

    // ═══════════════════════════════════════════════════════
    // Dashboard Stats
    // ═══════════════════════════════════════════════════════

    public class CompanyDashboardStatsDto
    {
        public int TotalProducts { get; set; }
        public int AvailableProducts { get; set; }
        public int LowStockProducts { get; set; }
        public int OutOfStockProducts { get; set; }
        public int TotalOrders { get; set; }
        public int NewOrders { get; set; }
        public int ProcessingOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int ActivePharmacies { get; set; }
        public decimal TodaySales { get; set; }
        public decimal MonthlySales { get; set; }
    }

    // ═══════════════════════════════════════════════════════
    // Medicine (Product) DTOs
    // ═══════════════════════════════════════════════════════

    public class CompanyMedicineDto
    {
        public int Id { get; set; }
        public string MedicineName { get; set; } = null!;
        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public decimal UnitPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinimumOrderQuantity { get; set; }
        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool IsAvailable { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateMedicineDto
    {
        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        [MaxLength(100)]
        public string? Category { get; set; }

        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "السعر يجب أن يكون أكبر من صفر")]
        public decimal UnitPrice { get; set; }

        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; } = 0;

        [Range(1, int.MaxValue)]
        public int MinimumOrderQuantity { get; set; } = 1;

        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public bool IsAvailable { get; set; } = true;
    }

    public class UpdateMedicineDto
    {
        [MaxLength(200)]
        public string? MedicineName { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        public string? Description { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? UnitPrice { get; set; }

        [Range(0, int.MaxValue)]
        public int? StockQuantity { get; set; }

        [Range(1, int.MaxValue)]
        public int? MinimumOrderQuantity { get; set; }

        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public bool? IsAvailable { get; set; }
    }

    // ═══════════════════════════════════════════════════════
    // Orders DTOs
    // ═══════════════════════════════════════════════════════

    public class CompanyOrderItemDto
    {
        public int Id { get; set; }
        public string MedicineName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Note { get; set; }
    }

    public class CompanyOrderDto
    {
        public int Id { get; set; }
        public string PharmacyName { get; set; } = null!;
        public string? PharmacyPhone { get; set; }
        public string? PharmacyAddress { get; set; }
        public string Status { get; set; } = null!;
        public string StatusArabic { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }
        public string? CompanyResponse { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<CompanyOrderItemDto> Items { get; set; } = new();
    }

    public class UpdateOrderStatusDto
    {
        [Required]
        public string Status { get; set; } = null!; // Confirmed, Shipped, Delivered, Rejected

        public string? CompanyResponse { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
    }

    // ═══════════════════════════════════════════════════════
    // Pharmacies DTOs
    // ═══════════════════════════════════════════════════════

    public class CompanyPharmacyDto
    {
        public int Id { get; set; }
        public string PharmacyName { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalPurchased { get; set; }
        public DateTime LastOrderDate { get; set; }
    }
}
