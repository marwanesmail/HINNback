namespace MyHealthcareApi.DTOs
{
    public class CompanyOrderDto
    {
        public int Id { get; set; }
        public string PharmacyName { get; set; } = null!;
        public string? PharmacyPhone { get; set; }    // ← تليفون الصيدلية
        public string? PharmacyAddress { get; set; }  // ← عنوان الصيدلية
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public string? Notes { get; set; }

        public List<CompanyOrderItemDto> Medicines { get; set; } = new List<CompanyOrderItemDto>();
    }
}
