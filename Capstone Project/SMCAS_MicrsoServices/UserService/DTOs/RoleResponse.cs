namespace UserService.DTOs
{
    public class RoleResponse
    {
        public int RoleId { get; set; }

        public string RoleName { get; set; } = null!;

        public string User { get; set; }

        public string Blog { get; set; }

        public string Medicine { get; set; }

        public string ExaminatedRecord { get; set; }

        public string Feedback { get; set; }

        public string Schedule { get; set; }

        public string Chat { get; set; }

        public bool IsActive { get; set; }
    }
}
