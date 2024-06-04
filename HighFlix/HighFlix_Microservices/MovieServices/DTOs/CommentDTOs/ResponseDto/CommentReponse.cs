namespace APIS.DTOs.CommentDTOs.ResponseDto
{
    public class CommentResponse
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }

        public int MovieId { get; set; }

        public string CommentContent { get; set; } = null!;

        public DateTime CommentedDate { get; set; }

        public int? Rating { get; set; }

    }
}
