using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace MyHealthcareApi.Services
{
    /// <summary>
    /// خدمة إرسال البريد الإلكتروني
    /// </summary>
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string message);
        Task SendWelcomeEmailAsync(string email, string userName);
        Task SendActivationEmailAsync(string email, string activationLink);
        Task SendPendingApprovalEmailAsync(string email, string entityType);
        Task SendPasswordResetEmailAsync(string email, string resetLink);
        Task SendApprovalNotificationAsync(string email, string entityType);
        Task SendPrescriptionNotificationAsync(string email, string prescriptionTitle);
    }

    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        /// إرسال بريد إلكتروني عام
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            try
            {
                using var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
                {
                    Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.SmtpPassword),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
                
                _logger.LogInformation($"Email sent successfully to {email} - Subject: {subject}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {email}. Error: {ex.Message}");
                // Don't throw - email failures shouldn't break the main flow
            }
        }

        /// إرسال بريد ترحيبي
        public async Task SendWelcomeEmailAsync(string email, string userName)
        {
            const string subject = "مرحباً بك في HINN - منصة الرعاية الصحية";
            
            var message = $@"
                <html>
                <body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>
                    <h2 style='color: #2E86AB;'>أهلاً وسهلاً يا {userName}! 👋</h2>
                    
                    <p>نشكرك لانضمامك إلى منصة <strong>HINN</strong> للرعاية الصحية.</p>
                    
                    <div style='background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <h3>ماذا يمكنك أن تفعل الآن؟</h3>
                        <ul>
                            <li>🔍 البحث عن الأدوية والصيدليات القريبة</li>
                            <li>👨‍⚕️ التواصل مع الأطباء المتخصصين</li>
                            <li>💊 رفع الروشتات والحصول على أفضل العروض</li>
                            <li>⭐ تقييم الخدمات والمقدمين</li>
                        </ul>
                    </div>
                    
                    <p style='color: #666;'>فريق HINN للرعاية الصحية</p>
                    <p style='font-size: 12px; color: #999;'>هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.</p>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, message);
        }

        /// إرسال بريد تفعيل الحساب
        public async Task SendActivationEmailAsync(string email, string activationLink)
        {
            const string subject = "تفعيل حسابك - HINN";
            
            var message = $@"
                <html>
                <body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>
                    <h2 style='color: #2E86AB;'>تفعيل الحساب 🔐</h2>
                    
                    <p>مرحباً بك! يرجى تأكيد بريدك الإلكتروني لتفعيل حسابك والبدء في استخدام التطبيق.</p>
                    
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{activationLink}' 
                           style='background-color: #27AE60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                            تفعيل الحساب
                        </a>
                    </div>
                    
                    <p style='color: #666; font-size: 14px;'>
                        ⚠️ إذا لم تقم بإنشاء حساب لدينا، يرجى تجاهل هذا البريد.
                    </p>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, message);
        }

        /// إرسال إشعار قيد المراجعة (الدكاترة والصيدليات والشركات)
        public async Task SendPendingApprovalEmailAsync(string email, string entityType)
        {
            string entityNameAr = entityType switch
            {
                "Pharmacy" => "الصيدلية",
                "Doctor" => "حساب الطبيب",
                "Company" => "الشركة",
                _ => "حسابك"
            };

            const string subject = "حسابك قيد المراجعة - HINN";
            
            var message = $@"
                <html>
                <body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>
                    <h2 style='color: #F39C12;'>مرحباً بك! حسابك قيد المراجعة ⏳</h2>
                    
                    <p>نشكرك على تسجيل {entityNameAr} في منصة HINN.</p>
                    
                    <div style='background-color: #fff8e1; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <p>حالياً، يقوم فريقنا بمراجعة طلبك والبيانات المرفقة لضمان الجودة والأمان.</p>
                        <p>سنرسل لك بريداً إلكترونياً آخر فور الموافقة على حسابك لتبدأ في تقديم خدماتك.</p>
                    </div>
                    
                    <p style='color: #666;'>فريق HINN للرعاية الصحية</p>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, message);
        }

        /// إرسال بريد استعادة كلمة المرور
        public async Task SendPasswordResetEmailAsync(string email, string resetLink)
        {
            const string subject = "إعادة تعيين كلمة المرور - HINN";
            
            var message = $@"
                <html>
                <body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>
                    <h2 style='color: #E74C3C;'>طلب إعادة تعيين كلمة المرور 🔐</h2>
                    
                    <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك.</p>
                    
                    <div style='text-align: center; margin: 30px 0;'>
                        <a href='{resetLink}' 
                           style='background-color: #2E86AB; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                            إعادة تعيين كلمة المرور
                        </a>
                    </div>
                    
                    <p style='color: #666; font-size: 14px;'>
                        ⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط.
                    </p>
                    
                    <p style='color: #999; font-size: 12px;'>
                        إذا لم تطلب هذا، يرجى تجاهل هذا البريد الإلكتروني.
                    </p>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, message);
        }

        /// إرسال إشعار بالموافقة على الحساب
        public async Task SendApprovalNotificationAsync(string email, string entityType)
        {
            string entityNameAr = entityType switch
            {
                "Pharmacy" => "الصيدلية",
                "Doctor" => "الحساب الطبي",
                "Company" => "الشركة",
                _ => "حسابك"
            };

            const string subject = "تم قبول حسابك - HINN ";
            
            var message = $@"
                <html>
                <body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>
                    <h2 style='color: #27AE60;'>تم قبول {entityNameAr}! 🎉</h2>
                    
                    <p>مبروك! تمت الموافقة على {entityNameAr} الخاص بك من قبل إدارة المنصة.</p>
                    
                    <div style='background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <p>الآن يمكنك:</p>
                        <ul>
                            <li>✅ تسجيل الدخول إلى حسابك</li>
                            <li>✅ الوصول إلى جميع الميزات</li>
                            {(entityType == "Pharmacy" ? "<li>✅ استقبال طلبات الأدوية من المرضى</li>" : "")}
                            {(entityType == "Doctor" ? "<li>✅ عرض ملفك الشخصي للمرضى</li>" : "")}
                            {(entityType == "Company" ? "<li>✅ التفاعل مع الصيدليات والمرضى</li>" : "")}
                        </ul>
                    </div>
                    
                    <p style='color: #666;'>فريق HINN للرعاية الصحية</p>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, message);
        }

        /// إرسال إشعار بوصفة طبية جديدة
        public async Task SendPrescriptionNotificationAsync(string email, string prescriptionTitle)
        {
            const string subject = "وصفة طبية جديدة - HINN 💊";
            
            var message = $@"
                <html>
                <body style='font-family: Arial, sans-serif; direction: rtl; text-align: right;'>
                    <h2 style='color: #2E86AB;'>وصفة طبية جديدة 📋</h2>
                    
                    <p>لديك طلب جديد لدواء: <strong>{prescriptionTitle}</strong></p>
                    
                    <div style='background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <p>يرجى تسجيل الدخول إلى حسابك للرد على هذا الطلب.</p>
                    </div>
                    
                    <p style='color: #666;'>فريق HINN للرعاية الصحية</p>
                </body>
                </html>
            ";

            await SendEmailAsync(email, subject, message);
        }
    }

    /// <summary>
    /// إعدادات البريد الإلكتروني
    /// </summary>
    public class EmailSettings
    {
        public string SmtpServer { get; set; } = string.Empty;
        public int SmtpPort { get; set; } = 587;
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string SmtpPassword { get; set; } = string.Empty;
    }
}
