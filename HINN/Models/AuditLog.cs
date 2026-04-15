using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// نموذج سجل التدقيق - لتتبع جميع العمليات في النظام
    /// </summary>
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// معرف المستخدم الذي قام بالعملية
        /// </summary>
        [Required]
        public string UserId { get; set; } = null!;

        /// <summary>
        /// اسم المستخدم (للعرض السريع)
        /// </summary>
        [MaxLength(100)]
        public string? UserName { get; set; }

        /// <summary>
        /// نوع الإجراء (Create, Update, Delete, Login, etc.)
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string ActionType { get; set; } = null!;

        /// <summary>
        /// الكيان المتأثر (User, Pharmacy, Prescription, etc.)
        /// </summary>
        [MaxLength(100)]
        public string? EntityType { get; set; }

        /// <summary>
        /// معرف الكيان المتأثر (يدعم Guid لجميع الكيانات)
        /// </summary>
        public Guid? EntityId { get; set; }

        /// <summary>
        /// وصف تفصيلي للعملية
        /// </summary>
        [MaxLength(2000)]
        public string? Description { get; set; }

        /// <summary>
        /// البيانات القديمة (قبل التعديل) - JSON
        /// </summary>
        [Column(TypeName = "nvarchar(max)")]
        public string? OldData { get; set; }

        /// <summary>
        /// البيانات الجديدة (بعد التعديل) - JSON
        /// </summary>
        [Column(TypeName = "nvarchar(max)")]
        public string? NewData { get; set; }

        /// <summary>
        /// عنوان IP للمستخدم
        /// </summary>
        [MaxLength(50)]
        public string? IpAddress { get; set; }

        /// <summary>
        /// معلومات المتصفح/الجهاز
        /// </summary>
        [MaxLength(200)]
        public string? UserAgent { get; set; }

        /// <summary>
        /// هل نجحت العملية؟
        /// </summary>
        public bool Success { get; set; } = true;

        /// <summary>
        /// رسالة الخطأ (لو فشلت)
        /// </summary>
        [MaxLength(1000)]
        public string? ErrorMessage { get; set; }

        /// <summary>
        /// وقت التنفيذ بالمللي ثانية
        /// </summary>
        public long? ExecutionTimeMs { get; set; }

        /// <summary>
        /// وقت حدوث العملية
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual AppUser? User { get; set; }
    }

    /// <summary>
    /// أنواع الإجراءات الشائعة
    /// </summary>
    public static class AuditActionTypes
    {
        public const string Create = "Create";
        public const string Update = "Update";
        public const string Delete = "Delete";
        public const string Login = "Login";
        public const string Logout = "Logout";
        public const string Register = "Register";
        public const string Approve = "Approve";
        public const string Reject = "Reject";
        public const string Upload = "Upload";
        public const string Download = "Download";
        public const string Search = "Search";
        public const string SendMessage = "SendMessage";
        public const string Rate = "Rate";
        public const string SelectPharmacy = "SelectPharmacy";
        public const string RespondToPrescription = "RespondToPrescription";
    }
}
