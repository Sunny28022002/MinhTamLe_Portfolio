namespace MedicineService.DTOs
{
    public class UpdateMedicineCodeRequest
    {
        public int CodeId { get; set; }

        public string CodeName { get; set; } = null!;
    }
}
