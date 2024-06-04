namespace MedicineService.DTOs
{
    public class UpdateUnitRequest
    {
        public int UnitId { get; set; }

        public string UnitName { get; set; } = null!;

        public bool IsActive { get; set; }
    }
}
