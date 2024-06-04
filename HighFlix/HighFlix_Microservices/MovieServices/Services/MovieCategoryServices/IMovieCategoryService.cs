namespace MovieServices.Services.MovieCategoryServices
{
    public interface IMovieCategoryService
    {
        void CreateMovieCategory(List<int> categoriesId, int movieId);
    }
}
