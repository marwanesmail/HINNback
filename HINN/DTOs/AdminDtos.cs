using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    public class PendingAccountDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty; // Doctor, Pharmacy, Company
        public string AccountTypeArabic { get; set; } = string.Empty; // طبيب، صيدلية، شركة
        public string Status { get; set; } = "قيد الانتظار";
    }

    public class AccountDetailsDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        
        // Generic Name for the Modal Header
        public string Name { get; set; } = string.Empty;

        // Common Names
        public string? FullName { get; set; }
        public string? PharmacyName { get; set; }
        public string? CompanyName { get; set; }

        // Doctor Specific
        public string? Specialty { get; set; }
        
        // Pharmacy Specific
        public string? Address { get; set; }
        public string? Phone2 { get; set; }
        public string? WorkingHours { get; set; }
        public string? DeliveryArea { get; set; }

        // Company Specific
        public string? LicenseNumber { get; set; }
        
        // الصور والمستندات (روابط كاملة)
        public string? LicenseImageUrl { get; set; } // صورة كارنيه النقابة أو الرخصة
        public string? TaxDocumentUrl { get; set; } // البطاقة الضريبية (للصيدليات)
        public string? CommercialRecordUrl { get; set; } // السجل التجاري (للصيدليات)
        public string? ProfileImageUrl { get; set; } // صورة البروفايل الشخصي
        
        public DateTime CreatedAt { get; set; }
    }

    public class UserManagementDto
    {
        public string Id { get; set; } = string.Empty; // AppUserId
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty;
        public string AccountTypeArabic { get; set; } = string.Empty; // طبيب، صيدلية، شركة أدواية، مريض
        public string Status { get; set; } = string.Empty; // مفعل، معلق
    }

    public class ChangeAdminEmailDto
    {
        [Required(ErrorMessage = "البريد الإلكتروني الحالي مطلوب")]
        [EmailAddress(ErrorMessage = "صيغة البريد غير صحيحة")]
        public string CurrentEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "البريد الإلكتروني الجديد مطلوب")]
        [EmailAddress(ErrorMessage = "صيغة البريد غير صحيحة")]
        public string NewEmail { get; set; } = string.Empty;
    }

    public class ChangeAdminPasswordDto
    {
        [Required(ErrorMessage = "كلمة المرور الحالية مطلوبة")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "كلمة المرور الجديدة مطلوبة")]
        [MinLength(6, ErrorMessage = "يجب ألا تقل كلمة المرور عن 6 أحرف")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
