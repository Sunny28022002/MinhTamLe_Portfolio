using AuthenticationServices.Models;

namespace AuthenticationServices.Services.RoleServices
{
    public interface IRoleService
    {
        Role GetRoleById(int roleId);

    }
}
