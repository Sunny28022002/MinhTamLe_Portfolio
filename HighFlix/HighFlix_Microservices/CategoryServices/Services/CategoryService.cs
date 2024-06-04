using CategoryServices.DAOs;
using CategoryServices.Models;

namespace CategoryServices.Services
{
    public class CategoryService : ICategoryService
    {
        public List<Category> GetCategoryList() => CategoryDAO.GetCategoryList();
        public Category GetCategoryById(int id) => CategoryDAO.GetCategoryById(id);
        public Category CreateCategory(Category category) => CategoryDAO.CreateCategory(category);
        public Category UpdateCategory(Category category) => CategoryDAO.UpdateCategory(category);
        public Category DeleteCategory(int id) => CategoryDAO.DeleteCategory(id);
    }
}
