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
    public class MedicineRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicineRequestsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// إحصائيات طلبات الأدوية
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetMedicineRequestStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var today = DateTime.Today;

            // الطلبات الجديدة (في انتظار الرد)
            var newRequests = await _context.Prescriptions
                .CountAsync(p => p.Status == PrescriptionStatus.Pending &&
                                p.CreatedAt.Date == today);

            // الطلبات المقبولة اليوم
            var acceptedRequests = await _context.PharmacyResponses
                .CountAsync(r => r.PharmacyId == pharmacy.Id &&
                                r.IsAvailable &&
                                r.RespondedAt.Date == today);

            // إجمالي الطلبات اليوم
            var totalRequests = await _context.Prescriptions
                .CountAsync(p => p.CreatedAt.Date == today);

            return Ok(new
            {
                NewRequests = newRequests,
                AcceptedRequests = acceptedRequests,
                TotalRequests = totalRequests,
                Date = today
            });
        }

        /// <summary>
        /// عرض طلبات الأدوية من المرضى القريبين
        /// </summary>
        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyMedicineRequests()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            // جلب الروشتات اللي لسه مفتوحة
            var prescriptions = await _context.Prescriptions
                .Where(p => p.Status == PrescriptionStatus.Pending)
                .Include(p => p.Patient)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            // فلترة حسب المسافة
            var nearbyRequests = prescriptions
                .Select(p => new
                {
                    p.Id,
                    PatientName = p.PatientName ?? p.Patient.FullName,
                    PatientPhone = p.PhoneNumber ?? p.Patient.PhoneNumber,
                    MedicineTitle = p.Title,
                    Notes = p.Notes,
                    PrescriptionImagePath = p.PrescriptionImagePath,
                    DeliveryAddress = p.DeliveryAddress,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,
                    SearchRadiusKm = p.SearchRadiusKm,
                    AlternativePreference = p.AlternativePreference ?? "PhoneConsultation",
                    CreatedAt = p.CreatedAt,
                    Distance = CalculateDistance(pharmacy.Latitude, pharmacy.Longitude, p.Latitude, p.Longitude),
                    HasResponded = _context.PharmacyResponses.Any(r => r.PrescriptionId == p.Id && r.PharmacyId == pharmacy.Id)
                })
                .Where(p => p.Distance <= p.SearchRadiusKm)
                .OrderBy(p => p.Distance)
                .ToList();

            return Ok(new
            {
                TotalRequests = nearbyRequests.Count,
                PharmacyLocation = new
                {
                    pharmacy.Latitude,
                    pharmacy.Longitude,
                    pharmacy.PharmacyName,
                    pharmacy.Address
                },
                Requests = nearbyRequests
            });
        }

        /// <summary>
        /// الرد على طلب دواء
        /// </summary>
        [HttpPost("{id}/respond")]
        public async Task<IActionResult> RespondToMedicineRequest(int id, [FromBody] RespondToMedicineRequestDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var prescription = await _context.Prescriptions
                .Include(p => p.Patient)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (prescription == null)
                return NotFound("الطلب غير موجود");

            // حفظ الرد
            var response = new PharmacyResponse
            {
                PharmacyId = pharmacy.Id,
                PatientId = prescription.PatientId,
                PrescriptionId = prescription.Id,
                IsAvailable = dto.IsAvailable,
                Price = dto.Price,
                Note = dto.Note,
                RespondedAt = DateTime.UtcNow
            };

            _context.PharmacyResponses.Add(response);

            // تحديث حالة الروشتة
            prescription.Status = PrescriptionStatus.Responded;

            await _context.SaveChangesAsync();

            // ═══════════════════════════════════════════════════════
            // إضافة نقاط للمريض عند القبول
            // ═══════════════════════════════════════════════════════
            
            if (dto.IsAvailable && dto.Price.HasValue)
            {
                var patient = await _context.Users.FindAsync(prescription.PatientId);
                if (patient != null)
                {
                    // كل 100 جنيه = 1 نقطة
                    var pointsEarned = (int)(dto.Price.Value / 100);
                    patient.LoyaltyPoints += pointsEarned;
                    patient.TotalPurchases += dto.Price.Value;
                    
                    // تحديث الخصم (كل نقطة = 1%، حد أقصى 20%)
                    patient.DiscountPercentage = Math.Min(patient.LoyaltyPoints, 20);
                    
                    await _context.SaveChangesAsync();
                }
            }

            // ═══════════════════════════════════════════════════════
            // إشعار للمريض
            // ═══════════════════════════════════════════════════════
            
            // TODO: إرسال إشعار عبر SignalR

            return Ok(new 
            { 
                Message = dto.IsAvailable ? "تم قبول الطلب بنجاح" : "تم رفض الطلب",
                ResponseId = response.Id,
                PointsEarned = dto.IsAvailable ? (int)((dto.Price ?? 0) / 100) : 0
            });
        }

        /// <summary>
        /// حساب المسافة بين نقطتين (Haversine Formula)
        /// </summary>
        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371; // نصف قطر الأرض بالكيلومتر
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }
    }

    // DTO للرد على طلب دواء
    public class RespondToMedicineRequestDto
    {
        /// <summary>
        /// هل الدواء متوفر؟
        /// </summary>
        [Required]
        public bool IsAvailable { get; set; }

        /// <summary>
        /// سعر الدواء (مطلوب إذا متوفر)
        /// </summary>
        public decimal? Price { get; set; }

        /// <summary>
        /// ملاحظات
        /// </summary>
        public string? Note { get; set; }
    }
}
