using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    public class RegisterDto
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        [Compare("Password", ErrorMessage = "كلمات المرور غير متطابقة")]
        public string ConfirmPassword { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Role { get; set; } = "Patient"; // Patient/Doctor/Pharmacy/Company
    }
}
