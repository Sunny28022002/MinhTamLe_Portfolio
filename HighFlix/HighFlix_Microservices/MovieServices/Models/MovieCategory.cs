using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MovieServices.Models;

[PrimaryKey(nameof(MovieId), nameof(CategoryId))]
public partial class MovieCategory
{
    public int MovieId { get; set; }

    public int CategoryId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Movie Movie { get; set; } = null!;
}
