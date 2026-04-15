using System.Collections.Concurrent;

namespace MyHealthcareApi.Services
{
    /// <summary>
    /// خدمة تحديد المعدل لمنع التعدي (Rate Limiting)
    /// </summary>
    public interface IRateLimitService
    {
        bool IsAllowed(string userId, string action, int limit, int windowInSeconds);
        Task<bool> IsAllowedAsync(string userId, string action, int limit, int windowInSeconds);
        void ResetLimits(string userId);
        RateLimitInfo GetRateLimitInfo(string userId, string action);
    }

    /// <summary>
    /// معلومات عن حالة الـ Rate Limiting
    /// </summary>
    public class RateLimitInfo
    {
        public int RemainingRequests { get; set; }
        public int TotalLimit { get; set; }
        public DateTime ResetTime { get; set; }
        public bool IsLimited { get; set; }
        public TimeSpan RetryAfter { get; set; }
    }

    public class RateLimitService : IRateLimitService
    {
        // تخزين مؤقت لتتبع الطلبات: userId_action -> قائمة الأوقات
        private readonly ConcurrentDictionary<string, List<DateTime>> _requestLog 
            = new ConcurrentDictionary<string, List<DateTime>>();
        
        private readonly ILogger<RateLimitService> _logger;

        public RateLimitService(ILogger<RateLimitService> logger)
        {
            _logger = logger;
            
            // تنظيف القديم كل ساعة
            Task.Run(async () =>
            {
                while (true)
                {
                    await Task.Delay(TimeSpan.FromHours(1));
                    CleanupOldEntries();
                }
            });
        }

        /// <summary>
        /// التحقق مما إذا كان الطلب مسموحاً به
        /// </summary>
        /// <param name="userId">معرف المستخدم</param>
        /// <param name="action">نوع الإجراء (login, search, upload, etc.)</param>
        /// <param name="limit">أقصى عدد من الطلبات المسموح بها</param>
        /// <param name="windowInSeconds">النافذة الزمنية بالثواني</param>
        public bool IsAllowed(string userId, string action, int limit, int windowInSeconds)
        {
            var key = $"{userId}_{action}";
            var now = DateTime.UtcNow;
            var windowStart = now.AddSeconds(-windowInSeconds);

            // الحصول على سجل الطلبات أو إنشاء جديد
            var requests = _requestLog.GetOrAdd(key, _ => new List<DateTime>());

            lock (requests)
            {
                // إزالة الطلبات القديمة خارج النافذة الزمنية
                requests.RemoveAll(r => r < windowStart);

                // التحقق من العدد
                if (requests.Count >= limit)
                {
                    var oldestRequest = requests.Min();
                    var retryAfter = oldestRequest.AddSeconds(windowInSeconds) - now;
                    
                    _logger.LogWarning(
                        $"Rate limit exceeded for user {userId} on action {action}. " +
                        $"Retry after {retryAfter.TotalSeconds} seconds"
                    );
                    
                    return false;
                }

                // تسجيل الطلب الجديد
                requests.Add(now);
                return true;
            }
        }

        /// <summary>
        /// نسخة غير متزامنة
        /// </summary>
        public Task<bool> IsAllowedAsync(string userId, string action, int limit, int windowInSeconds)
        {
            return Task.FromResult(IsAllowed(userId, action, limit, windowInSeconds));
        }

        /// <summary>
        /// إعادة تعيين حدود المستخدم
        /// </summary>
        public void ResetLimits(string userId)
        {
            foreach (var key in _requestLog.Keys.Where(k => k.StartsWith($"{userId}_")))
            {
                _requestLog.TryRemove(key, out _);
            }
            
            _logger.LogInformation($"Rate limits reset for user {userId}");
        }

        /// <summary>
        /// الحصول على معلومات عن حالة الـ Rate Limiting
        /// </summary>
        public RateLimitInfo GetRateLimitInfo(string userId, string action)
        {
            var key = $"{userId}_{action}";
            var now = DateTime.UtcNow;

            if (!_requestLog.TryGetValue(key, out var requests) || !requests.Any())
            {
                return new RateLimitInfo
                {
                    RemainingRequests = 0,
                    TotalLimit = 0,
                    IsLimited = false
                };
            }

            // نفترض نافذة افتراضية 60 ثانية
            const int defaultWindow = 60;
            var windowStart = now.AddSeconds(-defaultWindow);
            var recentRequests = requests.Where(r => r >= windowStart).ToList();
            
            var oldestRequest = recentRequests.Any() ? recentRequests.Min() : now;
            var resetTime = oldestRequest.AddSeconds(defaultWindow);

            return new RateLimitInfo
            {
                RemainingRequests = Math.Max(0, defaultWindow - recentRequests.Count),
                TotalLimit = defaultWindow,
                ResetTime = resetTime,
                IsLimited = recentRequests.Count >= defaultWindow,
                RetryAfter = recentRequests.Count >= defaultWindow ? resetTime - now : TimeSpan.Zero
            };
        }

        /// <summary>
        /// تنظيف السجلات القديمة
        /// </summary>
        private void CleanupOldEntries()
        {
            var now = DateTime.UtcNow;
            var cutoff = now.AddMinutes(-5);

            foreach (var kvp in _requestLog.ToList())
            {
                lock (kvp.Value)
                {
                    kvp.Value.RemoveAll(r => r < cutoff);
                    
                    if (!kvp.Value.Any())
                    {
                        _requestLog.TryRemove(kvp.Key, out _);
                    }
                }
            }
        }
    }

    /// <summary>
    /// ثوابت إعدادات الـ Rate Limiting
    /// </summary>
    public static class RateLimitPresets
    {
        // تسجيل الدخول: 5 محاولات في 15 دقيقة
        public const int LoginAttempts = 5;
        public const int LoginWindowSeconds = 900;

        // البحث: 30 بحث في الدقيقة
        public const int SearchRequests = 30;
        public const int SearchWindowSeconds = 60;

        // رفع الروشتات: 10 طلبات في الساعة
        public const int PrescriptionUploads = 10;
        public const int PrescriptionWindowSeconds = 3600;

        // إرسال الرسائل: 20 رسالة في الساعة
        public const int MessageSends = 20;
        public const int MessageWindowSeconds = 3600;

        // التقييمات: 5 تقييمات في الساعة
        public const int RatingSubmits = 5;
        public const int RatingWindowSeconds = 3600;

        // API عام: 100 طلب في الدقيقة
        public const int ApiRequests = 100;
        public const int ApiWindowSeconds = 60;
    }
}
