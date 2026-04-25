using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// صنف داخل طلب المريض (يربط مع مخزون الصيدلية)
    /// </summary>
    public class PatientOrderItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientOrderId { get; set; }
        public virtual PatientOrder PatientOrder { get; set; } = null!;

        /// <summary>
        /// الربط مع مخزون الصيدلية
        /// </summary>
        [Required]
        public int PharmacyInventoryId { get; set; }
        public virtual PharmacyInventory PharmacyInventory { get; set; } = null!;

        [Required]
        public int Quantity { get; set; }

        /// <summary>
        /// سعر الوحدة وقت الطلب
        /// </summary>
        public decimal UnitPrice { get; set; }

        /// <summary>
        /// السعر الإجمالي للصنف
        /// </summary>
        public decimal TotalPrice => Quantity * UnitPrice;

        [MaxLength(200)]
        public string? MedicineName { get; set; }
    }
}
