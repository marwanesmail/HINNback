using System.ComponentModel.DataAnnotations;

namespace MyHealthcareApi.DTOs
{
    /// DTO لحجز موعد جديد
    public class BookAppointmentDto
    {
        // معلومات الموعد
        
        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public TimeSpan AppointmentTime { get; set; }

            /// نوع الموعد: كشف، متابعة، طوارئ، استشارة
            [Required, MaxLength(50)]
        public string AppointmentType { get; set; } = null!;

            /// التخصص المطلوب
            public string? Specialty { get; set; }

            /// ID الطبيب (اختياري)
            public string? DoctorId { get; set; }

            /// ملاحظات المريض
            public string? PatientNotes { get; set; }
    }

    /// DTO لتحديث موعد (للطبيب)
    public class UpdateAppointmentDto
    {
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public string? AppointmentType { get; set; }
        public string? DoctorNotes { get; set; }
        public string? Diagnosis { get; set; }
        public string? Prescription { get; set; }
    }

    /// DTO لعرض الموعد
    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        
        // معلومات الموعد
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public string AppointmentType { get; set; } = null!;
        public string? Specialty { get; set; }
        
        // حالة الموعد
        public string Status { get; set; } = null!; // Upcoming, Completed, Cancelled, NoShow
        public string StatusArabic { get; set; } = null!;
        
        // الطبيب
        public string? DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string? DoctorSpecialty { get; set; }
        
        // المريض
        public string PatientId { get; set; } = null!;
        public string PatientName { get; set; } = null!;
        
        // ملاحظات
        public string? PatientNotes { get; set; }
        public string? DoctorNotes { get; set; }
        public string? Diagnosis { get; set; }
        public string? Prescription { get; set; }
        
        // تواريخ
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string? CancellationReason { get; set; }

        // بيانات مساعدة للـ Frontend
        
            /// التاريخ بصيغة عربية
            public string DateFormatted
        {
            get => AppointmentDate.ToString("yyyy-MM-dd");
        }

            /// الوقت بصيغة 12 ساعة
            public string TimeFormatted
        {
            get
            {
                var dateTime = DateTime.Today.Add(AppointmentTime);
                return dateTime.ToString("hh:mm tt");
            }
        }

            /// هل الموعد لسه قادم؟
            public bool IsUpcoming
        {
            get
            {
                var appointmentDateTime = AppointmentDate.Add(AppointmentTime);
                return appointmentDateTime > DateTime.UtcNow && Status == "Upcoming";
            }
        }

            /// هل يمكن إلغاء الموعد؟
            public bool CanCancel
        {
            get
            {
                var appointmentDateTime = AppointmentDate.Add(AppointmentTime);
                return appointmentDateTime > DateTime.UtcNow.AddHours(2) && Status == "Upcoming";
            }
        }
    }

    /// DTO لعرض قائمة المواعيد مع الفلترة
    public class AppointmentsListResponseDto
    {
        public List<AppointmentResponseDto> Appointments { get; set; } = new();
        public int TotalCount { get; set; }
        public int UpcomingCount { get; set; }
        public int CompletedCount { get; set; }
        public int CancelledCount { get; set; }
    }

    /// DTO لإلغاء موعد
    public class CancelAppointmentDto
    {
        public string? CancellationReason { get; set; }
    }

    /// DTO لعرض سجل طبي (روشتة أو موعد)
    public class MedicalRecordResponseDto
    {
        public string RecordType { get; set; } = null!; // Prescription, Appointment
        public string RecordTypeName { get; set; } = null!; // روشتة طبية, موعد طبي
        
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        
        public string? DoctorName { get; set; }
        public string? Diagnosis { get; set; }
        
        public string Status { get; set; } = null!;
        public string StatusArabic { get; set; } = null!;
        
        public bool HasImage { get; set; }
    }

    // DTOs لعرض الدكاترة المتاحين

    public class AvailableDoctorDto
    {
        public string DoctorId { get; set; } = null!;
        public string DoctorName { get; set; } = null!;
        public string? Specialty { get; set; }
        public double Rating { get; set; }
        public int RatingCount { get; set; }
        public int ViewCount { get; set; }
        public int AvailableSlotsCount { get; set; }
        public DateTime? EarliestAvailable { get; set; }
        public decimal ConsultationFee { get; set; }
        public List<AvailableSlotDto> AvailableSlots { get; set; } = new();
    }

    public class AvailableSlotDto
    {
        public int AvailabilityId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int DurationMinutes { get; set; }
        public decimal ConsultationFee { get; set; }
        public string? Location { get; set; }
        public string AppointmentType { get; set; } = null!;
    }

    public class BookFromAvailabilityDto
    {
        [Required]
        public int AvailabilityId { get; set; }

        public string? PatientNotes { get; set; }
    }
}
