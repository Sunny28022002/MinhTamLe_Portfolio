namespace UserService.DTOs
{
    public class UpdateFeedbackRequest
    {
        public int FeedbackId { get; set; }

        public int PatientId { get; set; }

        public string Message { get; set; } = null!;

        public int Rating { get; set; }
    }
}
