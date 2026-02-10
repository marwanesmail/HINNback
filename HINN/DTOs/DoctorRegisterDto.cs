using Microsoft.AspNetCore.Http;

namespace MyHealthcareApi.DTOs
{
    public class DoctorRegisterDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Specialty { get; set; } = null!;
        public IFormFile? LicenseImage { get; set; }
    }
}
