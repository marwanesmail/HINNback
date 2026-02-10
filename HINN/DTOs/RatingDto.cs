using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    // DTO لإضافة تقييم جديد
    public class AddRatingDto
    {
        [Required]
        public string EntityType { get; set; } = null!; // "Doctor", "Pharmacy", "Company"

        [Required]
        public int EntityId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "التقييم يجب أن يكون من 1 إلى 5 نجوم")]
        public int Stars { get; set; }

        [MaxLength(500, ErrorMessage = "التعليق لا يمكن أن يزيد عن 500 حرف")]
        public string? Comment { get; set; }
    }

    // DTO لتعديل تقييم موجود
    public class UpdateRatingDto
    {
        [Required]
        [Range(1, 5)]
        public int Stars { get; set; }

        [MaxLength(500)]
        public string? Comment { get; set; }
    }

    // DTO لعرض التقييم
    public class RatingResponseDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string? UserName { get; set; }
        public string EntityType { get; set; } = null!;
        public int EntityId { get; set; }
        public int Stars { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // DTO لإحصائيات التقييم
    public class RatingStatsDto
    {
        public double AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public int FiveStars { get; set; }
        public int FourStars { get; set; }
        public int ThreeStars { get; set; }
        public int TwoStars { get; set; }
        public int OneStar { get; set; }
    }
}
