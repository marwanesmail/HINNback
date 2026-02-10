using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;
using MyHealthcareApi.Services;
using MyHealthcareApi.Constants;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous] // الكل يقدر يستخدم البحث العام
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly GeoLocationService _geoService;
        private readonly FuzzySearchService _fuzzyService;

        public SearchController(
            AppDbContext context,
            GeoLocationService geoService,
            FuzzySearchService fuzzyService)
        {
            _context = context;
            _geoService = geoService;
            _fuzzyService = fuzzyService;
        }

        //  البحث العام - عن دواء أو دكتور أو صيدلية أو شركة
        [HttpGet("general")]
        public async Task<IActionResult> GeneralSearch([FromQuery] GeneralSearchRequest request)
        {
            var result = new SearchResultDto();
            int pageSize = request.PageSize > 0 ? Math.Min(request.PageSize, AppConstants.MaxPageSize) : AppConstants.DefaultPageSize;
            int pageNumber = request.PageNumber > 0 ? request.PageNumber : 1;
            double minSimilarity = request.UseFuzzy ? (request.MinSimilarity > 0 ? request.MinSimilarity : AppConstants.DefaultFuzzySimilarity) : 0;

            // البحث في الأدوية (من خلال الروشتات السابقة)
            if (string.IsNullOrEmpty(request.Type) || request.Type == "medicine")
            {
                var allMedicines = await _context.Prescriptions
                    .Select(p => p.Title)
                    .Distinct()
                    .ToListAsync();

                List<string> filteredMedicines;

                if (request.UseFuzzy)
                {
                    // Fuzzy Search - يتحمل الأخطاء
                    filteredMedicines = allMedicines
                        .Select(m => new { Medicine = m, Similarity = _fuzzyService.CalculateSimilarity(request.Query, m) })
                        .Where(m => m.Similarity >= minSimilarity)
                        .OrderByDescending(m => m.Similarity)
                        .Select(m => m.Medicine)
                        .ToList();
                }
                else
                {
                    // بحث عادي - Partial Match
                    filteredMedicines = allMedicines
                        .Where(m => m.Contains(request.Query))
                        .ToList();
                }

                result.TotalMedicines = filteredMedicines.Count;
                result.Medicines = filteredMedicines
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
            }

            // البحث في الأطباء
            if (string.IsNullOrEmpty(request.Type) || request.Type == "doctor")
            {
                var allDoctors = await _context.Doctors
                    .Where(d => d.IsApproved)
                    .Include(d => d.AppUser)
                    .ToListAsync();

                List<Doctor> filteredDoctors;

                if (request.UseFuzzy)
                {
                    // Fuzzy Search
                    filteredDoctors = allDoctors
                        .Select(d => new
                        {
                            Doctor = d,
                            Similarity = Math.Max(
                                _fuzzyService.CalculateSimilarity(request.Query, d.AppUser.FullName ?? ""),
                                _fuzzyService.CalculateSimilarity(request.Query, d.Specialty ?? "")
                            )
                        })
                        .Where(d => d.Similarity >= minSimilarity)
                        .OrderByDescending(d => d.Similarity)
                        .ThenByDescending(d => d.Doctor.ViewCount) // ترتيب حسب الشهرة
                        .ThenByDescending(d => d.Doctor.Rating)
                        .Select(d => d.Doctor)
                        .ToList();
                }
                else
                {
                    // بحث عادي
                    filteredDoctors = allDoctors
                        .Where(d => (d.AppUser.FullName != null && d.AppUser.FullName.Contains(request.Query)) ||
                                   (d.Specialty != null && d.Specialty.Contains(request.Query)))
                        .OrderByDescending(d => d.ViewCount) // ترتيب حسب الشهرة
                        .ThenByDescending(d => d.Rating)
                        .ToList();
                }

                result.TotalDoctors = filteredDoctors.Count;
                result.Doctors = filteredDoctors
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(d => new DoctorSearchResult
                    {
                        Id = d.Id,
                        FullName = d.AppUser.FullName,
                        Specialty = d.Specialty,
                        Email = d.AppUser.Email,
                        ViewCount = d.ViewCount,
                        Rating = d.Rating
                    })
                    .ToList();
            }

            // البحث في الصيدليات
            if (string.IsNullOrEmpty(request.Type) || request.Type == "pharmacy")
            {
                var allPharmacies = await _context.Pharmacies
                    .Where(p => p.IsApproved)
                    .ToListAsync();

                List<Pharmacy> filteredPharmacies;

                if (request.UseFuzzy)
                {
                    // Fuzzy Search
                    filteredPharmacies = allPharmacies
                        .Select(p => new
                        {
                            Pharmacy = p,
                            Similarity = _fuzzyService.CalculateSimilarity(request.Query, p.PharmacyName)
                        })
                        .Where(p => p.Similarity >= minSimilarity)
                        .OrderByDescending(p => p.Similarity)
                        .ThenByDescending(p => p.Pharmacy.ViewCount)
                        .ThenByDescending(p => p.Pharmacy.Rating)
                        .Select(p => p.Pharmacy)
                        .ToList();
                }
                else
                {
                    // بحث عادي
                    filteredPharmacies = allPharmacies
                        .Where(p => p.PharmacyName.Contains(request.Query))
                        .OrderByDescending(p => p.ViewCount)
                        .ThenByDescending(p => p.Rating)
                        .ToList();
                }

                result.TotalPharmacies = filteredPharmacies.Count;
                result.Pharmacies = filteredPharmacies
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(p => new PharmacySearchResult
                    {
                        Id = p.Id,
                        Name = p.PharmacyName,
                        Address = p.Address,
                        Latitude = p.Latitude,
                        Longitude = p.Longitude,
                        ViewCount = p.ViewCount,
                        Rating = p.Rating
                    })
                    .ToList();
            }

            // البحث في شركات الأدوية
            if (string.IsNullOrEmpty(request.Type) || request.Type == "company")
            {
                var allCompanies = await _context.Companies
                    .Where(c => c.IsApproved)
                    .Include(c => c.AppUser)
                    .ToListAsync();

                List<Company> filteredCompanies;

                if (request.UseFuzzy)
                {
                    // Fuzzy Search
                    filteredCompanies = allCompanies
                        .Select(c => new
                        {
                            Company = c,
                            Similarity = _fuzzyService.CalculateSimilarity(request.Query, c.CompanyName)
                        })
                        .Where(c => c.Similarity >= minSimilarity)
                        .OrderByDescending(c => c.Similarity)
                        .ThenByDescending(c => c.Company.ViewCount)
                        .ThenByDescending(c => c.Company.Rating)
                        .Select(c => c.Company)
                        .ToList();
                }
                else
                {
                    // بحث عادي
                    filteredCompanies = allCompanies
                        .Where(c => c.CompanyName.Contains(request.Query))
                        .OrderByDescending(c => c.ViewCount)
                        .ThenByDescending(c => c.Rating)
                        .ToList();
                }

                result.TotalCompanies = filteredCompanies.Count;
                result.Companies = filteredCompanies
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new CompanySearchResult
                    {
                        Id = c.Id,
                        Name = c.CompanyName,
                        Email = c.AppUser.Email,
                        ViewCount = c.ViewCount,
                        Rating = c.Rating
                    })
                    .ToList();
            }

            result.CurrentPage = pageNumber;
            result.PageSize = pageSize;

            return Ok(result);
        }

        //  البحث بالقرب من موقع معين (للصيدليات والأطباء)
        [HttpGet("nearby")]
        public async Task<IActionResult> SearchNearby([FromQuery] NearbySearchRequest request)
        {
            var result = new NearbySearchResult();

            if (request.Type == "pharmacy" || string.IsNullOrEmpty(request.Type))
            {
                var pharmacies = await _context.Pharmacies
                    .Where(p => p.IsApproved)
                    .ToListAsync();

                result.Pharmacies = pharmacies
                    .Select(p => new NearbyPharmacyResult
                    {
                        Id = p.Id,
                        Name = p.PharmacyName,
                        Address = p.Address,
                        Latitude = p.Latitude,
                        Longitude = p.Longitude,
                        Distance = _geoService.CalculateDistance(p.Latitude, p.Longitude, request.Latitude, request.Longitude),
                        ViewCount = p.ViewCount,
                        Rating = p.Rating
                    })
                    .Where(p => p.Distance <= request.RadiusKm)
                    .OrderBy(p => p.Distance) // أولاً حسب القرب
                    .ThenByDescending(p => p.Rating) // ثم حسب التقييم
                    .Take(20)
                    .ToList();
            }

            return Ok(result);
        }
    }
}
