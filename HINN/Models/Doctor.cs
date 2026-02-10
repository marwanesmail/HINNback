using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Doctor
    {
        public int Id { get; set; }

        // علاقة الدكتور مع المستخدم الأساسي (AppUser)
        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;

        public string? Specialty { get; set; }

        // صورة الكرنيه أو الترخيص
        public string? LicenseImageUrl { get; set; }

        //  خاصية موافقة الأدمن
        public bool IsApproved { get; set; } = false;

        //  للشهرة والترتيب
        public int ViewCount { get; set; } = 0; // عدد مرات المشاهدة
        public double Rating { get; set; } = 0; // التقييم (0-5)
        public int RatingCount { get; set; } = 0; // عدد التقييمات
    }
}
