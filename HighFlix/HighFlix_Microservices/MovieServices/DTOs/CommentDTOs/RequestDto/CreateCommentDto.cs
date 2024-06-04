namespace MovieServices.DTOs.CommentDTOs.RequestDto
{
    public class CreateCommentDto
    {
        public string CommentContent { get; set; } = null!;

        public int? Rating { get; set; }

        public int UserId { get; set; }
        public int MovieId { get; set; }
    }
}
