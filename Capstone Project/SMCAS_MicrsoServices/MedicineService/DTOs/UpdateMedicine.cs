namespace MedicineService.DTOs
{
    public class UpdateMedicine
    {
        public int Meid { get; set; }

        public int MedicineId { get; set; }

        public int Quantity { get; set; }
        public string MedicationGuide { get; set; }

        public bool IsActive { get; set; }
    }
}
