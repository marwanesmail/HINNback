using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // متاح للجميع (مرضى وزوار)
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// جلب قائمة المنتجات المعروضة في الصفحة الرئيسية
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductFilterDto filter)
        {
            // نأخذ الأدوية المتاحة في كتالوج الشركات
            // ملاحظة: يمكننا لاحقاً تصفية المنتجات التي توجد في مخزون الصيدليات القريبة فقط
            var query = _context.CompanyMedicines
                .Where(cm => cm.IsAvailable)
                .AsQueryable();

            // الفلترة حسب البحث
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(cm => cm.MedicineName.Contains(filter.SearchTerm) || 
                                         (cm.Description != null && cm.Description.Contains(filter.SearchTerm)));
            }

            // الفلترة حسب الفئة
            if (!string.IsNullOrEmpty(filter.Category) && filter.Category != "جميع المنتجات")
            {
                query = query.Where(cm => cm.Category == filter.Category);
            }

            // الترتيب
            query = filter.SortBy switch
            {
                "price_asc" => query.OrderBy(cm => cm.UnitPrice),
                "price_desc" => query.OrderByDescending(cm => cm.UnitPrice),
                "newest" => query.OrderByDescending(cm => cm.CreatedAt),
                "name" => query.OrderBy(cm => cm.MedicineName),
                _ => query.OrderByDescending(cm => cm.IsFeatured).ThenByDescending(cm => cm.CreatedAt)
            };

            // التقسيم لصفحات (Pagination)
            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(cm => new ProductDto
                {
                    Id = cm.Id,
                    Name = cm.MedicineName,
                    Category = cm.Category,
                    Description = cm.Description,
                    ImagePath = cm.ImagePath,
                    OriginalPrice = cm.UnitPrice,
                    DiscountPercentage = cm.DiscountPercentage,
                    Rating = cm.Rating,
                    ReviewsCount = cm.ReviewsCount,
                    IsAvailable = cm.StockQuantity > 0,
                    AvailabilityStatus = cm.Status,
                    IsNew = (DateTime.UtcNow - cm.CreatedAt).TotalDays <= 30,
                    IsFeatured = cm.IsFeatured
                })
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                Page = filter.Page,
                PageSize = filter.PageSize,
                Items = items
            });
        }

        /// <summary>
        /// جلب الفئات المتوفرة
        /// </summary>
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.CompanyMedicines
                .Where(cm => !string.IsNullOrEmpty(cm.Category))
                .Select(cm => cm.Category)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }

        /// <summary>
        /// جلب تفاصيل منتج معين
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var cm = await _context.CompanyMedicines.FindAsync(id);
            if (cm == null) return NotFound("المنتج غير موجود");

            var dto = new ProductDto
            {
                Id = cm.Id,
                Name = cm.MedicineName,
                Category = cm.Category,
                Description = cm.Description,
                ImagePath = cm.ImagePath,
                OriginalPrice = cm.UnitPrice,
                DiscountPercentage = cm.DiscountPercentage,
                Rating = cm.Rating,
                ReviewsCount = cm.ReviewsCount,
                IsAvailable = cm.StockQuantity > 0,
                AvailabilityStatus = cm.Status,
                IsNew = (DateTime.UtcNow - cm.CreatedAt).TotalDays <= 30,
                IsFeatured = cm.IsFeatured
            };

            return Ok(dto);
        }
    }
}
