using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.Models;
using System.Diagnostics;
using System.Text.Json;

namespace MyHealthcareApi.Services
{
    /// خدمة تدقيق وتسجيل العمليات (Audit Logging)
    public interface IAuditLogService
    {
        Task LogAsync(string userId, string userName, string actionType, 
            string? entityType = null, Guid? entityId = null, 
            string? description = null, object? oldData = null, 
            object? newData = null, bool success = true, 
            string? errorMessage = null);
        
        Task<List<AuditLog>> GetUserLogsAsync(string userId, int count = 50);
        Task<List<AuditLog>> GetEntityLogsAsync(string entityType, Guid entityId, int count = 50);
        Task<List<AuditLog>> GetRecentLogsAsync(int count = 100);
        Task<List<AuditLog>> GetFailedLogsAsync(int count = 50);
    }

    public class AuditLogService : IAuditLogService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AuditLogService> _logger;

        public AuditLogService(
            AppDbContext context,
            IHttpContextAccessor httpContextAccessor,
            ILogger<AuditLogService> logger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

            /// تسجيل عملية جديدة
            public async Task LogAsync(
            string userId, 
            string userName, 
            string actionType,
            string? entityType = null, 
            Guid? entityId = null,
            string? description = null, 
            object? oldData = null,
            object? newData = null, 
            bool success = true,
            string? errorMessage = null)
        {
            try
            {
                var stopwatch = Stopwatch.StartNew();

                var auditLog = new AuditLog
                {
                    UserId = userId,
                    UserName = userName,
                    ActionType = actionType,
                    EntityType = entityType,
                    EntityId = entityId,
                    Description = description,
                    OldData = oldData != null ? JsonSerializer.Serialize(oldData) : null,
                    NewData = newData != null ? JsonSerializer.Serialize(newData) : null,
                    IpAddress = GetIpAddress(),
                    UserAgent = GetUserAgent(),
                    Success = success,
                    ErrorMessage = errorMessage,
                    CreatedAt = DateTime.UtcNow
                };

                _context.AuditLogs.Add(auditLog);
                await _context.SaveChangesAsync();

                stopwatch.Stop();
                auditLog.ExecutionTimeMs = stopwatch.ElapsedMilliseconds;

                if (!success)
                {
                    _logger.LogWarning(
                        $"Audit: {actionType} by {userName} - Failed: {errorMessage}"
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to create audit log. Action: {actionType}, User: {userId}");
                // Don't throw - audit logging failures shouldn't break the main flow
            }
        }

            /// الحصول على سجلات مستخدم معين
            public async Task<List<AuditLog>> GetUserLogsAsync(string userId, int count = 50)
        {
            return await _context.AuditLogs
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

            /// الحصول على سجلات كيان معين
            public async Task<List<AuditLog>> GetEntityLogsAsync(string entityType, Guid entityId, int count = 50)
        {
            return await _context.AuditLogs
                .Where(a => a.EntityType == entityType && a.EntityId == entityId)
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

            /// الحصول على آخر السجلات
            public async Task<List<AuditLog>> GetRecentLogsAsync(int count = 100)
        {
            return await _context.AuditLogs
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

            /// الحصول على السجلات الفاشلة
            public async Task<List<AuditLog>> GetFailedLogsAsync(int count = 50)
        {
            return await _context.AuditLogs
                .Where(a => !a.Success)
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

            /// الحصول على عنوان IP
            private string? GetIpAddress()
        {
            try
            {
                return _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();
            }
            catch
            {
                return null;
            }
        }

            /// الحصول على معلومات المتصفح
            private string? GetUserAgent()
        {
            try
            {
                return _httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString();
            }
            catch
            {
                return null;
            }
        }
    }

    /// مساعد لتدوين العمليات بشكل أسهل
    public static class AuditHelper
    {
            /// تسجيل عملية إنشاء
            public static async Task LogCreate<T>(
            IAuditLogService auditService, 
            string userId, 
            string userName, 
            T entity,
            string? customDescription = null) where T : class
        {
            await auditService.LogAsync(
                userId, userName, AuditActionTypes.Create,
                entityType: typeof(T).Name,
                entityId: GetEntityId(entity),
                description: customDescription ?? $"Created new {typeof(T).Name}",
                newData: entity,
                success: true
            );
        }

            /// تسجيل عملية تحديث
            public static async Task LogUpdate<T>(
            IAuditLogService auditService,
            string userId,
            string userName,
            T oldEntity,
            T newEntity,
            string? customDescription = null) where T : class
        {
            await auditService.LogAsync(
                userId, userName, AuditActionTypes.Update,
                entityType: typeof(T).Name,
                entityId: GetEntityId(newEntity),
                description: customDescription ?? $"Updated {typeof(T).Name}",
                oldData: oldEntity,
                newData: newEntity,
                success: true
            );
        }

            /// تسجيل عملية حذف
            public static async Task LogDelete<T>(
            IAuditLogService auditService,
            string userId,
            string userName,
            T entity,
            string? customDescription = null) where T : class
        {
            await auditService.LogAsync(
                userId, userName, AuditActionTypes.Delete,
                entityType: typeof(T).Name,
                entityId: GetEntityId(entity),
                description: customDescription ?? $"Deleted {typeof(T).Name}",
                oldData: entity,
                success: true
            );
        }

            /// استخراج معرف الكيان (يدعم int و Guid)
            private static Guid? GetEntityId(object? entity)
        {
            if (entity == null) return null;

            var property = entity.GetType().GetProperty("Id");
            if (property != null)
            {
                var value = property.GetValue(entity);
                
                // دعم int
                if (value is int intId)
                    return new Guid(intId, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                
                // دعم Guid مباشرة
                if (value is Guid guidId)
                    return guidId;
            }

            return null;
        }
    }
}
