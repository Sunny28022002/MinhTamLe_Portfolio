using BlogService.DAOs;
using BlogService.Models;

namespace BlogService.Services
{
    public class BlogService : IBlogService
    {
        public List<Blog> GetBlogList() => BlogDAO.GetBlogList();
        public List<Blog> GetBlogListAdmin() => BlogDAO.GetBlogListAdmin();
        public Blog GetBlogById(int id) => BlogDAO.GetBlogById(id);
        public Blog GetBlogByIdAdmin(int id) => BlogDAO.GetBlogByIdAdmin(id);
        public Blog CreateBlog(Blog blog) => BlogDAO.CreateBlog(blog);
        public Blog UpdateBlog(Blog blog) => BlogDAO.UpdateBlog(blog);
        public Blog DeleteBlog(int id) => BlogDAO.DeleteBlog(id);
        public List<Blog> GetBlogsByTitle(string name) => BlogDAO.SearchBlogByTitle(name);
        public List<Blog> GetBlogsByTitleAdmin(string name) => BlogDAO.SearchBlogByTitleAdmin(name);
    }
}
