using APIS.DTOs.AuthenticationDTOs.ResponseDto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieServices.DTOs.MovieDTOs.RequestDto;
using MovieServices.DTOs.MovieDTOs.ResponseDTO;
using MovieServices.DTOs.StatisticDTOs.RequestDTO;
using MovieServices.Models;
using MovieServices.Services.MovieServices;
using MovieServices.Services.StatisticServices;

namespace MovieServices.Controllers.Statistic
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticController : ControllerBase
    {
        private IStatisticService statisticService = new StatisticService();
        private IMovieService movieService = new MovieService();
        private readonly IMapper _mapper;

        public StatisticController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<StatisticMovieResponse>>> GetStatisticTheLastThreeDay()
        {
            DateTime today = DateTime.Now;
            DateTime threeDaysBefore = today.AddDays(-3);
            ServiceResponse<List<StatisticMovieResponse>> response = new ServiceResponse<List<StatisticMovieResponse>>();
            List<StatisticMovieResponse> statisticMovieResponses = new List<StatisticMovieResponse>();
            List<StatisticMovieResponse> statisticMovieResponsesFinal = new List<StatisticMovieResponse>();
            List<Models.Movie> movieList = movieService.GetMovieList();
            var statisticResponses = statisticService.GetStatisticByDateToDate(threeDaysBefore, today);
            if (statisticResponses == null)
            {
                response.Data = null;
                response.Message = "No movie is seen during this time.";
                response.Status = 400;
            }
            else
            {
                foreach (var item in statisticResponses)
                {
                    StatisticMovieResponse statisticMovieResponse = new StatisticMovieResponse();
                    var movie = movieService.GetMovieById(item.MovieId);
                    if (movie == null)
                    {
                        continue;
                    }
                    statisticMovieResponse.View += item.View;
                    statisticMovieResponse.MovieName = movie.MovieName;
                    statisticMovieResponse.MovieThumnailImage = movie.MovieThumnailImage;
                    statisticMovieResponse.ReleasedYear = movie.ReleasedYear;
                    statisticMovieResponses.Add(statisticMovieResponse);
                }
                for (var i = 0; i <= movieList.Count; i++)
                {
                    while (i < movieList.Count)
                    {
                        int viewCount = 0;
                        StatisticMovieResponse statisticMovieResponse = new StatisticMovieResponse();
                        int j = 0;
                        for (j = 0; j < statisticResponses.Count; j++)
                        {
                            if (movieList[i].MovieId == statisticResponses[j].MovieId)
                            {
                                viewCount += statisticResponses[j].View;
                            }
                        }
                        if (viewCount > 0)
                        {
                            statisticMovieResponse.MovieName = movieList[i].MovieName;
                            statisticMovieResponse.MovieThumnailImage = movieList[i].MovieThumnailImage;
                            statisticMovieResponse.ReleasedYear = movieList[i].ReleasedYear;
                            statisticMovieResponse.View = viewCount;
                            statisticMovieResponsesFinal.Add(statisticMovieResponse);
                            i++;
                        }
                        else
                        {
                            i++;
                        }
                    }
                }
                response.Data = statisticMovieResponsesFinal;
                response.Message = "Statistic success";
                response.TotalDataList = statisticMovieResponsesFinal.Count;
                response.Status = 200;
            }
            return response;
        }

        //[HttpGet("{startDate}/{endDate}")]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<StatisticMovieResponse>>> GetStatisticByDate(StatisticDateRequest request)
        {
            if (request.StartDate > request.EndDate)
            {
                return BadRequest("Time is not valid.");
            }
            ServiceResponse<List<StatisticMovieResponse>> response = new ServiceResponse<List<StatisticMovieResponse>>();
            List<StatisticMovieResponse> statisticMovieResponses = new List<StatisticMovieResponse>();
            List<StatisticMovieResponse> statisticMovieResponsesFinal = new List<StatisticMovieResponse>();
            List<Models.Movie> movieList = movieService.GetMovieList();
            var statisticResponses = statisticService.GetStatisticByDateToDate(request.StartDate, request.EndDate);
            if (statisticResponses == null)
            {
                response.Data = null;
                response.Message = "No movie is seen during this time.";
                response.Status = 400;
            }
            else
            {
                foreach (var item in statisticResponses)
                {
                    StatisticMovieResponse statisticMovieResponse = new StatisticMovieResponse();
                    var movie = movieService.GetMovieById(item.MovieId);
                    if (movie == null)
                    {
                        continue;
                    }
                    statisticMovieResponse.View += item.View;
                    statisticMovieResponse.MovieName = movie.MovieName;
                    statisticMovieResponse.MovieThumnailImage = movie.MovieThumnailImage;
                    statisticMovieResponse.ReleasedYear = movie.ReleasedYear;
                    statisticMovieResponses.Add(statisticMovieResponse);
                }
                for (var i = 0; i <= movieList.Count; i++)
                {
                    while (i < movieList.Count)
                    {
                        int viewCount = 0;
                        StatisticMovieResponse statisticMovieResponse = new StatisticMovieResponse();
                        int j = 0;
                        for (j = 0; j < statisticResponses.Count; j++)
                        {
                            if (movieList[i].MovieId == statisticResponses[j].MovieId)
                            {
                                viewCount += statisticResponses[j].View;
                            }
                        }
                        if (viewCount > 0)
                        {
                            statisticMovieResponse.MovieName = movieList[i].MovieName;
                            statisticMovieResponse.MovieThumnailImage = movieList[i].MovieThumnailImage;
                            statisticMovieResponse.ReleasedYear = movieList[i].ReleasedYear;
                            statisticMovieResponse.View = viewCount;
                            statisticMovieResponsesFinal.Add(statisticMovieResponse);
                            i++;
                        }
                        else
                        {
                            i++;
                        }
                    }
                }
                response.Data = statisticMovieResponsesFinal;
                response.Message = "Statistic success";
                response.TotalDataList = statisticMovieResponsesFinal.Count;
                response.Status = 200;
            }
            return response;
        }
    }
}
