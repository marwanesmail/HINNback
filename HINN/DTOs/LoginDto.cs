namespace MyHealthcareApi.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class CreateAdminDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? FullName { get; set; }
        /// المفتاح السري للحماية (HINN_ADMIN_2026)
        public string SecretKey { get; set; } = null!;
    }
}
