namespace UserService.DTOs
{
    public class DeleteFeedbackRequest
    {
        public int FeedbackId { get; set; }

        public int PatientId { get; set; }
    }
}
