using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    // DTO للصيدلية لما ترد على روشتة
    public class PharmacyResponseRequestDto
    {
        [Required]
        public int PrescriptionId { get; set; }

        [Required]
        public bool IsAvailable { get; set; } // هل الدواء متاح؟

        public decimal? Price { get; set; } // السعر (اختياري)

        public string? Note { get; set; } // ملاحظات (اختياري)
    }
}
