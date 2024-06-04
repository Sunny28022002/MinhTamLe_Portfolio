using System;
using System.Collections.Generic;

namespace MedicineService.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int DoctorId { get; set; }

    public int PatientId { get; set; }

    public DateTime FeedbackDate { get; set; }

    public string Message { get; set; } = null!;

    public int Rating { get; set; }

    public bool IsActive { get; set; }

    public virtual User Doctor { get; set; } = null!;

    public virtual User Patient { get; set; } = null!;
}
