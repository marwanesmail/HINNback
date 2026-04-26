using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;
using MyHealthcareApi.Services;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // الأدمن فقط
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;

        public AdminController(AppDbContext context, UserManager<AppUser> userManager, IEmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
        }

        // ═══════════════════════════════════════════════════════
        //  الـ APIs الجديدة الموحدة (للـ Dashboard)
        // ═══════════════════════════════════════════════════════

        // 1. جلب جميع الحسابات قيد الانتظار (أطباء، صيدليات، شركات) في جدول واحد
        [HttpGet("pending-accounts")]
        public async Task<IActionResult> GetPendingAccounts()
        {
            var pendingAccounts = new List<PendingAccountDto>();

            // 1. الدكاترة
            var doctors = await _context.Doctors
                .Include(d => d.AppUser)
                .Where(d => !d.IsApproved)
                .ToListAsync();

            pendingAccounts.AddRange(doctors.Select(d => new PendingAccountDto
            {
                Id = d.Id,
                Name = d.AppUser?.FullName ?? "غير معروف",
                Email = d.AppUser?.Email ?? "",
                AccountType = "Doctor",
                AccountTypeArabic = "طبيب"
            }));

            // 2. الصيدليات
            var pharmacies = await _context.Pharmacies
                .Include(p => p.AppUser)
                .Where(p => !p.IsApproved)
                .ToListAsync();

            pendingAccounts.AddRange(pharmacies.Select(p => new PendingAccountDto
            {
                Id = p.Id,
                Name = p.PharmacyName ?? p.AppUser?.FullName ?? "غير معروف",
                Email = p.AppUser?.Email ?? "",
                AccountType = "Pharmacy",
                AccountTypeArabic = "صيدلية"
            }));

            // 3. الشركات
            var companies = await _context.Companies
                .Include(c => c.AppUser)
                .Where(c => !c.IsApproved)
                .ToListAsync();

            pendingAccounts.AddRange(companies.Select(c => new PendingAccountDto
            {
                Id = c.Id,
                Name = c.CompanyName ?? c.AppUser?.FullName ?? "غير معروف",
                Email = c.AppUser?.Email ?? "",
                AccountType = "Company",
                AccountTypeArabic = "شركة أدوية"
            }));

            return Ok(pendingAccounts.OrderBy(a => a.Name));
        }

        // 2. عرض تفاصيل حساب معين (بيظهر في الـ Modal)
        [HttpGet("account-details/{type}/{id}")]
        public async Task<IActionResult> GetAccountDetails(string type, int id)
        {
            if (type == "Doctor")
            {
                var doctor = await _context.Doctors.Include(d => d.AppUser).FirstOrDefaultAsync(d => d.Id == id);
                if (doctor == null) return NotFound("الطبيب غير موجود");

                return Ok(new AccountDetailsDto
                {
                    Id = doctor.Id,
                    Name = doctor.AppUser?.FullName ?? "طبيب",
                    FullName = doctor.AppUser?.FullName,
                    Email = doctor.AppUser?.Email ?? "",
                    PhoneNumber = doctor.AppUser?.PhoneNumber ?? "",
                    AccountType = "Doctor",
                    Specialty = doctor.Specialty,
                    Address = doctor.ClinicAddress ?? doctor.AppUser?.Address, // استخدام عنوان العيادة أو عنوان اليوزر
                    LicenseImageUrl = GetFullUrl(doctor.LicenseImageUrl),
                    ProfileImageUrl = GetFullUrl(doctor.AppUser?.ProfileImageUrl),
                    CreatedAt = DateTime.UtcNow
                });
            }
            else if (type == "Pharmacy")
            {
                var pharmacy = await _context.Pharmacies.Include(p => p.AppUser).FirstOrDefaultAsync(p => p.Id == id);
                if (pharmacy == null) return NotFound("الصيدلية غير موجودة");

                return Ok(new AccountDetailsDto
                {
                    Id = pharmacy.Id,
                    Name = pharmacy.PharmacyName,
                    PharmacyName = pharmacy.PharmacyName,
                    Email = pharmacy.AppUser?.Email ?? "",
                    PhoneNumber = pharmacy.PhoneNumber ?? pharmacy.AppUser?.PhoneNumber ?? "",
                    Phone2 = pharmacy.Phone2,
                    WorkingHours = pharmacy.WorkingHours,
                    DeliveryArea = pharmacy.DeliveryArea,
                    AccountType = "Pharmacy",
                    Address = pharmacy.Address,
                    LicenseImageUrl = GetFullUrl(pharmacy.LicenseImagePath),
                    TaxDocumentUrl = GetFullUrl(pharmacy.TaxDocumentPath),
                    CommercialRecordUrl = GetFullUrl(pharmacy.CommercialRecordPath),
                    ProfileImageUrl = GetFullUrl(pharmacy.AppUser?.ProfileImageUrl)
                });
            }
            else if (type == "Company")
            {
                var company = await _context.Companies.Include(c => c.AppUser).FirstOrDefaultAsync(c => c.Id == id);
                if (company == null) return NotFound("الشركة غير موجودة");

                return Ok(new AccountDetailsDto
                {
                    Id = company.Id,
                    Name = company.CompanyName,
                    CompanyName = company.CompanyName,
                    Email = company.AppUser?.Email ?? "",
                    PhoneNumber = company.AppUser?.PhoneNumber ?? "",
                    AccountType = "Company",
                    Address = company.AppUser?.Address,
                    LicenseNumber = company.LicenseNumber,
                    LicenseImageUrl = GetFullUrl(company.LicenseDocumentPath),
                    ProfileImageUrl = GetFullUrl(company.AppUser?.ProfileImageUrl)
                });
            }

            return BadRequest("نوع الحساب غير معروف");
        }

        // Helper لتحويل المسار لـ URL كامل
        private string? GetFullUrl(string? path)
        {
            if (string.IsNullOrEmpty(path)) return null;
            // لو كان مسار كامل من قبل، نرجعه زي ما هو
            if (path.StartsWith("http")) return path;
            
            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host.Value}";
            
            // تحويل D:\... إلى /uploads/...
            var fileName = Path.GetFileName(path);
            return $"{baseUrl}/uploads/{fileName}";
        }

        // ═══════════════════════════════════════════════════════
        //  القبول والرفض مع إرسال الإيميلات اللحظية (Direct Emails)
        // ═══════════════════════════════════════════════════════

        [HttpPost("approve/{type}/{id}")]
        public async Task<IActionResult> ApproveAccount(string type, int id)
        {
            string email = "";
            string name = "";

            if (type == "Doctor")
            {
                var doctor = await _context.Doctors.Include(d => d.AppUser).FirstOrDefaultAsync(d => d.Id == id);
                if (doctor == null) return NotFound();
                
                doctor.IsApproved = true;
                email = doctor.AppUser!.Email!;
                name = doctor.AppUser!.FullName ?? "الطبيب";
            }
            else if (type == "Pharmacy")
            {
                var pharmacy = await _context.Pharmacies.Include(p => p.AppUser).FirstOrDefaultAsync(p => p.Id == id);
                if (pharmacy == null) return NotFound();
                
                pharmacy.IsApproved = true;
                email = pharmacy.AppUser!.Email!;
                name = pharmacy.PharmacyName ?? "الصيدلية";
            }
            else if (type == "Company")
            {
                var company = await _context.Companies.Include(c => c.AppUser).FirstOrDefaultAsync(c => c.Id == id);
                if (company == null) return NotFound();
                
                company.IsApproved = true;
                email = company.AppUser!.Email!;
                name = company.CompanyName ?? "الشركة";
            }
            else
            {
                return BadRequest("نوع الحساب غير معروف");
            }

            await _context.SaveChangesAsync();

            // إرسال الإيميل مباشرة بعد الموافقة
            await _emailService.SendApprovalNotificationAsync(email, type);

            return Ok(new { Message = $"تمت الموافقة على {name} بنجاح، وتم إرسال بريد إلكتروني لإعلامه." });
        }

        [HttpPost("reject/{type}/{id}")]
        public async Task<IActionResult> RejectAccount(string type, int id)
        {
            if (type == "Doctor")
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor != null) _context.Doctors.Remove(doctor);
            }
            else if (type == "Pharmacy")
            {
                var pharmacy = await _context.Pharmacies.FindAsync(id);
                if (pharmacy != null) _context.Pharmacies.Remove(pharmacy);
            }
            else if (type == "Company")
            {
                var company = await _context.Companies.FindAsync(id);
                if (company != null) _context.Companies.Remove(company);
            }
            else
            {
                return BadRequest("نوع الحساب غير معروف");
            }

            await _context.SaveChangesAsync();

            // (اختياري) ممكن تبعت إيميل وتقوله حسابك اترفض لو حبيت
            // await _emailService.SendEmailAsync(email, "مرفوض", "تم رفض طلبك");

            return Ok(new { Message = "تم رفض وحذف الطلب بنجاح" });
        }

        // ═══════════════════════════════════════════════════════
        //  إدارة المستخدمين (User Management)
        // ═══════════════════════════════════════════════════════

        [HttpGet("users-management")]
        public async Task<IActionResult> GetUsersManagement()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserManagementDto>();

            foreach (var user in users)
            {
                if (user.UserType == Models.Enums.UserType.Admin) continue; // تخطي الأدمن

                string accountTypeEn = user.UserType.ToString();
                string accountTypeAr = accountTypeEn switch
                {
                    "Doctor" => "طبيب",
                    "Pharmacy" => "صيدلية",
                    "Company" => "شركة أدوية",
                    "Patient" => "مريض",
                    _ => "غير معروف"
                };

                // المرضى معتمدين تلقائياً إذا أكدوا الإيميل أو نعتبرهم دايماً مفعلين
                string status = user.UserType == Models.Enums.UserType.Patient 
                    ? (user.EmailConfirmed ? "مفعل" : "معلق")
                    : (user.IsApproved ? "مفعل" : "معلق");

                result.Add(new UserManagementDto
                {
                    Id = user.Id,
                    Name = user.FullName ?? user.UserName ?? "بدون اسم",
                    Email = user.Email ?? "",
                    Phone = user.PhoneNumber ?? "",
                    AccountType = accountTypeEn,
                    AccountTypeArabic = accountTypeAr,
                    Status = status
                });
            }

            return Ok(result.OrderBy(u => u.Name));
        }

        [HttpPut("users/{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound("المستخدم غير موجود");

            if (user.UserType == Models.Enums.UserType.Patient)
            {
                // بالنسبة للمريض ممكن نوقف حسابه عن طريق منع الدخول
                // بس للتبسيط هنعكس حالة EmailConfirmed أو نستخدم Lockout
                user.EmailConfirmed = !user.EmailConfirmed; 
            }
            else
            {
                // دكتور أو صيدلية أو شركة
                user.IsApproved = !user.IsApproved;

                // تحديث الـ Model المرتبط كمان (مهم جداً)
                if (user.UserType == Models.Enums.UserType.Doctor)
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.AppUserId == user.Id);
                    if (doctor != null) doctor.IsApproved = user.IsApproved;
                }
                else if (user.UserType == Models.Enums.UserType.Pharmacy)
                {
                    var pharmacy = await _context.Pharmacies.FirstOrDefaultAsync(p => p.AppUserId == user.Id);
                    if (pharmacy != null) pharmacy.IsApproved = user.IsApproved;
                }
                else if (user.UserType == Models.Enums.UserType.Company)
                {
                    var company = await _context.Companies.FirstOrDefaultAsync(c => c.AppUserId == user.Id);
                    if (company != null) company.IsApproved = user.IsApproved;
                }
            }

            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تغيير حالة المستخدم بنجاح" });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound("المستخدم غير موجود");

            // مسح الـ Models المرتبطة الأول لو فيه Cascade Delete مش شغال
            if (user.UserType == Models.Enums.UserType.Doctor)
            {
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.AppUserId == user.Id);
                if (doctor != null) _context.Doctors.Remove(doctor);
            }
            else if (user.UserType == Models.Enums.UserType.Pharmacy)
            {
                var pharmacy = await _context.Pharmacies.FirstOrDefaultAsync(p => p.AppUserId == user.Id);
                if (pharmacy != null) _context.Pharmacies.Remove(pharmacy);
            }
            else if (user.UserType == Models.Enums.UserType.Company)
            {
                var company = await _context.Companies.FirstOrDefaultAsync(c => c.AppUserId == user.Id);
                if (company != null) _context.Companies.Remove(company);
            }
            else if (user.UserType == Models.Enums.UserType.Patient)
            {
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.AppUserId == user.Id);
                if (patient != null) _context.Patients.Remove(patient);
            }

            await _context.SaveChangesAsync(); // نحفظ مسح الـ Entity الأول
            
            var result = await _userManager.DeleteAsync(user); // وبعدين نمسح اليوزر
            
            if (!result.Succeeded)
                return BadRequest("فشل في حذف المستخدم");

            return Ok(new { Message = "تم حذف المستخدم نهائياً" });
        }

        // ═══════════════════════════════════════════════════════
        //  الإعدادات (تغيير البريد والباسورد للأدمن)
        // ═══════════════════════════════════════════════════════

        [HttpPut("settings/change-email")]
        public async Task<IActionResult> ChangeAdminEmail([FromBody] ChangeAdminEmailDto dto)
        {
            // بنجيب الأدمن اللي عامل Login دلوقتي
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            if (user.Email != dto.CurrentEmail)
                return BadRequest("البريد الإلكتروني الحالي غير صحيح");

            var token = await _userManager.GenerateChangeEmailTokenAsync(user, dto.NewEmail);
            var result = await _userManager.ChangeEmailAsync(user, dto.NewEmail, token);
            
            if (result.Succeeded)
            {
                // عشان يقدر يعمل Login بيه
                await _userManager.SetUserNameAsync(user, dto.NewEmail); 
                return Ok(new { Message = "تم تغيير البريد الإلكتروني بنجاح" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPut("settings/change-password")]
        public async Task<IActionResult> ChangeAdminPassword([FromBody] ChangeAdminPasswordDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            
            if (result.Succeeded)
            {
                return Ok(new { Message = "تم تغيير كلمة المرور بنجاح" });
            }

            return BadRequest("كلمة المرور الحالية غير صحيحة أو هناك خطأ آخر");
        }
    }
}
