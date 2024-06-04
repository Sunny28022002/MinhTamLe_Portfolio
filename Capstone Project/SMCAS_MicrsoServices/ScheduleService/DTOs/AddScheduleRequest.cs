namespace ScheduleService.DTOs
{
    public class AddScheduleRequest
    {
        public int DoctorId { get; set; }

        public DateTime Date { get; set; }

        public TimeSpan StartShift { get; set; }

        public TimeSpan EndShift { get; set; }
    }
}
