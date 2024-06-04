using UserService.DAOs;
using UserService.Models;

namespace UserService.Services
{
    public class RoleService : IRoleService
    {
        public Role CreateRole(Role role) => RoleDAO.CreateRole(role);

        public Role DeleteRole(int roleId) => RoleDAO.DeleteRole(roleId);

        public Role GetRoleById(int id) => RoleDAO.GetRoleById(id);

        public List<Role> GetRoles() => RoleDAO.GetRoles();

        public List<Role> GetRoleStaff() => RoleDAO.GetRoleStaff();

        public List<Role> SearchRoleByName(string name) => RoleDAO.SearchRoleByName(name);

        public Role UpdateRole(Role role) => RoleDAO.UpdateRole(role);
    }
}
