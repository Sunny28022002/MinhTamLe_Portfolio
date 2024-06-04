using ScheduleService.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ScheduleService.DAOs
{
    public class ScheduleDAO
    {
        public static List<MedicalExaminationSchedule> GetScheduleList()
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var scheduleList = context.MedicalExaminationSchedules.ToList();
                    DateTime now = DateTime.Now;
                    foreach (var schedule in scheduleList)
                    {
                        if (schedule.IsActive)
                        {
                            schedules.Add(schedule);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static List<MedicalExaminationSchedule> GetScheduleListAdmin()
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var scheduleList = context.MedicalExaminationSchedules.ToList();
                    return scheduleList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        }

        public static MedicalExaminationSchedule GetScheduleById(int id)
        {
            MedicalExaminationSchedule schedule = new MedicalExaminationSchedule();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedule = context.MedicalExaminationSchedules.SingleOrDefault(s => (s.ScheduleId == id) && s.IsActive);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedule;
        }

        public static MedicalExaminationSchedule GetScheduleByIdAdmin(int id)
        {
            MedicalExaminationSchedule schedule = new MedicalExaminationSchedule();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedule = context.MedicalExaminationSchedules.SingleOrDefault(s => (s.ScheduleId == id));
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedule;
        }

        public static List<MedicalExaminationSchedule> GetScheduleListByDoctorId(int id)
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s => s.DoctorId == id && s.Date.Date >= DateTime.Now.Date && s.IsActive).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static List<MedicalExaminationSchedule> GetEmptyScheduleByDoctorId(int id)
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s => s.PatientId == null && s.Date.Date >= DateTime.Now.Date && s.IsActive).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static List<MedicalExaminationSchedule> GetScheduleWaitingConfirmByDoctorId(int id)
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s => s.PatientId != null && s.IsActive && !s.IsAccepted && s.DoctorId == id).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static List<MedicalExaminationSchedule> GetScheduleWaitingConfirmByPatientId(int id)
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s => s.PatientId == id && s.IsActive && !s.IsAccepted).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static MedicalExaminationSchedule CreateSchedule(MedicalExaminationSchedule schedule)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedule.IsActive = true;
                    schedule.IsAccepted = false;

                    context.MedicalExaminationSchedules.Add(schedule);
                    context.SaveChanges();

                    return schedule;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicalExaminationSchedule UpdateSchedule(MedicalExaminationSchedule schedule)
        {
            MedicalExaminationSchedule updateSchedule = new MedicalExaminationSchedule();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var scheduleCheck = context.MedicalExaminationSchedules.FirstOrDefault(s => s.ScheduleId == schedule.ScheduleId && s.IsActive && s.PatientId == null);
                    if (scheduleCheck != null)
                    {
                        updateSchedule = schedule;
                        updateSchedule.DoctorId = scheduleCheck.DoctorId;
                        updateSchedule.IsActive = scheduleCheck.IsActive;
                        context.Entry(scheduleCheck).CurrentValues.SetValues(updateSchedule);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }

                    return updateSchedule;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicalExaminationSchedule RegisterSchedule(MedicalExaminationSchedule schedule)
        {
            MedicalExaminationSchedule updateSchedule = new MedicalExaminationSchedule();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var scheduleCheck = context.MedicalExaminationSchedules.FirstOrDefault(s => s.ScheduleId == schedule.ScheduleId && s.IsActive && s.PatientId == null);
                    if (scheduleCheck != null)
                    {
                        updateSchedule = scheduleCheck;
                        updateSchedule.PatientId = schedule.PatientId;
                        updateSchedule.IsActive = scheduleCheck.IsActive;
                        context.Entry(scheduleCheck).CurrentValues.SetValues(updateSchedule);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }

                    return updateSchedule;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicalExaminationSchedule AcceptSchedule(int id)
        {
            MedicalExaminationSchedule updateSchedule = new MedicalExaminationSchedule();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var scheduleCheck = context.MedicalExaminationSchedules.FirstOrDefault(s => s.ScheduleId == id && s.IsActive && s.PatientId != null && !s.IsAccepted);
                    if (scheduleCheck != null)
                    {
                        updateSchedule = scheduleCheck;
                        updateSchedule.IsActive = scheduleCheck.IsActive;
                        updateSchedule.IsAccepted = true;
                        context.Entry(scheduleCheck).CurrentValues.SetValues(updateSchedule);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }

                    return updateSchedule;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicalExaminationSchedule RejectSchedule(int id)
        {
            MedicalExaminationSchedule updateSchedule = new MedicalExaminationSchedule();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var scheduleCheck = context.MedicalExaminationSchedules.FirstOrDefault(s => s.ScheduleId == id && s.IsActive && s.PatientId != null && !s.IsAccepted);
                    if (scheduleCheck != null)
                    {
                        updateSchedule = scheduleCheck;
                        updateSchedule.IsActive = scheduleCheck.IsActive;
                        updateSchedule.PatientId = null;
                        context.Entry(scheduleCheck).CurrentValues.SetValues(updateSchedule);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }

                    return updateSchedule;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicalExaminationSchedule DeleteSchedule(int id)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var _schedule = context.MedicalExaminationSchedules.SingleOrDefault(s => s.ScheduleId == id && s.IsActive);
                    if (_schedule != null)
                    {
                        if (_schedule.PatientId != null)
                        {
                            throw new Exception("Cannot delete this schedule");
                        }
                        _schedule.IsActive = false;

                        // Sử dụng SetValues để cập nhật giá trị từ movie vào _movie
                        context.Entry(_schedule).CurrentValues.SetValues(_schedule);
                        context.SaveChanges();

                        return _schedule; // Trả về _feedback sau khi cập nhật
                    }
                    else
                    {
                        throw new Exception("Schedule does not exist");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<MedicalExaminationSchedule> SearchScheduleByDate(DateTime dateStart, DateTime dateEnd)
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s => s.Date.Date >= dateStart.Date && s.Date.Date <= dateEnd.Date && s.IsActive).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static List<MedicalExaminationSchedule> GetEmptySchedule()
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s =>s.PatientId == null && s.IsAccepted == false && s.IsActive == true).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static List<MedicalExaminationSchedule> SearchScheduleByDateAdmin(DateTime dateStart, DateTime dateEnd)
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s => s.Date.Date >= dateStart.Date && s.Date.Date <= dateEnd.Date).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public static List<MedicalExaminationSchedule> GetAcceptSchedule()
        {
            List<MedicalExaminationSchedule> schedules = new List<MedicalExaminationSchedule>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    schedules = context.MedicalExaminationSchedules.Where(s => s.IsAccepted == true && s.IsActive == true).ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }
        public static User GetPeopleInfo(int? id)
        {
            var user = new User();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    user = context.Users.FirstOrDefault(user => (user.UserId == id));
                    if (user != null)
                    {
                        return user;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
