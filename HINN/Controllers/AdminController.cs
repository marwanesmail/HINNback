using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // الأدمن فقط
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public AdminController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        //  عرض الصيدليات المستنيه موافقة الأدمن
        [HttpGet("pending-pharmacies")]
        public async Task<IActionResult> GetPendingPharmacies()
        {
            var pending = await _context.Pharmacies
                .Where(p => !p.IsApproved)
                .ToListAsync();

            return Ok(pending);
        }

        // اعتماد صيدلية
        [HttpPost("approve-pharmacy/{id}")]
        public async Task<IActionResult> ApprovePharmacy(int id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);
            if (pharmacy == null)
                return NotFound();

            pharmacy.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تمت الموافقة على الصيدلية " });
        }

        //  رفض أو حذف صيدلية
        [HttpPost("reject-pharmacy/{id}")]
        public async Task<IActionResult> RejectPharmacy(int id)
        {
            var pharmacy = await _context.Pharmacies.FindAsync(id);
            if (pharmacy == null)
                return NotFound();

            _context.Pharmacies.Remove(pharmacy);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم حذف الصيدلية ❌" });
        }

        // عرض الأطباء اللي محتاجين مراجعة
        [HttpGet("pending-doctors")]
        public async Task<IActionResult> GetPendingDoctors()
        {
            var doctors = await _context.Doctors
                .Where(d => string.IsNullOrEmpty(d.LicenseImageUrl))
                .ToListAsync();

            return Ok(doctors);
        }

        //عرض الشركات اللي مستني موافقة الأدمن
        [HttpGet("pending-companies")]
        public async Task<IActionResult> GetPendingCompanies()
        {
            var companies = await _context.Companies
                .Where(c => !c.IsApproved)
                .Include(c => c.AppUser)
                .Select(c => new
                {
                    c.Id,
                    c.CompanyName,
                    c.LicenseNumber,
                    c.LicenseDocumentPath,
                    Email = c.AppUser.Email
                })
                .ToListAsync();

            return Ok(companies);
        }

        //  موافقة الأدمن على شركة أدوية
        [HttpPost("approve-company/{id}")]
        public async Task<IActionResult> ApproveCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
                return NotFound();

            company.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تمت الموافقة على شركة الأدوية ✅" });
        }

        //  رفض أو حذف شركة أدوية
        [HttpPost("reject-company/{id}")]
        public async Task<IActionResult> RejectCompany(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
                return NotFound();

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "تم رفض / حذف شركة الأدوية ❌" });
        }

        //  عرض جميع المستخدمين في النظام مع أدوارهم
        [HttpGet("all-users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    Roles = roles
                });
            }

            return Ok(result);
        }
    }
}
