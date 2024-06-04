namespace MedicineService.DTOs
{
    public class UnitResponse
    {
        public int UnitId { get; set; }

        public string UnitName { get; set; } = null!;

        public bool IsActive { get; set; }
    }
}
