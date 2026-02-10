using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    public class PharmacyResponse
    {
        [Key]
        public int Id { get; set; }

        //  ربط الصيدلية بالرد
        [Required]
        public int PharmacyId { get; set; }
        public virtual Pharmacy Pharmacy { get; set; } = null!;

        //  ربط المريض اللي طلب الدواء
        [Required]
        public string PatientId { get; set; } = null!;

        //  ربط بالروشتة (لو البحث كان عن طريق روشتة)
        public int? PrescriptionId { get; set; }
        public virtual Prescription? Prescription { get; set; }

        //  اسم الدواء المطلوب (لو البحث كان بالاسم مباشرة)
        [MaxLength(200)]
        public string? MedicineName { get; set; }

        //  هل الدواء متاح؟
        public bool IsAvailable { get; set; }

        //  السعر (اختياري)
        public decimal? Price { get; set; }

        //  ملاحظات اختيارية من الصيدلية
        public string? Note { get; set; }

        //  هل المريض شاف الرد؟
        public bool IsSeenByPatient { get; set; } = false;

        //  وقت الرد
        public DateTime RespondedAt { get; set; } = DateTime.UtcNow;
    }
}
