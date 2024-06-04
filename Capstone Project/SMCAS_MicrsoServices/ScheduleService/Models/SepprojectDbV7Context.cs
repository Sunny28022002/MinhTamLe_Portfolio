using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ScheduleService.Models;

public partial class SepprojectDbV7Context : DbContext
{
    public SepprojectDbV7Context()
    {
    }

    public SepprojectDbV7Context(DbContextOptions<SepprojectDbV7Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Chat> Chats { get; set; }

    public virtual DbSet<ChatHistory> ChatHistories { get; set; }

    public virtual DbSet<ExaminatedRecord> ExaminatedRecords { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<MedicalExaminationSchedule> MedicalExaminationSchedules { get; set; }

    public virtual DbSet<Medicine> Medicines { get; set; }

    public virtual DbSet<MedicineCode> MedicineCodes { get; set; }

    public virtual DbSet<MedicineExaminatedRecord> MedicineExaminatedRecords { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server=MINHTAM; database = SEPProjectDB_v7;uid=sa;pwd=123456;TrustServerCertificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>(entity =>
        {
            entity.ToTable("Blog");

            entity.Property(e => e.PublishedDate).HasColumnType("date");
            entity.Property(e => e.WritingDate).HasColumnType("date");

            entity.HasOne(d => d.User).WithMany(p => p.Blogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Blog_User");
        });

        modelBuilder.Entity<Chat>(entity =>
        {
            entity.ToTable("Chat");

            entity.Property(e => e.ChatDate).HasColumnType("date");
            entity.Property(e => e.EndTime).HasColumnType("datetime");
            entity.Property(e => e.StartTime).HasColumnType("datetime");
            entity.Property(e => e.TotalTime)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Doctor).WithMany(p => p.ChatDoctors)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Chat_User");

            entity.HasOne(d => d.Patient).WithMany(p => p.ChatPatients)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Chat_User1");
        });

        modelBuilder.Entity<ChatHistory>(entity =>
        {
            entity.ToTable("ChatHistory");

            entity.Property(e => e.SendingTime).HasColumnType("datetime");

            entity.HasOne(d => d.Chat).WithMany(p => p.ChatHistories)
                .HasForeignKey(d => d.ChatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChatHistory_Chat");
        });

        modelBuilder.Entity<ExaminatedRecord>(entity =>
        {
            entity.HasKey(e => e.RecordId);

            entity.ToTable("ExaminatedRecord");

            entity.Property(e => e.BloodPressure).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.RespirationRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SpO2).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Temperature).HasColumnType("decimal(18, 1)");

            entity.HasOne(d => d.Doctor).WithMany(p => p.ExaminatedRecordDoctors)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ExaminatedRecord_User");

            entity.HasOne(d => d.Patient).WithMany(p => p.ExaminatedRecordPatients)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ExaminatedRecord_User1");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackDate).HasColumnType("date");

            entity.HasOne(d => d.Doctor).WithMany(p => p.FeedbackDoctors)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Feedback_User");

            entity.HasOne(d => d.Patient).WithMany(p => p.FeedbackPatients)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Feedback_User1");
        });

        modelBuilder.Entity<MedicalExaminationSchedule>(entity =>
        {
            entity.HasKey(e => e.ScheduleId);

            entity.ToTable("MedicalExaminationSchedule");

            entity.Property(e => e.Date).HasColumnType("date");

            entity.HasOne(d => d.Doctor).WithMany(p => p.MedicalExaminationScheduleDoctors)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MedicalExaminationSchedule_User");

            entity.HasOne(d => d.Patient).WithMany(p => p.MedicalExaminationSchedulePatients)
                .HasForeignKey(d => d.PatientId)
                .HasConstraintName("FK_MedicalExaminationSchedule_User1");
        });

        modelBuilder.Entity<Medicine>(entity =>
        {
            entity.ToTable("Medicine");

            entity.Property(e => e.MedicineName).HasMaxLength(50);
            entity.Property(e => e.PricePerUnit).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Code).WithMany(p => p.Medicines)
                .HasForeignKey(d => d.CodeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Medicine_MedicineCode");

            entity.HasOne(d => d.Unit).WithMany(p => p.Medicines)
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Medicine_Unit1");

            entity.HasOne(d => d.User).WithMany(p => p.Medicines)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Medicine_User1");
        });

        modelBuilder.Entity<MedicineCode>(entity =>
        {
            entity.HasKey(e => e.CodeId);

            entity.ToTable("MedicineCode");

            entity.Property(e => e.CodeName).HasMaxLength(50);
        });

        modelBuilder.Entity<MedicineExaminatedRecord>(entity =>
        {
            entity.HasKey(e => e.Meid);

            entity.ToTable("MedicineExaminatedRecord");

            entity.Property(e => e.Meid).HasColumnName("MEId");

            entity.HasOne(d => d.Medicine).WithMany(p => p.MedicineExaminatedRecords)
                .HasForeignKey(d => d.MedicineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MedicineExaminatedRecord_Medicine");

            entity.HasOne(d => d.Record).WithMany(p => p.MedicineExaminatedRecords)
                .HasForeignKey(d => d.RecordId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MedicineExaminatedRecord_ExaminatedRecord");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.Property(e => e.Blog)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Chat)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ExaminatedRecord)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Feedback)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Medicine)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RoleName).HasMaxLength(50);
            entity.Property(e => e.Schedule)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.User)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Unit>(entity =>
        {
            entity.ToTable("Unit");

            entity.Property(e => e.UnitName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.Property(e => e.Address).HasMaxLength(50);
            entity.Property(e => e.Birthday).HasColumnType("date");
            entity.Property(e => e.Course).HasMaxLength(50);
            entity.Property(e => e.EmergencyContact)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Experience).HasMaxLength(50);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.Gender).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Major).HasMaxLength(50);
            entity.Property(e => e.Password).IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.Qualification).HasMaxLength(50);
            entity.Property(e => e.StudentCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.University).HasMaxLength(50);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.WorkPlace).HasMaxLength(50);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_User_Role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
