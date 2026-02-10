namespace MyHealthcareApi.DTOs
{
    public class MedicineSearchRequest
    {
        public string MedicineName { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double RadiusKm { get; set; } = 5.0; // default radius
        public string PatientId { get; set; } = null!; // from frontend if known (or server can derive from token)
    }
}
