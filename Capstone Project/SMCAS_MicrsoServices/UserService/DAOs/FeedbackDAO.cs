using UserService.Models;
using System.Linq;
using UserService.DTOs;
using System.Runtime.Intrinsics.X86;

namespace UserService.DAOs
{
    public class FeedbackDAO
    {
        public static List<Feedback> GetFeedBackList()
        {
            List<Feedback> feedbacks = new List<Feedback>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var feedbackList = context.Feedbacks.ToList();
                    foreach (var feedback in feedbackList)
                    {
                        if (feedback.IsActive)
                        {
                            feedbacks.Add(feedback);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return feedbacks;
        }

        public static List<Feedback> GetFeedBackListAdmin()
        {
            List<Feedback> feedbacks = new List<Feedback>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var feedbackList = context.Feedbacks.ToList();
                    return feedbackList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        
        }

        public static Feedback GetFeedbackById(int id)
        {
            Feedback feedback = new Feedback();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    feedback = context.Feedbacks.SingleOrDefault(f => (f.FeedbackId == id) && f.IsActive);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return feedback;
        }

        public static Feedback GetFeedbackByIdAdmin(int id)
        {
            Feedback feedback = new Feedback();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    feedback = context.Feedbacks.SingleOrDefault(f => (f.FeedbackId == id));
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return feedback;
        }

        public static List<Feedback> GetFeedbackByDoctorId(int id)
        {
            List<Feedback> feedbacks = new List<Feedback>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var feedbackList = context.Feedbacks.Where(f => (f.DoctorId == id) && f.IsActive).ToList();
                    foreach (var feedback in feedbackList)
                    {
                        if (feedback.IsActive)
                        {
                            feedbacks.Add(feedback);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return feedbacks;
        }

        public static List<Feedback> GetFeedbackByPatientId(int id)
        {
            List<Feedback> feedbacks = new List<Feedback>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var feedbackList = context.Feedbacks.Where(f => (f.PatientId == id) && f.IsActive).ToList();
                    foreach (var feedback in feedbackList)
                    {
                        if (feedback.IsActive)
                        {
                            feedbacks.Add(feedback);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return feedbacks;
        }

        public static Feedback CreateFeedback(Feedback feedback)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    feedback.IsActive = true;
                    feedback.FeedbackDate = DateTime.Now;

                    context.Feedbacks.Add(feedback);
                    context.SaveChanges();

                    return feedback;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Feedback UpdateFeedback(Feedback feedback)
        {
            Feedback updateFeedback = new Feedback();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var feedbackCheck = context.Feedbacks.FirstOrDefault(f => f.FeedbackId == feedback.FeedbackId && f.IsActive);
                    if (feedbackCheck != null)
                    {
                        updateFeedback = feedback;
                        updateFeedback.FeedbackDate = feedbackCheck.FeedbackDate;
                        updateFeedback.DoctorId = feedbackCheck.DoctorId;
                        updateFeedback.IsActive = feedbackCheck.IsActive;
                        context.Entry(feedbackCheck).CurrentValues.SetValues(updateFeedback);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }

                    return updateFeedback;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Feedback DeleteFeedback(Feedback feedback)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var _feedback = context.Feedbacks.SingleOrDefault(f => f.FeedbackId == feedback.FeedbackId && f.IsActive);
                    if (_feedback != null)
                    {
                        if (feedback.PatientId != _feedback.PatientId)
                        {
                            throw new Exception("You cannot delete this feedback");
                        }

                        _feedback.IsActive = false;

                        // Sử dụng SetValues để cập nhật giá trị từ movie vào _movie
                        context.Entry(_feedback).CurrentValues.SetValues(_feedback);
                        context.SaveChanges();

                        return _feedback; // Trả về _feedback sau khi cập nhật
                    }
                    else
                    {
                        throw new Exception("Feedback does not exist");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static float GetAvgOfDoctor(int doctorId)
        {
            float avg = 0;
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var feedbackList = context.Feedbacks.Where(f => f.DoctorId == doctorId).ToList();
                    if (feedbackList.Any())
                    {
                        foreach (var feedback in feedbackList)
                        {
                            avg += feedback.Rating;
                        }
                        avg = avg / feedbackList.Count;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return avg;
        }

        public static List<StatisticFeedbackOfDoctor> Statistic()
        {
            List<StatisticFeedbackOfDoctor> listResponse = new List<StatisticFeedbackOfDoctor>();
            List<User> listDoctor = UserDAO.GetDoctors();
            try
            {
                foreach (var doctor in listDoctor)
                {
                    using (var context = new SepprojectDbV7Context())
                    {
                        int totalFeedback = context.Feedbacks.Where(f => f.DoctorId == doctor.UserId).ToList().Count;
                        float avg = GetAvgOfDoctor(doctor.UserId);
                        StatisticFeedbackOfDoctor statistic = new StatisticFeedbackOfDoctor();
                        statistic.TotalFeedback = totalFeedback;
                        statistic.Avg = avg;
                        statistic.DoctorName = doctor.FirstName + " " + doctor.LastName;
                        listResponse.Add(statistic);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return listResponse;
        }
    }
}
