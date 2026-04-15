using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }

        // ═══════════════════════════════════════════════════════
        // بيانات المريض
        // ═══════════════════════════════════════════════════════
        
        [Required]
        public string PatientId { get; set; } = null!;
        public virtual AppUser Patient { get; set; } = null!;

        // ═══════════════════════════════════════════════════════
        // بيانات الطبيب (اختياري - ممكن يكون مش محدد بعد)
        // ═══════════════════════════════════════════════════════
        
        public string? DoctorId { get; set; }
        public virtual AppUser? Doctor { get; set; }

        // ═══════════════════════════════════════════════════════
        // معلومات الموعد
        // ═══════════════════════════════════════════════════════
        
        /// <summary>
        /// تاريخ الموعد
        /// </summary>
        [Required]
        public DateTime AppointmentDate { get; set; }

        /// <summary>
        /// وقت الموعد
        /// </summary>
        [Required]
        public TimeSpan AppointmentTime { get; set; }

        /// <summary>
        /// نوع الموعد: كشف، متابعة، طوارئ، استشارة
        /// </summary>
        [Required, MaxLength(50)]
        public string AppointmentType { get; set; } = null!; // Checkup, FollowUp, Emergency, Consultation

        /// <summary>
        /// التخصص المطلوب
        /// </summary>
        [MaxLength(100)]
        public string? Specialty { get; set; }

        // ═══════════════════════════════════════════════════════
        // حالة الموعد
        // ═══════════════════════════════════════════════════════
        
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Upcoming;

        /// <summary>
        /// ملاحظات المريض عند الحجز
        /// </summary>
        public string? PatientNotes { get; set; }

        /// <summary>
        /// ملاحظات الطبيب بعد الكشف
        /// </summary>
        public string? DoctorNotes { get; set; }

        /// <summary>
        /// التشخيص (بعد الكشف)
        /// </summary>
        [MaxLength(500)]
        public string? Diagnosis { get; set; }

        /// <summary>
        /// وصفة طبية (بعد الكشف)
        /// </summary>
        public string? Prescription { get; set; }

        // ═══════════════════════════════════════════════════════
        // تواريخ
        // ═══════════════════════════════════════════════════════
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
        public DateTime? CancelledAt { get; set; }

        /// <summary>
        /// سبب الإلغاء
        /// </summary>
        public string? CancellationReason { get; set; }
    }

    /// <summary>
    /// حالات الموعد
    /// </summary>
    public enum AppointmentStatus
    {
        Upcoming,      // موعد قادم
        Completed,     // تم الكشف
        Cancelled,     // ملغي
        NoShow         // المريض حضرش
    }

    /// <summary>
    /// أنواع المواعيد
    /// </summary>
    public static class AppointmentTypes
    {
        public const string Checkup = "كشف";
        public const string FollowUp = "متابعة";
        public const string Emergency = "طوارئ";
        public const string Consultation = "استشارة";
        public const string LabWork = "تحاليل";
        public const string Radiology = "أشعة";
    }
}
