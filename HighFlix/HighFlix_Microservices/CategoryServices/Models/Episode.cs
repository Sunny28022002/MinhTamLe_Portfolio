using System;
using System.Collections.Generic;

namespace CategoryServices.Models;

public partial class Episode
{
    public int EpisodeId { get; set; }

    public int MovieId { get; set; }

    public string EpisodeName { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string? MediaContent { get; set; }

    public bool IsActive { get; set; }

    public string? MediaLink { get; set; }

    public virtual Movie Movie { get; set; } = null!;
}
