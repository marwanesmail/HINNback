using Microsoft.AspNetCore.SignalR;
using MyHealthcareApi.Data;
using MyHealthcareApi.Hubs;
using MyHealthcareApi.Models;

namespace MyHealthcareApi.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string userId, string title, string message, string type, string? relatedEntityId = null);
    }

    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationsHub> _hubContext;

        public NotificationService(AppDbContext context, IHubContext<NotificationsHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task SendNotificationAsync(string userId, string title, string message, string type, string? relatedEntityId = null)
        {
            // 1. حفظ في قاعدة البيانات
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                RelatedEntityId = relatedEntityId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 2. إرسال إشعار لحظي (Real-time) باستخدام SignalR
            var groupName = NotificationsHub.GetUserGroup(userId);
            await _hubContext.Clients.Group(groupName).SendAsync("ReceiveNotification", new
            {
                notification.Id,
                notification.Title,
                notification.Message,
                notification.Type,
                notification.RelatedEntityId,
                notification.CreatedAt
            });
        }
    }
}
