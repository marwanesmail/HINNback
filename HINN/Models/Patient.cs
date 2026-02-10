namespace MyHealthcareApi.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;
        public string? MedicalRecordNumber { get; set; }
    }
}
