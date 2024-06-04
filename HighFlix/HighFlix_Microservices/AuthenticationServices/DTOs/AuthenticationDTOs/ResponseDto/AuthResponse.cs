namespace APIS.DTOs.ResponseDto
{
    public class AuthResponse
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string Message { get; set; }

    }
}
