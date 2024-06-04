using AuthenticationServices.DAOs;
using AuthenticationServices.Models;

namespace AuthenticationServices.Services.UserServices
{
    public class UserService : IUserService
    {
        public User GetUserByUsername(string username) => UserDAO.GetUserByUsername(username);

        public bool Login(string username, string password) => UserDAO.Login(username, password);

        public User Register(User user) => UserDAO.Register(user);

        public List<User> GetUsers() => UserDAO.GetUsers();
        public User GetUserById(int id) => UserDAO.GetUserById(id);

        public User DeleteUser(int id) => UserDAO.DeleteUser(id);
    }
}
