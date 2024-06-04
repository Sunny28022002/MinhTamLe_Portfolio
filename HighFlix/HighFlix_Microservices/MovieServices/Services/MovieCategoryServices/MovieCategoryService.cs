using MovieServices.DAOs;

namespace MovieServices.Services.MovieCategoryServices
{
    public class MovieCategoryService : IMovieCategoryService
    {
        public void CreateMovieCategory(List<int> categoriesId, int movieId) => MovieCategoryDAO.CreateMovieCategory(categoriesId, movieId);
    }
}
