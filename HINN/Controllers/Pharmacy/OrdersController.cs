using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/pharmacy/[controller]")]
    [Authorize(Roles = "Pharmacy")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// بحث عن أدوية من الشركات
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchMedicines([FromQuery] string? searchTerm = null, [FromQuery] string? category = null)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            // البحث في المخزون الحالي
            var query = _context.PharmacyInventories
                .Where(i => i.PharmacyId == pharmacy.Id)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(i => i.MedicineName.Contains(searchTerm));
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(i => i.Manufacturer != null && i.Manufacturer.Contains(category));
            }

            var inventory = await query
                .Select(i => new
                {
                    i.Id,
                    i.MedicineName,
                    i.Manufacturer,
                    i.Quantity,
                    i.Price,
                    i.MinimumQuantity,
                    IsLowStock = i.Quantity <= i.MinimumQuantity
                })
                .ToListAsync();

            return Ok(new
            {
                TotalItems = inventory.Count,
                LowStockCount = inventory.Count(i => i.IsLowStock),
                Items = inventory
            });
        }

        /// <summary>
        /// عرض طلباتي من الشركات
        /// </summary>
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders([FromQuery] string? status = null)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var query = _context.PharmacyOrders
                .Where(po => po.PharmacyId == pharmacy.Id)
                .Include(po => po.Company)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                if (status == "pending")
                    query = query.Where(po => po.Status == OrderStatus.Pending);
                else if (status == "confirmed")
                    query = query.Where(po => po.Status == OrderStatus.Confirmed);
                else if (status == "delivered")
                    query = query.Where(po => po.Status == OrderStatus.Delivered);
            }

            var dbOrders = await query
                .OrderByDescending(po => po.CreatedAt)
                .ToListAsync();

            var orders = dbOrders
                .Select(po => new
                {
                    po.Id,
                    po.MedicineName,
                    po.Quantity,
                    po.Category,
                    po.ExpectedPrice,
                    po.Priority,
                    CompanyName = po.Company != null ? po.Company.CompanyName : null,
                    Status = po.Status.ToString(),
                    StatusArabic = GetStatusArabic(po.Status),
                    po.CompanyResponse,
                    po.FinalPrice,
                    po.ExpectedDeliveryDate,
                    po.ActualDeliveryDate,
                    po.Notes,
                    po.CreatedAt
                })
                .ToList();

            return Ok(new
            {
                TotalOrders = orders.Count,
                PendingCount = orders.Count(o => o.Status == "Pending"),
                DeliveredCount = orders.Count(o => o.Status == "Delivered"),
                Orders = orders
            });
        }

        /// <summary>
        /// إنشاء طلب دواء جديد
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            Company? company = null;
            if (dto.CompanyId.HasValue)
            {
                company = await _context.Companies
                    .FirstOrDefaultAsync(c => c.Id == dto.CompanyId.Value);

                if (company == null)
                    return NotFound("الشركة غير موجودة");
            }

            var order = new PharmacyOrder
            {
                PharmacyId = pharmacy.Id,
                CompanyId = dto.CompanyId,
                MedicineName = dto.MedicineName,
                Quantity = dto.Quantity,
                Category = dto.Category,
                ExpectedPrice = dto.ExpectedPrice,
                Priority = dto.Priority ?? "Normal",
                Notes = dto.Notes,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.PharmacyOrders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                Message = "تم إرسال الطلب بنجاح",
                OrderId = order.Id
            });
        }

        /// <summary>
        /// إلغاء طلب
        /// </summary>
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var order = await _context.PharmacyOrders
                .FirstOrDefaultAsync(po => po.Id == id && po.PharmacyId == pharmacy.Id);

            if (order == null)
                return NotFound("الطلب غير موجود");

            if (order.Status != OrderStatus.Pending)
                return BadRequest("لا يمكن إلغاء هذا الطلب");

            order.Status = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم إلغاء الطلب بنجاح" });
        }

        /// <summary>
        /// تحويل حالة الطلب لـ Arabic
        /// </summary>
        private string GetStatusArabic(OrderStatus status)
        {
            return status switch
            {
                OrderStatus.Pending => "في الانتظار",
                OrderStatus.Confirmed => "مؤكد",
                OrderStatus.Shipped => "تم الشحن",
                OrderStatus.Delivered => "تم التسليم",
                OrderStatus.Cancelled => "ملغي",
                OrderStatus.Rejected => "مرفوض",
                _ => "غير معروف"
            };
        }
    }

    // DTO لإنشاء طلب
    public class CreateOrderDto
    {
        public int? CompanyId { get; set; }

        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        [Required, Range(1, 100000)]
        public int Quantity { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        public decimal? ExpectedPrice { get; set; }

        [MaxLength(50)]
        public string? Priority { get; set; } = "Normal";

        public string? Notes { get; set; }
    }
}
