namespace MedicineService.DTOs
{
    public class MedicineExaminatedRecordResponse
    {
        public int Meid { get; set; }

        public int RecordId { get; set; }

        public int MedicineId { get; set; }

        public string MedicineName { get; set; }

        public string MedicationGuide { get; set; } = null!;

        public int Quantity { get; set; }

        public bool IsActive { get; set; }
    }
}
