using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Company
    {
        public int Id { get; set; }

        // ربط الشركة بالمستخدم الأساسي (AppUser)
        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;

        [Required]
        public string CompanyName { get; set; } = null!;

        [Required]
        public string LicenseNumber { get; set; } = null!;

        public string? LicenseDocumentPath { get; set; } // صورة أو PDF للترخيص
        public bool IsApproved { get; set; } = false; // الأدمن يوافق عليها

        //  للشهرة والترتيب
        public int ViewCount { get; set; } = 0;
        public double Rating { get; set; } = 0;
        public int RatingCount { get; set; } = 0;
    }
}
