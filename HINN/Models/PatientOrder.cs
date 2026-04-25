using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

namespace MyHealthcareApi.Models
{
    /// <summary>
    /// طلب شراء أدوية من مريض لصيدلية
    /// </summary>
    public class PatientOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string PatientId { get; set; } = null!;
        public virtual AppUser Patient { get; set; } = null!;

        [Required]
        public int PharmacyId { get; set; }
        public virtual Pharmacy Pharmacy { get; set; } = null!;

        public virtual ICollection<PatientOrderItem> Items { get; set; } = new List<PatientOrderItem>();

        /// <summary>
        /// السعر الإجمالي للطلب
        /// </summary>
        public decimal TotalAmount => Items.Sum(i => i.TotalPrice);

        public PatientOrderStatus Status { get; set; } = PatientOrderStatus.Pending;

        /// <summary>
        /// طريقة الدفع: Cash, Online, Points
        /// </summary>
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "Cash";

        /// <summary>
        /// طريقة الاستلام: Delivery, Pickup
        /// </summary>
        [MaxLength(50)]
        public string DeliveryMethod { get; set; } = "Pickup";

        public string? DeliveryAddress { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public enum PatientOrderStatus
    {
        Pending,        // قيد الانتظار
        Confirmed,      // تم التأكيد
        Processing,     // جاري التجهيز
        OutForDelivery, // في الطريق
        Delivered,      // تم التسليم
        Cancelled,      // ملغي
        Rejected        // مرفوض
    }
}
