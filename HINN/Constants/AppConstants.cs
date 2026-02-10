namespace MyHealthcareApi.Constants
{
    /// <summary>
    /// ثوابت أدوار المستخدمين في النظام
    /// </summary>
    public static class UserRoles
    {
        public const string Admin = "Admin";
        public const string Doctor = "Doctor";
        public const string Pharmacy = "Pharmacy";
        public const string Patient = "Patient";
        public const string Company = "Company";

        /// <summary>
        /// الحصول على جميع الأدوار المتاحة
        /// </summary>
        public static string[] All => new[]
        {
            Admin,
            Doctor,
            Pharmacy,
            Patient,
            Company
        };
    }

    /// <summary>
    /// ثوابت عامة للنظام
    /// </summary>
    public static class AppConstants
    {
        public const int DefaultPageSize = 10;
        public const int MaxPageSize = 50;
        public const double DefaultSearchRadius = 5.0; // كيلومتر
        public const double DefaultFuzzySimilarity = 60.0; // نسبة التشابه
        public const int MinStars = 1;
        public const int MaxStars = 5;
    }
}
