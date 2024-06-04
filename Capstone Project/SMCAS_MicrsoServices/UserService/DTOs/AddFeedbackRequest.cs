namespace UserService.DTOs
{
    public class AddFeedbackRequest
    {
        public int DoctorId { get; set; }

        public int PatientId { get; set; }

        public string Message { get; set; } = null!;

        public int Rating { get; set; }
    }
}
