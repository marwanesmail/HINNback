using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MyHealthcareApi.DTOs
{
    public class PharmacyRegisterDto
    {
        
        // بيانات الأساسية
        
        
        public string PharmacyName { get; set; } = null!;
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        [Compare("Password", ErrorMessage = "كلمات المرور غير متطابقة")]
        public string ConfirmPassword { get; set; } = null!;

        public string Address { get; set; } = null!;

        
        // بيانات الاتصال
        
        
        public string? PhoneNumber { get; set; }
        public string? Phone2 { get; set; }

        
        // معلومات إضافية
        
        
        public string? WorkingHours { get; set; }
        public string? DeliveryArea { get; set; }

        
        // المستندات المطلوبة
        
        
        public IFormFile? LicenseImage { get; set; }              // رخصة الصيدلية
        public IFormFile? TaxDocument { get; set; }               // البطاقة الضريبية
        public IFormFile? CommercialRecordImage { get; set; }     // السجل التجاري
    }
}
