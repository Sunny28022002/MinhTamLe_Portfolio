using System;
using System.Collections.Generic;

namespace BlogService.Models;

public partial class Chat
{
    public int ChatId { get; set; }

    public int DoctorId { get; set; }

    public int PatientId { get; set; }

    public DateTime ChatDate { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public string? TotalTime { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<ChatHistory> ChatHistories { get; set; } = new List<ChatHistory>();

    public virtual User Doctor { get; set; } = null!;

    public virtual User Patient { get; set; } = null!;
}
