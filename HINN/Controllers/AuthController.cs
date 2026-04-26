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
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    UserType = Models.Enums.UserType.Pharmacy
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                var pharmacy = new Pharmacy
                {
                    PharmacyName = model.PharmacyName,
                    AppUserId = user.Id,
                    Address = model.Address,
                    PhoneNumber = model.PhoneNumber,
                    Phone2 = model.Phone2,
                    WorkingHours = model.WorkingHours,
                    DeliveryArea = model.DeliveryArea,
                    IsApproved = false, // الأدمن لازم يوافق
                    LicenseImagePath = model.LicenseImage != null ? await SaveFile(model.LicenseImage) : string.Empty,
                    TaxDocumentPath = model.TaxDocument != null ? await SaveFile(model.TaxDocument) : string.Empty,
                    CommercialRecordPath = model.CommercialRecordImage != null ? await SaveFile(model.CommercialRecordImage) : string.Empty
                };

                _context.Pharmacies.Add(pharmacy);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // إرسال رسالة: قيد المراجعة
                await _emailService.SendPendingApprovalEmailAsync(user.Email!, "Pharmacy");

                
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
                    FullName = model.FullName,
                    UserType = Models.Enums.UserType.Doctor
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                var doctor = new Doctor
                {
                    AppUserId = user.Id,
                    Specialty = model.Specialty,
                    LicenseImageUrl = model.LicenseImage != null ? await SaveFile(model.LicenseImage) : string.Empty
                };

                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // إرسال رسالة: قيد المراجعة
                await _emailService.SendPendingApprovalEmailAsync(user.Email!, "Doctor");

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
                    Email = model.Email,
                    UserType = Models.Enums.UserType.Company
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

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

                // إرسال رسالة: قيد المراجعة
                await _emailService.SendPendingApprovalEmailAsync(user.Email!, "Company");

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
                    PhoneNumber = model.PhoneNumber,
                    UserType = Models.Enums.UserType.Patient
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

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

                // إرسال رابط تفعيل الحساب
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                // الرابط ده هيكون إما للفرونت إند بتاعك أو الباك إند
                var activationLink = $"https://hinn.runasp.net/api/Auth/confirm-email?email={Uri.EscapeDataString(user.Email!)}&token={Uri.EscapeDataString(token)}";
                
                await _emailService.SendActivationEmailAsync(user.Email!, activationLink);

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

        //  إنشاء أدمن (مرة واحدة فقط للإعداد الأولي)
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto model)
        {
            // حماية: لازم يبعت secret key صح
            var adminSecret = _config["AdminSetup:SecretKey"] ?? "HINN_ADMIN_2026";
            if (model.SecretKey != adminSecret)
                return Unauthorized(new { Message = "المفتاح السري غير صحيح" });

            // التحقق من إن الأدمن ده مش موجود
            var existingAdmin = await _userManager.FindByEmailAsync(model.Email);
            if (existingAdmin != null)
                return BadRequest(new { Message = "هذا البريد الإلكتروني مسجل بالفعل" });

            var user = new AppUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName ?? "Admin",
                UserType = Models.Enums.UserType.Admin
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(new { Message = "فشل إنشاء الحساب", Errors = result.Errors });

            return Ok(new
            {
                Message = "تم إنشاء حساب الأدمن بنجاح",
                Email = user.Email,
                Id = user.Id
            });
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

                if (user.UserType == Models.Enums.UserType.Patient && !user.EmailConfirmed)
                {
                    return Unauthorized("يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني");
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
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                // Assign the Role claim purely from the UserType column
                new Claim(ClaimTypes.Role, user.UserType.ToString())
            };

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

        // ═══════════════════════════════════════════════════════
        //  إدارة تأكيد البريد وكلمة المرور
        // ═══════════════════════════════════════════════════════

        //  تأكيد البريد الإلكتروني للمريض
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(token))
                return BadRequest("البيانات غير مكتملة");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound("المستخدم غير موجود");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                // إرسال رسالة ترحيبية بعد التفعيل
                await _emailService.SendWelcomeEmailAsync(user.Email!, user.FullName ?? "عزيزي المريض");
                return Ok(new { Message = "تم تفعيل الحساب بنجاح. يمكنك الآن تسجيل الدخول" });
            }

            return BadRequest("الرابط غير صالح أو منتهي الصلاحية");
        }

        //  طلب إعادة تعيين كلمة المرور
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Ok(new { Message = "إذا كان البريد مسجلاً لدينا، ستصلك رسالة الاستعادة" }); // للأمان مش بنقول إن الايميل مش موجود

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            
            // في التطبيق الحقيقي ده هيكون رابط للـ Frontend، والـ Frontend هو اللي بيبعت الـ Token لـ ResetPassword API
            var resetLink = $"https://hinn.runasp.net/reset-password?email={Uri.EscapeDataString(user.Email!)}&token={Uri.EscapeDataString(token)}";

            await _emailService.SendPasswordResetEmailAsync(user.Email!, resetLink);

            return Ok(new { Message = "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني" });
        }

        //  إعادة تعيين كلمة المرور فعلياً
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("طلب غير صالح");

            var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
            if (result.Succeeded)
            {
                // Audit Log
                await _auditService.LogAsync(
                    user.Id, user.Email!, AuditActionTypes.Update,
                    description: "Password reset successful",
                    success: true
                );

                return Ok(new { Message = "تم تغيير كلمة المرور بنجاح" });
            }

            return BadRequest(new { Message = "فشل في إعادة تعيين كلمة المرور", Errors = result.Errors });
        }
    }
}
