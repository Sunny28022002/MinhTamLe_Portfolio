namespace BlogService.DTOs
{
    public class UpdateBlogResquest
    {
        public int BlogId { get; set; }

        public string Title { get; set; }

        public string Content { get; set; } = null!;

        public bool IsDraft { get; set; }
    }
}
