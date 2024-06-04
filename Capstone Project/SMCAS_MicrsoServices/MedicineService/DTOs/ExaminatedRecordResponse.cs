namespace MedicineService.DTOs
{
    public class ExaminatedRecordResponse
    {
        public int RecordId { get; set; }

        public int DoctorId { get; set; }

        public int PatientId { get; set; }

        public decimal? RespirationRate { get; set; }

        public decimal? Temperature { get; set; }

        public decimal? BloodPressure { get; set; }

        public decimal? SpO2 { get; set; }

        public string? Note { get; set; }
        public DateTime? CreatedDate { get; set; }

        public string Symptoms { get; set; } = null!;

        public bool IsActive { get; set; }

        public string DoctorName { get; set; }
        public string PatientName { get; set;}
    }
}
