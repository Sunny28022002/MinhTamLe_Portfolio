using CategoryServices.Models;

namespace CategoryServices.Services
{
    public interface ICategoryService
    {
        List<Category> GetCategoryList();
        Category GetCategoryById(int id);
        Category CreateCategory(Category category);
        Category UpdateCategory(Category category);
        Category DeleteCategory(int id);
    }
}
