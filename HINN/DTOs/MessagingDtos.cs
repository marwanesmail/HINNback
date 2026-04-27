using System;

namespace MyHealthcareApi.DTOs
{
    public class ConversationDto
    {
        public string OtherUserId { get; set; } = null!;
        public string OtherUserName { get; set; } = null!;
        public string? OtherUserProfileImage { get; set; }
        public string? LastMessage { get; set; }
        public DateTime LastMessageTime { get; set; }
        public int UnreadCount { get; set; }
        public string UserType { get; set; } = null!; // Patient, Pharmacy, etc.
    }

    public class DoctorMedicineSearchResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Category { get; set; }
        public string CompanyName { get; set; } = null!;
    }
}
