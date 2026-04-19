using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;
using MyHealthcareApi.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Doctor")] // الطبيب بس
    public class DoctorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public DoctorController(
            AppDbContext context,
            UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
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
            var doctorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (doctorId == null) return Unauthorized();

            var availabilities = new List<DoctorAvailability>();

            // إنشاء موعد لكل يوم في النطاق
            var currentDate = dto.StartDate.Date;
            var endDate = dto.EndDate.Date;

            while (currentDate <= endDate)
            {
                // تخطي الأيام اللي الدكتور مش متاح فيها
                if (dto.ExcludedDates?.Any(d => d.Date == currentDate.Date) == true)
                {
                    currentDate = currentDate.AddDays(1);
                    continue;
                }

                // إنشاء مواعد لكل وقت
                foreach (var timeSlot in dto.TimeSlots)
                {
                    var availability = new DoctorAvailability
                    {
                        DoctorId = doctorId,
                        Date = currentDate,
                        StartTime = timeSlot.StartTime,
                        EndTime = timeSlot.EndTime,
                        DurationMinutes = dto.DurationMinutes,
                        ConsultationFee = dto.ConsultationFee,
                        AppointmentType = dto.AppointmentType ?? "كشف",
                        Location = dto.Location,
                        Notes = dto.Notes,
                        IsAvailable = true
                    };

                    availabilities.Add(availability);
                }

                currentDate = currentDate.AddDays(1);
            }

            _context.DoctorAvailabilities.AddRange(availabilities);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                Message = $"تم إضافة {availabilities.Count} موعد متاح",
                Count = availabilities.Count
            });
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
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }
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
}

