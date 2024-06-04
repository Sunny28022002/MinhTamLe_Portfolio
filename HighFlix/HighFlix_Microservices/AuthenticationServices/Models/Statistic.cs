using System;
using System.Collections.Generic;

namespace AuthenticationServices.Models;

public partial class Statistic
{
    public int StatisticId { get; set; }

    public int MovieId { get; set; }

    public DateTime Date { get; set; }

    public int View { get; set; }

    public virtual Movie Movie { get; set; } = null!;
}
