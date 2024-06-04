namespace MedicineService.DTOs
{
    public class ListMedicine
    {
        public int RecordId { get; set; }
        public List<MedicineCreatedList> medicineCreatedLists { get; set; }
    }
}
