using MedicineService.Models;

namespace MedicineService.Services.ExaminatedRecordFolder
{
    public interface IExaminatedRecordService
    {
        List<ExaminatedRecord> GetAll();
        ExaminatedRecord GetRecordById(int id);
        ExaminatedRecord CreateRecord(ExaminatedRecord record);
        ExaminatedRecord UpdateRecord(ExaminatedRecord record);
        ExaminatedRecord DeleteRecord(int id);
        List<ExaminatedRecord> SearchRecordByPeopleId(int id);
        List<ExaminatedRecord> SearchRecordByName(string name);
        User GetPeopleInfo(int id);
        List<User> GetDoctorList();
    }
}
