using System;
using System.Collections.Generic;

namespace UserService.Models;

public partial class MedicineCode
{
    public int CodeId { get; set; }

    public string CodeName { get; set; } = null!;

    public bool IsActive { get; set; }

    public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
}
