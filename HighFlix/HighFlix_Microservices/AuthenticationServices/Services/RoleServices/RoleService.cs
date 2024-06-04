using AuthenticationServices.DAOs;
using AuthenticationServices.Models;

namespace AuthenticationServices.Services.RoleServices
{
    public class RoleService : IRoleService
    {
        public Role GetRoleById(int roleId) => RoleDAO.GetRoleById(roleId);
    }
}
