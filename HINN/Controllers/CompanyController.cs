using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;
using MyHealthcareApi.DTOs;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CompanyController(UserManager<AppUser> userManager, AppDbContext context, IWebHostEnvironment env)
        {
            _userManager = userManager;
            _context = context;
            _env = env;
        }

        //  تسجيل شركة جديدة
        [HttpPost("register")]
        public async Task<IActionResult> RegisterCompany([FromForm] CompanyRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            //  إضافة الدور المناسب للشركة
            await _userManager.AddToRoleAsync(user, "Company");

            string? licensePath = null;
            if (dto.LicenseDocument != null)
            {
                var folder = Path.Combine(_env.WebRootPath ?? "Uploads", "CompanyLicenses");
                Directory.CreateDirectory(folder);
                var filePath = Path.Combine(folder, $"{Guid.NewGuid()}_{dto.LicenseDocument.FileName}");
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.LicenseDocument.CopyToAsync(stream);
                }
                licensePath = filePath;
            }

            var company = new Company
            {
                AppUserId = user.Id,
                CompanyName = dto.CompanyName,
                LicenseNumber = dto.LicenseNumber,
                LicenseDocumentPath = licensePath,
                IsApproved = false
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تسجيل الشركة بنجاح  في انتظار موافقة الأدمن." });
        }

        //  عرض الشركات التي تنتظر موافقة
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingCompanies()
        {
            var companies = await _context.Companies
                .Include(c => c.AppUser)
                .Where(c => !c.IsApproved)
                .ToListAsync();

            return Ok(companies);
        }

        //  موافقة الأدمن على شركة (اختياري)
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
                return NotFound();

            company.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تمت الموافقة على الشركة بنجاح " });
        }
    }
}

