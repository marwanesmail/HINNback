using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;
using System.Security.Claims;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Pharmacy")]
    public class PharmacyDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PharmacyDashboardController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// لوحة التحكم - تلخيص الأرقام
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);

            // ═══════════════════════════════════════════════════════
            // إحصائيات الروشتات
            // ═══════════════════════════════════════════════════════

            // الروشتات الجديدة اليوم
            var newPrescriptionsToday = await _context.Prescriptions
                .CountAsync(p => p.Status == PrescriptionStatus.Pending &&
                                p.CreatedAt.Date == today);

            // في انتظار المراجعة
            var pendingReview = await _context.PharmacyResponses
                .CountAsync(r => r.PharmacyId == pharmacy.Id && 
                                r.PatientStatus == ResponsePatientStatus.Pending);

            // الطلبات من مرضى قريبين
            var nearbyPatientRequests = await _context.Prescriptions
                .CountAsync(p => p.Status == PrescriptionStatus.Pending);

            // الروشتات المكتملة اليوم
            var completedToday = await _context.PharmacyResponses
                .CountAsync(r => r.PharmacyId == pharmacy.Id && 
                                r.PatientStatus == ResponsePatientStatus.Accepted &&
                                r.RespondedAt.Date == today);

            // ═══════════════════════════════════════════════════════
            // إحصائيات المخزون (محتاجين نعمل Inventory Model بعدين)
            // ═══════════════════════════════════════════════════════

            var lowStockItems = 3; // مثال - هيتغير لما نعمل Inventory
            var needsReorder = 3;  // مثال
            var totalInventoryValue = 0m; // مثال

            // ═══════════════════════════════════════════════════════
            // إحصائيات تبادل الأدوية
            // ═══════════════════════════════════════════════════════

            var exchangeRequests = 1; // مثال - من صيدليات أخرى

            // ═══════════════════════════════════════════════════════
            // إحصائيات المبيعات
            // ═══════════════════════════════════════════════════════

            // إجمالي المبيعات هذا الشهر
            var monthlySales = await _context.PharmacyResponses
                .Where(r => r.PharmacyId == pharmacy.Id && 
                           r.PatientStatus == ResponsePatientStatus.Accepted &&
                           r.RespondedAt >= startOfMonth &&
                           r.Price.HasValue)
                .SumAsync(r => r.Price.Value);

            // المبيعات اليوم
            var todaySales = await _context.PharmacyResponses
                .Where(r => r.PharmacyId == pharmacy.Id && 
                           r.PatientStatus == ResponsePatientStatus.Accepted &&
                           r.RespondedAt.Date == today &&
                           r.Price.HasValue)
                .SumAsync(r => r.Price.Value);

            // ═══════════════════════════════════════════════════════
            // الروشتات الحديثة
            // ═══════════════════════════════════════════════════════

            var recentPrescriptions = await _context.Prescriptions
                .Where(p => p.Status == PrescriptionStatus.Pending || p.Status == PrescriptionStatus.Responded)
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    PatientName = p.Patient.FullName,
                    DoctorName = p.Doctor.FullName,
                    MedicineCount = 2, // مثال - هيتغير
                    Status = p.Status.ToString(),
                    StatusArabic = p.Status == PrescriptionStatus.Pending ? "في الانتظار" : "قيد التحضير",
                    TotalPrice = 85.50m, // مثال
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                // بطاقات الإحصائيات
                Stats = new
                {
                    NewPrescriptions = newPrescriptionsToday,
                    PendingReview = pendingReview,
                    NearbyPatientRequests = nearbyPatientRequests,
                    LowStockItems = lowStockItems,
                    NeedsReorder = needsReorder,
                    ExchangeRequests = exchangeRequests,
                    MonthlySales = monthlySales,
                    TodaySales = todaySales,
                    TotalInventoryValue = totalInventoryValue,
                    CompletedToday = completedToday
                },

                // الروشتات الحديثة
                RecentPrescriptions = recentPrescriptions
            });
        }
    }
}
