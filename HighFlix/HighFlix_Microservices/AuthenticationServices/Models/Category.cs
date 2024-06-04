using System;
using System.Collections.Generic;

namespace AuthenticationServices.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public bool IsActive { get; set; }
}
