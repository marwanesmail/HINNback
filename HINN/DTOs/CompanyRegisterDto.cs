using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    public class CompanyRegisterDto
    {
        [Required]
        public string CompanyName { get; set; } = null!;

        [Required]
        public string LicenseNumber { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        public IFormFile? LicenseDocument { get; set; } // ملف الترخيص
    }
}
