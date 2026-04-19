using Microsoft.AspNetCore.Identity;

namespace MyHealthcareApi.Models
{
    // ═══════════════════════════════════════════════════════════
    // كلاس اليوزرلا  - المستخدم الأساسي
    // ═══════════════════════════════════════════════════════════
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsApproved { get; set; } = false;
        public string? ProfileImageUrl { get; set; }
        public Enums.UserType UserType { get; set; }

        // ═══════════════════════════════════════════════════════════
        // حقول الشهرة (للترتيب في البحث)
        // ═══════════════════════════════════════════════════════════
        public int ViewCount { get; set; } = 0;
        public double Rating { get; set; } = 0;
        public int RatingCount { get; set; } = 0;

        // ═══════════════════════════════════════════════════════════
        // نظام النقاط والولاء
        // ═══════════════════════════════════════════════════════════
        
        /// <summary>
        /// نقاط الولاء (كل 100 جنيه = 1 نقطة)
        /// </summary>
        public int LoyaltyPoints { get; set; } = 0;

        /// <summary>
        /// إجمالي المشتريات (لحساب النقاط)
        /// </summary>
        public decimal TotalPurchases { get; set; } = 0;

        /// <summary>
        /// نسبة الخصم الحالية (بناءً على النقاط)
        /// </summary>
        public decimal DiscountPercentage { get; set; } = 0;
    }
}
