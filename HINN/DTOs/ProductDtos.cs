using System;

namespace MyHealthcareApi.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        
        // التسعير
        public decimal OriginalPrice { get; set; }
        public int DiscountPercentage { get; set; }
        public decimal CurrentPrice => OriginalPrice * (1 - (DiscountPercentage / 100m));
        
        // التقييمات
        public decimal Rating { get; set; }
        public int ReviewsCount { get; set; }
        
        // الحالة
        public bool IsAvailable { get; set; }
        public string AvailabilityStatus { get; set; } = null!;
        public bool IsNew { get; set; }
        public bool IsFeatured { get; set; }
    }

    public class ProductFilterDto
    {
        public string? SearchTerm { get; set; }
        public string? Category { get; set; }
        public string? SortBy { get; set; } // price_asc, price_desc, name, newest
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
