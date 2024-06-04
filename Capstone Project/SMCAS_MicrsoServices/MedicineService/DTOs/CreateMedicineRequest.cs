namespace MedicineService.DTOs
{
    public class CreateMedicineRequest
    {
        public int UserId { get; set; }

        public int UnitId { get; set; }

        public int CodeId { get; set; }

        public string MedicineName { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal PricePerUnit { get; set; }
    }
}
