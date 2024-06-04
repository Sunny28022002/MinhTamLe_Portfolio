using BlogService.Models;

namespace BlogService.DTOs
{
    public class BlogResponse
    {
        public int BlogId { get; set; }

        public int UserId { get; set; }

        public string Title { get; set; }

        public string Content { get; set; } = null!;

        public DateTime WritingDate { get; set; }

        public DateTime PublishedDate { get; set; }

        public bool IsDraft { get; set; }

        public bool IsActive { get; set; }
    }
}
