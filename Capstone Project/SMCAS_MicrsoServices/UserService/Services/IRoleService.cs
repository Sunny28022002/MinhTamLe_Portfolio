using UserService.Models;

namespace UserService.Services
{
    public interface IRoleService
    {
        Role GetRoleById(int id);
        List<Role> GetRoles();
        Role CreateRole(Role role);
        Role UpdateRole(Role role);
        Role DeleteRole(int roleId);
        List<Role> SearchRoleByName(string name);
        List<Role> GetRoleStaff();
    }
}
