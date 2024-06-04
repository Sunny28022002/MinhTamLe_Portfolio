namespace ScheduleService.DTOs
{
    public class RegisterScheduleRequest
    {
        public int ScheduleId { get; set; }

        public int? PatientId { get; set; }
    }
}
