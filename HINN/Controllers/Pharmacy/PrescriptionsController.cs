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
    public class PrescriptionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PrescriptionsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// عرض الروشتات المرسلة من الدكاترة
        /// </summary>
        [HttpGet("from-doctors")]
        public async Task<IActionResult> GetPrescriptionsFromDoctors([FromQuery] string? status = null)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var query = _context.Prescriptions
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .Include(p => p.Items)
                .Include(p => p.Responses) // لضمان جلب السعر
                .Where(p => p.DoctorId != null)
                .AsQueryable();

            // فلترة حسب الحالة
            if (!string.IsNullOrEmpty(status))
            {
                if (status == "pending")
                    query = query.Where(p => p.Status == PrescriptionStatus.Pending);
                else if (status == "responded")
                    query = query.Where(p => p.Status == PrescriptionStatus.Responded);
            }

            var prescriptions = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var result = prescriptions.Select(p => new
            {
                id = p.Id,
                patientName = p.PatientName ?? p.Patient?.FullName,
                doctorName = (p.Doctor?.FullName?.StartsWith("د. ") == true) ? p.Doctor.FullName : $"د. {p.Doctor?.FullName}",
                medicines = p.Items.Select(i => $"{i.MedicineName} {i.Dosage}".Trim()).ToList(),
                status = p.Status.ToString(), // "Pending", "Responded", etc.
                points = GetPatientPoints(p.PatientId),
                total = p.Responses?.OrderByDescending(r => r.RespondedAt).FirstOrDefault()?.Price ?? 0,
                date = (p.VisitDate ?? p.CreatedAt).ToString("yyyy-MM-dd"),
                phone = p.PhoneNumber ?? p.Patient?.PhoneNumber,
                notes = p.Notes ?? p.Diagnosis ?? ""
            }).ToList();

            return Ok(new
            {
                TotalPrescriptions = result.Count,
                PendingCount = result.Count(p => p.status == "Pending"),
                RespondedCount = result.Count(p => p.status == "Responded"),
                Prescriptions = result
            });
        }

        /// <summary>
        /// الرد على روشتة من دكتور
        /// </summary>
        [HttpPost("{id}/respond")]
        public async Task<IActionResult> RespondToDoctorPrescription(int id, [FromBody] RespondToPrescriptionDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var prescription = await _context.Prescriptions
                .Include(p => p.Doctor)
                .Include(p => p.Patient)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (prescription == null)
                return NotFound("الروشتة غير موجودة");

            if (prescription.DoctorId == null)
                return BadRequest("هذه روشتة من مريض مش من دكتور");

            // حفظ الرد
            var response = new PharmacyResponse
            {
                PharmacyId = pharmacy.Id,
                PatientId = prescription.PatientId,
                PrescriptionId = prescription.Id,
                IsAvailable = dto.Action == "accept",
                Price = dto.Price,
                Note = dto.Note,
                RespondedAt = DateTime.UtcNow
            };

            _context.PharmacyResponses.Add(response);

            // تحديث حالة الروشتة
            if (dto.Action == "accept")
            {
                prescription.Status = PrescriptionStatus.Responded;
            }

            await _context.SaveChangesAsync();

            // ═══════════════════════════════════════════════════════
            // إضافة نقاط للمريض
            // ═══════════════════════════════════════════════════════
            
            if (dto.Action == "accept" && dto.Price.HasValue)
            {
                // كل 100 جنيه = 1 نقطة
                var pointsEarned = (int)(dto.Price.Value / 100);
                
                // تحديث نقاط المريض (هحتاج PatientPoints field في AppUser)
                // var patient = await _context.Users.FindAsync(prescription.PatientId);
                // patient.LoyaltyPoints += pointsEarned;
                
                // TODO: إرسال إشعار للمريض بالنقاط
            }

            // ═══════════════════════════════════════════════════════
            // إشعار للدكتور والمريض
            // ═══════════════════════════════════════════════════════

            return Ok(new 
            { 
                Message = dto.Action == "accept" ? "تم قبول الروشتة بنجاح" : "تم رفض الروشتة",
                ResponseId = response.Id,
                PointsEarned = dto.Action == "accept" ? (int)((dto.Price ?? 0) / 100) : 0
            });
        }

        /// <summary>
        /// حساب نقاط المريض
        /// </summary>
        private int GetPatientPoints(string patientId)
        {
            // كل عملية شراء = نقاط
            // كل 100 جنيه = 1 نقطة
            var totalPurchases = _context.PharmacyResponses
                .Where(r => r.PatientId == patientId && 
                           r.PatientStatus == ResponsePatientStatus.Accepted &&
                           r.Price.HasValue)
                .Sum(r => (decimal?)r.Price);

            return (int)((totalPurchases ?? 0) / 100);
        }

        /// <summary>
        /// حساب خصم المريض بناءً على النقاط
        /// </summary>
        private decimal GetPatientDiscount(string patientId)
        {
            var points = GetPatientPoints(patientId);
            
            // كل نقطة = خصم 1%
            // حد أقصى 20%
            var discountPercentage = Math.Min(points, 20);
            
            return discountPercentage;
        }
    }

    // DTO للرد على الروشتة
    public class RespondToPrescriptionDto
    {
        /// <summary>
        /// الإجراء: accept, reject, call
        /// </summary>
        [Required]
        public string Action { get; set; } = null!;

        /// <summary>
        /// سعر الدواء (مطلوب للقبول)
        /// </summary>
        public decimal? Price { get; set; }

        /// <summary>
        /// ملاحظات
        /// </summary>
        public string? Note { get; set; }
    }
}
