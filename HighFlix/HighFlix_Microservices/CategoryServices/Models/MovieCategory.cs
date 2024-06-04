using System;
using System.Collections.Generic;

namespace CategoryServices.Models;

public partial class MovieCategory
{
    public int MovieId { get; set; }

    public int CategoryId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Movie Movie { get; set; } = null!;
}
