using AuthenticationServices.Models;

namespace AuthenticationServices.DAOs
{
    public class UserDAO
    {
        public static bool Login(string username, string password)
        {
            User user = new User();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    user = context.Users.FirstOrDefault(user => (user.Username == username) && user.IsActive);
                    if (user != null)
                    {
                        if (user.Password == password)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static User GetUserByUsername(string username)
        {
            User member = new User();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    member = context.Users.FirstOrDefault(user => (user.Username == username) && user.IsActive);
                    if (member != null)
                    {
                        return member;
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

        public static User Register(User user)
        {
            User userNew = new User();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var userValidate = context.Users.FirstOrDefault(userCheck => userCheck.Username == user.Username);
                    if (userValidate != null)
                    {
                        return null;
                    }
                    else
                    {
                        userNew.RegistedDate = DateTime.Now;
                        userNew.RoleId = 2;
                        userNew.Email = user.Email;
                        userNew.Username = user.Username;
                        userNew.Password = user.Password;
                        userNew.IsActive = true;
                        context.Users.Add(userNew);
                        context.SaveChanges();
                        return userNew;
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public static List<User> GetUsers()
        {
            var users = new List<User>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var userList = context.Users.ToList();
                    foreach (var user in userList)
                    {
                        if (user.IsActive)
                        {
                            users.Add(user);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            return users;
        }

        public static User GetUserById(int id)
        {
            var user = new User();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    user = context.Users.FirstOrDefault(user => (user.UserId == id) && user.IsActive);
                    if (user != null)
                    {
                        return user;
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

        public static User DeleteUser(int id)
        {
            var userActive = new User();
            var userUnActive = new User();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    userActive = context.Users.FirstOrDefault(user => (user.UserId == id) && user.IsActive);
                    userUnActive = context.Users.FirstOrDefault(user => (user.UserId == id) && !user.IsActive);
                    if (userActive != null)
                    {
                        userActive.IsActive = false;
                        context.Users.Update(userActive);
                        context.SaveChanges();
                        return userActive;
                    } else if (userUnActive != null)
                    {
                        return userUnActive;
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
