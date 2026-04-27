using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;
using MyHealthcareApi.DTOs;
using System.Security.Claims;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Company")]
    public class CompanyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanyController(AppDbContext context)
        {
            _context = context;
        }

        private async Task<Company?> GetCurrentCompanyAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return null;
            return await _context.Companies.FirstOrDefaultAsync(c => c.AppUserId == userId);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound("الشركة غير موجودة");

            var medicines = await _context.CompanyMedicines
                .Where(m => m.CompanyId == company.Id)
                .ToListAsync();

            var orders = await _context.PharmacyOrders
                .Where(po => po.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id))
                .ToListAsync();

            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);

            var stats = new CompanyDashboardStatsDto
            {
                TotalProducts = medicines.Count,
                AvailableProducts = medicines.Count(m => m.Status == "متوفر"),
                LowStockProducts = medicines.Count(m => m.Status == "مخزون منخفض"),
                OutOfStockProducts = medicines.Count(m => m.Status == "غير متوفر"),
                TotalOrders = orders.Count,
                NewOrders = orders.Count(o => o.Status == OrderStatus.Pending),
                ProcessingOrders = orders.Count(o => o.Status == OrderStatus.Confirmed || o.Status == OrderStatus.Shipped),
                CompletedOrders = orders.Count(o => o.Status == OrderStatus.Delivered),
                ActivePharmacies = orders.Select(o => o.PharmacyId).Distinct().Count(),
                TodaySales = orders.Where(o => o.CreatedAt.Date == today && o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Rejected).Sum(o => o.TotalAmount),
                MonthlySales = orders.Where(o => o.CreatedAt >= startOfMonth && o.Status != OrderStatus.Cancelled && o.Status != OrderStatus.Rejected).Sum(o => o.TotalAmount)
            };

            return Ok(stats);
        }

        [HttpGet("medicines")]
        public async Task<IActionResult> GetMedicines()
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound();

            var medicines = await _context.CompanyMedicines
                .Where(m => m.CompanyId == company.Id)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new CompanyMedicineDto
                {
                    Id = m.Id,
                    MedicineName = m.MedicineName,
                    Category = m.Category,
                    Description = m.Description,
                    ImagePath = m.ImagePath,
                    UnitPrice = m.UnitPrice,
                    StockQuantity = m.StockQuantity,
                    MinimumOrderQuantity = m.MinimumOrderQuantity,
                    ProductionDate = m.ProductionDate,
                    ExpiryDate = m.ExpiryDate,
                    IsAvailable = m.IsAvailable,
                    Status = m.Status,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(medicines);
        }

        [HttpPost("medicines")]
        public async Task<IActionResult> CreateMedicine([FromBody] CreateMedicineDto dto)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound();

            var medicine = new CompanyMedicine
            {
                CompanyId = company.Id,
                MedicineName = dto.MedicineName,
                Category = dto.Category,
                Description = dto.Description,
                UnitPrice = dto.UnitPrice,
                StockQuantity = dto.StockQuantity,
                MinimumOrderQuantity = dto.MinimumOrderQuantity,
                ProductionDate = dto.ProductionDate,
                ExpiryDate = dto.ExpiryDate,
                IsAvailable = dto.IsAvailable,
                CreatedAt = DateTime.UtcNow
            };

            _context.CompanyMedicines.Add(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم إضافة المنتج بنجاح", ProductId = medicine.Id });
        }

        [HttpPut("medicines/{id}")]
        public async Task<IActionResult> UpdateMedicine(int id, [FromBody] UpdateMedicineDto dto)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound();

            var medicine = await _context.CompanyMedicines
                .FirstOrDefaultAsync(m => m.Id == id && m.CompanyId == company.Id);

            if (medicine == null) return NotFound("المنتج غير موجود");

            if (dto.MedicineName != null) medicine.MedicineName = dto.MedicineName;
            if (dto.Category != null) medicine.Category = dto.Category;
            if (dto.Description != null) medicine.Description = dto.Description;
            if (dto.UnitPrice.HasValue) medicine.UnitPrice = dto.UnitPrice.Value;
            if (dto.StockQuantity.HasValue) medicine.StockQuantity = dto.StockQuantity.Value;
            if (dto.MinimumOrderQuantity.HasValue) medicine.MinimumOrderQuantity = dto.MinimumOrderQuantity.Value;
            if (dto.ProductionDate.HasValue) medicine.ProductionDate = dto.ProductionDate;
            if (dto.ExpiryDate.HasValue) medicine.ExpiryDate = dto.ExpiryDate;
            if (dto.IsAvailable.HasValue) medicine.IsAvailable = dto.IsAvailable.Value;
            
            medicine.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "تم تحديث المنتج بنجاح" });
        }

        [HttpDelete("medicines/{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound();

            var medicine = await _context.CompanyMedicines
                .FirstOrDefaultAsync(m => m.Id == id && m.CompanyId == company.Id);

            if (medicine == null) return NotFound();

            _context.CompanyMedicines.Remove(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم حذف المنتج بنجاح" });
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound();

            var orders = await _context.PharmacyOrders
                .Where(po => po.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id))
                .Include(po => po.Pharmacy)
                .Include(po => po.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                .OrderByDescending(po => po.CreatedAt)
                .Select(po => new CompanyOrderDto
                {
                    Id = po.Id,
                    PharmacyName = po.Pharmacy.PharmacyName,
                    PharmacyPhone = po.Pharmacy.PhoneNumber,
                    PharmacyAddress = po.Pharmacy.Address,
                    Status = po.Status.ToString(),
                    StatusArabic = GetStatusArabic(po.Status),
                    Priority = po.Priority,
                    TotalAmount = po.TotalAmount,
                    Notes = po.Notes,
                    CompanyResponse = po.CompanyResponse,
                    ExpectedDeliveryDate = po.ExpectedDeliveryDate,
                    ActualDeliveryDate = po.ActualDeliveryDate,
                    CreatedAt = po.CreatedAt,
                    Items = po.Items
                        .Where(i => i.CompanyMedicine.CompanyId == company.Id)
                        .Select(i => new CompanyOrderItemDto
                        {
                            Id = i.Id,
                            MedicineName = i.MedicineName,
                            Quantity = i.Quantity,
                            UnitPrice = i.UnitPrice,
                            TotalPrice = i.TotalPrice,
                            Note = i.Note
                        }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound();

            var order = await _context.PharmacyOrders
                .Include(po => po.Items)
                .ThenInclude(i => i.CompanyMedicine)
                .FirstOrDefaultAsync(po => po.Id == id && po.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id));

            if (order == null) return NotFound("الطلب غير موجود");

            if (Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
            {
                order.Status = newStatus;
                order.CompanyResponse = dto.CompanyResponse;
                order.ExpectedDeliveryDate = dto.ExpectedDeliveryDate;
                order.RespondedAt = DateTime.UtcNow;

                if (newStatus == OrderStatus.Delivered)
                {
                    order.ActualDeliveryDate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                return Ok(new { Message = "تم تحديث حالة الطلب بنجاح" });
            }

            return BadRequest("حالة طلب غير صالحة");
        }

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
}
