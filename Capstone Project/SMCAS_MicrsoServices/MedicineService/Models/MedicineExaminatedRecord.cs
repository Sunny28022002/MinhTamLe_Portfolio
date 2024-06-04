using System;
using System.Collections.Generic;

namespace MedicineService.Models;

public partial class MedicineExaminatedRecord
{
    public int Meid { get; set; }

    public int RecordId { get; set; }

    public int MedicineId { get; set; }

    public int Quantity { get; set; }

    public string MedicationGuide { get; set; } = null!;

    public bool IsActive { get; set; }

    public virtual Medicine Medicine { get; set; } = null!;

    public virtual ExaminatedRecord Record { get; set; } = null!;
}
