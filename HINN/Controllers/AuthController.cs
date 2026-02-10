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

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            AppDbContext context,
            IConfiguration config,
            IWebHostEnvironment env)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _config = config;
            _env = env;
        }

        //  تسجيل صيدلية
        [HttpPost("register-pharmacy")]
        public async Task<IActionResult> RegisterPharmacy([FromForm] PharmacyRegisterDto model)
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
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                IsApproved = false, // الأدمن لازم يوافق
                LicenseImagePath = model.LicenseImage != null ? await SaveFile(model.LicenseImage) : string.Empty,
                TaxDocumentPath = model.TaxDocument != null ? await SaveFile(model.TaxDocument) : string.Empty
            };

            _context.Pharmacies.Add(pharmacy);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم تسجيل الصيدلية بنجاح  بانتظار موافقة الأدمن" });
        }

        //  تسجيل دكتور
        [HttpPost("register-doctor")]
        public async Task<IActionResult> RegisterDoctor([FromForm] DoctorRegisterDto model)
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

            return Ok(new { Message = "تم تسجيل الطبيب بنجاح  بانتظار موافقة الأدمن" });
        }

        //  تسجيل شركة أدوية
        [HttpPost("register-company")]
        public async Task<IActionResult> RegisterCompany([FromForm] CompanyRegisterDto model)
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

            return Ok(new { Message = "تم تسجيل شركة الأدوية بنجاح  بانتظار موافقة الأدمن" });
        }

        //  تسجيل دخول عام (لأي مستخدم)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("المستخدم غير موجود");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
                return Unauthorized("كلمة المرور غير صحيحة");

            // تأكيد أن المستخدم معتمد (لو صيدلية أو شركة)
            var pharmacy = await _context.Pharmacies.FirstOrDefaultAsync(p => p.AppUserId == user.Id);
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.AppUserId == user.Id);

            if ((pharmacy != null && !pharmacy.IsApproved) ||
                (company != null && !company.IsApproved))
            {
                return Unauthorized("الحساب لم تتم الموافقة عليه بعد من الأدمن 🚫");
            }

            var token = await GenerateJwtToken(user);
            return Ok(new { Token = token });
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

            var folder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var filePath = Path.Combine(folder, Guid.NewGuid() + Path.GetExtension(file.FileName));
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return filePath;
        }
    }
}