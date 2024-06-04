using BlogService.Models;

namespace BlogService.Services
{
    public interface IBlogService
    {
        List<Blog> GetBlogList();
        List<Blog> GetBlogListAdmin();
        Blog GetBlogById(int id);
        Blog GetBlogByIdAdmin(int id);
        Blog CreateBlog(Blog blog);
        Blog UpdateBlog(Blog blog);
        Blog DeleteBlog(int id);
        List<Blog> GetBlogsByTitle(string title);
        List<Blog> GetBlogsByTitleAdmin(string title);
    }
}
