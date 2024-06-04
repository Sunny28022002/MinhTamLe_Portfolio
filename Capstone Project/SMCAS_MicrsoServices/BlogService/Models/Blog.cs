using System;
using System.Collections.Generic;

namespace BlogService.Models;

public partial class Blog
{
    public int BlogId { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime WritingDate { get; set; }

    public DateTime PublishedDate { get; set; }

    public bool IsDraft { get; set; }

    public bool IsActive { get; set; }

    public virtual User User { get; set; } = null!;
}
