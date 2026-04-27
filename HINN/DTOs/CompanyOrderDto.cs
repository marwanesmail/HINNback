namespace MyHealthcareApi.DTOs
{
    public class CompanyOrderDto
    {
        public int Id { get; set; }
        public string PharmacyName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!; // هنحول الـ Enum لنص عشان الفرونت إند
        public string Priority { get; set; } = null!;
        public string? Notes { get; set; }

        public List<CompanyOrderItemDto> Medicines { get; set; } = new List<CompanyOrderItemDto>();
    }
}
// ده الطلب اللي الصيدلية باعتاه للشركة