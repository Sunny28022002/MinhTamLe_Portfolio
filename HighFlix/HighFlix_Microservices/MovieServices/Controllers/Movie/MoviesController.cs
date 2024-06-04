using APIS.DTOs.AuthenticationDTOs.ResponseDto;
using APIS.DTOs.MovieDTOs.RequestDto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieServices.DTOs.MovieDTOs.ResponseDTO;
using MovieServices.Services.MovieServices;
using MovieServices.Models;
using MovieServices.DAOs;
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Options;
using CategoryServices.DTOs.ResponseDTO;


namespace MovieServices.Controllers.Movie
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly HttpClient _httpClient = null;
        private IMovieService service = new MovieService();
        private readonly IMapper _mapper;
        private string CategoryManagementApiUrl = "";

        public MoviesController(IMapper mapper)
        {
            _httpClient = new HttpClient();
            CategoryManagementApiUrl = "http://host.docker.internal:7112/api/Categories";
            //CategoryManagementApiUrl = "http://localhost:44386/api/Categories";

            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<ServiceResponse<List<MovieResponse>>> GetMovieList()
        {
            var response = new ServiceResponse<List<MovieResponse>>();
            var movieResponseList = new List<MovieResponse>();
            var movieList = service.GetMovieList();
            foreach (var movie in movieList)
            {
                List<MovieCategory> movieCategories = MovieCategoryDAO.GetCategoryByMovieId(movie.MovieId);
                MovieResponse movieResponse = _mapper.Map<MovieResponse>(movie);
                movieResponse.Categories = new List<string>();
                if (movieResponse.Description.Contains("N\'"))
                {
                    movieResponse.Description = movieResponse.Description.TrimEnd('\'');
                    movieResponse.Description = movieResponse.Description.Substring(2);
                }
                if (movieResponse.AliasName.Contains("N\'"))
                {
                    movieResponse.AliasName = movieResponse.AliasName.TrimEnd('\'');
                    movieResponse.AliasName = movieResponse.AliasName.Substring(2);
                }
                movieCategories.ForEach(movieCategory =>
                {
                    movieResponse.Categories.Add(movieCategory.CategoryId.ToString());
                });
                movieResponseList.Add(movieResponse);
            }

            response.Data = movieResponseList;
            response.Message = "Get Movie List";
            response.Status = 200;
            response.TotalDataList = movieResponseList.Count;
            return response;
        }

        [HttpGet("id")]
        public async Task<ActionResult<ServiceResponse<MovieResponse>>> GetMovieByIdAsync(int id)
        {
            var movie = service.GetMovieById(id);
            var movieResponse = _mapper.Map<MovieResponse>(movie);
            List<MovieCategory> movieCategories = MovieCategoryDAO.GetCategoryByMovieId(movie.MovieId);
            movieResponse.Categories = new List<string>();
            movieCategories.ForEach(movieCategory =>
            {
                movieResponse.Categories.Add(movieCategory.CategoryId.ToString());
            });
            if (movieResponse.Description.Contains("N\'"))
            {
                movieResponse.Description = movieResponse.Description.TrimEnd('\'');
                movieResponse.Description = movieResponse.Description.Substring(2);
            }
            if (movieResponse.AliasName.Contains("N\'"))
            {
                movieResponse.AliasName = movieResponse.AliasName.TrimEnd('\'');
                movieResponse.AliasName = movieResponse.AliasName.Substring(2);
            }

            for (int i = 0; i < movieResponse.Categories.Count; i++)
            {
                var category = movieResponse.Categories[i];
                HttpResponseMessage responseData = await _httpClient.GetAsync($"{CategoryManagementApiUrl}/id?id={int.Parse(category)}");
                string strData = await responseData.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                ServiceResponse<CategoryResponse> categoryResponse = JsonSerializer.Deserialize<ServiceResponse<CategoryResponse>>(strData, options);

                var newCategory = categoryResponse.Data.CategoryName;

                // Gán lại giá trị của category bằng giá trị mới
                movieResponse.Categories[i] = newCategory;
            }

            var response = new ServiceResponse<MovieResponse>();
            response.Data = movieResponse;
            response.Message = "Get Movie Detail";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpGet("update/id")]
        public async Task<ActionResult<ServiceResponse<MovieResponse>>> GetMovieByIdForUpdate(int id)
        {
            var movie = service.GetMovieById(id);
            var movieResponse = _mapper.Map<MovieResponse>(movie);
            List<MovieCategory> movieCategories = MovieCategoryDAO.GetCategoryByMovieId(movie.MovieId);
            movieResponse.Categories = new List<string>();
            movieCategories.ForEach(movieCategory =>
            {
                movieResponse.Categories.Add(movieCategory.CategoryId.ToString());
            });
            if (movieResponse.Description.Contains("N\'"))
            {
                movieResponse.Description = movieResponse.Description.TrimEnd('\'');
                movieResponse.Description = movieResponse.Description.Substring(2);
            }
            if (movieResponse.AliasName.Contains("N\'"))
            {
                movieResponse.AliasName = movieResponse.AliasName.TrimEnd('\'');
                movieResponse.AliasName = movieResponse.AliasName.Substring(2);
            }

            var response = new ServiceResponse<MovieResponse>();
            response.Data = movieResponse;
            response.Message = "Get Movie Detail";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpGet("new")]
        public ActionResult<ServiceResponse<List<MovieResponse>>> GetMovieListNew()
        {
            var response = new ServiceResponse<List<MovieResponse>>();
            var movieResponseList = new List<MovieResponse>();
            var movieList = service.GetMovieListNew();
            foreach (var movie in movieList)
            {
                List<MovieCategory> movieCategories = MovieCategoryDAO.GetCategoryByMovieId(movie.MovieId);
                MovieResponse movieResponse = _mapper.Map<MovieResponse>(movie);
                movieResponse.Categories = new List<string>();
                if (movieResponse.Description.Contains("N\'"))
                {
                    movieResponse.Description = movieResponse.Description.TrimEnd('\'');
                    movieResponse.Description = movieResponse.Description.Substring(2);
                }
                if (movieResponse.AliasName.Contains("N\'"))
                {
                    movieResponse.AliasName = movieResponse.AliasName.TrimEnd('\'');
                    movieResponse.AliasName = movieResponse.AliasName.Substring(2);
                }
                movieCategories.ForEach(movieCategory =>
                {
                    movieResponse.Categories.Add(movieCategory.CategoryId.ToString());
                });
                movieResponseList.Add(movieResponse);
            }
            response.Data = movieResponseList;
            response.Message = "Get Movie List New";
            response.Status = 200;
            response.TotalDataList = movieList.Count;
            return response;
        }



        [Authorize(Roles = "Admin")]
        [HttpPost("Create")]
        public ActionResult<ServiceResponse<MovieResponse>> CreateMovie(AddMovieDto addMovieDto)
        {
            Models.Movie movie = _mapper.Map<Models.Movie>(addMovieDto);
            movie = service.CreateMovie(movie, addMovieDto.Categories);
            var movieResponse = _mapper.Map<MovieResponse>(movie);
            var response = new ServiceResponse<MovieResponse>();
            response.Data = movieResponse;
            response.Message = "Create Movie";
            response.Status = 200;
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Update")]
        public ActionResult<ServiceResponse<MovieResponse>> UpdateMovie(UpdateMovieDto updateMovieDto)
        {
            Models.Movie movie = _mapper.Map<Models.Movie>(updateMovieDto);

            movie = service.UpdateMovie(movie, updateMovieDto.Categories);
            var movieResponse = _mapper.Map<MovieResponse>(movie);
            var response = new ServiceResponse<MovieResponse>();
            response.Data = movieResponse;
            response.Message = "Update Movie";
            response.Status = 200;
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Delete")]
        public ActionResult<ServiceResponse<MovieResponse>> DeleteMovie(int id)
        {
            Models.Movie movie = service.DeleteMovie(id);
            var movieResponse = _mapper.Map<MovieResponse>(movie);
            var response = new ServiceResponse<MovieResponse>();
            response.Data = movieResponse;
            response.Message = "Delete Movie";
            response.Status = 200;
            return response;
        }

        [HttpGet("Search")]
        public ActionResult<ServiceResponse<List<MovieResponse>>> SearchMovies([FromQuery] string searchMovieName)
        {
            var movies = service.SearchMovies(searchMovieName);
            return Ok(movies);
        }
        [HttpGet("category/{categoryId}")]
        public ActionResult<ServiceResponse<List<MovieResponse>>> GetMoviesByCategoryId(int categoryId)
        {
            var response = new ServiceResponse<List<MovieResponse>>();
            var movieResponseList = new List<MovieResponse>();

            try
            {
                List<Models.Movie> movies = service.GetMoviesByCategoryId(categoryId); 

                foreach (var movie in movies)
                {
                    List<MovieCategory> movieCategories = MovieCategoryDAO.GetCategoryByMovieId(movie.MovieId);
                    MovieResponse movieResponse = _mapper.Map<MovieResponse>(movie);
                    movieResponse.Categories = new List<string>();

                    if (movieResponse.Description != null && movieResponse.Description.Contains("N\'"))
                    {
                        movieResponse.Description = movieResponse.Description.Replace("N'", string.Empty);
                    }

                    if (movieResponse.AliasName != null && movieResponse.AliasName.Contains("N\'"))
                    {
                        movieResponse.AliasName = movieResponse.AliasName.Replace("N'", string.Empty);
                    }

                    movieCategories.ForEach(movieCategory =>
                    {
                        movieResponse.Categories.Add(movieCategory.CategoryId.ToString());
                    });

                    movieResponseList.Add(movieResponse);
                }

                response.Data = movieResponseList;
                response.Message = "Get Movies by Category";
                response.Status = 200;
                response.TotalDataList = movieResponseList.Count;
            }
            catch (Exception ex)
            {
                response.Data = null;
                response.Message = ex.Message;
                response.Status = 500;
                response.TotalDataList = 0;
            }

            return response;
        }

    }
}

