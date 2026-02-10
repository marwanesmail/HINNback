using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace MyHealthcareApi.Hubs
{
    public class NotificationsHub : Hub
    {
        //  دي بيستعملها السيرفر علشان يربط المستخدم بالـ Connection بتاعه في SignalR
        public async Task RegisterUser(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GetUserGroup(userId));
        }

        //  دالة بتشتغل تلقائياً لما المستخدم يتفصل
        public override async Task OnDisconnectedAsync(System.Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        // كل مستخدم بيتخزن في Group خاص بيه لتوصيل الإشعارات الشخصية
        public static string GetUserGroup(string userId) => $"user-{userId}";

        public static string GetPharmacyGroup(int pharmacyId) => $"pharmacy-{pharmacyId}";
    }
}
