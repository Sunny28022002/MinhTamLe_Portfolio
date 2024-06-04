namespace UserService.DTOs
{
    public class UserStatisticResponse
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int NumberOfUser { get; set; }
        public float Percentage { get; set; }
    }
}
