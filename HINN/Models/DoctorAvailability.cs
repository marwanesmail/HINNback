using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// مواعيد الدكتور المتاحة للحجز
    /// </summary>
    public class DoctorAvailability
    {
        [Key]
        public int Id { get; set; }

        // الدكتور
        [Required]
        public string DoctorId { get; set; } = null!;
        public virtual AppUser Doctor { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // معلومات الموعد
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// تاريخ الموعد
        /// </summary>
        [Required]
        public DateTime Date { get; set; }

        /// <summary>
        /// وقت البداية
        /// </summary>
        [Required]
        public TimeSpan StartTime { get; set; }

        /// <summary>
        /// وقت النهاية
        /// </summary>
        [Required]
        public TimeSpan EndTime { get; set; }

        /// <summary>
        /// مدة الكشف بالدقائق (15, 20, 30, 45, 60)
        /// </summary>
        [Required]
        public int DurationMinutes { get; set; } = 30;

        // ═══════════════════════════════════════════════════════
        // حالة الموعد
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// هل الموعد لسه متاح؟
        /// </summary>
        public bool IsAvailable { get; set; } = true;

        /// <summary>
        /// المريض اللي حجز (لو اتحجز)
        /// </summary>
        public string? BookedByPatientId { get; set; }
        public virtual AppUser? BookedByPatient { get; set; }

        /// <summary>
        /// وقت الحجز
        /// </summary>
        public DateTime? BookedAt { get; set; }

        /// <summary>
        /// سعر الكشف
        /// </summary>
        public decimal ConsultationFee { get; set; }

        /// <summary>
        /// نوع الموعد: كشف، متابعة، استشارة
        /// </summary>
        [MaxLength(50)]
        public string AppointmentType { get; set; } = "كشف";

        /// <summary>
        /// ملاحظات الدكتور عن الموعد
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// مكان الكشف (العيادة، المستشفى، أونلاين)
        /// </summary>
        [MaxLength(200)]
        public string? Location { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
