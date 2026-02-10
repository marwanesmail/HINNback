using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    // DTO لرفع روشتة جديدة
    public class PrescriptionRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!; // اسم الدواء أو عنوان الروشتة

        public string? Notes { get; set; }

        public IFormFile? PrescriptionImage { get; set; } // صورة الروشتة

        [Required]
        public double Latitude { get; set; } // موقع المريض

        [Required]
        public double Longitude { get; set; }

        public double SearchRadiusKm { get; set; } = 5; // نطاق البحث بالكيلو
    }

    // DTO للبحث عن دواء بالاسم
    public class MedicineSearchDto
    {
        [Required]
        public string MedicineName { get; set; } = null!;

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public double SearchRadiusKm { get; set; } = 5;
    }
}
