namespace UserService.DTOs
{
    public class CreateUserRequest
    {
        public int RoleId { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public DateTime? Birthday { get; set; }

        public string? Address { get; set; }

        public string? Gender { get; set; }

        public string PhoneNumber { get; set; } = null!;

        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Major { get; set; }

        public string? Experience { get; set; }

        public string? WorkPlace { get; set; }

        public string? Qualification { get; set; }

        public string? EmergencyContact { get; set; }

        public string? Course { get; set; }

        public string? StudentCode { get; set; }

        public string? University { get; set; }
    }
}
