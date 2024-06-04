using UserService.DTOs;
using UserService.Models;

namespace UserService.Services
{
    public interface IFeedbackService
    {
        Feedback GetFeedbackById(int id);
        Feedback GetFeedbackByIdAdmin(int id);
        List<Feedback> GetFeedbackByDoctorId(int id);
        List<Feedback> GetFeedbackByPatientId(int id);
        List<Feedback> GetFeedbacks();
        List<Feedback> GetFeedbacksAdmin();
        Feedback CreateFeedback(Feedback feedback);
        Feedback UpdateFeedback(Feedback feedback);
        Feedback DeleteFeedback(Feedback feedback);
        float GetAvgOfDoctor(int doctorId);
        List<StatisticFeedbackOfDoctor> Statistic();
    }
}
