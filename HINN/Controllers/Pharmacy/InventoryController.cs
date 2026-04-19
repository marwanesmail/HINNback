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
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventoryController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// إحصائيات المخزون
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetInventoryStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var inventory = await _context.PharmacyInventories
                .Where(i => i.PharmacyId == pharmacy.Id)
                .ToListAsync();

            var totalItems = inventory.Count;
            var lowStock = inventory.Count(i => i.Status == InventoryStatus.Low);
            var outOfStock = inventory.Count(i => i.Status == InventoryStatus.OutOfStock);
            var expired = inventory.Count(i => i.IsExpired);

            // إجمالي قيمة المخزون
            var totalValue = inventory.Sum(i => i.Quantity * i.Price);

            return Ok(new
            {
                TotalItems = totalItems,
                LowStockItems = lowStock,
                OutOfStockItems = outOfStock,
                ExpiredItems = expired,
                TotalValue = totalValue,
                Date = DateTime.Today
            });
        }

        /// <summary>
        /// عرض قائمة المخزون
        /// </summary>
        [HttpGet("list")]
        public async Task<IActionResult> GetInventoryList([FromQuery] string? status = null, [FromQuery] string? searchTerm = null)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var query = _context.PharmacyInventories
                .Where(i => i.PharmacyId == pharmacy.Id)
                .AsQueryable();

            // فلترة حسب الحالة
            if (!string.IsNullOrEmpty(status))
            {
                if (status == "available")
                    query = query.Where(i => i.Status == InventoryStatus.Available);
                else if (status == "low")
                    query = query.Where(i => i.Status == InventoryStatus.Low);
                else if (status == "outofstock")
                    query = query.Where(i => i.Status == InventoryStatus.OutOfStock);
                else if (status == "expired")
                    query = query.Where(i => i.IsExpired);
            }

            // بحث باسم الدواء
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(i => i.MedicineName.Contains(searchTerm));
            }

            var dbInventory = await query
                .OrderBy(i => i.MedicineName)
                .ToListAsync();

            var inventory = dbInventory
                .Select(i => new
                {
                    i.Id,
                    i.MedicineName,
                    i.Quantity,
                    i.MinimumQuantity,
                    i.ExpiryDate,
                    i.Price,
                    i.BatchNumber,
                    i.Manufacturer,
                    i.StorageLocation,
                    i.Notes,
                    Status = i.Status.ToString(),
                    StatusArabic = GetStatusArabic(i.Status),
                    IsExpired = i.IsExpired,
                    i.CreatedAt,
                    i.LastUpdated
                })
                .ToList();

            return Ok(new
            {
                TotalItems = inventory.Count,
                Items = inventory
            });
        }

        /// <summary>
        /// إضافة صنف جديد للمخزون
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddInventoryItem([FromBody] AddInventoryItemDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var item = new PharmacyInventory
            {
                PharmacyId = pharmacy.Id,
                MedicineName = dto.MedicineName,
                Quantity = dto.Quantity,
                MinimumQuantity = dto.MinimumQuantity,
                ExpiryDate = dto.ExpiryDate,
                Price = dto.Price,
                BatchNumber = dto.BatchNumber,
                Manufacturer = dto.Manufacturer,
                StorageLocation = dto.StorageLocation,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.PharmacyInventories.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                Message = "تم إضافة الصنف بنجاح",
                ItemId = item.Id
            });
        }

        /// <summary>
        /// تحديث صنف في المخزون
        /// </summary>
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateInventoryItem(int id, [FromBody] UpdateInventoryItemDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var item = await _context.PharmacyInventories
                .FirstOrDefaultAsync(i => i.Id == id && i.PharmacyId == pharmacy.Id);

            if (item == null)
                return NotFound("الصنف غير موجود");

            // تحديث البيانات
            if (dto.Quantity.HasValue)
                item.Quantity = dto.Quantity.Value;
            
            if (dto.MinimumQuantity.HasValue)
                item.MinimumQuantity = dto.MinimumQuantity.Value;
            
            if (dto.Price.HasValue)
                item.Price = dto.Price.Value;
            
            if (dto.ExpiryDate.HasValue)
                item.ExpiryDate = dto.ExpiryDate.Value;
            
            if (dto.BatchNumber != null)
                item.BatchNumber = dto.BatchNumber;
            
            if (dto.Manufacturer != null)
                item.Manufacturer = dto.Manufacturer;
            
            if (dto.StorageLocation != null)
                item.StorageLocation = dto.StorageLocation;
            
            if (dto.Notes != null)
                item.Notes = dto.Notes;

            item.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تحديث الصنف بنجاح" });
        }

        /// <summary>
        /// حذف صنف من المخزون
        /// </summary>
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteInventoryItem(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var item = await _context.PharmacyInventories
                .FirstOrDefaultAsync(i => i.Id == id && i.PharmacyId == pharmacy.Id);

            if (item == null)
                return NotFound("الصنف غير موجود");

            _context.PharmacyInventories.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم حذف الصنف بنجاح" });
        }

        /// <summary>
        /// تحويل الحالة لـ Arabic
        /// </summary>
        private string GetStatusArabic(InventoryStatus status)
        {
            return status switch
            {
                InventoryStatus.Available => "متوفر",
                InventoryStatus.Low => "منخفض",
                InventoryStatus.OutOfStock => "نفد",
                _ => "غير معروف"
            };
        }
    }

    // DTO لإضافة صنف
    public class AddInventoryItemDto
    {
        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        [Required, Range(0, 100000)]
        public int Quantity { get; set; }

        [Required, Range(1, 10000)]
        public int MinimumQuantity { get; set; } = 10;

        public DateTime? ExpiryDate { get; set; }

        [Required, Range(0, 100000)]
        public decimal Price { get; set; }

        [MaxLength(50)]
        public string? BatchNumber { get; set; }

        [MaxLength(200)]
        public string? Manufacturer { get; set; }

        [MaxLength(100)]
        public string? StorageLocation { get; set; }

        public string? Notes { get; set; }
    }

    // DTO لتحديث صنف
    public class UpdateInventoryItemDto
    {
        [Range(0, 100000)]
        public int? Quantity { get; set; }

        [Range(1, 10000)]
        public int? MinimumQuantity { get; set; }

        [Range(0, 100000)]
        public decimal? Price { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [MaxLength(50)]
        public string? BatchNumber { get; set; }

        [MaxLength(200)]
        public string? Manufacturer { get; set; }

        [MaxLength(100)]
        public string? StorageLocation { get; set; }

        public string? Notes { get; set; }
    }
}
