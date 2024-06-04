using APIS.DTOs.AuthenticationDTOs.ResponseDto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieServices.DTOs.EpisodeDTOs.RequestDTO;
using MovieServices.DTOs.EpisodeDTOs.ResponseDTO;
using MovieServices.Services.EpisodeServices;

namespace MovieServices.Controllers.Episode
{
    [Route("api/[controller]")]
    [ApiController]
    public class EpisodesController : ControllerBase
    {
        private IEpisodeService service = new EpisodeService();
        private readonly IMapper _mapper;

        public EpisodesController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<ServiceResponse<List<EpisodeResponse>>> GetEpisodes()
        {
            var response = new ServiceResponse<List<EpisodeResponse>>();
            var episodeResponseList = new List<EpisodeResponse>();
            var episodeList = service.GetEpisodes();
            foreach (var episode in episodeList)
            {
                episodeResponseList.Add(_mapper.Map<EpisodeResponse>(episode));
            }
            response.Data = episodeResponseList;
            response.Message = "Get Episode List";
            response.Status = 200;
            response.TotalDataList = episodeResponseList.Count;
            return response;
        }


        [HttpGet("movie/movieId")]
        public ActionResult<ServiceResponse<List<EpisodeResponse>>> GetEpisodesByMovieId(int movieId)
        {
            var response = new ServiceResponse<List<EpisodeResponse>>();
            var episodeResponseList = new List<EpisodeResponse>();
            var episodeList = service.GetEpisodesByMovieId(movieId);
            foreach (var episode in episodeList)
            {
                episodeResponseList.Add(_mapper.Map<EpisodeResponse>(episode));
            }
            response.Data = episodeResponseList;
            response.Message = "Get Episode List";
            response.Status = 200;
            response.TotalDataList = episodeResponseList.Count;
            return response;
        }
        [HttpGet("latestByMovie/{movieId}")]
        public ActionResult<ServiceResponse<EpisodeResponse>> GetLastestEpisodesByMovieId(int movieId)
        {
            var response = new ServiceResponse<EpisodeResponse>();

            // Retrieve the latest episode for the given movieId from the service
            var episode = service.GetLastestEpisodesByMovieId(movieId);

            if (episode != null)
            {
                var episodeResponse = _mapper.Map<EpisodeResponse>(episode);
                response.Data = episodeResponse;
                response.Message = "Get Latest Episode";
                response.Status = 200;
                response.TotalDataList = 1;
            }
            else
            {
                response.Message = "No latest episode found for the specified movieId.";
                response.Status = 404; 
            }

            return response;
        }
        


        [HttpGet("id")]
        public ActionResult<ServiceResponse<EpisodeResponse>> GetEpisodeById(int id)
        {
            var response = new ServiceResponse<EpisodeResponse>();
            var episode = service.GetEpisodeById(id);
            var episodeResponse = _mapper.Map<EpisodeResponse>(episode);
            response.Data = episodeResponse;
            response.Message = $"Get Episode by {id}";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Create")]
        public ActionResult<ServiceResponse<EpisodeResponse>> CreateMovie(AddEpisodeDto addEpisodeDto)
        {
            Models.Episode episode = _mapper.Map<Models.Episode>(addEpisodeDto);
            var episodeResponse = _mapper.Map<EpisodeResponse>(service.CreateEpisode(episode));
            var response = new ServiceResponse<EpisodeResponse>();
            response.Data = episodeResponse;
            response.Status = 200;
            response.Message = "Create Episode";
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Update")]
        public ActionResult<ServiceResponse<EpisodeResponse>> UpdateEpisode(UpdateEpisodeDto updateEpisodeDto)
        {
            Models.Episode episode = _mapper.Map<Models.Episode>(updateEpisodeDto);
            var episodeResponse = _mapper.Map<EpisodeResponse>(service.UpdateEpisode(episode));
            var response = new ServiceResponse<EpisodeResponse>();
            response.Data = episodeResponse;
            response.Status = 200;
            response.Message = "Update Episode";
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Delete")]
        public ActionResult<ServiceResponse<EpisodeResponse>> DeleteEpisode(int id)
        {
            var episodeResponse = _mapper.Map<EpisodeResponse>(service.DeleteEpisode(id));
            var response = new ServiceResponse<EpisodeResponse>();
            response.Data = episodeResponse;
            response.Status = 200;
            response.Message = "Delete Episode";
            return response;
        }
    }
}
