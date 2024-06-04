using AuthenticationServices.Models;

namespace AuthenticationServices.Services.UserServices
{
    public interface IUserService
    {
        bool Login(string username, string password);
        User GetUserByUsername(string username);
        User Register(User user);
        List<User> GetUsers();
        User GetUserById(int id);
        User DeleteUser(int id);
    }
}
