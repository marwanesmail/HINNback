using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        // المستخدم المستلم للإشعار
        [Required]
        public string UserId { get; set; } = null!;
        public virtual AppUser User { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = null!;

        // نوع الإشعار: Appointment, Prescription, MedicineRequest, Message, General
        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = null!;

        // معرف العنصر المرتبط (مثل AppointmentId) - اختياري لفتح التفاصيل
        public string? RelatedEntityId { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
