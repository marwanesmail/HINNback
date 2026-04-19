using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MyHealthcareApi.DTOs
{
    public class DoctorRegisterDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        [Compare("Password", ErrorMessage = "كلمات المرور غير متطابقة")]
        public string ConfirmPassword { get; set; } = null!;
        public string Specialty { get; set; } = null!;
        public IFormFile? LicenseImage { get; set; }
    }
}
