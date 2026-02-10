using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Hubs;
using MyHealthcareApi.Models;
using MyHealthcareApi.DTOs;
using System.Security.Claims;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Pharmacy")]
    public class PharmacyController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationsHub> _hubContext;
        private readonly IWebHostEnvironment _env;
        private readonly UserManager<AppUser> _userManager;

        public PharmacyController(AppDbContext context, IHubContext<NotificationsHub> hubContext, IWebHostEnvironment env, UserManager<AppUser> userManager)
        {
            _context = context;
            _hubContext = hubContext;
            _env = env;
            _userManager = userManager;
        }

        //   جديدة تسجيل صيدلية
        [HttpPost("register")]
        public async Task<IActionResult> RegisterPharmacy([FromForm] PharmacyRegisterDto dto)
        {
            if (dto == null)
                return BadRequest("البيانات غير مكتملة.");

            //  إنشاء المستخدم الأول
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            //  إضافة الدور المناسب
            await _userManager.AddToRoleAsync(user, "Pharmacy");

            //  رفع صور المستندات
            string licensePath = dto.LicenseImage != null ? await SaveFile(dto.LicenseImage) : string.Empty;
            string taxPath = dto.TaxDocument != null ? await SaveFile(dto.TaxDocument) : string.Empty;

            //  إنشاء كيان الصيدلية في قاعدة البيانات
            var pharmacy = new Pharmacy
            {
                AppUserId = user.Id,
                PharmacyName = dto.PharmacyName,
                Address = dto.Address,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                LicenseImagePath = licensePath,
                TaxDocumentPath = taxPath,
                IsApproved = false // في انتظار موافقة الأدمن
            };

            _context.Pharmacies.Add(pharmacy);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تسجيل الصيدلية بنجاح، بانتظار موافقة الإدارة." });
        }

        //  دالة مساعدة لحفظ الملفات في السيرفر
        private async Task<string> SaveFile(IFormFile file)
        {
            if (file == null || file.Length == 0) return string.Empty;

            var folderPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{fileName}";
        }

        //  الصيدلية تشوف الطلبات المفتوحة القريبة منها
        [HttpGet("nearby-requests")]
        public async Task<IActionResult> GetNearbyRequests()
        {
            var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            // جلب الروشتات اللي لسه مفتوحة والصيدلية ضمن نطاقها
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
                    p.Title,
                    p.Notes,
                    p.PrescriptionImagePath,
                    p.Latitude,
                    p.Longitude,
                    p.SearchRadiusKm,
                    p.CreatedAt,
                    Distance = CalculateDistance(pharmacy.Latitude, pharmacy.Longitude, p.Latitude, p.Longitude)
                })
                .Where(p => p.Distance <= p.SearchRadiusKm)
                .OrderBy(p => p.Distance)
                .ToList();

            return Ok(nearbyRequests);
        }

        //  الصيدلية ترد على طلب (روشتة)
        [HttpPost("respond-to-prescription")]
        public async Task<IActionResult> RespondToPrescription([FromBody] PharmacyResponseRequestDto dto)
        {
            var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var prescription = await _context.Prescriptions
                .Include(p => p.Patient)
                .FirstOrDefaultAsync(p => p.Id == dto.PrescriptionId);

            if (prescription == null)
                return NotFound("الروشتة غير موجودة");

            //  حفظ الرد
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

            //  إشعار للمريض
            await _hubContext.Clients
                .Group(NotificationsHub.GetUserGroup(prescription.PatientId))
                .SendAsync("PharmacyResponseReceived", new
                {
                    PrescriptionId = prescription.Id,
                    PharmacyId = pharmacy.Id,
                    PharmacyName = pharmacy.PharmacyName,
                    PharmacyAddress = pharmacy.Address,
                    Distance = CalculateDistance(pharmacy.Latitude, pharmacy.Longitude, prescription.Latitude, prescription.Longitude),
                    dto.IsAvailable,
                    dto.Price,
                    dto.Note,
                    ResponseId = response.Id
                });

            return Ok(new { message = "تم إرسال الرد بنجاح", ResponseId = response.Id });
        }

        //  الصيدلية تشوف ردودها السابقة
        [HttpGet("my-responses")]
        public async Task<IActionResult> GetMyResponses()
        {
            var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized();

            var pharmacy = await _context.Pharmacies
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pharmacy == null)
                return NotFound("الصيدلية غير موجودة");

            var responses = await _context.PharmacyResponses
                .Where(r => r.PharmacyId == pharmacy.Id)
                .Include(r => r.Prescription)
                .OrderByDescending(r => r.RespondedAt)
                .Select(r => new
                {
                    r.Id,
                    r.PrescriptionId,
                    r.Prescription!.Title,
                    r.IsAvailable,
                    r.Price,
                    r.Note,
                    r.RespondedAt,
                    IsSelected = r.Prescription.Status == PrescriptionStatus.Completed
                })
                .ToListAsync();

            return Ok(responses);
        }

        //  عرض كل الردود المخزنة (للإدارة)
        [HttpGet("responses")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllResponses()
        {
            var responses = await _context.PharmacyResponses
                .Include(r => r.Pharmacy)
                .ToListAsync();

            return Ok(responses);
        }

        //  حساب المسافة
        private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double R = 6371;
            double dLat = (lat2 - lat1) * Math.PI / 180;
            double dLon = (lon2 - lon1) * Math.PI / 180;
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }
    }

}
