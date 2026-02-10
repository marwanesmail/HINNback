using Microsoft.AspNetCore.Http;

namespace MyHealthcareApi.DTOs
{
    public class PharmacyRegisterDto
    {
        public string PharmacyName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Address { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public IFormFile? LicenseImage { get; set; }
        public IFormFile? TaxDocument { get; set; }
    }
}
