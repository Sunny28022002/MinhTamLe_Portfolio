﻿namespace UserService.DTOs
{
    public class FeedbackResponse
    {
        public int FeedbackId { get; set; }

        public int DoctorId { get; set; }

        public int PatientId { get; set; }

        public DateTime FeedbackDate { get; set; }

        public string Message { get; set; } = null!;

        public int Rating { get; set; }

        public bool IsActive { get; set; }
    }
}
