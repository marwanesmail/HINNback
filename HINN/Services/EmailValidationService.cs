using DnsClient;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace MyHealthcareApi.Services
{
    public interface IEmailValidationService
    {
        Task<(bool isValid, string message)> ValidateEmailAsync(string email);
    }

    public class EmailValidationService : IEmailValidationService
    {
        private readonly LookupClient _lookupClient;

        public EmailValidationService()
        {
            _lookupClient = new LookupClient();
        }

        public async Task<(bool isValid, string message)> ValidateEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return (false, "البريد الإلكتروني مطلوب");

            // 1. التحقق من الصيغة (Regex)
            if (!IsValidFormat(email))
                return (false, "صيغة البريد الإلكتروني غير صحيحة");

            // 2. استخراج الدومين
            var domain = email.Split('@').Last();

            // 3. التحقق من وجود سجلات MX (التأكد أن الدومين يستقبل بريد)
            try
            {
                var result = await _lookupClient.QueryAsync(domain, QueryType.MX);
                if (!result.Answers.MxRecords().Any())
                {
                    return (false, "هذا البريد ينتمي لنطاق غير موجود أو لا يستقبل رسائل");
                }
            }
            catch (Exception)
            {
                return (false, "فشل التحقق من نطاق البريد الإلكتروني");
            }

            return (true, "البريد الإلكتروني صالح");
        }

        private bool IsValidFormat(string email)
        {
            try
            {
                var addr = new MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
