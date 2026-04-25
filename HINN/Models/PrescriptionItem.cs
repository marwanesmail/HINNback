using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// صنف دواء منفرد داخل الروشتة
    /// </summary>
    public class PrescriptionItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PrescriptionId { get; set; }
        public virtual Prescription Prescription { get; set; } = null!;

        /// <summary>
        /// اسم الدواء
        /// </summary>
        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        /// <summary>
        /// الجرعة (مثلاً: 500 ملجم)
        /// </summary>
        [MaxLength(100)]
        public string? Dosage { get; set; }

        /// <summary>
        /// الكمية (مثلاً: علبتين)
        /// </summary>
        [MaxLength(100)]
        public string? Quantity { get; set; }

        /// <summary>
        /// التكرار (مثلاً: 3 مرات يومياً)
        /// </summary>
        [MaxLength(100)]
        public string? Frequency { get; set; }

        /// <summary>
        /// تعليمات الاستخدام (مثلاً: بعد الأكل)
        /// </summary>
        public string? Instructions { get; set; }

        /// <summary>
        /// الربط مع كتالوج الأدوية (اختياري)
        /// </summary>
        public int? CompanyMedicineId { get; set; }
        public virtual CompanyMedicine? CompanyMedicine { get; set; }
    }
}
