namespace MedicineService.DTOs
{
    public class UpdateMedicineExaminatedRecordRequest
    {
        public int Meid { get; set; }

        public int RecordId { get; set; }

        public int MedicineId { get; set; }
        public string MedicationGuide { get; set; } 

        public int Quantity { get; set; }

        public bool IsActive { get; set; }
    }
}
