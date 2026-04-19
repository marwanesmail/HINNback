using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Doctor
    {
        public int Id { get; set; }

        // علاقة الدكتور مع المستخدم الأساسي (AppUser)
        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // بيانات المؤهل والخبرة
        // ═══════════════════════════════════════════════════════
        public string? Specialty { get; set; }
        public string? LicenseImageUrl { get; set; }
        public string? Bio { get; set; }
        public int ExperienceYears { get; set; } = 0;
        public string? ProfileImagePath { get; set; }

        // ═══════════════════════════════════════════════════════
        // بيانات العيادة
        // ═══════════════════════════════════════════════════════
        public string? ClinicName { get; set; }
        public string? ClinicAddress { get; set; }
        public string? ClinicPhone { get; set; }
        public double Latitude { get; set; } = 0;
        public double Longitude { get; set; } = 0;

        // ═══════════════════════════════════════════════════════
        // إعدادات الكشف
        // ═══════════════════════════════════════════════════════
        public decimal ConsultationFee { get; set; } = 0;
        public string? ConsultationType { get; set; } = "both"; // in-person | online | both
        public int SessionDurationMinutes { get; set; } = 30;

        // ═══════════════════════════════════════════════════════
        // للشهرة والترتيب
        // ═══════════════════════════════════════════════════════
        public bool IsApproved { get; set; } = false;
        public int ViewCount { get; set; } = 0;
        public double Rating { get; set; } = 0;
        public int RatingCount { get; set; } = 0;
    }
}
