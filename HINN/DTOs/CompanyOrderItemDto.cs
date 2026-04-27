namespace MyHealthcareApi.DTOs
{
    public class CompanyOrderItemDto
    {
        public int MedicineId { get; set; }
        public string MedicineName { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice => Quantity * UnitPrice; 
    }
}
// ده ملف تفاصيل وحدة الدواء بتاع الطلب اللي الصيدلية باعتاه للشركة