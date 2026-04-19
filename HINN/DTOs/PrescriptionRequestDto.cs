using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    // DTO لرفع روشتة جديدة
    public class PrescriptionRequestDto
    {
        [MaxLength(200)]
        public string? Title { get; set; } // اسم الدواء أو عنوان الروشتة

        public string? Notes { get; set; }

        public IFormFile? PrescriptionImage { get; set; } // صورة الروشتة

        [Required]
        public double Latitude { get; set; } // موقع المريض

        [Required]
        public double Longitude { get; set; }

        public double SearchRadiusKm { get; set; } = 5; // نطاق البحث بالكيلو

        public string? DeliveryAddress { get; set; } // العنوان النصي
        public string? PatientName { get; set; } // اسم المريض (للتوصيل)
        public string? PhoneNumber { get; set; } // رقم الهاتف (للتوصيل)
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

        public string? DeliveryAddress { get; set; } // العنوان النصي
    }
}
