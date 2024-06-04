using MedicineService.DAOs;
using MedicineService.Models;

namespace MedicineService.Services.MedicineExaminatedRecordFolder
{
    public class MedicineExaminatedRecordService : IMedicineExaminatedRecordService
    {
        public MedicineExaminatedRecord CreateRecord(MedicineExaminatedRecord record) => MedicineExaminatedRecordDAO.CreateMedicineRecord(record);

        public MedicineExaminatedRecord DeleteRecord(int id) => MedicineExaminatedRecordDAO.DeleteMedicineRecord(id);

        public List<MedicineExaminatedRecord> GetAllMedicineRecord() => MedicineExaminatedRecordDAO.GetAllMedicineRecord();

        public MedicineExaminatedRecord GetRecordById(int id) => MedicineExaminatedRecordDAO.GetRecordById(id);

        public List<MedicineExaminatedRecord> SearchByRecordId(int id) => MedicineExaminatedRecordDAO.SearchByRecordId(id);

        public MedicineExaminatedRecord UpdateRecord(MedicineExaminatedRecord record) => MedicineExaminatedRecordDAO.UpdateMedicineRecord(record);
    }
}
