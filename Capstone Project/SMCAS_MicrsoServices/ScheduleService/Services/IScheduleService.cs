using ScheduleService.Models;

namespace ScheduleService.Services
{
    public interface IScheduleService
    {
        List<MedicalExaminationSchedule> GetScheduleList();
        List<MedicalExaminationSchedule> GetScheduleListAdmin();
        MedicalExaminationSchedule GetScheduleById(int id);
        MedicalExaminationSchedule GetScheduleByIdAdmin(int id);
        List<MedicalExaminationSchedule> GetEmptyScheduleByDoctorId(int id);
        List<MedicalExaminationSchedule> GetScheduleWaitingConfirmByDoctorId(int id);
        List<MedicalExaminationSchedule> GetScheduleWaitingConfirmByPatientId(int id);
        MedicalExaminationSchedule CreateSchedule(MedicalExaminationSchedule schedule);
        MedicalExaminationSchedule UpdateSchedule(MedicalExaminationSchedule schedule);
        MedicalExaminationSchedule RegisterSchedule(MedicalExaminationSchedule schedule);
        MedicalExaminationSchedule AcceptSchedule(int id);
        MedicalExaminationSchedule RejectSchedule(int id);
        MedicalExaminationSchedule DeleteSchedule(int id);
        List<MedicalExaminationSchedule> GetScheduleListByDoctorId(int id);
        List<MedicalExaminationSchedule> SearchScheduleByDate(DateTime dateStart, DateTime dateEnd);
        List<MedicalExaminationSchedule> SearchScheduleByDateAdmin(DateTime dateStart, DateTime dateEnd);
        List<MedicalExaminationSchedule> GetEmptySchedule();
        List<MedicalExaminationSchedule> GetAcceptSchedule();
        User GetPeopleInfo(int? id);
    }
}
