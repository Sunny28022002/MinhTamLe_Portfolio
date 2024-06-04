namespace UserService.DTOs
{
    public class SaveChatRequest
    {
        public int ChatId { get; set; }
        public int ReceiverId { get; set; }

        public int SenderId { get; set; }

        public string Message { get; set; } = null!;

        public DateTime SendingTime { get; set; }
        public bool IsActive { get; set; }

    }
}
