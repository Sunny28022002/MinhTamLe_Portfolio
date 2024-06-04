namespace UserService.DTOs
{
    public class ChatResponse
    {
        public int ChatId { get; set; }

        public int DoctorId { get; set; }

        public int PatientId { get; set; }

        public DateTime ChatDate { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string TotalTime { get; set; } = null!;

        public bool IsActive { get; set; }
    }
}
