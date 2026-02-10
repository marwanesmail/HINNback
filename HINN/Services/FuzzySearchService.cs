namespace MyHealthcareApi.Services
{
    /// <summary>
    /// خدمة البحث الذكي (Fuzzy Search) باستخدام Levenshtein Distance
    /// </summary>
    public class FuzzySearchService
    {
        /// <summary>
        /// حساب المسافة بين نصين (Levenshtein Distance)
        /// </summary>
        public int CalculateLevenshteinDistance(string source, string target)
        {
            if (string.IsNullOrEmpty(source))
                return string.IsNullOrEmpty(target) ? 0 : target.Length;

            if (string.IsNullOrEmpty(target))
                return source.Length;

            int sourceLength = source.Length;
            int targetLength = target.Length;
            int[,] distance = new int[sourceLength + 1, targetLength + 1];

            // تهيئة الصف والعمود الأول
            for (int i = 0; i <= sourceLength; distance[i, 0] = i++) { }
            for (int j = 0; j <= targetLength; distance[0, j] = j++) { }

            // حساب المسافة
            for (int i = 1; i <= sourceLength; i++)
            {
                for (int j = 1; j <= targetLength; j++)
                {
                    int cost = (target[j - 1] == source[i - 1]) ? 0 : 1;
                    distance[i, j] = Math.Min(
                        Math.Min(distance[i - 1, j] + 1, distance[i, j - 1] + 1),
                        distance[i - 1, j - 1] + cost);
                }
            }

            return distance[sourceLength, targetLength];
        }

        /// <summary>
        /// حساب نسبة التشابه بين نصين (0-100%)
        /// </summary>
        /// <param name="source">النص الأول</param>
        /// <param name="target">النص الثاني</param>
        /// <returns>نسبة التشابه من 0 إلى 100</returns>
        public double CalculateSimilarity(string source, string target)
        {
            if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target))
                return 0;

            int maxLength = Math.Max(source.Length, target.Length);
            if (maxLength == 0) return 100;

            int distance = CalculateLevenshteinDistance(source.ToLower(), target.ToLower());
            return (1.0 - (double)distance / maxLength) * 100;
        }

        /// <summary>
        /// فحص هل النصان متشابهان بنسبة معينة
        /// </summary>
        public bool IsSimilar(string source, string target, double minSimilarityPercentage = 60)
        {
            return CalculateSimilarity(source, target) >= minSimilarityPercentage;
        }
    }
}
