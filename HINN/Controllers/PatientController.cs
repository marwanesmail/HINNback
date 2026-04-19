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

        // ═══════════════════════════════════════════════════════
        //  إدارة الملف الشخصي للمريض
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// عرض الملف الشخصي الكامل للمريض
        /// </summary>
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("المستخدم غير موجود");

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (patient == null)
                return NotFound("ملف المريض غير موجود");

            var response = new PatientProfileResponseDto
            {
                // بيانات الحساب
                Id = user.Id,
                FullName = user.FullName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                
                // البيانات الشخصية
                PhoneNumber = patient.PhoneNumber ?? user.PhoneNumber,
                Gender = patient.Gender,
                DateOfBirth = patient.DateOfBirth,
                Age = patient.Age,
                
                // البيانات الصحية
                HeightCm = patient.HeightCm,
                WeightKg = patient.WeightKg,
                BMI = patient.BMI,
                BloodType = patient.BloodType,
                Allergies = patient.Allergies,
                ChronicDiseases = patient.ChronicDiseases,
                CurrentMedications = patient.CurrentMedications,
                Surgeries = patient.Surgeries,
                MedicalNotes = patient.MedicalNotes,
                
                // بيانات الطوارئ
                EmergencyContactName = patient.EmergencyContactName,
                EmergencyContactPhone = patient.EmergencyContactPhone,
                
                // معلومات أخرى
                LastMedicalUpdate = patient.LastMedicalUpdate,
                MedicalRecordNumber = patient.MedicalRecordNumber
            };

            return Ok(response);
        }

        /// <summary>
        /// تحديث الملف الشخصي للمريض
        /// </summary>
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdatePatientProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (patient == null)
                return NotFound("ملف المريض غير موجود");

            // تحديث البيانات الشخصية
            if (dto.PhoneNumber != null) patient.PhoneNumber = dto.PhoneNumber;
            if (dto.Gender != null) patient.Gender = dto.Gender;
            if (dto.DateOfBirth.HasValue) patient.DateOfBirth = dto.DateOfBirth.Value;

            // تحديث البيانات الصحية
            if (dto.HeightCm.HasValue) patient.HeightCm = dto.HeightCm.Value;
            if (dto.WeightKg.HasValue) patient.WeightKg = dto.WeightKg.Value;
            if (dto.BloodType != null) patient.BloodType = dto.BloodType;
            if (dto.Allergies != null) patient.Allergies = dto.Allergies;
            if (dto.ChronicDiseases != null) patient.ChronicDiseases = dto.ChronicDiseases;
            if (dto.CurrentMedications != null) patient.CurrentMedications = dto.CurrentMedications;
            if (dto.Surgeries != null) patient.Surgeries = dto.Surgeries;
            if (dto.MedicalNotes != null) patient.MedicalNotes = dto.MedicalNotes;

            // تحديث بيانات الطوارئ
            if (dto.EmergencyContactName != null) patient.EmergencyContactName = dto.EmergencyContactName;
            if (dto.EmergencyContactPhone != null) patient.EmergencyContactPhone = dto.EmergencyContactPhone;

            // تحديث رقم الهاتف في AppUser كمان
            if (dto.PhoneNumber != null)
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    user.PhoneNumber = dto.PhoneNumber;
                    await _userManager.UpdateAsync(user);
                }
            }

            patient.LastMedicalUpdate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تحديث الملف الشخصي بنجاح" });
        }

        /// <summary>
        /// تحديث الوزن والطول فقط (للمتابعة الصحية)
        /// </summary>
        [HttpPut("profile/vitals")]
        public async Task<IActionResult> UpdateVitals([FromBody] UpdateVitalsDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (patient == null)
                return NotFound("ملف المريض غير موجود");

            if (dto.HeightCm.HasValue) patient.HeightCm = dto.HeightCm.Value;
            if (dto.WeightKg.HasValue) patient.WeightKg = dto.WeightKg.Value;

            patient.LastMedicalUpdate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                Message = "تم تحديث البيانات الحيوية بنجاح",
                BMI = patient.BMI
            });
        }

        /// <summary>
        /// عرض إحصائيات لوحة تحكم المريض
        /// </summary>
        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (patient == null)
                return NotFound("ملف المريض غير موجود");

            // ═══════════════════════════════════════════════════════
            // حساب الإحصائيات
            // ═══════════════════════════════════════════════════════

            // الروشتات النشطة
            var activePrescriptions = await _context.Prescriptions
                .CountAsync(p => p.PatientId == userId && 
                                (p.Status == PrescriptionStatus.Pending || 
                                 p.Status == PrescriptionStatus.Responded));

            // عدد الأدوية الحالية
            var medicationsCount = 0;
            if (!string.IsNullOrEmpty(patient.CurrentMedications))
            {
                medicationsCount = patient.CurrentMedications
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Length;
            }

            // المواعيد القادمة (لو Appointment Model موجود)
            var upcomingAppointments = 0;
            var completedVisits = 0;
            var cancelledAppointments = 0;

            // TODO: Uncomment when Appointment Model is added
            // upcomingAppointments = await _context.Appointments
            //     .CountAsync(a => a.PatientId == userId && a.Status == AppointmentStatus.Upcoming);
            // completedVisits = await _context.Appointments
            //     .CountAsync(a => a.PatientId == userId && a.Status == AppointmentStatus.Completed);
            // cancelledAppointments = await _context.Appointments
            //     .CountAsync(a => a.PatientId == userId && a.Status == AppointmentStatus.Cancelled);

            // حساب الزيارات المكتملة من الروشتات
            completedVisits = await _context.Prescriptions
                .CountAsync(p => p.PatientId == userId && p.Status == PrescriptionStatus.Completed);

            // ═══════════════════════════════════════════════════════
            // تجميع البيانات
            // ═══════════════════════════════════════════════════════

            var stats = new PatientDashboardStatsDto
            {
                ActivePrescriptions = activePrescriptions,
                CurrentMedicationsCount = medicationsCount,
                UpcomingAppointments = upcomingAppointments,
                CompletedVisits = completedVisits,
                CancelledAppointments = cancelledAppointments,
                
                BMI = patient.BMI,
                BMICategory = BMICalculator.GetCategory(patient.BMI),
                BloodType = patient.BloodType,
                
                HasChronicDiseases = !string.IsNullOrEmpty(patient.ChronicDiseases),
                HasAllergies = !string.IsNullOrEmpty(patient.Allergies)
            };

            return Ok(stats);
        }

        // ═══════════════════════════════════════════════════════
        //  إدارة المواعيد
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// حجز موعد جديد
        /// </summary>
        [HttpPost("appointments/book")]
        public async Task<IActionResult> BookAppointment([FromBody] BookAppointmentDto dto)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            // التحقق من إن الموعد مش في الماضي
            var appointmentDateTime = dto.AppointmentDate.Add(dto.AppointmentTime);
            if (appointmentDateTime < DateTime.UtcNow.AddHours(1))
                return BadRequest("لا يمكن حجز موعد في الماضي");

            var appointment = new Appointment
            {
                PatientId = patientId,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime,
                AppointmentType = dto.AppointmentType,
                Specialty = dto.Specialty,
                PatientNotes = dto.PatientNotes,
                Status = AppointmentStatus.Upcoming
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // TODO: إرسال إشعار للطبيب لو DoctorId موجود

            return Ok(new 
            { 
                Message = "تم حجز الموعد بنجاح",
                AppointmentId = appointment.Id,
                AppointmentDate = appointment.AppointmentDate,
                AppointmentTime = appointment.AppointmentTime
            });
        }

        /// <summary>
        /// عرض كل مواعيد المريض
        /// </summary>
        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments([FromQuery] string? status = null)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            var query = _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientId == patientId)
                .AsQueryable();

            // فلترة حسب الحالة
            if (!string.IsNullOrEmpty(status))
            {
                if (Enum.TryParse<AppointmentStatus>(status, true, out var statusEnum))
                {
                    query = query.Where(a => a.Status == statusEnum);
                }
            }

            var appointments = await query
                .OrderByDescending(a => a.AppointmentDate)
                .ThenByDescending(a => a.AppointmentTime)
                .ToListAsync();

            var response = new AppointmentsListResponseDto
            {
                Appointments = appointments.Select(a => new AppointmentResponseDto
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
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor?.FullName,
                    DoctorSpecialty = a.Doctor != null ? "طبيب عام" : null, // TODO: Get from Doctor model
                    PatientId = a.PatientId,
                    PatientName = a.Patient?.FullName ?? string.Empty,
                    PatientNotes = a.PatientNotes,
                    DoctorNotes = a.DoctorNotes,
                    Diagnosis = a.Diagnosis,
                    Prescription = a.Prescription,
                    CreatedAt = a.CreatedAt,
                    CompletedAt = a.CompletedAt,
                    CancelledAt = a.CancelledAt,
                    CancellationReason = a.CancellationReason
                }).ToList(),
                TotalCount = appointments.Count,
                UpcomingCount = appointments.Count(a => a.Status == AppointmentStatus.Upcoming),
                CompletedCount = appointments.Count(a => a.Status == AppointmentStatus.Completed),
                CancelledCount = appointments.Count(a => a.Status == AppointmentStatus.Cancelled)
            };

            return Ok(response);
        }

        /// <summary>
        /// عرض تفاصيل موعد معين
        /// </summary>
        [HttpGet("appointments/{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patientId);

            if (appointment == null)
                return NotFound("الموعد غير موجود");

            var response = new AppointmentResponseDto
            {
                Id = appointment.Id,
                AppointmentDate = appointment.AppointmentDate,
                AppointmentTime = appointment.AppointmentTime,
                AppointmentType = appointment.AppointmentType,
                Specialty = appointment.Specialty,
                Status = appointment.Status.ToString(),
                StatusArabic = appointment.Status switch
                {
                    AppointmentStatus.Upcoming => "قادم",
                    AppointmentStatus.Completed => "مكتمل",
                    AppointmentStatus.Cancelled => "ملغي",
                    AppointmentStatus.NoShow => "لم يحضر",
                    _ => appointment.Status.ToString()
                },
                DoctorId = appointment.DoctorId,
                DoctorName = appointment.Doctor?.FullName,
                DoctorSpecialty = appointment.Doctor != null ? "طبيب عام" : null,
                PatientId = appointment.PatientId,
                PatientName = appointment.Patient?.FullName ?? string.Empty,
                PatientNotes = appointment.PatientNotes,
                DoctorNotes = appointment.DoctorNotes,
                Diagnosis = appointment.Diagnosis,
                Prescription = appointment.Prescription,
                CreatedAt = appointment.CreatedAt,
                CompletedAt = appointment.CompletedAt,
                CancelledAt = appointment.CancelledAt,
                CancellationReason = appointment.CancellationReason
            };

            return Ok(response);
        }

        /// <summary>
        /// إلغاء موعد
        /// </summary>
        [HttpPut("appointments/{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id, [FromBody] CancelAppointmentDto dto)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patientId);

            if (appointment == null)
                return NotFound("الموعد غير موجود");

            if (appointment.Status != AppointmentStatus.Upcoming)
                return BadRequest("لا يمكن إلغاء هذا الموعد");

            var appointmentDateTime = appointment.AppointmentDate.Add(appointment.AppointmentTime);
            if (appointmentDateTime < DateTime.UtcNow.AddHours(2))
                return BadRequest("لا يمكن إلغاء الموعد قبل أقل من ساعتين");

            appointment.Status = AppointmentStatus.Cancelled;
            appointment.CancelledAt = DateTime.UtcNow;
            appointment.CancellationReason = dto?.CancellationReason;

            await _context.SaveChangesAsync();

            // TODO: إرسال إشعار للطبيب بالإلغاء

            return Ok(new { Message = "تم إلغاء الموعد بنجاح" });
        }

        // ═══════════════════════════════════════════════════════
        //  السجل الطبي الكامل
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// عرض السجل الطبي الكامل (روشتات + مواعيد)
        /// </summary>
        [HttpGet("medical-records")]
        public async Task<IActionResult> GetMedicalRecords([FromQuery] string? type = null, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            var records = new List<MedicalRecordResponseDto>();

            // ═══════════════════════════════════════════════════════
            // جلب الروشتات
            // ═══════════════════════════════════════════════════════
            if (string.IsNullOrEmpty(type) || type == "prescription")
            {
                var prescriptionsQuery = _context.Prescriptions
                    .Include(p => p.Doctor)
                    .Where(p => p.PatientId == patientId);

                if (fromDate.HasValue)
                    prescriptionsQuery = prescriptionsQuery.Where(p => p.CreatedAt >= fromDate.Value);
                
                if (toDate.HasValue)
                    prescriptionsQuery = prescriptionsQuery.Where(p => p.CreatedAt <= toDate.Value);

                var prescriptions = await prescriptionsQuery
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                records.AddRange(prescriptions.Select(p => new MedicalRecordResponseDto
                {
                    RecordType = "Prescription",
                    RecordTypeName = "روشتة طبية",
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Notes,
                    Date = p.VisitDate ?? p.CreatedAt,
                    DoctorName = p.Doctor?.FullName,
                    Diagnosis = p.Diagnosis,
                    Status = p.Status.ToString(),
                    StatusArabic = p.Status switch
                    {
                        PrescriptionStatus.Pending => "جديد",
                        PrescriptionStatus.Responded => "قيد التنفيذ",
                        PrescriptionStatus.Completed => "مكتمل",
                        PrescriptionStatus.Cancelled => "ملغي",
                        _ => p.Status.ToString()
                    },
                    HasImage = !string.IsNullOrEmpty(p.PrescriptionImagePath)
                }));
            }

            // ═══════════════════════════════════════════════════════
            // جلب المواعيد
            // ═══════════════════════════════════════════════════════
            if (string.IsNullOrEmpty(type) || type == "appointment")
            {
                var appointmentsQuery = _context.Appointments
                    .Include(a => a.Doctor)
                    .Where(a => a.PatientId == patientId);

                if (fromDate.HasValue)
                    appointmentsQuery = appointmentsQuery.Where(a => a.AppointmentDate >= fromDate.Value);
                
                if (toDate.HasValue)
                    appointmentsQuery = appointmentsQuery.Where(a => a.AppointmentDate <= toDate.Value);

                var appointments = await appointmentsQuery
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();

                records.AddRange(appointments.Select(a => new MedicalRecordResponseDto
                {
                    RecordType = "Appointment",
                    RecordTypeName = "موعد طبي",
                    Id = a.Id,
                    Title = $"{a.AppointmentType} - {a.Specialty ?? "عام"}",
                    Description = a.PatientNotes,
                    Date = a.AppointmentDate,
                    DoctorName = a.Doctor?.FullName,
                    Diagnosis = a.Diagnosis,
                    Status = a.Status.ToString(),
                    StatusArabic = a.Status switch
                    {
                        AppointmentStatus.Upcoming => "قادم",
                        AppointmentStatus.Completed => "مكتمل",
                        AppointmentStatus.Cancelled => "ملغي",
                        AppointmentStatus.NoShow => "لم يحضر",
                        _ => a.Status.ToString()
                    },
                    HasImage = false
                }));
            }

            // ترتيب كل السجلات بالتاريخ
            var sortedRecords = records
                .OrderByDescending(r => r.Date)
                .ToList();

            return Ok(new
            {
                TotalRecords = sortedRecords.Count,
                Records = sortedRecords
            });
        }

        // ═══════════════════════════════════════════════════════
        //  حجز المواعيد من المواعيد المتاحة
        // ═══════════════════════════════════════════════════════

        /// <summary>
        /// عرض الدكاترة المتاحين مع مواعيدهم (للبحث العام)
        /// </summary>
        [HttpGet("doctors/available")]
        public async Task<IActionResult> GetAvailableDoctors([FromQuery] string? searchTerm = null, [FromQuery] string? specialty = null, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
        {
            var query = _context.Users
                .Where(u => _context.Doctors.Any(d => d.AppUserId == u.Id && d.IsApproved))
                .AsQueryable();

            // البحث بالاسم
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(u => u.FullName.Contains(searchTerm));
            }

            // البحث بالتخصص
            if (!string.IsNullOrEmpty(specialty))
            {
                query = query.Where(u => _context.Doctors
                    .Any(d => d.AppUserId == u.Id && d.Specialty != null && d.Specialty.Contains(specialty)));
            }

            var doctors = await query.ToListAsync();

            var fromDateFilter = fromDate ?? DateTime.UtcNow;
            var toDateFilter = toDate ?? DateTime.UtcNow.AddDays(30);

            var response = new List<AvailableDoctorDto>();

            foreach (var doctor in doctors)
            {
                var doctorProfile = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.AppUserId == doctor.Id);

                var availableSlots = await _context.DoctorAvailabilities
                    .Where(da => da.DoctorId == doctor.Id && 
                                da.IsAvailable && 
                                da.Date >= fromDateFilter && 
                                da.Date <= toDateFilter)
                    .OrderBy(da => da.Date)
                    .ThenBy(da => da.StartTime)
                    .ToListAsync();

                if (availableSlots.Any())
                {
                    response.Add(new AvailableDoctorDto
                    {
                        DoctorId = doctor.Id,
                        DoctorName = doctor.FullName ?? "غير معروف",
                        Specialty = doctorProfile?.Specialty,
                        Rating = doctor.Rating,
                        RatingCount = doctor.RatingCount,
                        ViewCount = doctor.ViewCount,
                        AvailableSlotsCount = availableSlots.Count,
                        EarliestAvailable = availableSlots.FirstOrDefault()?.Date,
                        ConsultationFee = availableSlots.FirstOrDefault()?.ConsultationFee ?? 0,
                        AvailableSlots = availableSlots.Select(s => new AvailableSlotDto
                        {
                            AvailabilityId = s.Id,
                            Date = s.Date,
                            StartTime = s.StartTime,
                            EndTime = s.EndTime,
                            DurationMinutes = s.DurationMinutes,
                            ConsultationFee = s.ConsultationFee,
                            Location = s.Location,
                            AppointmentType = s.AppointmentType
                        }).ToList()
                    });
                }
            }

            return Ok(new
            {
                TotalDoctors = response.Count,
                Doctors = response
            });
        }

        /// <summary>
        /// حجز موعد من المواعيد المتاحة
        /// </summary>
        [HttpPost("appointments/book-from-availability")]
        public async Task<IActionResult> BookFromAvailability([FromBody] BookFromAvailabilityDto dto)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            var availability = await _context.DoctorAvailabilities
                .FirstOrDefaultAsync(da => da.Id == dto.AvailabilityId && da.IsAvailable);

            if (availability == null)
                return BadRequest("الموعد غير متاح");

            if (availability.BookedByPatientId != null)
                return BadRequest("الموعد محجوز بالفعل");

            // حجز الموعد
            availability.IsAvailable = false;
            availability.BookedByPatientId = patientId;
            availability.BookedAt = DateTime.UtcNow;

            // إنشاء Appointment
            var appointment = new Appointment
            {
                PatientId = patientId,
                DoctorId = availability.DoctorId,
                AppointmentDate = availability.Date,
                AppointmentTime = availability.StartTime,
                AppointmentType = availability.AppointmentType,
                Specialty = null, // هنجيبها من Doctor
                Status = AppointmentStatus.Upcoming,
                PatientNotes = dto.PatientNotes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // TODO: إرسال إشعار للدكتور بالحجز

            return Ok(new 
            { 
                Message = "تم حجز الموعد بنجاح",
                AppointmentId = appointment.Id,
                DoctorId = availability.DoctorId,
                Date = availability.Date,
                Time = availability.StartTime,
                ConsultationFee = availability.ConsultationFee
            });
        }

        //  المريض يرفع روشتة أو يبحث عن دواء
        [HttpPost("request-medicine")]
        public async Task<IActionResult> RequestMedicine([FromForm] PrescriptionRequestDto dto)
        {
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Title) && dto.PrescriptionImage == null)
            {
                return BadRequest("يجب إما كتابة اسم الدواء أو رفع صورة الروشتة.");
            }

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
                Title = string.IsNullOrWhiteSpace(dto.Title) ? "طلب دواء من صورة" : dto.Title,
                Notes = dto.Notes,
                PrescriptionImagePath = imagePath,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                SearchRadiusKm = dto.SearchRadiusKm,
                DeliveryAddress = dto.DeliveryAddress,
                PatientName = dto.PatientName,
                PhoneNumber = dto.PhoneNumber,
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
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (patientId == null) return Unauthorized();

            // إنشاء روشتة مبسطة للبحث
            var prescription = new Prescription
            {
                PatientId = patientId,
                Title = dto.MedicineName,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                SearchRadiusKm = dto.SearchRadiusKm,
                DeliveryAddress = dto.DeliveryAddress,
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
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
            var patientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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

