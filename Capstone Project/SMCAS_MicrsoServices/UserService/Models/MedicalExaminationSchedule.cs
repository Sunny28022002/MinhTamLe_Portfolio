using System;
using System.Collections.Generic;

namespace UserService.Models;

public partial class MedicalExaminationSchedule
{
    public int ScheduleId { get; set; }

    public int DoctorId { get; set; }

    public int? PatientId { get; set; }

    public DateTime Date { get; set; }

    public TimeSpan StartShift { get; set; }

    public TimeSpan EndShift { get; set; }

    public bool IsAccepted { get; set; }

    public bool IsActive { get; set; }

    public virtual User Doctor { get; set; } = null!;

    public virtual User? Patient { get; set; }
}
