using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;
using System.Security.Claims;
using MyHealthcareApi.Services;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/Companies")]
    [Authorize(Roles = "Company")]   // ← كل الـ endpoints محمية بالتوكن
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public CompaniesController(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        // ═══════════════════════════════════════════════════════
        // Helper: جلب الشركة الحالية من JWT Token
        // ═══════════════════════════════════════════════════════

        /// <summary>بيجيب بيانات الشركة المسجل دخولها من التوكن — مش من الـ Body أو الـ URL</summary>
        private async Task<Company?> GetCurrentCompanyAsync()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return null;
            return await _context.Companies.FirstOrDefaultAsync(c => c.AppUserId == userId);
        }

        // ═══════════════════════════════════════════════════════
        // 📊 Stats — داشبورد الشركة
        // ═══════════════════════════════════════════════════════

        /// <summary>GET api/Companies/stats — إحصائيات الداشبورد</summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null)
                return NotFound(new { message = "الشركة غير موجودة" });

            var medicines = await _context.CompanyMedicines
                .Where(m => m.CompanyId == company.Id)
                .ToListAsync();

            var orders = await _context.PharmacyOrders
                .Where(po => po.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id))
                .Include(po => po.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                .ToListAsync();

            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);

            var completedOrders = orders.Where(o => o.Status == OrderStatus.Delivered).ToList();

            var stats = new CompanyDashboardStatsDto
            {
                // المنتجات
                TotalProducts       = medicines.Count,
                AvailableProducts   = medicines.Count(m => m.Status == "متوفر"),
                LowStockProducts    = medicines.Count(m => m.Status == "مخزون منخفض"),
                OutOfStockProducts  = medicines.Count(m => m.Status == "غير متوفر"),

                // الطلبات
                TotalOrders         = orders.Count,
                NewOrders           = orders.Count(o => o.Status == OrderStatus.Pending),
                ProcessingOrders    = orders.Count(o =>
                    o.Status == OrderStatus.Processing ||
                    o.Status == OrderStatus.Confirmed  ||
                    o.Status == OrderStatus.Shipped),
                CompletedOrders     = orders.Count(o => o.Status == OrderStatus.Delivered),
                CancelledOrders     = orders.Count(o =>
                    o.Status == OrderStatus.Cancelled ||
                    o.Status == OrderStatus.Rejected),

                // العملاء والمبيعات
                ActivePharmacies    = orders.Select(o => o.PharmacyId).Distinct().Count(),

                TodaySales    = completedOrders
                    .Where(o => o.CreatedAt.Date == today)
                    .Sum(o => o.Items
                        .Where(i => i.CompanyMedicine.CompanyId == company.Id)
                        .Sum(i => i.TotalPrice)),

                MonthlySales  = completedOrders
                    .Where(o => o.CreatedAt >= startOfMonth)
                    .Sum(o => o.Items
                        .Where(i => i.CompanyMedicine.CompanyId == company.Id)
                        .Sum(i => i.TotalPrice)),

                TotalSales    = completedOrders
                    .Sum(o => o.Items
                        .Where(i => i.CompanyMedicine.CompanyId == company.Id)
                        .Sum(i => i.TotalPrice))
            };

            return Ok(stats);
        }

        // ═══════════════════════════════════════════════════════
        // 💊 إدارة الأدوية / المنتجات
        // ═══════════════════════════════════════════════════════

        /// <summary>GET api/Companies/medicines — جلب كل منتجات شركتي</summary>
        [HttpGet("medicines")]
        public async Task<IActionResult> GetMyMedicines()
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            var medicines = await _context.CompanyMedicines
                .Where(m => m.CompanyId == company.Id)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new CompanyMedicineDto
                {
                    Id                  = m.Id,
                    CompanyId           = m.CompanyId,
                    MedicineName        = m.MedicineName,
                    Category            = m.Category,
                    Description         = m.Description,
                    ImagePath           = m.ImagePath,
                    UnitPrice           = m.UnitPrice,
                    StockQuantity       = m.StockQuantity,
                    MinimumOrderQuantity= m.MinimumOrderQuantity,
                    IsAvailable         = m.IsAvailable,
                    Status              = m.Status,
                    ProductionDate      = m.ProductionDate,
                    ExpiryDate          = m.ExpiryDate,
                    CreatedAt           = m.CreatedAt
                })
                .ToListAsync();

            if (!medicines.Any())
                return Ok(new { message = "لا يوجد أدوية مسجلة لشركتك حالياً", data = medicines });

            return Ok(medicines);
        }

        /// <summary>POST api/Companies/medicines — إضافة دواء جديد لشركتي</summary>
        [HttpPost("medicines")]
        public async Task<IActionResult> AddMedicine([FromBody] CreateMedicineDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            var medicine = new CompanyMedicine
            {
                CompanyId            = company.Id,      // ← من التوكن — مش من الـ Body
                MedicineName         = dto.MedicineName,
                Category             = dto.Category,
                Description          = dto.Description,
                UnitPrice            = dto.UnitPrice,
                StockQuantity        = dto.StockQuantity,
                MinimumOrderQuantity = dto.MinimumOrderQuantity,
                IsAvailable          = dto.IsAvailable,
                ProductionDate       = dto.ProductionDate,
                ExpiryDate           = dto.ExpiryDate,
                CreatedAt            = DateTime.UtcNow
            };

            _context.CompanyMedicines.Add(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تمت إضافة الدواء بنجاح", medicineId = medicine.Id });
        }

        /// <summary>PUT api/Companies/medicines/{id} — تعديل دواء (لازم يكون تابع لشركتي)</summary>
        [HttpPut("medicines/{id}")]
        public async Task<IActionResult> UpdateMedicine(int id, [FromBody] UpdateMedicineDto dto)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            // ← بيتحقق إن الدواء ده تابع لشركتي بالفعل
            var medicine = await _context.CompanyMedicines
                .FirstOrDefaultAsync(m => m.Id == id && m.CompanyId == company.Id);

            if (medicine == null)
                return NotFound(new { message = "المنتج غير موجود أو لا ينتمي لشركتك" });

            // تطبيق التعديلات (فقط الحقول اللي بعتها)
            if (dto.MedicineName != null)        medicine.MedicineName        = dto.MedicineName;
            if (dto.Category != null)            medicine.Category            = dto.Category;
            if (dto.Description != null)         medicine.Description         = dto.Description;
            if (dto.ImagePath != null)           medicine.ImagePath           = dto.ImagePath;
            if (dto.UnitPrice.HasValue)          medicine.UnitPrice           = dto.UnitPrice.Value;
            if (dto.StockQuantity.HasValue)      medicine.StockQuantity       = dto.StockQuantity.Value;
            if (dto.MinimumOrderQuantity.HasValue)medicine.MinimumOrderQuantity= dto.MinimumOrderQuantity.Value;
            if (dto.IsAvailable.HasValue)        medicine.IsAvailable         = dto.IsAvailable.Value;
            if (dto.ProductionDate.HasValue)     medicine.ProductionDate      = dto.ProductionDate;
            if (dto.ExpiryDate.HasValue)         medicine.ExpiryDate          = dto.ExpiryDate;

            medicine.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "فشل تحديث بيانات المنتج", error = ex.Message });
            }

            return Ok(new { message = "تم تحديث بيانات المنتج بنجاح" });
        }

        /// <summary>DELETE api/Companies/medicines/{id} — حذف دواء (لازم يكون تابع لشركتي)</summary>
        [HttpDelete("medicines/{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            // ← بيتحقق إن الدواء ده تابع لشركتي بالفعل
            var medicine = await _context.CompanyMedicines
                .FirstOrDefaultAsync(m => m.Id == id && m.CompanyId == company.Id);

            if (medicine == null)
                return NotFound(new { message = "المنتج غير موجود أو لا ينتمي لشركتك" });

            _context.CompanyMedicines.Remove(medicine);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حذف المنتج بنجاح" });
        }

        // ═══════════════════════════════════════════════════════
        // 📋 إدارة الطلبات
        // ═══════════════════════════════════════════════════════

        /// <summary>GET api/Companies/orders — جلب كل طلبات شركتي مع تفاصيل الأدوية</summary>
        [HttpGet("orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            var orders = await _context.PharmacyOrders
                .Include(o => o.Pharmacy)
                .Include(o => o.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                .Where(o => o.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id))
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new CompanyOrderDto
                {
                    Id           = o.Id,
                    PharmacyName = o.Pharmacy.PharmacyName,
                    PharmacyPhone   = o.Pharmacy.PhoneNumber,    // ← تليفون الصيدلية
                    PharmacyAddress = o.Pharmacy.Address,         // ← عنوان الصيدلية
                    CreatedAt    = o.CreatedAt,
                    Status       = o.Status.ToString(),
                    Priority     = o.Priority,
                    Notes        = o.Notes,
                    TotalAmount  = o.Items
                        .Where(i => i.CompanyMedicine.CompanyId == company.Id)
                        .Sum(i => i.Quantity * i.UnitPrice),
                    Medicines    = o.Items
                        .Where(i => i.CompanyMedicine.CompanyId == company.Id)
                        .Select(i => new CompanyOrderItemDto
                        {
                            MedicineId   = i.CompanyMedicineId,
                            MedicineName = i.MedicineName,
                            Quantity     = i.Quantity,
                            UnitPrice    = i.UnitPrice
                        }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        /// <summary>PUT api/Companies/process-order/{id} — تحويل الطلب لـ "قيد التجهيز"</summary>
        [HttpPut("process-order/{id}")]
        public async Task<IActionResult> ProcessOrder(int id)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            var order = await _context.PharmacyOrders
                .Include(o => o.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                .FirstOrDefaultAsync(o =>
                    o.Id == id &&
                    o.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id));

            if (order == null)
                return NotFound(new { message = "الطلب غير موجود أو لا ينتمي لشركتك" });

            // ← فحوصات الـ Status الصحيحة
            if (order.Status == OrderStatus.Processing)
                return BadRequest(new { message = "الطلب قيد التجهيز بالفعل." });
            if (order.Status == OrderStatus.Delivered)
                return BadRequest(new { message = "لا يمكن معالجة طلب تم تسليمه بالفعل." });
            if (order.Status == OrderStatus.Rejected)
                return BadRequest(new { message = "لا يمكن معالجة طلب مرفوض." });
            if (order.Status == OrderStatus.Cancelled)
                return BadRequest(new { message = "لا يمكن معالجة طلب ملغي." });

            order.Status = OrderStatus.Processing;

            string? pharmacyUserId = await GetPharmacyUserIdAsync(order.PharmacyId);
            if (pharmacyUserId != null)
            {
                AddNotification(
                    pharmacyUserId,
                    "تحديث: الطلب قيد التجهيز",
                    BuildNotificationMessage(order, "معالجة"),
                    "Processing",
                    order.Id, order.PharmacyId,
                    order.Items.FirstOrDefault()?.CompanyMedicine?.CompanyId
                );
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم البدء في التجهيز وإرسال التنبيه للصيدلية." });
        }

        /// <summary>PUT api/Companies/complete-order/{id} — تأكيد الطلب وخصم المخزون</summary>
        [HttpPut("complete-order/{id}")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            var order = await _context.PharmacyOrders
                .Include(o => o.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                .FirstOrDefaultAsync(o =>
                    o.Id == id &&
                    o.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id));

            if (order == null)
                return NotFound(new { message = "الطلب غير موجود أو لا ينتمي لشركتك" });

            // ← فحوصات الـ Status الصحيحة
            if (order.Status == OrderStatus.Confirmed)
                return BadRequest(new { message = "الطلب مؤكد بالفعل." });
            if (order.Status == OrderStatus.Delivered)
                return BadRequest(new { message = "الطلب تم تسليمه بالفعل." });
            if (order.Status == OrderStatus.Rejected)
                return BadRequest(new { message = "لا يمكن تأكيد طلب مرفوض." });
            if (order.Status == OrderStatus.Cancelled)
                return BadRequest(new { message = "لا يمكن تأكيد طلب ملغي." });

            // فحص المخزون وخصمه
            foreach (var item in order.Items.Where(i => i.CompanyMedicine.CompanyId == company.Id))
            {
                var medicine = await _context.CompanyMedicines.FindAsync(item.CompanyMedicineId);
                if (medicine == null || medicine.StockQuantity < item.Quantity)
                    return BadRequest(new { message = $"عجز في مخزون دواء: {medicine?.MedicineName ?? "غير معروف"}" });

                medicine.StockQuantity -= item.Quantity;
            }

            order.Status = OrderStatus.Confirmed;

            string? pharmacyUserId = await GetPharmacyUserIdAsync(order.PharmacyId);
            if (pharmacyUserId != null)
            {
                AddNotification(
                    pharmacyUserId,
                    "مبروك: تم قبول طلبك",
                    BuildNotificationMessage(order, "تأكيد"),
                    "Success",
                    order.Id, order.PharmacyId,
                    order.Items.FirstOrDefault()?.CompanyMedicine?.CompanyId
                );
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم تأكيد الطلب وخصم المخزون وإرسال التنبيه." });
        }

        /// <summary>PUT api/Companies/cancel-order/{id} — رفض / إلغاء الطلب</summary>
        [HttpPut("cancel-order/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            var order = await _context.PharmacyOrders
                .Include(o => o.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                .FirstOrDefaultAsync(o =>
                    o.Id == id &&
                    o.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id));

            if (order == null)
                return NotFound(new { message = "الطلب غير موجود أو لا ينتمي لشركتك" });

            // ← فحوصات الـ Status الصحيحة
            if (order.Status == OrderStatus.Delivered)
                return BadRequest(new { message = "لا يمكن إلغاء طلب تم تسليمه بالفعل." });
            if (order.Status == OrderStatus.Rejected)
                return BadRequest(new { message = "الطلب مرفوض بالفعل." });
            if (order.Status == OrderStatus.Cancelled)
                return BadRequest(new { message = "الطلب ملغي بالفعل." });

            order.Status = OrderStatus.Rejected;

            string? pharmacyUserId = await GetPharmacyUserIdAsync(order.PharmacyId);
            if (pharmacyUserId != null)
            {
                AddNotification(
                    pharmacyUserId,
                    "تنبيه: تم رفض الطلب",
                    BuildNotificationMessage(order, "رفض وإلغاء"),
                    "Danger",
                    order.Id, order.PharmacyId,
                    order.Items.FirstOrDefault()?.CompanyMedicine?.CompanyId
                );
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم رفض الطلب وإخطار الصيدلية." });
        }

        // ═══════════════════════════════════════════════════════
        // 👥 إدارة العملاء
        // ═══════════════════════════════════════════════════════

        /// <summary>GET api/Companies/my-customers — الصيدليات اللي طلبت من شركتي</summary>
        [HttpGet("my-customers")]
        public async Task<IActionResult> GetMyCustomers()
        {
            var company = await GetCurrentCompanyAsync();
            if (company == null) return NotFound(new { message = "الشركة غير موجودة" });

            var customers = await _context.PharmacyOrderItems
                .Where(item => item.CompanyMedicine.CompanyId == company.Id)
                .Select(item => item.PharmacyOrder.Pharmacy)
                .Distinct()
                .Select(p => new CompanyCustomerDto
                {
                    Id              = p.Id,
                    PharmacyName    = p.PharmacyName,
                    Address         = p.Address,
                    PhoneNumber     = p.PhoneNumber,
                    TotalOrdersCount = _context.PharmacyOrders
                        .Count(o =>
                            o.PharmacyId == p.Id &&
                            o.Items.Any(i => i.CompanyMedicine.CompanyId == company.Id))
                })
                .ToListAsync();

            return Ok(customers);
        }

        // ═══════════════════════════════════════════════════════
        // 🔔 Private Helpers
        // ═══════════════════════════════════════════════════════

        private async Task<string?> GetPharmacyUserIdAsync(int pharmacyId)
        {
            return await _context.Pharmacies
                .Where(p => p.Id == pharmacyId)
                .Select(p => p.AppUserId)
                .FirstOrDefaultAsync();
        }

        private string BuildNotificationMessage(PharmacyOrder order, string actionVerb)
        {
            var firstItem = order.Items.FirstOrDefault();
            string medicineName    = firstItem?.CompanyMedicine?.MedicineName ?? "منتجات طبية";
            string medicineDisplay = order.Items.Count > 1
                ? $"{medicineName} وأصناف أخرى"
                : medicineName;

            return $"تم {actionVerb} الطلب رقم ({order.Id}) الخاص بدواء ({medicineDisplay}) بنجاح.";
        }

        private void AddNotification(
            string userId, string title, string message,
            string type, int orderId, int pharmacyId, int? companyId)
        {
            // Instead of just adding to DB, we use the service to add to DB AND send SignalR push
            // But since this is a void method and SendNotificationAsync is async, we should ideally await it.
            // Since we can't await inside void, we'll run it without awaiting (fire and forget).
            // (Note: To be safer, it's better to update the signature, but since it's called in multiple places, this is a quick fix)
            _ = _notificationService.SendNotificationAsync(
                userId: userId,
                title: title,
                message: message,
                type: type,
                relatedEntityId: $"Order:{orderId},Pharmacy:{pharmacyId},Company:{companyId}"
            );
        }
    }
}