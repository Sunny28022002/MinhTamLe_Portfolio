namespace UserService.DTOs
{
    public class StudentResponse
    {
        public int Key { get; set; }
        public string Fullname { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string? Course { get; set; }
        public string? StudentCode { get; set; }
        public string? University { get; set; }
        public string? Major { get; set; }
        public string? Gender { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public DateTime? Birthday { get; set; }

    }
}
