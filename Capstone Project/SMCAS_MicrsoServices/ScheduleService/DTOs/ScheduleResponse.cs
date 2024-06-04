namespace ScheduleService.DTOs
{
    public class ScheduleResponse
    {
        public int ScheduleId { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; }  

        public int? PatientId { get; set; }
        public string PatientName { get; set; } 

        public DateTime Date { get; set; }

        public TimeSpan StartShift { get; set; }

        public TimeSpan EndShift { get; set; }

        public bool IsAccepted { get; set; }

        public bool IsActive { get; set; }
    }
}
