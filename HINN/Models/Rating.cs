using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Rating
    {
        [Key]
        public int Id { get; set; }

        // المستخدم اللي عمل التقييم
        [Required]
        public string UserId { get; set; } = null!;
        public virtual AppUser User { get; set; } = null!;

        // نوع الكيان اللي بيتقيّم (Doctor, Pharmacy, Company)
        [Required]
        [MaxLength(50)]
        public string EntityType { get; set; } = null!; // "Doctor", "Pharmacy", "Company"

        // معرّف الكيان
        [Required]
        public int EntityId { get; set; }

        // التقييم من 1 إلى 5
        [Required]
        [Range(1, 5)]
        public int Stars { get; set; }

        // تعليق اختياري
        [MaxLength(500)]
        public string? Comment { get; set; }

        // وقت التقييم
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // آخر تعديل
        public DateTime? UpdatedAt { get; set; }
    }
}
