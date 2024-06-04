namespace MedicineService.DTOs
{
    public class MedicineResponse
    {
        public int MedicineId { get; set; }

        public int UserId { get; set; }
        public string UserFullName { get; set; }

        public int UnitId { get; set; }
        public string UnitName { get; set; }

        public int CodeId { get; set; }
        public string CodeName { get; set; }

        public string MedicineName { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal PricePerUnit { get; set; }

        public bool IsActive { get; set; }
    }
}
