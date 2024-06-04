using AuthenticationServices.Models;

namespace AuthenticationServices.DAOs
{
    public class RoleDAO
    {
        public static Role GetRoleById(int roleId)
        {
            Role role = new Role();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    role = context.Roles.FirstOrDefault(role => role.RoleId == roleId);
                    if (role != null)
                    {
                        return role;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
