namespace UserService.DTOs
{
    public class UserManagementResponse
    {
        public int Key { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;
        public string Fullname { get; set; } = null!;

        public DateTime? Birthday { get; set; }

        public string? Address { get; set; }

        public string? Gender { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string RoleName { get; set; }

    }
}
