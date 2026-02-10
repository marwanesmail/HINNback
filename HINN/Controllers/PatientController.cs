using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Hubs;
using MyHealthcareApi.Models;
using MyHealthcareApi.Services;
using MyHealthcareApi.Constants;
using System.Security.Claims;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Patient")] // المريض بس اللي يقدر يستخدمه
    public class PatientController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IHubContext<NotificationsHub> _hubContext;
        private readonly IWebHostEnvironment _env;
        private readonly GeoLocationService _geoService;

        public PatientController(
            AppDbContext context,
            UserManager<AppUser> userManager,
            IHubContext<NotificationsHub> hubContext,
            IWebHostEnvironment env,
            GeoLocationService geoService)
        {
            _context = context;
            _userManager = userManager;
            _hubContext = hubContext;
            _env = env;
            _geoService = geoService;
        }

        //  المريض يرفع روشتة أو يبحث عن دواء
        [HttpPost("request-medicine")]
        public async Task<IActionResult> RequestMedicine([FromForm] PrescriptionRequestDto dto)
        {
            var patientId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (patientId == null) return Unauthorized();

            // حفظ صورة الروشتة لو موجودة
            string? imagePath = null;
            if (dto.PrescriptionImage != null)
            {
                imagePath = await SaveFile(dto.PrescriptionImage);
            }

            // إنشاء الروشتة
            var prescription = new Prescription
            {
                PatientId = patientId,
                Title = dto.Title,
                Notes = dto.Notes,
                PrescriptionImagePath = imagePath,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                SearchRadiusKm = dto.SearchRadiusKm,
                Status = PrescriptionStatus.Pending
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            // إرسال إشعارات للصيدليات القريبة
            await NotifyNearbyPharmacies(prescription);

            return Ok(new 
            { 
                Message = "تم إرسال طلبك للصيدليات القريبة",
                PrescriptionId = prescription.Id,
                PharmaciesNotified = await GetNearbyPharmaciesCount(dto.Latitude, dto.Longitude, dto.SearchRadiusKm)
            });
        }

        //  البحث عن دواء بالاسم (للمريض)
        [HttpPost("search-medicine")]
        public async Task<IActionResult> SearchMedicine([FromBody] MedicineSearchDto dto)
        {
            var patientId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (patientId == null) return Unauthorized();

            // إنشاء روشتة مبسطة للبحث
            var prescription = new Prescription
            {
                PatientId = patientId,
                Title = dto.MedicineName,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                SearchRadiusKm = dto.SearchRadiusKm,
                Status = PrescriptionStatus.Pending
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            // إرسال إشعار للصيدليات القريبة
            var nearbyPharmacies = await GetNearbyPharmacies(dto.Latitude, dto.Longitude, dto.SearchRadiusKm);
            
            foreach (var pharmacy in nearbyPharmacies)
            {
                await _hubContext.Clients
                    .Group(NotificationsHub.GetPharmacyGroup(pharmacy.Id))
                    .SendAsync("NewPrescriptionRequest", new
                    {
                        PrescriptionId = prescription.Id,
                        MedicineName = dto.MedicineName,
                        PatientLocation = new { dto.Latitude, dto.Longitude },
                        Distance = _geoService.CalculateDistance(pharmacy.Latitude, pharmacy.Longitude, dto.Latitude, dto.Longitude)
                    });
            }

            return Ok(new
            {
                Message = "تم إرسال طلبك للصيدليات القريبة",
                PrescriptionId = prescription.Id,
                PharmaciesNotified = nearbyPharmacies.Count
            });
        }

        //  المريض يشوف ردود الصيدليات على طلب معين
        [HttpGet("my-responses/{prescriptionId}")]
        public async Task<IActionResult> GetResponses(int prescriptionId)
        {
            var patientId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (patientId == null) return Unauthorized();

            var prescription = await _context.Prescriptions
                .FirstOrDefaultAsync(p => p.Id == prescriptionId && p.PatientId == patientId);

            if (prescription == null)
                return NotFound("الروشتة غير موجودة");

            var responses = await _context.PharmacyResponses
                .Where(r => r.PrescriptionId == prescriptionId)
                .Include(r => r.Pharmacy)
                .OrderBy(r => r.RespondedAt)
                .Select(r => new
                {
                    r.Id,
                    PharmacyName = r.Pharmacy.PharmacyName,
                    r.Pharmacy.Address,
                    Distance = _geoService.CalculateDistance(r.Pharmacy.Latitude, r.Pharmacy.Longitude, prescription.Latitude, prescription.Longitude),
                    r.IsAvailable,
                    r.Price,
                    r.Note,
                    r.RespondedAt
                })
                .ToListAsync();

            return Ok(responses);
        }

        //  المريض يشوف كل طلباته
        [HttpGet("my-prescriptions")]
        public async Task<IActionResult> GetMyPrescriptions()
        {
            var patientId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (patientId == null) return Unauthorized();

            var prescriptions = await _context.Prescriptions
                .Where(p => p.PatientId == patientId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Status,
                    p.CreatedAt,
                    ResponsesCount = p.Responses!.Count
                })
                .ToListAsync();

            return Ok(prescriptions);
        }

        //  المريض يختار صيدلية (يخلص الطلب)
        [HttpPost("select-pharmacy/{responseId}")]
        public async Task<IActionResult> SelectPharmacy(int responseId)
        {
            var patientId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (patientId == null) return Unauthorized();

            var response = await _context.PharmacyResponses
                .Include(r => r.Prescription)
                .FirstOrDefaultAsync(r => r.Id == responseId && r.PatientId == patientId);

            if (response == null)
                return NotFound("الرد غير موجود");

            if (response.Prescription != null)
            {
                response.Prescription.Status = PrescriptionStatus.Completed;
                await _context.SaveChangesAsync();
            }

            // إشعار للصيدلية إن المريض اختارها
            await _hubContext.Clients
                .Group(NotificationsHub.GetPharmacyGroup(response.PharmacyId))
                .SendAsync("PharmacySelected", new
                {
                    PrescriptionId = response.PrescriptionId,
                    PatientId = patientId,
                    Message = "المريض اختار صيدليتك للطلب"
                });

            return Ok(new { Message = "تم اختيار الصيدلية بنجاح" });
        }

        //  دوال مساعدة
        private async Task NotifyNearbyPharmacies(Prescription prescription)
        {
            var nearbyPharmacies = await GetNearbyPharmacies(
                prescription.Latitude, 
                prescription.Longitude, 
                prescription.SearchRadiusKm);

            foreach (var pharmacy in nearbyPharmacies)
            {
                await _hubContext.Clients
                    .Group(NotificationsHub.GetPharmacyGroup(pharmacy.Id))
                    .SendAsync("NewPrescriptionRequest", new
                    {
                        PrescriptionId = prescription.Id,
                        Title = prescription.Title,
                        HasImage = !string.IsNullOrEmpty(prescription.PrescriptionImagePath),
                        PatientLocation = new { prescription.Latitude, prescription.Longitude },
                        Distance = _geoService.CalculateDistance(pharmacy.Latitude, pharmacy.Longitude, prescription.Latitude, prescription.Longitude)
                    });
            }
        }

        private async Task<List<Pharmacy>> GetNearbyPharmacies(double lat, double lon, double radiusKm)
        {
            var pharmacies = await _context.Pharmacies
                .Where(p => p.IsApproved)
                .ToListAsync();

            return pharmacies
                .Where(p => _geoService.CalculateDistance(p.Latitude, p.Longitude, lat, lon) <= radiusKm)
                .ToList();
        }

        private async Task<int> GetNearbyPharmaciesCount(double lat, double lon, double radiusKm)
        {
            var pharmacies = await GetNearbyPharmacies(lat, lon, radiusKm);
            return pharmacies.Count;
        }

        private async Task<string> SaveFile(IFormFile file)
        {
            if (file == null || file.Length == 0) return string.Empty;

            var folderPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "prescriptions");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/prescriptions/{fileName}";
        }
    }
}
