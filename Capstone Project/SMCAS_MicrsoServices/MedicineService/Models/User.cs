using System;
using System.Collections.Generic;

namespace MedicineService.Models;

public partial class User
{
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateTime? Birthday { get; set; }

    public string? Address { get; set; }

    public string? Gender { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Major { get; set; }

    public string? Experience { get; set; }

    public string? WorkPlace { get; set; }

    public string? Qualification { get; set; }

    public string? EmergencyContact { get; set; }

    public string? Course { get; set; }

    public string? StudentCode { get; set; }

    public string? University { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();

    public virtual ICollection<Chat> ChatDoctors { get; set; } = new List<Chat>();

    public virtual ICollection<Chat> ChatPatients { get; set; } = new List<Chat>();

    public virtual ICollection<ExaminatedRecord> ExaminatedRecordDoctors { get; set; } = new List<ExaminatedRecord>();

    public virtual ICollection<ExaminatedRecord> ExaminatedRecordPatients { get; set; } = new List<ExaminatedRecord>();

    public virtual ICollection<Feedback> FeedbackDoctors { get; set; } = new List<Feedback>();

    public virtual ICollection<Feedback> FeedbackPatients { get; set; } = new List<Feedback>();

    public virtual ICollection<MedicalExaminationSchedule> MedicalExaminationScheduleDoctors { get; set; } = new List<MedicalExaminationSchedule>();

    public virtual ICollection<MedicalExaminationSchedule> MedicalExaminationSchedulePatients { get; set; } = new List<MedicalExaminationSchedule>();

    public virtual ICollection<Medicine> Medicines { get; set; } = new List<Medicine>();

    public virtual Role Role { get; set; } = null!;
}
