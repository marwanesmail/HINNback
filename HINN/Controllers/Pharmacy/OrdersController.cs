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
            // البحث الآن يتم في كتالوج الشركات المتاح (CompanyMedicines)
            var query = _context.CompanyMedicines
                .Include(cm => cm.Company)
                .Where(cm => cm.IsAvailable)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(cm => cm.MedicineName.Contains(searchTerm) || 
                                         (cm.Company != null && cm.Company.CompanyName.Contains(searchTerm)));
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(cm => cm.Category == category);
            }

            var results = await query
                .OrderBy(cm => cm.MedicineName)
                .Select(cm => new
                {
                    cm.Id,
                    cm.MedicineName,
                    CompanyName = cm.Company.CompanyName,
                    cm.CompanyId,
                    cm.Category,
                    cm.UnitPrice,
                    cm.StockQuantity,
                    cm.ImagePath,
                    cm.Description
                })
                .ToListAsync();

            return Ok(new
            {
                TotalItems = results.Count,
                Items = results
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
                .Include(po => po.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                        .ThenInclude(cm => cm.Company)
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
                    po.Priority,
                    Status = po.Status.ToString(),
                    StatusArabic = GetStatusArabic(po.Status),
                    po.CompanyResponse,
                    TotalAmount = po.TotalAmount,
                    po.ExpectedDeliveryDate,
                    po.ActualDeliveryDate,
                    po.Notes,
                    po.CreatedAt,
                    ItemsCount = po.Items.Count,
                    Items = po.Items.Select(i => new {
                        i.Id,
                        i.MedicineName,
                        i.Quantity,
                        i.UnitPrice,
                        i.TotalPrice,
                        CompanyName = i.CompanyMedicine?.Company?.CompanyName ?? "غير معروف",
                        i.Note
                    }).ToList()
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

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest("يجب إضافة صنف واحد على الأقل للطلب");

            var order = new PharmacyOrder
            {
                PharmacyId = pharmacy.Id,
                Priority = dto.Priority ?? "Normal",
                Notes = dto.Notes,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var itemDto in dto.Items)
            {
                var medicine = await _context.CompanyMedicines.FindAsync(itemDto.CompanyMedicineId);
                if (medicine == null)
                    return BadRequest($"الدواء المعرف بـ {itemDto.CompanyMedicineId} غير موجود");

                order.Items.Add(new PharmacyOrderItem
                {
                    CompanyMedicineId = medicine.Id,
                    MedicineName = medicine.MedicineName,
                    Quantity = itemDto.Quantity,
                    UnitPrice = medicine.UnitPrice,
                    Note = itemDto.Note
                });
            }

            _context.PharmacyOrders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                Message = "تم إرسال الطلب بنجاح",
                OrderId = order.Id,
                TotalAmount = order.TotalAmount
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
        public string? Priority { get; set; } = "Normal";
        public string? Notes { get; set; }
        public List<OrderItemRequestDto> Items { get; set; } = new();
    }

    public class OrderItemRequestDto
    {
        [Required]
        public int CompanyMedicineId { get; set; }
        
        [Required, Range(1, 100000)]
        public int Quantity { get; set; }

        public string? Note { get; set; }
    }
}
