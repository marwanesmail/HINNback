namespace MyHealthcareApi.DTOs
{
    public class CompanyCustomerDto
    {
        public int Id { get; set; }
        public string PharmacyName { get; set; } = null!;
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public int TotalOrdersCount { get; set; } // عشان الشركة تعرف الصيدلية دي طلبت كام مرة
    }
}

// الملف بتاع عملاء الشركة اللي هيا الصيدليات يعني وكدا اللي بتشتري منتجات الشركة