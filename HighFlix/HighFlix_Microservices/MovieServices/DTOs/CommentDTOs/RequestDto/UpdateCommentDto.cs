namespace MovieServices.DTOs.CommentDTOs.RequestDto
{
    public class UpdateCommentDto
    {
        public int CommentId { get; set; }
        public string CommentContent { get; set; } = null!;
    }
}
