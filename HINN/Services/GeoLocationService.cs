namespace MyHealthcareApi.Services
{
    /// <summary>
    /// خدمة حساب المسافات الجغرافية والعمليات المتعلقة بالموقع
    /// </summary>
    public class GeoLocationService
    {
        /// <summary>
        /// حساب المسافة بين نقطتين جغرافيتين باستخدام Haversine Formula
        /// </summary>
        /// <param name="lat1">خط العرض للنقطة الأولى</param>
        /// <param name="lon1">خط الطول للنقطة الأولى</param>
        /// <param name="lat2">خط العرض للنقطة الثانية</param>
        /// <param name="lon2">خط الطول للنقطة الثانية</param>
        /// <returns>المسافة بالكيلومتر</returns>
        public double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; // نصف قطر الأرض بالكيلومتر

            double dLat = ToRadians(lat2 - lat1);
            double dLon = ToRadians(lon2 - lon1);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c;
        }

        /// <summary>
        /// تحويل الدرجات إلى راديان
        /// </summary>
        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }
    }
}
