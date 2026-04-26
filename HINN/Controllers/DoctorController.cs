using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Hubs;
using MyHealthcareApi.Models;
using MyHealthcareApi.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Doctor")] // الطبيب بس
    public partial class DoctorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IWebHostEnvironment _env;
        private readonly IHubContext<NotificationsHub> _hubContext;

        public DoctorController(
            AppDbContext context,
            UserManager<AppUser> userManager,
            IWebHostEnvironment env,
            IHubContext<NotificationsHub> hubContext)
        {
            _context = context;
            _userManager = userManager;
            _env = env;
            _hubContext = hubContext;
        }

        //  إدارة الروشتات

        /// كتابة روشتة جديدة لمريض
        [HttpPost("prescriptions")]
        public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionDto dto)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            // التحقق من إن المريض موجود
            var patient = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == dto.PatientId);

            if (patient == null)
                return BadRequest("المريض غير موجود");

            // التحقق من إن المريض فعلاً Patient
            var isPatient = await _context.Users
                .AnyAsync(u => u.Id == dto.PatientId && 
                              _context.Patients.Any(p => p.AppUserId == u.Id));

            if (!isPatient)
                return BadRequest("المستخدم المحدد ليس مريضاً");

            var prescription = new Prescription
            {
                PatientId = dto.PatientId,
                DoctorId = doctorId,
                Title = dto.Title,
                Notes = dto.Notes,
                PrescriptionImagePath = dto.PrescriptionImagePath,
                VisitDate = dto.VisitDate ?? DateTime.UtcNow,
                Diagnosis = dto.Diagnosis,
                SpecialInstructions = dto.SpecialInstructions,
                PrescriptionType = dto.PrescriptionType ?? "Normal",
                ValidityDays = dto.ValidityDays ?? 30,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                SearchRadiusKm = dto.SearchRadiusKm ?? 5,
                Status = PrescriptionStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            // TODO: إرسال إشعار للمريض إن فيه روشتة جديدة

            return Ok(new
            {
                Message = "تم كتابة الروشتة بنجاح",
                PrescriptionId = prescription.Id,
                PatientName = patient.FullName
            });
        }

        /// عرض كل الروشتات اللي الدكتور كتبها
        [HttpGet("prescriptions")]
        public async Task<IActionResult> GetMyPrescriptions([FromQuery] string? status = null)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            var query = _context.Prescriptions
                .Include(p => p.Patient)
                .Where(p => p.DoctorId == doctorId)
                .AsQueryable();

            // فلترة حسب الحالة
            if (!string.IsNullOrEmpty(status))
            {
                if (Enum.TryParse<PrescriptionStatus>(status, true, out var statusEnum))
                {
                    query = query.Where(p => p.Status == statusEnum);
                }
            }

            var prescriptions = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            var response = prescriptions.Select(p => new PrescriptionResponseDto
            {
                Id = p.Id,
                PatientId = p.PatientId,
                PatientName = p.Patient?.FullName ?? "غير معروف",
                DoctorId = p.DoctorId,
                DoctorName = p.Doctor?.FullName ?? "غير معروف",
                Title = p.Title,
                Notes = p.Notes,
                Diagnosis = p.Diagnosis,
                VisitDate = p.VisitDate,
                PrescriptionType = p.PrescriptionType,
                SpecialInstructions = p.SpecialInstructions,
                Status = p.Status.ToString(),
                StatusArabic = p.Status switch
                {
                    PrescriptionStatus.Pending => "جديد",
                    PrescriptionStatus.Responded => "قيد التنفيذ",
                    PrescriptionStatus.Completed => "مكتمل",
                    PrescriptionStatus.Cancelled => "ملغي",
                    _ => p.Status.ToString()
                },
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                ValidityDays = p.ValidityDays
            }).ToList();

            return Ok(new
            {
                TotalPrescriptions = response.Count,
                Prescriptions = response
            });
        }

        /// عرض تفاصيل روشتة معينة
        [HttpGet("prescriptions/{id}")]
        public async Task<IActionResult> GetPrescription(int id)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            var prescription = await _context.Prescriptions
                .Include(p => p.Patient)
                .Include(p => p.Doctor)
                .Include(p => p.Responses)
                .FirstOrDefaultAsync(p => p.Id == id && p.DoctorId == doctorId);

            if (prescription == null)
                return NotFound("الروشتة غير موجودة");

            var response = new PrescriptionDetailResponseDto
            {
                Id = prescription.Id,
                PatientId = prescription.PatientId,
                PatientName = prescription.Patient?.FullName ?? "غير معروف",
                PatientPhone = prescription.Patient?.PhoneNumber,
                DoctorId = prescription.DoctorId,
                DoctorName = prescription.Doctor?.FullName ?? "غير معروف",
                Title = prescription.Title,
                Notes = prescription.Notes,
                Diagnosis = prescription.Diagnosis,
                VisitDate = prescription.VisitDate,
                PrescriptionType = prescription.PrescriptionType,
                SpecialInstructions = prescription.SpecialInstructions,
                Status = prescription.Status.ToString(),
                StatusArabic = prescription.Status switch
                {
                    PrescriptionStatus.Pending => "جديد",
                    PrescriptionStatus.Responded => "قيد التنفيذ",
                    PrescriptionStatus.Completed => "مكتمل",
                    PrescriptionStatus.Cancelled => "ملغي",
                    _ => prescription.Status.ToString()
                },
                IsActive = prescription.IsActive,
                CreatedAt = prescription.CreatedAt,
                ValidityDays = prescription.ValidityDays,
                PharmacyResponsesCount = prescription.Responses?.Count ?? 0,
                Responses = prescription.Responses?.Select(r => new PharmacyResponseDto
                {
                    Id = r.Id,
                    PharmacyName = r.Pharmacy?.PharmacyName ?? "غير معروف",
                    MedicineName = r.MedicineName,
                    IsAvailable = r.IsAvailable,
                    Price = r.Price,
                    Note = r.Note,
                    RespondedAt = r.RespondedAt,
                    PatientStatus = r.PatientStatus.ToString()
                }).ToList()
            };

            return Ok(response);
        }

        /// تحديث حالة الروشتة
        [HttpPut("prescriptions/{id}/status")]
        public async Task<IActionResult> UpdatePrescriptionStatus(int id, [FromBody] UpdatePrescriptionStatusDto dto)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            var prescription = await _context.Prescriptions
                .FirstOrDefaultAsync(p => p.Id == id && p.DoctorId == doctorId);

            if (prescription == null)
                return NotFound("الروشتة غير موجودة");

            prescription.Status = dto.Status;
            await _context.SaveChangesAsync();

            // TODO: إرسال إشعار للمريض بتحديث حالة الروشتة

            return Ok(new { Message = "تم تحديث حالة الروشتة بنجاح" });
        }

        //  إدارة المواعيد

        /// عرض مواعيد الدكتور
        [HttpGet("appointments")]
        public async Task<IActionResult> GetMyAppointments([FromQuery] string? status = null)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            var query = _context.Appointments
                .Include(a => a.Patient)
                .Where(a => a.DoctorId == doctorId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                if (Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
                {
                    query = query.Where(a => a.Status == statusEnum);
                }
            }

            var appointments = await query
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            var response = appointments.Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                AppointmentType = a.AppointmentType,
                Specialty = a.Specialty,
                Status = a.Status.ToString(),
                StatusArabic = a.Status switch
                {
                    AppointmentStatus.Upcoming => "قادم",
                    AppointmentStatus.Completed => "مكتمل",
                    AppointmentStatus.Cancelled => "ملغي",
                    AppointmentStatus.NoShow => "لم يحضر",
                    _ => a.Status.ToString()
                },
                PatientId = a.PatientId,
                PatientName = a.Patient?.FullName ?? "غير معروف",
                PatientNotes = a.PatientNotes,
                DoctorNotes = a.DoctorNotes,
                Diagnosis = a.Diagnosis,
                CreatedAt = a.CreatedAt
            }).ToList();

            return Ok(new
            {
                TotalAppointments = response.Count,
                Appointments = response
            });
        }

        /// تحديث حالة الموعد وإضافة ملاحظات الطبيب
        [HttpPut("appointments/{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateAppointmentDto dto)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == doctorId);

            if (appointment == null)
                return NotFound("الموعد غير موجود");

            if (dto.AppointmentDate.HasValue)
                appointment.AppointmentDate = dto.AppointmentDate.Value;

            if (dto.AppointmentTime.HasValue)
                appointment.AppointmentTime = dto.AppointmentTime.Value;

            if (dto.AppointmentType != null)
                appointment.AppointmentType = dto.AppointmentType;

            if (dto.DoctorNotes != null)
                appointment.DoctorNotes = dto.DoctorNotes;

            if (dto.Diagnosis != null)
                appointment.Diagnosis = dto.Diagnosis;

            if (dto.Prescription != null)
                appointment.Prescription = dto.Prescription;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تحديث الموعد بنجاح" });
        }

        //  إدارة المواعيد المتاحة

        /// إضافة مواعيد متاحة للحجز
        [HttpPost("availability")]
        public async Task<IActionResult> AddAvailability([FromBody] AddAvailabilityDto dto)
        {
            try 
            {
                var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (doctorId == null) return Unauthorized();

                var availabilities = new List<DoctorAvailability>();

                // إنشاء موعد لكل يوم في النطاق
                var currentDate = dto.StartDate.Date;
                var endDate = dto.EndDate.Date;

                while (currentDate <= endDate)
                {
                    // تخطي الأيام اللي الدكتور مش متاح فيها
                    if (dto.ExcludedDates?.Any(d => d.Date.Date == currentDate.Date) == true)
                    {
                        currentDate = currentDate.AddDays(1);
                        continue;
                    }

                    // إنشاء مواعد لكل وقت
                    foreach (var timeSlot in dto.TimeSlots)
                    {
                        // محاولة تحويل الوقت بشكل مرن
                        if (!TryParseFlexibleTime(timeSlot.StartTime, out TimeSpan startTime) ||
                            !TryParseFlexibleTime(timeSlot.EndTime, out TimeSpan endTime))
                        {
                            return BadRequest($"صيغة الوقت غير صحيحة: {timeSlot.StartTime} أو {timeSlot.EndTime}. يرجى استخدام صيغة HH:mm أو أرقام الساعات.");
                        }

                        var availability = new DoctorAvailability
                        {
                            DoctorId = doctorId,
                            Date = currentDate,
                            StartTime = startTime,
                            EndTime = endTime,
                            DurationMinutes = dto.DurationMinutes,
                            ConsultationFee = dto.ConsultationFee,
                            AppointmentType = dto.AppointmentType ?? "كشف",
                            Location = dto.Location,
                            Notes = dto.Notes,
                            IsAvailable = true,
                            CreatedAt = DateTime.UtcNow
                        };

                        availabilities.Add(availability);
                    }

                    currentDate = currentDate.AddDays(1);
                }

                if (availabilities.Count > 0)
                {
                    _context.DoctorAvailabilities.AddRange(availabilities);
                    await _context.SaveChangesAsync();
                }

                return Ok(new 
                { 
                    Message = $"تم إضافة {availabilities.Count} موعد متاح",
                    Count = availabilities.Count
                });
            }
            catch (Exception ex)
            {
                // إرجاع تفاصيل الخطأ للمساعدة في التصحيح
                return StatusCode(500, new { 
                    Error = "حدث خطأ أثناء حفظ المواعيد", 
                    Details = ex.Message,
                    InnerException = ex.InnerException?.Message 
                });
            }
        }

        /// عرض مواعيدي المتاحة
        [HttpGet("availability")]
        public async Task<IActionResult> GetMyAvailability([FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            var query = _context.DoctorAvailabilities
                .Include(da => da.BookedByPatient)
                .Where(da => da.DoctorId == doctorId);

            if (fromDate.HasValue)
                query = query.Where(da => da.Date >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(da => da.Date <= toDate.Value);

            var availabilities = await query
                .OrderBy(da => da.Date)
                .ThenBy(da => da.StartTime)
                .ToListAsync();

            var response = availabilities.Select(a => new AvailabilityResponseDto
            {
                Id = a.Id,
                Date = a.Date,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                DurationMinutes = a.DurationMinutes,
                IsAvailable = a.IsAvailable,
                BookedByPatientId = a.BookedByPatientId,
                BookedByPatientName = a.BookedByPatient?.FullName,
                ConsultationFee = a.ConsultationFee,
                AppointmentType = a.AppointmentType,
                Location = a.Location,
                BookedAt = a.BookedAt
            }).ToList();

            return Ok(new
            {
                TotalSlots = response.Count,
                AvailableSlots = response.Count(a => a.IsAvailable),
                BookedSlots = response.Count(a => !a.IsAvailable),
                Availabilities = response
            });
        }

        private bool TryParseFlexibleTime(string timeStr, out TimeSpan result)
        {
            result = TimeSpan.Zero;
            if (string.IsNullOrWhiteSpace(timeStr)) return false;

            // 1. محاولة Parse كـ TimeSpan كامل (02:00:00)
            if (TimeSpan.TryParse(timeStr, out result)) return true;

            // 2. محاولة Parse كـ DateTime (2:00 PM) ثم استخراج الوقت
            if (DateTime.TryParse(timeStr, out DateTime dt))
            {
                result = dt.TimeOfDay;
                return true;
            }

            // 3. محاولة Parse كرقم مجرد (مثلاً "2" تعني الساعة 2 صباحاً)
            if (int.TryParse(timeStr, out int hour) && hour >= 0 && hour <= 23)
            {
                result = new TimeSpan(hour, 0, 0);
                return true;
            }

            return false;
        }
    }

    // DTOs

    public class CreatePrescriptionDto
    {
        [Required]
        public string PatientId { get; set; } = null!;

        [Required, MaxLength(500)]
        public string Title { get; set; } = null!;

        public string? Notes { get; set; }
        public string? PrescriptionImagePath { get; set; }
        public DateTime? VisitDate { get; set; }
        public string? Diagnosis { get; set; }
        public string? SpecialInstructions { get; set; }
        public string? PrescriptionType { get; set; } = "Normal";
        public int? ValidityDays { get; set; } = 30;
        
        // لتحديد نطاق البحث عن صيدليات
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double? SearchRadiusKm { get; set; } = 5;
    }

    public class UpdatePrescriptionStatusDto
    {
        [Required]
        public PrescriptionStatus Status { get; set; }
    }

    public class PrescriptionResponseDto
    {
        public int Id { get; set; }
        public string PatientId { get; set; } = null!;
        public string PatientName { get; set; } = null!;
        public string DoctorId { get; set; } = null!;
        public string DoctorName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Notes { get; set; }
        public string? Diagnosis { get; set; }
        public DateTime? VisitDate { get; set; }
        public string? PrescriptionType { get; set; }
        public string? SpecialInstructions { get; set; }
        public string Status { get; set; } = null!;
        public string StatusArabic { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? ValidityDays { get; set; }
    }

    public class PrescriptionDetailResponseDto
    {
        public int Id { get; set; }
        public string PatientId { get; set; } = null!;
        public string PatientName { get; set; } = null!;
        public string? PatientPhone { get; set; }
        public string DoctorId { get; set; } = null!;
        public string DoctorName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Notes { get; set; }
        public string? Diagnosis { get; set; }
        public DateTime? VisitDate { get; set; }
        public string? PrescriptionType { get; set; }
        public string? SpecialInstructions { get; set; }
        public string Status { get; set; } = null!;
        public string StatusArabic { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? ValidityDays { get; set; }
        public int PharmacyResponsesCount { get; set; }
        public List<PharmacyResponseDto>? Responses { get; set; }
    }

    public class PharmacyResponseDto
    {
        public int Id { get; set; }
        public string PharmacyName { get; set; } = null!;
        public string? MedicineName { get; set; }
        public bool IsAvailable { get; set; }
        public decimal? Price { get; set; }
        public string? Note { get; set; }
        public DateTime RespondedAt { get; set; }
        public string PatientStatus { get; set; } = null!;
    }

    // DTOs للـ Availability

    public class AddAvailabilityDto
    {
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public List<TimeSlotDto> TimeSlots { get; set; } = new();

        [Required, Range(15, 120)]
        public int DurationMinutes { get; set; } = 30;

        [Required, Range(0, 10000)]
        public decimal ConsultationFee { get; set; }

        public string? AppointmentType { get; set; } = "كشف";
        public string? Location { get; set; }
        public string? Notes { get; set; }

        /// أيام مستثناة (الدكتور مش متاح فيها)
        public List<ExcludedDateDto>? ExcludedDates { get; set; }
    }

    public class TimeSlotDto
    {
        [Required]
        public string StartTime { get; set; } = null!;

        [Required]
        public string EndTime { get; set; } = null!;
    }

    public class ExcludedDateDto
    {
        [Required]
        public DateTime Date { get; set; }

        public string? Reason { get; set; }
    }

    public class AvailabilityResponseDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsAvailable { get; set; }
        public string? BookedByPatientId { get; set; }
        public string? BookedByPatientName { get; set; }
        public decimal ConsultationFee { get; set; }
        public string AppointmentType { get; set; } = null!;
        public string? Location { get; set; }
        public DateTime? BookedAt { get; set; }
    }

    public class AddPatientDto
    {
        [Required(ErrorMessage = "الاسم الكامل مطلوب")]
        public string FullName { get; set; } = null!;

        [Required(ErrorMessage = "العمر مطلوب")]
        [Range(1, 150, ErrorMessage = "العمر يجب أن يكون بين 1 و 150")]
        public int Age { get; set; }

        [Required(ErrorMessage = "رقم الهاتف مطلوب")]
        [Phone(ErrorMessage = "رقم الهاتف غير صالح")]
        public string PhoneNumber { get; set; } = null!;
    }
}

// ═══════════════════════════════════════════════════════
// NEW ENDPOINTS — added below existing code
// ═══════════════════════════════════════════════════════

namespace MyHealthcareApi.Controllers
{
    public partial class DoctorController
    {
        // ── A: Profile ──────────────────────────────────────────

        /// <summary>
        /// Returns the full doctor profile matching DoctorProfilePage and DoctorSettingsSection fields.
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _context.Doctors
                .Include(d => d.AppUser)
                .FirstOrDefaultAsync(d => d.AppUserId == userId);

            if (doctor == null) return NotFound("الطبيب غير موجود");

            return Ok(new DoctorProfileResponseDto
            {
                Id = userId,
                FullName = doctor.AppUser.FullName ?? string.Empty,
                Email = doctor.AppUser.Email ?? string.Empty,
                Phone = doctor.AppUser.PhoneNumber,
                Specialization = doctor.Specialty,
                LicenseNumber = doctor.LicenseImageUrl,
                ProfileImagePath = doctor.ProfileImagePath,
                Bio = doctor.Bio,
                YearsOfExperience = doctor.ExperienceYears,
                ClinicName = doctor.ClinicName,
                Address = doctor.ClinicAddress,
                ClinicPhone = doctor.ClinicPhone,
                ConsultationFee = doctor.ConsultationFee,
                ConsultationType = doctor.ConsultationType,
                SessionDuration = doctor.SessionDurationMinutes,
                Latitude = doctor.Latitude,
                Longitude = doctor.Longitude,
                Rating = doctor.Rating,
                RatingCount = doctor.RatingCount,
                IsApproved = doctor.IsApproved
            });
        }

        /// <summary>
        /// Updates doctor profile fields from DoctorSettingsSection (personal + clinic tabs).
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateDoctorProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _context.Doctors
                .Include(d => d.AppUser)
                .FirstOrDefaultAsync(d => d.AppUserId == userId);

            if (doctor == null) return NotFound("الطبيب غير موجود");

            // Update AppUser name/phone
            if (!string.IsNullOrEmpty(dto.FullName))
                doctor.AppUser.FullName = dto.FullName;
            if (!string.IsNullOrEmpty(dto.Phone))
                doctor.AppUser.PhoneNumber = dto.Phone;

            // Update Doctor profile fields
            if (!string.IsNullOrEmpty(dto.Specialization)) doctor.Specialty = dto.Specialization;
            if (!string.IsNullOrEmpty(dto.Bio)) doctor.Bio = dto.Bio;
            if (dto.YearsOfExperience > 0) doctor.ExperienceYears = dto.YearsOfExperience;
            if (!string.IsNullOrEmpty(dto.ClinicName)) doctor.ClinicName = dto.ClinicName;
            if (!string.IsNullOrEmpty(dto.Address)) doctor.ClinicAddress = dto.Address;
            if (!string.IsNullOrEmpty(dto.ClinicPhone)) doctor.ClinicPhone = dto.ClinicPhone;
            if (dto.ConsultationFee > 0) doctor.ConsultationFee = dto.ConsultationFee;
            if (!string.IsNullOrEmpty(dto.ConsultationType)) doctor.ConsultationType = dto.ConsultationType;
            if (dto.SessionDuration > 0) doctor.SessionDurationMinutes = dto.SessionDuration;
            if (dto.Latitude != 0) doctor.Latitude = dto.Latitude;
            if (dto.Longitude != 0) doctor.Longitude = dto.Longitude;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "تم تحديث الملف الشخصي بنجاح" });
        }

        /// <summary>
        /// Uploads and stores a doctor profile image to wwwroot/doctors/.
        /// </summary>
        [HttpPost("profile/image")]
        public async Task<IActionResult> UploadProfileImage(IFormFile file)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            if (file == null || file.Length == 0)
                return BadRequest("لم يتم رفع أي ملف");

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.AppUserId == userId);
            if (doctor == null) return NotFound("الطبيب غير موجود");

            var folderPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "doctors");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            doctor.ProfileImagePath = $"/doctors/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { ImagePath = doctor.ProfileImagePath });
        }

        // ── B: Dashboard Stats ───────────────────────────────────

        /// <summary>
        /// Returns aggregated stats for the doctor dashboard matching DashboardSection.jsx fields.
        /// </summary>
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.AppUserId == userId);
            if (doctor == null) return NotFound("الطبيب غير موجود");

            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var totalPatients = await _context.Appointments
                .Where(a => a.DoctorId == userId)
                .Select(a => a.PatientId)
                .Distinct()
                .CountAsync();

            var todayAppointments = await _context.Appointments
                .CountAsync(a => a.DoctorId == userId && a.AppointmentDate.Date == today);

            var tomorrowAppointments = await _context.Appointments
                .CountAsync(a => a.DoctorId == userId && a.AppointmentDate.Date == tomorrow);

            var completedAppointments = await _context.Appointments
                .CountAsync(a => a.DoctorId == userId && a.Status == AppointmentStatus.Completed);

            var pendingAppointments = await _context.Appointments
                .CountAsync(a => a.DoctorId == userId && a.Status == AppointmentStatus.Pending);

            var newPrescriptions = await _context.Prescriptions
                .CountAsync(p => p.DoctorId == userId && p.Status == PrescriptionStatus.Pending);

            // Last 5 prescriptions for the dashboard feed
            var recentPrescriptions = await _context.Prescriptions
                .Where(p => p.DoctorId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    PatientName = p.PatientName,
                    Status = p.Status.ToString(),
                    p.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                TotalPatients = totalPatients,
                TodayAppointments = todayAppointments,
                TomorrowAppointments = tomorrowAppointments,
                CompletedAppointments = completedAppointments,
                PendingAppointments = pendingAppointments,
                NewPrescriptions = newPrescriptions,
                AverageRating = doctor.Rating,
                RecentPrescriptions = recentPrescriptions
            });
        }

        // ── C: Appointment Lifecycle ─────────────────────────────

        /// <summary>
        /// Returns a single appointment with isNewPatient flag.
        /// </summary>
        [HttpGet("appointments/{id}")]
        public async Task<IActionResult> GetAppointmentDetail(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var appt = await _context.Appointments
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == userId);

            if (appt == null) return NotFound("الموعد غير موجود");

            // isNewPatient = first appointment this patient has with any doctor
            var isNew = await _context.Appointments
                .CountAsync(a => a.PatientId == appt.PatientId) == 1;

            var patient = await _context.Users.FindAsync(appt.PatientId);
            var patientProfile = await _context.Patients.FirstOrDefaultAsync(p => p.AppUserId == appt.PatientId);

            int age = 0;
            if (patientProfile?.DateOfBirth != null)
                age = DateTime.Today.Year - patientProfile.DateOfBirth.Value.Year;

            return Ok(new DoctorAppointmentDetailDto
            {
                Id = appt.Id,
                PatientName = patient?.FullName ?? "غير معروف",
                PatientPhone = patient?.PhoneNumber,
                PatientEmail = patient?.Email,
                PatientAge = age,
                Date = appt.AppointmentDate.ToString("yyyy-MM-dd"),
                Time = appt.AppointmentTime.ToString(@"hh\:mm"),
                Duration = appt.AppointmentDate == default ? 30 : 30,
                Reason = appt.PatientNotes,
                Status = MapStatus(appt.Status),
                Notes = appt.DoctorNotes,
                Diagnosis = appt.Diagnosis,
                IsNewPatient = isNew,
                AppointmentType = appt.AppointmentType
            });
        }

        /// <summary>
        /// Confirms a pending appointment (status → "confirmed").
        /// </summary>
        [HttpPut("appointments/{id}/confirm")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var appt = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == userId);

            if (appt == null) return NotFound("الموعد غير موجود");
            if (appt.Status != AppointmentStatus.Pending)
                return BadRequest("يمكن تأكيد المواعيد المعلقة فقط");

            appt.Status = AppointmentStatus.Upcoming;
            await _context.SaveChangesAsync();

            // Notify patient in real-time
            await _hubContext.Clients.User(appt.PatientId)
                .SendAsync("AppointmentConfirmed", new { AppointmentId = id });

            return Ok(new { Message = "تم تأكيد الموعد بنجاح", Status = "confirmed" });
        }

        /// <summary>
        /// Marks an appointment as completed with optional diagnosis and notes.
        /// </summary>
        [HttpPut("appointments/{id}/complete")]
        public async Task<IActionResult> CompleteAppointment(int id, [FromBody] CompleteAppointmentDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var appt = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == userId);

            if (appt == null) return NotFound("الموعد غير موجود");

            appt.Status = AppointmentStatus.Completed;
            appt.CompletedAt = DateTime.UtcNow;
            if (!string.IsNullOrEmpty(dto.Diagnosis)) appt.Diagnosis = dto.Diagnosis;
            if (!string.IsNullOrEmpty(dto.DoctorNotes)) appt.DoctorNotes = dto.DoctorNotes;

            await _context.SaveChangesAsync();

            await _hubContext.Clients.User(appt.PatientId)
                .SendAsync("AppointmentCompleted", new { AppointmentId = id });

            return Ok(new { Message = "تم تسجيل الموعد كمكتمل", Status = "completed" });
        }

        /// <summary>
        /// Cancels an appointment with an optional reason.
        /// </summary>
        [HttpPut("appointments/{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id, [FromBody] CancelAppointmentDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var appt = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == userId);

            if (appt == null) return NotFound("الموعد غير موجود");
            if (appt.Status == AppointmentStatus.Completed)
                return BadRequest("لا يمكن إلغاء موعد مكتمل");

            appt.Status = AppointmentStatus.Cancelled;
            appt.CancellationReason = dto.CancellationReason;
            appt.CancelledAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _hubContext.Clients.User(appt.PatientId)
                .SendAsync("AppointmentCancelled", new { AppointmentId = id, Reason = dto.CancellationReason });

            return Ok(new { Message = "تم إلغاء الموعد", Status = "cancelled" });
        }

        /// <summary>
        /// Marks a patient as a no-show for their appointment.
        /// </summary>
        [HttpPut("appointments/{id}/no-show")]
        public async Task<IActionResult> MarkNoShow(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var appt = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == userId);

            if (appt == null) return NotFound("الموعد غير موجود");

            appt.Status = AppointmentStatus.Cancelled;
            appt.CancellationReason = "المريض لم يحضر";
            appt.CancelledAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "تم تسجيل غياب المريض" });
        }

        // ── D: Availability CRUD ─────────────────────────────────

        /// <summary>
        /// Deletes an availability slot only if it has not been booked.
        /// </summary>
        [HttpDelete("availability/{id}")]
        public async Task<IActionResult> DeleteAvailabilitySlot(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.AppUserId == userId);
            if (doctor == null) return NotFound("الطبيب غير موجود");

            var slot = await _context.DoctorAvailabilities
                .FirstOrDefaultAsync(s => s.Id == id && s.DoctorId == userId);

            if (slot == null) return NotFound("الموعد غير موجود");

            // Prevent deleting a booked slot
            if (!slot.IsAvailable)
                return BadRequest("لا يمكن حذف موعد محجوز");

            _context.DoctorAvailabilities.Remove(slot);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم حذف الموعد بنجاح" });
        }

        /// <summary>
        /// Toggles the IsAvailable flag on an availability slot.
        /// </summary>
        [HttpPut("availability/{id}/toggle")]
        public async Task<IActionResult> ToggleAvailabilitySlot(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.AppUserId == userId);
            if (doctor == null) return NotFound("الطبيب غير موجود");

            var slot = await _context.DoctorAvailabilities
                .FirstOrDefaultAsync(s => s.Id == id && s.DoctorId == userId);

            if (slot == null) return NotFound("الموعد غير موجود");

            slot.IsAvailable = !slot.IsAvailable;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تحديث حالة الموعد", IsAvailable = slot.IsAvailable });
        }

        // ── E: My Patients ───────────────────────────────────────

        /// <summary>
        /// Adds a new patient directly from the Doctor's Dashboard.
        /// </summary>
        [HttpPost("patients")]
        public async Task<IActionResult> AddPatient([FromBody] AddPatientDto dto)
        {
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            // تحقق إذا كان هناك مستخدم بهذا الرقم
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == dto.PhoneNumber);
            
            string patientAppUserId = string.Empty;

            if (existingUser != null)
            {
                if (existingUser.UserType != Models.Enums.UserType.Patient)
                {
                    return BadRequest("رقم الهاتف مسجل لحساب ليس مريضاً.");
                }
                patientAppUserId = existingUser.Id;
            }
            else
            {
                // إنشاء مستخدم جديد
                var newUser = new AppUser
                {
                    UserName = dto.PhoneNumber, // Username is the phone number
                    PhoneNumber = dto.PhoneNumber,
                    FullName = dto.FullName,
                    Email = $"{dto.PhoneNumber}@hinn.local", // Dummy email
                    UserType = Models.Enums.UserType.Patient,
                    EmailConfirmed = true 
                };

                // كلمة مرور افتراضية، يمكن إرسالها للمريض لاحقاً في رسالة
                var result = await _userManager.CreateAsync(newUser, "Hinn@123456");
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                patientAppUserId = newUser.Id;

                // إنشاء بروفايل المريض
                var newPatientProfile = new Patient
                {
                    AppUserId = patientAppUserId,
                    DateOfBirth = DateTime.Today.AddYears(-dto.Age),
                    PhoneNumber = dto.PhoneNumber
                };

                _context.Patients.Add(newPatientProfile);
                await _context.SaveChangesAsync();
            }

            // لربط المريض بالدكتور، ننشئ له موعد "وهمي" أو مجرد أنه مضاف للقائمة
            // بما أن علاقة الطبيب بالمريض تعتمد على الحجوزات والروشتات،
            // يمكننا إنشاء موعد مكتمل فوراً لكي يظهر في القائمة
            var hasRelationship = await _context.Appointments
                .AnyAsync(a => a.DoctorId == doctorId && a.PatientId == patientAppUserId);

            if (!hasRelationship)
            {
                var newAppointment = new Appointment
                {
                    DoctorId = doctorId,
                    PatientId = patientAppUserId,
                    AppointmentDate = DateTime.Today,
                    AppointmentTime = DateTime.Now.TimeOfDay,
                    Status = AppointmentStatus.Completed,
                    AppointmentType = "كشف (إضافة يدوية)",
                    DoctorNotes = "تم إضافته يدوياً بواسطة الطبيب",
                    CreatedAt = DateTime.UtcNow,
                    CompletedAt = DateTime.UtcNow
                };

                _context.Appointments.Add(newAppointment);
                await _context.SaveChangesAsync();
            }

            return Ok(new { Message = "تم إضافة المريض بنجاح" });
        }

        /// <summary>
        /// Returns all unique patients who had appointments with this doctor.
        /// </summary>
        [HttpGet("patients")]
        public async Task<IActionResult> GetMyPatients()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var patients = await _context.Appointments
                .Where(a => a.DoctorId == userId)
                .GroupBy(a => a.PatientId)
                .Select(g => new
                {
                    PatientId = g.Key,
                    TotalAppointments = g.Count(),
                    LastVisitDate = g.Max(a => a.AppointmentDate).ToString("yyyy-MM-dd"),
                    LastVisitStatus = g.OrderByDescending(a => a.AppointmentDate)
                                       .Select(a => a.Status.ToString())
                                       .FirstOrDefault()
                })
                .ToListAsync();

            // Fetch user details for each unique patient
            var result = new List<DoctorPatientSummaryDto>();
            foreach (var p in patients)
            {
                var user = await _context.Users.FindAsync(p.PatientId);
                var profile = await _context.Patients.FirstOrDefaultAsync(pp => pp.AppUserId == p.PatientId);
                int age = 0;
                if (profile?.DateOfBirth != null)
                    age = DateTime.Today.Year - profile.DateOfBirth.Value.Year;

                result.Add(new DoctorPatientSummaryDto
                {
                    PatientId = p.PatientId ?? string.Empty,
                    FullName = user?.FullName ?? "غير معروف",
                    Phone = user?.PhoneNumber,
                    Email = user?.Email,
                    Age = age,
                    TotalAppointments = p.TotalAppointments,
                    LastVisitDate = p.LastVisitDate,
                    LastVisitStatus = p.LastVisitStatus
                });
            }

            return Ok(result);
        }

        /// <summary>
        /// Returns a patient's profile + their full appointment history with this doctor.
        /// </summary>
        [HttpGet("patients/{patientId}")]
        public async Task<IActionResult> GetPatientDetail(string patientId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            // Verify this patient has at least one appointment with this doctor
            var hasRelationship = await _context.Appointments
                .AnyAsync(a => a.DoctorId == userId && a.PatientId == patientId);

            if (!hasRelationship) return NotFound("هذا المريض ليس من مرضاك");

            var user = await _context.Users.FindAsync(patientId);
            var profile = await _context.Patients.FirstOrDefaultAsync(p => p.AppUserId == patientId);
            int age = 0;
            if (profile?.DateOfBirth != null)
                age = DateTime.Today.Year - profile.DateOfBirth.Value.Year;

            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == userId && a.PatientId == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new
                {
                    a.Id,
                    Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    a.AppointmentTime,
                    Status = MapStatus(a.Status),
                    a.Diagnosis,
                    a.DoctorNotes,
                    a.PatientNotes,
                    a.AppointmentType
                })
                .ToListAsync();

            return Ok(new
            {
                PatientId = patientId,
                FullName = user?.FullName ?? "غير معروف",
                Email = user?.Email,
                Phone = user?.PhoneNumber,
                Age = age,
                BloodType = profile?.BloodType,
                Allergies = profile?.Allergies,
                ChronicDiseases = profile?.ChronicDiseases,
                Appointments = appointments
            });
        }

        // ── Helper ───────────────────────────────────────────────

        /// <summary>
        /// Maps backend AppointmentStatus enum to frontend string values.
        /// </summary>
        private static string MapStatus(AppointmentStatus status) => status switch
        {
            AppointmentStatus.Pending   => "pending",
            AppointmentStatus.Upcoming  => "confirmed",
            AppointmentStatus.Completed => "completed",
            AppointmentStatus.Cancelled => "cancelled",
            _ => status.ToString().ToLower()
        };
    }
}
