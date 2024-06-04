namespace MedicineService.DTOs
{
    public class ListUpdateMedicine
    {
        public int RecordId { get; set; }
        public List<UpdateMedicine> medicineUpdatedList { get; set; }
    }
}
