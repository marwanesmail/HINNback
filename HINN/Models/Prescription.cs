using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Prescription
    {
        [Key]
        public int Id { get; set; }

        // المريض اللي رفع الروشتة
        [Required]
        public string PatientId { get; set; } = null!;
        public virtual AppUser Patient { get; set; } = null!;

        // عنوان الروشتة أو اسم الدواء الرئيسي
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = null!;

        // ملاحظات إضافية
        public string? Notes { get; set; }

        // صورة الروشتة
        public string? PrescriptionImagePath { get; set; }

        // موقع المريض وقت البحث
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // نطاق البحث بالكيلومتر
        public double SearchRadiusKm { get; set; } = 5;

        // حالة الطلب
        public PrescriptionStatus Status { get; set; } = PrescriptionStatus.Pending;

        // وقت الإنشاء
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // الردود اللي جات من الصيدليات
        public virtual ICollection<PharmacyResponse>? Responses { get; set; }
    }

    public enum PrescriptionStatus
    {
        Pending,      // لسه منتظر ردود
        Responded,    // فيه صيدلية ردت
        Completed,    // المريض اختار صيدلية
        Cancelled     // اتلغي
    }
}
