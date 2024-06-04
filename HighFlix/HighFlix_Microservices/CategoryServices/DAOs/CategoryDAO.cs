using CategoryServices.Models;

namespace CategoryServices.DAOs
{
    public class CategoryDAO
    {
        public static List<Category> GetCategoryList()
        {
            List<Category> categories = new List<Category>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var categoryList = context.Categories.ToList();
                    foreach (var category in categoryList)
                    {
                        if (category.IsActive)
                        {
                            categories.Add(category);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return categories;
        }

        public static Category GetCategoryById(int id)
        {
            Category category = new Category();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    category = context.Categories.SingleOrDefault(c => c.CategoryId == id);
                }
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return category;
        }

        public static Category CreateCategory(Category category)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    category.IsActive = true;

                    context.Categories.Add(category);
                    context.SaveChanges();

                    return category;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Category UpdateCategory(Category category)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _category = context.Categories.SingleOrDefault(c => c.CategoryId == category.CategoryId && c.IsActive);
                    if (_category != null)
                    {
                        category.IsActive = _category.IsActive;

                        // Sử dụng SetValues để cập nhật giá trị từ movie vào _movie
                        context.Entry(_category).CurrentValues.SetValues(category);
                        context.SaveChanges();

                        return _category; // Trả về _movie sau khi cập nhật
                    }
                    else
                    {
                        throw new Exception("Category does not exist");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Category DeleteCategory(int id)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _category = context.Categories.SingleOrDefault(c => c.CategoryId == id && c.IsActive);
                    if (_category != null)
                    {
                        _category.IsActive = false;

                        // Sử dụng SetValues để cập nhật giá trị từ movie vào _movie
                        context.Entry(_category).CurrentValues.SetValues(_category);
                        context.SaveChanges();

                        return _category; // Trả về _movie sau khi cập nhật
                    }
                    else
                    {
                        throw new Exception("Category does not exist");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
