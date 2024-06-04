using AutoMapper.Configuration.Annotations;
using UserService.Models;

namespace UserService.DAOs
{
    public class RoleDAO
    {
        public static Role GetRoleById(int id)
        {
            Role role = new Role();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    role = context.Roles.FirstOrDefault(r => r.RoleId == id);
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
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public static Role CreateRole(Role role)
        {
            Role newRole = new Role();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var roleCheck = context.Roles.FirstOrDefault(r => r.RoleName.ToLower() == role.RoleName.ToLower());
                    if (roleCheck != null)
                    {
                        return null;
                    }
                    else
                    {
                        newRole = role;
                        newRole.RoleName = role.RoleName;
                        newRole.IsActive = true;
                        context.Roles.Add(newRole);
                        context.SaveChanges();
                    }
                }
                return newRole;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Role> GetRoles()
        {
            List<Role> roles = new List<Role>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var roleList = context.Roles.ToList();
                    foreach (var role in roleList)
                    {
                        roles.Add(role);
                    }
                }
                return roles;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Role UpdateRole(Role role)
        {
            Role updatedRole = new Role();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var roleCheck = context.Roles.FirstOrDefault(r => r.RoleId == role.RoleId && r.IsActive);
                    if (roleCheck != null)
                    {
                        var rolenNameCheck = context.Roles.FirstOrDefault(r => r.RoleName == role.RoleName && r.IsActive);
                        if (rolenNameCheck != null)
                        {
                            return null;
                        }
                        updatedRole = role;
                        updatedRole.RoleId = roleCheck.RoleId;
                        updatedRole.RoleName = role.RoleName;
                        updatedRole.IsActive = role.IsActive;
                        context.Entry(roleCheck).CurrentValues.SetValues(updatedRole);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }
                    return updatedRole;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Role DeleteRole(int roleId)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var role = context.Roles.FirstOrDefault(r => r.RoleId == roleId && r.IsActive);
                    if (role == null)
                    {
                        return null;
                    }
                    else
                    {
                        role.IsActive = false;
                        context.Roles.Update(role);
                        context.SaveChanges();
                    }
                    return role;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Role> SearchRoleByName(string roleName)
        {
            var roleList = new List<Role>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var roleCheck = context.Roles.Where(r => r.RoleName.ToLower().Contains(roleName.ToLower())).ToList();
                    if (roleCheck != null)
                    {
                        foreach (var item in roleCheck)
                        {
                            roleList.Add(item);
                        }
                        return roleList;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Role> GetRoleStaff()
        {
            var roleList = new List<Role>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var list = context.Roles.ToList();
                    var staff = "Staff";
                    for (int i = 0; i < list.Count; i++)
                    {
                        if (list[i].RoleName.ToLower().Contains(staff.ToLower()))
                        {
                            roleList.Add(list[i]);
                        }
                    }
                }
                return roleList;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
