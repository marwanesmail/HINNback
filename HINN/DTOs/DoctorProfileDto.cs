namespace MyHealthcareApi.DTOs
{
    /// <summary>
    /// Full doctor profile response — matches DoctorProfilePage.jsx and DoctorSettingsSection.jsx field names.
    /// </summary>
    public class DoctorProfileResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Specialization { get; set; }
        public string? LicenseNumber { get; set; }
        public string? ProfileImagePath { get; set; }

        // Personal info (DoctorSettingsSection - personal tab)
        public string? Bio { get; set; }
        public int YearsOfExperience { get; set; }

        // Clinic info (DoctorSettingsSection - clinic tab)
        public string? ClinicName { get; set; }
        public string? Address { get; set; }
        public string? ClinicPhone { get; set; }
        public decimal ConsultationFee { get; set; }
        public string? ConsultationType { get; set; }
        public int SessionDuration { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // Stats
        public double Rating { get; set; }
        public int RatingCount { get; set; }
        public bool IsApproved { get; set; }
    }

    /// <summary>
    /// Update payload — maps all editable fields from DoctorSettingsSection tabs.
    /// </summary>
    public class UpdateDoctorProfileDto
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Specialization { get; set; }

        // Personal tab
        public string? Bio { get; set; }
        public int YearsOfExperience { get; set; }

        // Clinic tab
        public string? ClinicName { get; set; }
        public string? Address { get; set; }
        public string? ClinicPhone { get; set; }
        public decimal ConsultationFee { get; set; }
        public string? ConsultationType { get; set; }
        public int SessionDuration { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    /// <summary>
    /// Single appointment detail with isNewPatient flag for the frontend badge.
    /// </summary>
    public class DoctorAppointmentDetailDto
    {
        public int Id { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string? PatientPhone { get; set; }
        public string? PatientEmail { get; set; }
        public int PatientAge { get; set; }
        public string Date { get; set; } = string.Empty;
        public string? Time { get; set; }
        public int Duration { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; } = string.Empty; // "confirmed" | "pending" | "completed" | "cancelled"
        public string? Notes { get; set; }
        public string? Diagnosis { get; set; }
        public bool IsNewPatient { get; set; }
        public string? AppointmentType { get; set; }
    }

    /// <summary>
    /// Complete appointment action body — diagnosis and notes.
    /// </summary>
    public class CompleteAppointmentDto
    {
        public string? Diagnosis { get; set; }
        public string? DoctorNotes { get; set; }
    }

    /// <summary>
    /// Patient summary item in the doctor's patients list.
    /// </summary>
    public class DoctorPatientSummaryDto
    {
        public string PatientId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int Age { get; set; }
        public int TotalAppointments { get; set; }
        public string? LastVisitDate { get; set; }
        public string? LastVisitStatus { get; set; }
    }
}
