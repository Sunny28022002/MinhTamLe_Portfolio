using AutoMapper;
using MovieServices.DTOs.MovieDTOs.ResponseDTO;
using MovieServices.Models;

namespace MovieServices.DAOs
{
    public class MovieDAO
    {
        public static List<Movie> GetMovieList()
        {
            List<Movie> movies = new List<Movie>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var movieList = context.Movies.ToList();
                    foreach (var movie in movieList)
                    {
                        if (movie.IsActive)
                        {
                            movies.Add(movie);

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return movies;
        }

        public static Movie GetMovieById(int id)
        {
            Movie movie = new Movie();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    movie = context.Movies.SingleOrDefault(mv => (mv.MovieId == id) && mv.IsActive);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return movie;
        }

        public static List<Movie> GetMovieListNew()
        {
            List<Movie> movies = new List<Movie>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var movieList = context.Movies.OrderByDescending(movie => movie.MovieId).Where(movie => movie.IsActive).Take(10).ToList();
                    foreach (var movie in movieList)
                    {
                        if (movie.IsActive)
                        {
                            movies.Add(movie);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return movies;
        }

        public static List<Movie> GetListMovieByCategory(int categoryId)
        {
            List<int> movieIds = new List<int>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var listMovieId = context.MovieCategories.Where(c => c.CategoryId == categoryId).ToList();
                    foreach (var movie in listMovieId)
                    {
                        movieIds.Add(movie.MovieId);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


            List<Movie> movies = new List<Movie>();
            foreach (var movieID in movieIds)
            {
                var movie = GetMovieById(movieID);
                movies.Add(movie);
            }
            return movies;
        }

        public static Movie CreateMovie(Movie movie, List<int> cates)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    movie.IsActive = true;

                    context.Movies.Add(movie);
                    context.SaveChanges();

                    MovieCategoryDAO.CreateMovieCategory(cates, movie.MovieId);
                    return movie;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Movie UpdateMovie(Movie movie, List<int> cates)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _movie = context.Movies.SingleOrDefault(m => m.MovieId == movie.MovieId && m.IsActive);
                    if (_movie != null)
                    {
                        movie.IsActive = _movie.IsActive;
                        movie.PostedByUser = _movie.PostedByUser;

                        // Sử dụng SetValues để cập nhật giá trị từ movie vào _movie
                        context.Entry(_movie).CurrentValues.SetValues(movie);
                        context.SaveChanges();

                        MovieCategoryDAO.UpdateMovieCategory(cates, movie.MovieId);
                        return _movie; // Trả về _movie sau khi cập nhật
                    }
                    else
                    {
                        throw new Exception("Movie does not exist");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Movie DeleteMovie(int id)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _movie = context.Movies.SingleOrDefault(m => m.MovieId == id && m.IsActive);
                    if (_movie != null)
                    {
                        _movie.IsActive = false;
                        MovieCategoryDAO.DeleteMovieCategory(_movie.MovieId);

                        // Sử dụng SetValues để cập nhật giá trị từ movie vào _movie
                        context.Entry(_movie).CurrentValues.SetValues(_movie);
                        context.SaveChanges();

                        return _movie; // Trả về _movie sau khi cập nhật
                    }
                    else
                    {
                        throw new Exception("Movie does not exist");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static List<Movie> SearchMovies(string searchTerm)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    return context.Movies
                        .Where(movie =>
                            movie.IsActive &&
                            (movie.MovieName.Contains(searchTerm)
                            ))
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static List<Movie> GetMoviesByCategoryId(int categoryId)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var movieIds = context.MovieCategories
                        .Where(mc => mc.CategoryId == categoryId)
                        .Select(mc => mc.MovieId)
                        .ToList();

                    return context.Movies
                        .Where(movie => movie.IsActive && movieIds.Contains(movie.MovieId))
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
