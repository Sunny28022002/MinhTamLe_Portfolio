using System.ComponentModel.DataAnnotations;

namespace APIS.DTOs.RequestDto
{
    public class RegisterDto
    {
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; }
    }
}
