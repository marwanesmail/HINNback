using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// عنصر منفرد داخل طلب الأدوية
    /// </summary>
    public class PharmacyOrderItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PharmacyOrderId { get; set; }
        public virtual PharmacyOrder PharmacyOrder { get; set; } = null!;

        /// <summary>
        /// الربط مع كتالوج الشركة
        /// </summary>
        [Required]
        public int CompanyMedicineId { get; set; }
        public virtual CompanyMedicine CompanyMedicine { get; set; } = null!;

        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        [Required]
        public int Quantity { get; set; }

        /// <summary>
        /// السعر المتفق عليه للوحدة عند الطلب
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// السعر الإجمالي لهذا العنصر
        /// </summary>
        public decimal TotalPrice => Quantity * UnitPrice;

        [MaxLength(500)]
        public string? Note { get; set; }
    }
}
