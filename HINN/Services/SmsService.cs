using Microsoft.Extensions.Options;

namespace MyHealthcareApi.Services
{
    /// <summary>
    /// خدمة إرسال الرسائل النصية (SMS)
    /// </summary>
    public interface ISmsService
    {
        Task SendSmsAsync(string phoneNumber, string message);
        Task SendVerificationCodeAsync(string phoneNumber, string code);
        Task SendAppointmentReminderAsync(string phoneNumber, string doctorName, DateTime appointmentTime);
        Task SendPrescriptionReadyAsync(string phoneNumber, string pharmacyName);
        Task SendPasswordResetCodeAsync(string phoneNumber, string code);
    }

    public class SmsService : ISmsService
    {
        private readonly SmsSettings _smsSettings;
        private readonly ILogger<SmsService> _logger;

        public SmsService(IOptions<SmsSettings> smsSettings, ILogger<SmsService> logger)
        {
            _smsSettings = smsSettings.Value;
            _logger = logger;

            // Initialize Twilio (commented out - uncomment when you have valid credentials)
            // if (!string.IsNullOrEmpty(_smsSettings.AccountSid) && 
            //     !string.IsNullOrEmpty(_smsSettings.AuthToken))
            // {
            //     TwilioClient.Init(_smsSettings.AccountSid, _smsSettings.AuthToken);
            // }
        }

        /// <summary>
        /// إرسال رسالة نصية عامة
        /// </summary>
        public async Task SendSmsAsync(string phoneNumber, string message)
        {
            try
            {
                // Skip if Twilio is not configured
                if (string.IsNullOrEmpty(_smsSettings.AccountSid))
                {
                    _logger.LogWarning("Twilio not configured. SMS skipped. To enable SMS, configure Twilio credentials in appsettings.json");
                    return;
                }

                // TODO: Implement actual Twilio sending logic when credentials are available
                // Example code (requires valid Twilio subscription):
                /*
                var messageResource = await MessageResource.CreateAsync(
                    new Twilio.Types.PhoneNumber(phoneNumber),
                    from: new Twilio.Types.PhoneNumber(_smsSettings.SenderNumber),
                    body: message
                );
                */
                
                _logger.LogInformation($"SMS would be sent to {phoneNumber} (Twilio not configured - this is a no-op)");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send SMS to {phoneNumber}. Error: {ex.Message}");
                // Don't throw - SMS failures shouldn't break the main flow
            }
        }

        /// <summary>
        /// إرسال كود التحقق
        /// </summary>
        public async Task SendVerificationCodeAsync(string phoneNumber, string code)
        {
            const string message = "HINN - كود التحقق الخاص بك هو: {0}. صالح لمدة 10 دقائق.";
            
            await SendSmsAsync(phoneNumber, string.Format(message, code));
        }

        /// <summary>
        /// إرسال تذكير بالموعد
        /// </summary>
        public async Task SendAppointmentReminderAsync(string phoneNumber, string doctorName, DateTime appointmentTime)
        {
            var message = $@"HINN - تذكير بموعدك الطبي
الطبيب: {doctorName}
الوقت: {appointmentTime:yyyy-MM-dd HH:mm}

يرجى الحضور قبل الموعد بـ 15 دقيقة";

            await SendSmsAsync(phoneNumber, message);
        }

        /// <summary>
        /// إشعار جاهزية الدواء
        /// </summary>
        public async Task SendPrescriptionReadyAsync(string phoneNumber, string pharmacyName)
        {
            var message = $@"HINN - دوائك جاهز! 🎉

الصيدلية: {pharmacyName}
يمكنك استلام الدواء الآن.

شكراً لاستخدامك منصة HINN";

            await SendSmsAsync(phoneNumber, message);
        }

        /// <summary>
        /// إرسال كود استعادة كلمة المرور
        /// </summary>
        public async Task SendPasswordResetCodeAsync(string phoneNumber, string code)
        {
            var message = $@"HINN - كود إعادة تعيين كلمة المرور

الكود: {code}

⚠️ هذا الكود صالح لمدة 30 دقيقة فقط.
🔒 إذا لم تطلب هذا، يرجى تجاهل الرسالة.";

            await SendSmsAsync(phoneNumber, message);
        }
    }

    /// <summary>
    /// إعدادات خدمة SMS
    /// </summary>
    public class SmsSettings
    {
        public string AccountSid { get; set; } = string.Empty;
        public string AuthToken { get; set; } = string.Empty;
        public string SenderNumber { get; set; } = string.Empty;
    }
}
