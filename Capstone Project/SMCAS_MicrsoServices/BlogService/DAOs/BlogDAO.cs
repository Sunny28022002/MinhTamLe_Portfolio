using BlogService.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogService.DAOs
{
    public class BlogDAO
    {
        public static List<Blog> GetBlogList()
        {
            List<Blog> blogs = new List<Blog>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var blogList = context.Blogs.ToList();
                    foreach (var blog in blogList)
                    {
                        if (blog.IsActive)
                        {
                            blogs.Add(blog);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return blogs;
        }

        public static List<Blog> GetBlogListAdmin()
        {
            List<Blog> blogs = new List<Blog>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var blogList = context.Blogs.ToList();
                    return blogList;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Blog GetBlogById(int id)
        {
            Blog blog = new Blog();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    blog = context.Blogs.SingleOrDefault(b => (b.BlogId == id) && b.IsActive);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return blog;
        }

        public static Blog GetBlogByIdAdmin(int id)
        {
            Blog blog = new Blog();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    blog = context.Blogs.SingleOrDefault(b => b.BlogId == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return blog;
        }

        public static Blog CreateBlog(Blog blog)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    blog.IsActive = true;

                    context.Blogs.Add(blog);
                    context.SaveChanges();

                    return blog;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Blog UpdateBlog(Blog blog)
        {
            Blog updateBlog = new Blog();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var blogCheck = context.Blogs.FirstOrDefault(r => r.BlogId == blog.BlogId && r.IsActive);
                    if (blogCheck != null)
                    {
                        updateBlog = blog;
                        updateBlog.WritingDate = blogCheck.WritingDate;
                        updateBlog.PublishedDate = blogCheck.PublishedDate;
                        updateBlog.UserId = blogCheck.UserId;
                        updateBlog.IsActive = blogCheck.IsActive;
                        context.Entry(blogCheck).CurrentValues.SetValues(updateBlog);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }
                    return updateBlog;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Blog DeleteBlog(int id)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var _blog = context.Blogs.SingleOrDefault(b => b.BlogId == id && b.IsActive);
                    if (_blog != null)
                    {
                        _blog.IsActive = false;

                        // Sử dụng SetValues để cập nhật giá trị từ movie vào _movie
                        context.Entry(_blog).CurrentValues.SetValues(_blog);
                        context.SaveChanges();

                        return _blog; // Trả về _movie sau khi cập nhật
                    }
                    else
                    {
                        throw new Exception("Blog does not exist");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Blog> SearchBlogByTitle(string title)
        {
            List<Blog> blogs = new List<Blog>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    blogs = context.Blogs
                        .Where(blog =>
                            blog.IsActive &&
                            (blog.Title.Contains(title)
                            ))
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return blogs;
        }

        public static List<Blog> SearchBlogByTitleAdmin(string title)
        {
            List<Blog> blogs = new List<Blog>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    blogs = context.Blogs
                        .Where(blog =>
                            (blog.Title.Contains(title)
                            ))
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return blogs;
        }
    }
}
