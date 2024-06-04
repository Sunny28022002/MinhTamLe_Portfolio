namespace MedicineService.DTOs
{
    public class MedicineCodeResponse
    {
        public int CodeId { get; set; }

        public string CodeName { get; set; } = null!;

        public bool IsActive { get; set; }
    }
}
