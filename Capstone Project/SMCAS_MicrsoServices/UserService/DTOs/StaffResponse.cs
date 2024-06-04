namespace UserService.DTOs
{
    public class StaffResponse
    {
        public int UserId { get; set; }
        public string Fullname { get; set; }
        public int RoleId { get; set; }

        public int Key { get; set; }

        public string Username { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public DateTime Birthday { get; set; }

        public string? Major { get; set; }

        public string? WorkPlace { get; set; }

        public string? Qualification { get; set; }
        public string? Experience { get; set; }

        public string? RoleName { get; set; }

        public string PhoneNumber { get; set; } = null!;
    }
}
