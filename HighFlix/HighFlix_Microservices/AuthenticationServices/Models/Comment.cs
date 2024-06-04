using System;
using System.Collections.Generic;

namespace AuthenticationServices.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int UserId { get; set; }

    public int MovieId { get; set; }

    public string CommentContent { get; set; } = null!;

    public DateTime CommentedDate { get; set; }

    public int? Rating { get; set; }

    public bool IsActive { get; set; }

    public virtual Movie Movie { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
