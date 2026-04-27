using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    public class CompanyMedicineDto
    {
        public int Id { get; set; }

        [Required]
        public int CompanyId { get; set; }

        [Required]
        [MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        [MaxLength(100)]
        public string? Category { get; set; }

        public string? Description { get; set; }

        public string? ImagePath { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        public bool IsAvailable { get; set; }

        public DateTime? ProductionDate { get; set; }

        public DateTime? ExpiryDate { get; set; }
    }
}