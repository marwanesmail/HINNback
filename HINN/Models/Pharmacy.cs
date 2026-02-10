using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    public class Pharmacy
    {
        [Key]
        public int Id { get; set; }

        //  اسم الصيدلية
        [Required]
        [MaxLength(150)]
        public string PharmacyName { get; set; } = null!;

        //  العنوان التفصيلي
        [Required]
        [MaxLength(250)]
        public string Address { get; set; } = null!;

        //  الإحداثيات (لتحديد موقع الصيدلية على الخريطة)
        public double Latitude { get; set; }   // خط العرض
        public double Longitude { get; set; }  // خط الطول

        //  صورة رخصة مزاولة المهنة
        public string? LicenseImagePath { get; set; }

        //  صورة الورق الضريبي
        public string? TaxDocumentPath { get; set; }

        //  حالة الموافقة من الأدمن
        public bool IsApproved { get; set; } = false;

        //  علاقة الصيدلية مع المستخدم (AppUser)
        [Required]
        public string AppUserId { get; set; } = null!;
        public virtual AppUser AppUser { get; set; } = null!;

        //  للشهرة والترتيب
        public int ViewCount { get; set; } = 0;
        public double Rating { get; set; } = 0;
        public int RatingCount { get; set; } = 0;

        //  الردود اللي أرسلتها الصيدلية للمرضى
        public virtual ICollection<PharmacyResponse>? Responses { get; set; }
    }
}

