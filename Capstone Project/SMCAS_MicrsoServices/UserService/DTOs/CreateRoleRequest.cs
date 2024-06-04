using System.ComponentModel.DataAnnotations;

namespace UserService.DTOs
{
    public class CreateRoleRequest
    {
        [Required]
        public string RoleName { get; set; }

        public string User { get; set; }

        public string Blog { get; set; }

        public string Medicine { get; set; }

        public string ExaminatedRecord { get; set; }

        public string Feedback { get; set; }

        public string Schedule { get; set; }

        public string Chat { get; set; }
    }
}
