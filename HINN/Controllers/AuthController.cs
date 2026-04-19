using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;
using MyHealthcareApi.DTOs;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Collections.Generic;
using MyHealthcareApi.Services;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly IRateLimitService _rateLimitService;
        private readonly IAuditLogService _auditService;

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            AppDbContext context,
            IConfiguration config,
            IWebHostEnvironment env,
            IEmailService emailService,
            ISmsService smsService,
            IRateLimitService rateLimitService,
            IAuditLogService auditService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _config = config;
            _env = env;
            _emailService = emailService;
            _smsService = smsService;
            _rateLimitService = rateLimitService;
            _auditService = auditService;
        }

        //  تسجيل صيدلية
        [HttpPost("register-pharmacy")]
        public async Task<IActionResult> RegisterPharmacy([FromForm] PharmacyRegisterDto model)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new AppUser
                {
                    UserName = model.Email,
                    Email = model.Email
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                //  إضافة الدور المناسب
                await _userManager.AddToRoleAsync(user, "Pharmacy");

                var pharmacy = new Pharmacy
                {
                    PharmacyName = model.PharmacyName,
                    AppUserId = user.Id,
                    Address = model.Address,
                    IsApproved = false, // الأدمن لازم يوافق
                    LicenseImagePath = model.LicenseImage != null ? await SaveFile(model.LicenseImage) : string.Empty,
                    TaxDocumentPath = model.TaxDocument != null ? await SaveFile(model.TaxDocument) : string.Empty
                };

                _context.Pharmacies.Add(pharmacy);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // إرسال بريد ترحيبي
                await _emailService.SendWelcomeEmailAsync(user.Email!, user.FullName ?? model.PharmacyName);
                
                // Audit Log
                await _auditService.LogAsync(
                    user.Id, user.Email!, AuditActionTypes.Register,
                    entityType: "Pharmacy",
                    entityId: Guid.TryParse(pharmacy.Id.ToString(), out var guid) ? guid : (Guid?)null,
                    description: "New pharmacy registered",
                    newData: new { pharmacy.PharmacyName, pharmacy.Address },
                    success: true
                );

                return Ok(new { Message = "تم تسجيل الصيدلية بنجاح بانتظار موافقة الأدمن" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Message = "حدث خطأ أثناء التسجيل", Error = ex.Message });
            }
        }

        //  تسجيل دكتور
        [HttpPost("register-doctor")]
        public async Task<IActionResult> RegisterDoctor([FromForm] DoctorRegisterDto model)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new AppUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FullName = model.FullName
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                //  إضافة الدور المناسب
                await _userManager.AddToRoleAsync(user, "Doctor");

                var doctor = new Doctor
                {
                    AppUserId = user.Id,
                    Specialty = model.Specialty,
                    LicenseImageUrl = model.LicenseImage != null ? await SaveFile(model.LicenseImage) : string.Empty
                };

                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { Message = "تم تسجيل الطبيب بنجاح بانتظار موافقة الأدمن" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Message = "حدث خطأ أثناء التسجيل", Error = ex.Message });
            }
        }

        //  تسجيل شركة أدوية
        [HttpPost("register-company")]
        public async Task<IActionResult> RegisterCompany([FromForm] CompanyRegisterDto model)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new AppUser
                {
                    UserName = model.Email,
                    Email = model.Email
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                //  إضافة الدور المناسب
                await _userManager.AddToRoleAsync(user, "Company");

                var company = new Company
                {
                    CompanyName = model.CompanyName,
                    LicenseNumber = model.LicenseNumber,
                    AppUserId = user.Id,
                    IsApproved = false, // الأدمن لازم يوافق الأول
                    LicenseDocumentPath = model.LicenseDocument != null ? await SaveFile(model.LicenseDocument) : string.Empty
                };

                _context.Companies.Add(company);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { Message = "تم تسجيل شركة الأدوية بنجاح بانتظار موافقة الأدمن" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Message = "حدث خطأ أثناء التسجيل", Error = ex.Message });
            }
        }

        //  تسجيل مريض جديد مع بيانات صحية كاملة
        [HttpPost("register-patient")]
        public async Task<IActionResult> RegisterPatient([FromBody] PatientRegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new AppUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FullName = model.FullName,
                    PhoneNumber = model.PhoneNumber
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                //  إضافة الدور المناسب
                await _userManager.AddToRoleAsync(user, "Patient");

                //  إنشاء سجل المريض مع البيانات الصحية
                var patient = new Patient
                {
                    AppUserId = user.Id,
                    MedicalRecordNumber = $"PAT-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                    PhoneNumber = model.PhoneNumber,
                    Gender = model.Gender,
                    DateOfBirth = model.DateOfBirth,
                    HeightCm = model.HeightCm,
                    WeightKg = model.WeightKg,
                    BloodType = model.BloodType,
                    Allergies = model.Allergies,
                    ChronicDiseases = model.ChronicDiseases,
                    CurrentMedications = model.CurrentMedications,
                    Surgeries = model.Surgeries,
                    MedicalNotes = model.MedicalNotes,
                    EmergencyContactName = model.EmergencyContactName,
                    EmergencyContactPhone = model.EmergencyContactPhone,
                    LastMedicalUpdate = DateTime.UtcNow
                };

                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // إرسال بريد ترحيبي
                await _emailService.SendWelcomeEmailAsync(user.Email!, user.FullName);

                //  Audit Log
                await _auditService.LogAsync(
                    user.Id, user.Email!, AuditActionTypes.Register,
                    entityType: "Patient",
                    entityId: Guid.TryParse(patient.Id.ToString(), out var guid) ? guid : (Guid?)null,
                    description: "New patient registered with medical profile",
                    newData: new { patient.MedicalRecordNumber, patient.BloodType, patient.Allergies },
                    success: true
                );

                return Ok(new 
                { 
                    Message = "تم تسجيل المريض بنجاح",
                    PatientId = patient.Id,
                    MedicalRecordNumber = patient.MedicalRecordNumber
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { Message = "حدث خطأ أثناء التسجيل", Error = ex.Message });
            }
        }

        //  تسجيل دخول عام (لأي مستخدم)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
            
            // Rate Limiting: منع الهجمات
            if (!_rateLimitService.IsAllowed(userId, "login", RateLimitPresets.LoginAttempts, RateLimitPresets.LoginWindowSeconds))
            {
                await _auditService.LogAsync(
                    userId, model.Email, AuditActionTypes.Login,
                    description: "Login attempt blocked due to rate limiting",
                    success: false,
                    errorMessage: "Rate limit exceeded"
                );
                
                return StatusCode(429, new { message = "محاولات كثيرة جداً. يرجى المحاولة بعد قليل" });
            }

            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    await _auditService.LogAsync(
                        userId, model.Email, AuditActionTypes.Login,
                        description: $"Login failed - user not found: {model.Email}",
                        success: false,
                        errorMessage: "User not found"
                    );
                    return Unauthorized("المستخدم غير موجود");
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (!result.Succeeded)
                {
                    await _auditService.LogAsync(
                        user.Id, user.Email!, AuditActionTypes.Login,
                        description: "Login failed - invalid password",
                        success: false,
                        errorMessage: "Invalid password"
                    );
                    return Unauthorized("كلمة المرور غير صحيحة");
                }

                // تأكيد أن المستخدم معتمد (لو صيدلية أو شركة)
                var pharmacy = await _context.Pharmacies.FirstOrDefaultAsync(p => p.AppUserId == user.Id);
                var company = await _context.Companies.FirstOrDefaultAsync(c => c.AppUserId == user.Id);

                if ((pharmacy != null && !pharmacy.IsApproved) ||
                    (company != null && !company.IsApproved))
                {
                    await _auditService.LogAsync(
                        user.Id, user.Email!, AuditActionTypes.Login,
                        description: "Login blocked - account not approved",
                        success: false,
                        errorMessage: "Account not approved"
                    );
                    return Unauthorized("الحساب لم تتم الموافقة عليه بعد من الأدمن");
                }

                var token = await GenerateJwtToken(user);
                
                // Audit Log: نجاح تسجيل الدخول
                await _auditService.LogAsync(
                    user.Id, user.Email!, AuditActionTypes.Login,
                    description: "Login successful",
                    success: true
                );
                
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                await _auditService.LogAsync(
                    userId, model.Email, AuditActionTypes.Login,
                    description: "Login error",
                    success: false,
                    errorMessage: ex.Message
                );
                
                return StatusCode(500, new { message = "حدث خطأ غير متوقع" });
            }
        }

        //  إنشاء JWT Token
        private async Task<string> GenerateJwtToken(AppUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            //  إضافة الـ Roles للـ Token
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        //  حفظ الملفات المرفوعة (صور - PDF)
        private async Task<string> SaveFile(IFormFile file)
        {
            if (file == null) return string.Empty;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            
            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                throw new InvalidOperationException("نوع الملف غير مسموح به. مسموح فقط بـ JPG, PNG, PDF");

            if (file.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("حجم الملف يجب ألا يتجاوز 5 ميجابايت");

            var folder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var filePath = Path.Combine(folder, Guid.NewGuid() + extension);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return filePath;
        }
    }
}
