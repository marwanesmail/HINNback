namespace MyHealthcareApi.DTOs
{
    public class PharmacyResponseDto
    {
        public int PharmacyId { get; set; }
        public string PharmacyName { get; set; } = string.Empty;
        public string PatientId { get; set; } = string.Empty;
        public string MedicineName { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public string? Note { get; set; }
        public DateTime ResponseTime { get; set; } = DateTime.UtcNow;
    }
}
