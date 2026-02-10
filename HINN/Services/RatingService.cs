using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;

namespace MyHealthcareApi.Services
{
    /// <summary>
    /// خدمة إدارة التقييمات وتحديث الشهرة
    /// </summary>
    public class RatingService
    {
        private readonly AppDbContext _context;

        public RatingService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// تحديث متوسط التقييم وعدد التقييمات للكيان
        /// </summary>
        public async Task UpdateEntityRatingAsync(string entityType, int entityId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.EntityType == entityType && r.EntityId == entityId)
                .ToListAsync();

            double avgRating = ratings.Any() ? Math.Round(ratings.Average(r => r.Stars), 2) : 0;
            int ratingCount = ratings.Count;

            switch (entityType)
            {
                case EntityTypes.Doctor:
                    var doctor = await _context.Doctors.FindAsync(entityId);
                    if (doctor != null)
                    {
                        doctor.Rating = avgRating;
                        doctor.RatingCount = ratingCount;
                    }
                    break;

                case EntityTypes.Pharmacy:
                    var pharmacy = await _context.Pharmacies.FindAsync(entityId);
                    if (pharmacy != null)
                    {
                        pharmacy.Rating = avgRating;
                        pharmacy.RatingCount = ratingCount;
                    }
                    break;

                case EntityTypes.Company:
                    var company = await _context.Companies.FindAsync(entityId);
                    if (company != null)
                    {
                        company.Rating = avgRating;
                        company.RatingCount = ratingCount;
                    }
                    break;
            }

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// التحقق من وجود الكيان
        /// </summary>
        public async Task<bool> EntityExistsAsync(string entityType, int entityId)
        {
            return entityType switch
            {
                EntityTypes.Doctor => await _context.Doctors.AnyAsync(d => d.Id == entityId),
                EntityTypes.Pharmacy => await _context.Pharmacies.AnyAsync(p => p.Id == entityId),
                EntityTypes.Company => await _context.Companies.AnyAsync(c => c.Id == entityId),
                _ => false
            };
        }
    }

    /// <summary>
    /// ثوابت أنواع الكيانات القابلة للتقييم
    /// </summary>
    public static class EntityTypes
    {
        public const string Doctor = "Doctor";
        public const string Pharmacy = "Pharmacy";
        public const string Company = "Company";
    }
}
