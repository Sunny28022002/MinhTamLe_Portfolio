using UserService.DAOs;
using UserService.Models;

namespace UserService.Services
{
    public class UserService : IUserService
    {
        public User CreateUser(User user) => UserDAO.CreateUser(user);

        public User DeleteUser(int id) => UserDAO.DeleteUser(id);

        public List<User> GetDoctors() => UserDAO.GetDoctors();

        public List<User> GetPatientList() => UserDAO.GetPatientsList();

        public List<User> GetStaffs() => UserDAO.GetStaffs();

        public List<User> GetStudents() => UserDAO.GetStudents();

        public User GetUserById(int id) => UserDAO.GetUserById(id);

        public User GetUserByUsername(string username) => UserDAO.GetUserByUsername(username);

        public List<User> GetUsers() => UserDAO.GetUsers();

        public bool Login(string username, string password) => UserDAO.Login(username, password);

        public User Register(User user) => UserDAO.Register(user);

        public List<User> SearchUserByNameRole(string name, int roleId) => UserDAO.SearchUserByNameRole(name, roleId);

        public List<User> SearchUserByName(string name) => UserDAO.SearchUserByName(name);

        public User UpdateUser(User user) => UserDAO.UpdateUser(user);

        public List<User> GetListOfVisitor() => UserDAO.GetListOfVisitor();

        public List<User> GetMedicalStaffs() => UserDAO.GetMedicalStaffs();

        public User UpdatePassword(string username, string password) => UserDAO.UpdatePassword(username, password);
    }
}
