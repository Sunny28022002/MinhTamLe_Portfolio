namespace UserService.DTOs
{
    public class TokenReaderResponse
    {
        public string? Username { get; set; }
        public string? Role { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
