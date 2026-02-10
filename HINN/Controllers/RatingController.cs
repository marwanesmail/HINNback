using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class RatingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly RatingService _ratingService;

        public RatingController(AppDbContext context, RatingService ratingService)
        {
            _context = context;
            _ratingService = ratingService;
        }

        //  إضافة تقييم جديد أو تعديل تقييم موجود
        [HttpPost]
        public async Task<IActionResult> AddOrUpdateRating([FromBody] AddRatingDto dto)
        {
            var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized();

            // التحقق من وجود الكيان
            bool entityExists = await _ratingService.EntityExistsAsync(dto.EntityType, dto.EntityId);
            if (!entityExists)
                return NotFound($"{dto.EntityType} غير موجود");

            // البحث عن تقييم سابق
            var existingRating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.UserId == userId &&
                                         r.EntityType == dto.EntityType &&
                                         r.EntityId == dto.EntityId);

            if (existingRating != null)
            {
                // تعديل التقييم الموجود
                existingRating.Stars = dto.Stars;
                existingRating.Comment = dto.Comment;
                existingRating.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await _ratingService.UpdateEntityRatingAsync(dto.EntityType, dto.EntityId);

                return Ok(new { Message = "تم تعديل التقييم بنجاح", RatingId = existingRating.Id });
            }
            else
            {
                // إضافة تقييم جديد
                var newRating = new Rating
                {
                    UserId = userId,
                    EntityType = dto.EntityType,
                    EntityId = dto.EntityId,
                    Stars = dto.Stars,
                    Comment = dto.Comment
                };

                _context.Ratings.Add(newRating);
                await _context.SaveChangesAsync();
                await _ratingService.UpdateEntityRatingAsync(dto.EntityType, dto.EntityId);

                return Ok(new { Message = "تم إضافة التقييم بنجاح", RatingId = newRating.Id });
            }
        }

        //  عرض تقييمات كيان معين
        [HttpGet("{entityType}/{entityId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRatings(string entityType, int entityId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.EntityType == entityType && r.EntityId == entityId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new RatingResponseDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = r.User.FullName ?? r.User.UserName,
                    EntityType = r.EntityType,
                    EntityId = r.EntityId,
                    Stars = r.Stars,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync();

            return Ok(ratings);
        }

        //  عرض إحصائيات التقييم
        [HttpGet("{entityType}/{entityId}/stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRatingStats(string entityType, int entityId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.EntityType == entityType && r.EntityId == entityId)
                .ToListAsync();

            if (!ratings.Any())
            {
                return Ok(new RatingStatsDto
                {
                    AverageRating = 0,
                    TotalRatings = 0
                });
            }

            var stats = new RatingStatsDto
            {
                AverageRating = Math.Round(ratings.Average(r => r.Stars), 2),
                TotalRatings = ratings.Count,
                FiveStars = ratings.Count(r => r.Stars == 5),
                FourStars = ratings.Count(r => r.Stars == 4),
                ThreeStars = ratings.Count(r => r.Stars == 3),
                TwoStars = ratings.Count(r => r.Stars == 2),
                OneStar = ratings.Count(r => r.Stars == 1)
            };

            return Ok(stats);
        }

        //  حذف تقييم
        [HttpDelete("{ratingId}")]
        public async Task<IActionResult> DeleteRating(int ratingId)
        {
            var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized();

            var rating = await _context.Ratings.FindAsync(ratingId);
            if (rating == null)
                return NotFound("التقييم غير موجود");

            if (rating.UserId != userId)
                return Forbid("لا يمكنك حذف تقييم شخص آخر");

            _context.Ratings.Remove(rating);
            await _context.SaveChangesAsync();
            await _ratingService.UpdateEntityRatingAsync(rating.EntityType, rating.EntityId);

            return Ok(new { Message = "تم حذف التقييم بنجاح" });
        }
    }
}
