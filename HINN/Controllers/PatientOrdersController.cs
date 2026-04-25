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
    [Route("api/[controller]")]
    public class PatientOrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientOrdersController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// إنشاء طلب شراء جديد من المريض
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> CreateOrder([FromBody] CreatePatientOrderDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest("يجب اختيار دواء واحد على الأقل");

            var pharmacy = await _context.Pharmacies.FindAsync(dto.PharmacyId);
            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var order = new PatientOrder
            {
                PatientId = userId,
                PharmacyId = dto.PharmacyId,
                PaymentMethod = dto.PaymentMethod,
                DeliveryMethod = dto.DeliveryMethod,
                DeliveryAddress = dto.DeliveryAddress,
                Notes = dto.Notes,
                Status = PatientOrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            foreach (var itemDto in dto.Items)
            {
                var inventory = await _context.PharmacyInventories
                    .FirstOrDefaultAsync(i => i.Id == itemDto.PharmacyInventoryId && i.PharmacyId == dto.PharmacyId);

                if (inventory == null)
                    return BadRequest($"الدواء غير موجود في مخزون هذه الصيدلية: {itemDto.PharmacyInventoryId}");

                if (inventory.Quantity < itemDto.Quantity)
                    return BadRequest($"الكمية المطلوبة من {inventory.MedicineName} غير متوفرة. المتاح: {inventory.Quantity}");

                order.Items.Add(new PatientOrderItem
                {
                    PharmacyInventoryId = inventory.Id,
                    MedicineName = inventory.MedicineName,
                    Quantity = itemDto.Quantity,
                    UnitPrice = inventory.Price
                });
            }

            _context.PatientOrders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "تم إنشاء الطلب بنجاح",
                OrderId = order.Id,
                TotalAmount = order.TotalAmount
            });
        }

        /// <summary>
        /// عرض طلباتي كمريض
        /// </summary>
        [HttpGet("my-orders")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var orders = await _context.PatientOrders
                .Include(o => o.Pharmacy)
                .Include(o => o.Items)
                .Where(o => o.PatientId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    PharmacyName = o.Pharmacy.PharmacyName,
                    o.TotalAmount,
                    Status = o.Status.ToString(),
                    o.PaymentMethod,
                    o.DeliveryMethod,
                    o.CreatedAt,
                    ItemCount = o.Items.Count
                })
                .ToListAsync();

            return Ok(orders);
        }

        /// <summary>
        /// عرض الطلبات الواردة للصيدلية
        /// </summary>
        [HttpGet("pharmacy-orders")]
        [Authorize(Roles = "Pharmacy")]
        public async Task<IActionResult> GetPharmacyOrders([FromQuery] string? status = null)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null) return NotFound("الصيدلية غير موجودة");

            var query = _context.PatientOrders
                .Include(o => o.Patient)
                .Include(o => o.Items)
                .Where(o => o.PharmacyId == pharmacy.Id)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<PatientOrderStatus>(status, true, out var statusEnum))
            {
                query = query.Where(o => o.Status == statusEnum);
            }

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.Id,
                    PatientName = o.Patient.FullName,
                    o.TotalAmount,
                    Status = o.Status.ToString(),
                    o.CreatedAt,
                    o.PaymentMethod,
                    o.DeliveryMethod,
                    Items = o.Items.Select(i => new
                    {
                        i.MedicineName,
                        i.Quantity,
                        i.UnitPrice,
                        i.TotalPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        /// <summary>
        /// تحديث حالة الطلب من قبل الصيدلية
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Pharmacy")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null) return NotFound("الصيدلية غير موجودة");

            var order = await _context.PatientOrders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id && o.PharmacyId == pharmacy.Id);

            if (order == null) return NotFound("الطلب غير موجود");

            if (!Enum.TryParse<PatientOrderStatus>(dto.Status, true, out var newStatus))
                return BadRequest("حالة غير صالحة");

            // خصم الكمية من المخزون عند التأكيد
            if (newStatus == PatientOrderStatus.Confirmed && order.Status == PatientOrderStatus.Pending)
            {
                foreach (var item in order.Items)
                {
                    var inventory = await _context.PharmacyInventories.FindAsync(item.PharmacyInventoryId);
                    if (inventory != null)
                    {
                        if (inventory.Quantity < item.Quantity)
                            return BadRequest($"الكمية غير كافية للدواء: {inventory.MedicineName}");
                        
                        inventory.Quantity -= item.Quantity;
                        inventory.LastUpdated = DateTime.UtcNow;
                    }
                }
            }
            // إعادة الكمية للمخزون عند الإلغاء (لو كان تم التأكيد سابقاً)
            else if ((newStatus == PatientOrderStatus.Cancelled || newStatus == PatientOrderStatus.Rejected) && 
                     (order.Status != PatientOrderStatus.Pending && order.Status != PatientOrderStatus.Cancelled && order.Status != PatientOrderStatus.Rejected))
            {
                foreach (var item in order.Items)
                {
                    var inventory = await _context.PharmacyInventories.FindAsync(item.PharmacyInventoryId);
                    if (inventory != null)
                    {
                        inventory.Quantity += item.Quantity;
                        inventory.LastUpdated = DateTime.UtcNow;
                    }
                }
            }

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تحديث حالة الطلب بنجاح", Status = order.Status.ToString() });
        }
    }

    public class CreatePatientOrderDto
    {
        [Required]
        public int PharmacyId { get; set; }
        
        [Required]
        public List<PatientOrderItemRequestDto> Items { get; set; } = new();

        public string PaymentMethod { get; set; } = "Cash";
        public string DeliveryMethod { get; set; } = "Pickup";
        public string? DeliveryAddress { get; set; }
        public string? Notes { get; set; }
    }

    public class PatientOrderItemRequestDto
    {
        [Required]
        public int PharmacyInventoryId { get; set; }
        
        [Required]
        [Range(1, 1000)]
        public int Quantity { get; set; }
    }

    public class UpdateStatusDto
    {
        [Required]
        public string Status { get; set; } = null!;
    }
}
