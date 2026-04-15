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
    public class DrugExchangeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DrugExchangeController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// عرض طلبات التبادل الواردة
        /// </summary>
        [HttpGet("incoming")]
        public async Task<IActionResult> GetIncomingExchanges()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var exchanges = await _context.DrugExchanges
                .Where(de => de.ToPharmacyId == pharmacy.Id)
                .Include(de => de.FromPharmacy)
                .OrderByDescending(de => de.CreatedAt)
                .Select(de => new
                {
                    de.Id,
                    FromPharmacyName = de.FromPharmacy.PharmacyName,
                    FromPharmacyAddress = de.FromPharmacy.Address,
                    de.MedicineName,
                    de.Quantity,
                    de.SuggestedPrice,
                    de.ExpiryDate,
                    de.BatchNumber,
                    de.ExchangeType,
                    ExchangeTypeArabic = GetExchangeTypeArabic(de.ExchangeType),
                    de.Reason,
                    de.Notes,
                    Status = de.Status.ToString(),
                    StatusArabic = GetStatusArabic(de.Status),
                    de.CreatedAt,
                    de.RespondedAt
                })
                .ToListAsync();

            return Ok(new
            {
                TotalExchanges = exchanges.Count,
                PendingCount = exchanges.Count(e => e.Status == "Pending"),
                ApprovedCount = exchanges.Count(e => e.Status == "Approved"),
                RejectedCount = exchanges.Count(e => e.Status == "Rejected"),
                Exchanges = exchanges
            });
        }

        /// <summary>
        /// عرض طلبات التبادل الصادرة
        /// </summary>
        [HttpGet("outgoing")]
        public async Task<IActionResult> GetOutgoingExchanges()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var exchanges = await _context.DrugExchanges
                .Where(de => de.FromPharmacyId == pharmacy.Id)
                .Include(de => de.ToPharmacy)
                .OrderByDescending(de => de.CreatedAt)
                .Select(de => new
                {
                    de.Id,
                    ToPharmacyName = de.ToPharmacy.PharmacyName,
                    ToPharmacyAddress = de.ToPharmacy.Address,
                    de.MedicineName,
                    de.Quantity,
                    de.SuggestedPrice,
                    de.ExchangeType,
                    ExchangeTypeArabic = GetExchangeTypeArabic(de.ExchangeType),
                    Status = de.Status.ToString(),
                    StatusArabic = GetStatusArabic(de.Status),
                    de.ResponseNote,
                    de.CreatedAt,
                    de.RespondedAt
                })
                .ToListAsync();

            return Ok(new
            {
                TotalExchanges = exchanges.Count,
                PendingCount = exchanges.Count(e => e.Status == "Pending"),
                ApprovedCount = exchanges.Count(e => e.Status == "Approved"),
                Exchanges = exchanges
            });
        }

        /// <summary>
        /// إنشاء طلب تبادل جديد
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateExchange([FromBody] CreateDrugExchangeDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var toPharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.Id == dto.ToPharmacyId);

            if (toPharmacy == null)
                return NotFound("الصيدلية المستلمة غير موجودة");

            var exchange = new DrugExchange
            {
                FromPharmacyId = pharmacy.Id,
                ToPharmacyId = dto.ToPharmacyId,
                MedicineName = dto.MedicineName,
                Quantity = dto.Quantity,
                SuggestedPrice = dto.SuggestedPrice,
                ExpiryDate = dto.ExpiryDate,
                BatchNumber = dto.BatchNumber,
                ExchangeType = dto.ExchangeType,
                Reason = dto.Reason,
                Notes = dto.Notes,
                Status = ExchangeStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.DrugExchanges.Add(exchange);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                Message = "تم إرسال طلب التبادل بنجاح",
                ExchangeId = exchange.Id
            });
        }

        /// <summary>
        /// الرد على طلب تبادل
        /// </summary>
        [HttpPost("{id}/respond")]
        public async Task<IActionResult> RespondToExchange(int id, [FromBody] RespondToExchangeDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var exchange = await _context.DrugExchanges
                .FirstOrDefaultAsync(de => de.Id == id && de.ToPharmacyId == pharmacy.Id);

            if (exchange == null)
                return NotFound("طلب التبادل غير موجود");

            if (exchange.Status != ExchangeStatus.Pending)
                return BadRequest("تم الرد على هذا الطلب مسبقاً");

            // تحديث الحالة
            exchange.Status = dto.Approved ? ExchangeStatus.Approved : ExchangeStatus.Rejected;
            exchange.ResponseNote = dto.Note;
            exchange.RespondedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = dto.Approved ? "تمت الموافقة على التبادل" : "تم رفض التبادل" });
        }

        /// <summary>
        /// تحويل حالة التبادل لـ Arabic
        /// </summary>
        private string GetStatusArabic(ExchangeStatus status)
        {
            return status switch
            {
                ExchangeStatus.Pending => "في الانتظار",
                ExchangeStatus.Approved => "موافق عليه",
                ExchangeStatus.Rejected => "مرفوض",
                ExchangeStatus.Completed => "تم التبادل",
                _ => "غير معروف"
            };
        }

        /// <summary>
        /// تحويل نوع التبادل لـ Arabic
        /// </summary>
        private string GetExchangeTypeArabic(string type)
        {
            return type switch
            {
                "Offer" => "عرض",
                "Request" => "طلب",
                "Swap" => "تبادل",
                _ => type
            };
        }
    }

    // DTO لإنشاء طلب تبادل
    public class CreateDrugExchangeDto
    {
        [Required]
        public int ToPharmacyId { get; set; }

        [Required, MaxLength(200)]
        public string MedicineName { get; set; } = null!;

        [Required, Range(1, 100000)]
        public int Quantity { get; set; }

        public decimal? SuggestedPrice { get; set; }
        public DateTime? ExpiryDate { get; set; }

        [MaxLength(50)]
        public string? BatchNumber { get; set; }

        [Required, MaxLength(50)]
        public string ExchangeType { get; set; } = "Offer";

        [MaxLength(500)]
        public string? Reason { get; set; }

        public string? Notes { get; set; }
    }

    // DTO للرد على طلب تبادل
    public class RespondToExchangeDto
    {
        [Required]
        public bool Approved { get; set; }

        public string? Note { get; set; }
    }
}
