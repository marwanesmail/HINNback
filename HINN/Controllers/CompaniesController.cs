using Microsoft.AspNetCore.Mvc;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq; // عشان الـ .Where() والـ .Select() والـ .Count() يشتغلوا
using System.Collections.Generic; // عشان لو استخدمت List<string> للفحوصات

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/Companies")]
    public class CompaniesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompaniesController(AppDbContext context)
        {
            _context = context;
        }

        //اضافة دواء لشركة معينة

        [HttpPost("add-medicine")]
        public async Task<IActionResult> AddMedicine(CompanyMedicineDto dto)
        {
            var medicine = new CompanyMedicine
            {
                CompanyId = dto.CompanyId,
                MedicineName = dto.MedicineName,
                Category = dto.Category,
                Description = dto.Description,
                UnitPrice = dto.UnitPrice,
                StockQuantity = dto.StockQuantity,
                ProductionDate = dto.ProductionDate,
                ExpiryDate = dto.ExpiryDate,
                IsAvailable = dto.IsAvailable,
            };

            _context.CompanyMedicines.Add(medicine);
            await _context.SaveChangesAsync();
            return Ok(new { message = "تمت إضافة الدواء بنجاح" });
        }


        //عرض جميع منتجات او الادوية لشركة معينة

        [HttpGet("get-all-medicines/{companyId}")]
        public async Task<IActionResult> GetMedicinesByCompany(int companyId)
        {
            var medicines = await _context.CompanyMedicines
                .Where(m => m.CompanyId == companyId)
                .Select(m => new CompanyMedicineDto
                {
                    Id = m.Id,
                    CompanyId = m.CompanyId,
                    MedicineName = m.MedicineName,
                    Category = m.Category,
                    UnitPrice = m.UnitPrice,
                    StockQuantity = m.StockQuantity,
                    IsAvailable = m.IsAvailable,
                    ProductionDate = m.ProductionDate,
                    ExpiryDate = m.ExpiryDate,
                    Description = m.Description,
                    ImagePath = m.ImagePath
                })
                .ToListAsync();

            if (medicines == null)
            {
                return Ok(new { message = "لا يوجد أدوية مسجلة لهذه الشركة حالياً" });
            }

            return Ok(medicines);
        }

        //تحديث بيانات منتج معين

        [HttpPut("update-medicine/{id}")]
        public async Task<IActionResult> UpdateMedicine(int id, CompanyMedicineDto dto)
        {
            var medicine = await _context.CompanyMedicines.FindAsync(id);

            if (medicine == null)
            {
                return NotFound(new { message = "هذا المنتج غير موجود" });
            }

            // تحديث البيانات الأساسية
            medicine.MedicineName = dto.MedicineName;
            medicine.Category = dto.Category;
            medicine.Description = dto.Description;
            medicine.UnitPrice = dto.UnitPrice;
            medicine.StockQuantity = dto.StockQuantity;
            medicine.IsAvailable = dto.IsAvailable;
            medicine.ProductionDate = dto.ProductionDate;
            medicine.ExpiryDate = dto.ExpiryDate;

            medicine.ImagePath = dto.ImagePath; // تعديل مسار الصورة

            // تسجيل وقت التحديث تلقائياً
            medicine.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "فشل التحديث بيانات المنتج", error = ex.Message });
            }

            return Ok(new { message = "تم تحديث كل بيانات المنتج بنجاح!" });
        }

        // حذف منتج معين 

        [HttpDelete("delete-medicine/{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = await _context.CompanyMedicines.FindAsync(id);

            if (medicine == null)
            {
                return NotFound(new { message = "عذراً، المنتج ده مش موجود عشان يتم حذفه" });
            }

            _context.CompanyMedicines.Remove(medicine);

            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حذف المنتج بنجاح من قائمة الشركة" });
        }

        // عرض جميع الطلبات و ومحتوياتها لشركة معينة
        [HttpGet("get-all-orders-with-items/{companyId}")]
        public async Task<IActionResult> GetAllOrdersWithItems(int companyId)
        {
            var orders = await _context.PharmacyOrders
                .Include(o => o.Pharmacy)
                .Include(o => o.Items)
                    .ThenInclude(i => i.CompanyMedicine)
                .Where(o => o.Items.Any(i => i.CompanyMedicine.CompanyId == companyId))
                .Select(o => new CompanyOrderDto
                {
                    Id = o.Id,
                    PharmacyName = o.Pharmacy.PharmacyName,
                    CreatedAt = o.CreatedAt,
                    Status = o.Status.ToString(),
                    Priority = o.Priority,
                    Notes = o.Notes,

                    TotalAmount = o.Items
                        .Where(i => i.CompanyMedicine.CompanyId == companyId)
                        .Sum(i => i.Quantity * i.UnitPrice),

                    // تعبئة قائمة الأدوية (Medicines)
                    Medicines = o.Items
                        .Where(i => i.CompanyMedicine.CompanyId == companyId)
                        .Select(i => new CompanyOrderItemDto
                        {
                            MedicineId = i.CompanyMedicineId,
                            MedicineName = i.MedicineName,
                            Quantity = i.Quantity,
                            UnitPrice = i.UnitPrice
                        }).ToList()
                })
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        // دالة تجيب الـ UserId بتاع الصيدلية من جدول الـ Users
        private async Task<string?> GetPharmacyUserIdAsync(int pharmacyId)
        {
            return await _context.Pharmacies
                .Where(p => p.Id == pharmacyId)
                .Select(p => p.AppUserId)
                .FirstOrDefaultAsync();
        }

        // دالة بتبني نص الرسالة بالعربي بشكل مرتب
        private string BuildNotificationMessage(PharmacyOrder order, string actionVerb)
        {
            var firstItem = order.Items.FirstOrDefault();
            string medicineName = firstItem?.CompanyMedicine?.MedicineName ?? "منتجات طبية";
            string medicineDisplay = order.Items.Count > 1 ? $"{medicineName} وأصناف أخرى" : medicineName;

            // تم [معالجة/إتمام/إلغاء] الطلب رقم (10) الخاص بدواء (أوجمنتين) بنجاح.
            return "تم " + actionVerb + " الطلب رقم (" + order.Id + ") الخاص بدواء (" + medicineDisplay + ") بنجاح.";
        }

        // دالة بتضيف التنبيه فعلياً في الداتا بيز
        private void AddNotification(string userId, string title, string message, string type, int orderId, int pharmacyId, int? companyId)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                RelatedEntityId = $"Order:{orderId},Pharmacy:{pharmacyId},Company:{companyId}",
                IsRead = false,
                CreatedAt = DateTime.Now
            });
        }

        // 1. معالجة الطلب
        [HttpPut("process-order/{id}")]
        public async Task<IActionResult> ProcessOrder(int id)
        {
            var order = await _context.PharmacyOrders.Include(o => o.Items).ThenInclude(i => i.CompanyMedicine).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();

            // الفحص الكامل 
            if (order.Status == OrderStatus.Pending) return BadRequest(new { message = "الطلب قيد المعالجة بالفعل." });
            if (order.Status == OrderStatus.Confirmed) return BadRequest(new { message = "لا يمكن معالجة طلب مكتمل ومسلم." });
            if (order.Status == OrderStatus.Rejected) return BadRequest(new { message = "لا يمكن معالجة طلب ملغي." });

            order.Status = OrderStatus.Pending;

            string? pharmacyUserId = await GetPharmacyUserIdAsync(order.PharmacyId);
            if (pharmacyUserId != null)
            {
                AddNotification(pharmacyUserId, "تحديث: الطلب قيد المعالجة", BuildNotificationMessage(order, "معالجة"), "Processing", order.Id, order.PharmacyId, order.Items.FirstOrDefault()?.CompanyMedicine?.CompanyId);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم البدء في المعالجة وإرسال التنبيه." });
        }
        // 2. إتمام الطلب (مع فحص المخزن بدقة)
        [HttpPut("complete-order/{id}")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var order = await _context.PharmacyOrders.Include(o => o.Items).ThenInclude(i => i.CompanyMedicine).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();

            if (order.Status == OrderStatus.Confirmed) return BadRequest(new { message = "الطلب مكتمل بالفعل." });
            if (order.Status == OrderStatus.Rejected) return BadRequest(new { message = "لا يمكن إتمام طلب ملغي." });

            // فحص المخزن والخصم (الـ Logic القديم بتاعك)
            foreach (var item in order.Items)
            {
                var medicine = await _context.CompanyMedicines.FindAsync(item.CompanyMedicineId);
                if (medicine == null || medicine.StockQuantity < item.Quantity)
                    return BadRequest(new { message = "عجز في مخزون دواء " + medicine?.MedicineName });
                medicine.StockQuantity -= item.Quantity;
            }

            order.Status = OrderStatus.Confirmed;

            string? pharmacyUserId = await GetPharmacyUserIdAsync(order.PharmacyId);
            if (pharmacyUserId != null)
            {
                AddNotification(pharmacyUserId, "مبروك: تم قبول طلبك", BuildNotificationMessage(order, "إتمام"), "Success", order.Id, order.PharmacyId, order.Items.FirstOrDefault()?.CompanyMedicine?.CompanyId);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم الإتمام وخصم المخزن وإرسال التنبيه." });
        }

        // 3. إلغاء الطلب
        [HttpPut("cancel-order/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.PharmacyOrders.Include(o => o.Items).ThenInclude(i => i.CompanyMedicine).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();

            if (order.Status == OrderStatus.Confirmed) return BadRequest(new { message = "لا يمكن إلغاء طلب تم إتمامه وتسليمه." });
            if (order.Status == OrderStatus.Rejected) return BadRequest(new { message = "الطلب ملغي بالفعل." });

            order.Status = OrderStatus.Rejected;

            string? pharmacyUserId = await GetPharmacyUserIdAsync(order.PharmacyId);
            if (pharmacyUserId != null)
            {
                AddNotification(pharmacyUserId, "تنبيه: تم رفض الطلب", BuildNotificationMessage(order, "رفض وإلغاء"), "Danger", order.Id, order.PharmacyId, order.Items.FirstOrDefault()?.CompanyMedicine?.CompanyId);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "تم إلغاء الطلب وإخطار الصيدلية." });
        }


        // عرض جميع الصيدليات اللي طلبت من شركة معينة 
        [HttpGet("my-customers/{companyId}")]
        public async Task<IActionResult> GetMyCustomers(int companyId)
        {
            // المنطق: ابدأ من أصناف الطلبات -> هات الصيدليات اللي طلبت أصناف تخص شركتك
            var customers = await _context.PharmacyOrderItems
                .Where(item => item.CompanyMedicine.CompanyId == companyId)
                .Select(item => item.PharmacyOrder.Pharmacy) // بنوصل للصيدلية من خلال الطلب
                .Distinct() // مصفاة عشان الصيدلية اللي طلبت اكتر من مرة تظهر مرة واحدة بس
                .Select(p => new CompanyCustomerDto
                {
                    Id = p.Id,
                    PharmacyName = p.PharmacyName, // اتأكد من اسم الخاصية في الموديل عندك
                    Address = p.Address,
                    PhoneNumber = p.PhoneNumber,
                    // اختياري لو حابب تحسب هي طلبت كام مرة من شركة
                    TotalOrdersCount = _context.PharmacyOrders
                        .Count(o => o.PharmacyId == p.Id && o.Items.Any(i => i.CompanyMedicine.CompanyId == companyId))
                })
                .ToListAsync();

            return Ok(customers);
        }
    }



}