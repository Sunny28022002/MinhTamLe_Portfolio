using System;
using System.Collections.Generic;

namespace ScheduleService.Models;

public partial class MedicineCode
{
    public int CodeId { get; set; }

    public string CodeName { get; set; } = null!;

    public bool IsActive { get; set; }

    public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();
}
