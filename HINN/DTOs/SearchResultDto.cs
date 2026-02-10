namespace MyHealthcareApi.DTOs
{
    // طلب البحت العام
    public class GeneralSearchRequest
    {
        public string Query { get; set; } = null!;
        public string? Type { get; set; } // medicine, doctor, pharmacy, company (optional)
        public int PageNumber { get; set; } = 1; // رقم الصفحة
        public int PageSize { get; set; } = 10; // عدد النتائج في الصفحة
        public bool UseFuzzy { get; set; } = false; // فعّل Fuzzy Search (يتحمل الأخطاء)
        public double MinSimilarity { get; set; } = 60; // أدنى نسبة تشابه للـ Fuzzy Search
    }

    // نتيجة البحث العام
    public class SearchResultDto
    {
        public List<string> Medicines { get; set; } = new();
        public int TotalMedicines { get; set; }

        public List<DoctorSearchResult> Doctors { get; set; } = new();
        public int TotalDoctors { get; set; }

        public List<PharmacySearchResult> Pharmacies { get; set; } = new();
        public int TotalPharmacies { get; set; }

        public List<CompanySearchResult> Companies { get; set; } = new();
        public int TotalCompanies { get; set; }

        // Pagination info
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => TotalMedicines > 0 ? (int)Math.Ceiling(TotalMedicines / (double)PageSize) : 0;
    }

    public class DoctorSearchResult
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Specialty { get; set; }
        public string? Email { get; set; }
        public int ViewCount { get; set; }
        public double Rating { get; set; }
    }

    public class PharmacySearchResult
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int ViewCount { get; set; }
        public double Rating { get; set; }
    }

    public class CompanySearchResult
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Email { get; set; }
        public int ViewCount { get; set; }
        public double Rating { get; set; }
    }

    // طلب البحث بالقرب من موقع
    public class NearbySearchRequest
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double RadiusKm { get; set; } = 5;
        public string? Type { get; set; } // pharmacy, doctor
    }

    public class NearbySearchResult
    {
        public List<NearbyPharmacyResult> Pharmacies { get; set; } = new();
    }

    public class NearbyPharmacyResult
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double Distance { get; set; } // بالكيلومتر
        public int ViewCount { get; set; }
        public double Rating { get; set; }
    }
}
