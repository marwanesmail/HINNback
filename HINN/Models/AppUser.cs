using Microsoft.AspNetCore.Identity;

namespace MyHealthcareApi.Models
{
    // Application user extends IdentityUser so Identity manages username, password hash, email...
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; }

        //  نضيف خاصية الدور علشان نعرف نوع المستخدم
        public string? Role { get; set; }
    }
}
