namespace ScheduleService.DTOs
{
    public class UpdateScheduleRequest
    {
        public int ScheduleId { get; set; }

        public DateTime Date { get; set; }

        public TimeSpan StartShift { get; set; }

        public TimeSpan EndShift { get; set; }
    }
}
