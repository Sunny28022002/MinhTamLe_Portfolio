namespace MedicineService.DTOs
{
    public class CreateExaminatedRecordRequest
    {
        public int DoctorId { get; set; }

        public int PatientId { get; set; }

        public decimal? RespirationRate { get; set; }

        public decimal? Temperature { get; set; }

        public decimal? BloodPressure { get; set; }

        public decimal? SpO2 { get; set; }
        public string Symptoms { get; set; }

        public string? Note { get; set; }

        public bool IsActive { get; set; }
    }
}
