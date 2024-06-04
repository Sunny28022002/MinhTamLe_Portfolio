using MedicineService.Models;

namespace MedicineService.Services.MedicineExaminatedRecordFolder
{
    public interface IMedicineExaminatedRecordService
    {
        List<MedicineExaminatedRecord> GetAllMedicineRecord();
        MedicineExaminatedRecord GetRecordById(int id);    
        MedicineExaminatedRecord CreateRecord (MedicineExaminatedRecord record);
        MedicineExaminatedRecord UpdateRecord (MedicineExaminatedRecord record);
        MedicineExaminatedRecord DeleteRecord (int id);
        List<MedicineExaminatedRecord> SearchByRecordId(int id);

    }
}
