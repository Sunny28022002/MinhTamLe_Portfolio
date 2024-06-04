
using MovieServices.Models;
using MovieServices.Services.CommentServices;
using AutoMapper;
using AutoMapper.Execution;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using APIS.DTOs.AuthenticationDTOs.ResponseDto;
using APIS.DTOs.CommentDTOs.ResponseDto;
using MovieServices.DTOs.CommentDTOs.RequestDto;
using MovieServices.DAOs;
using MovieServices.DTOs.MovieDTOs.ResponseDTO;

namespace MovieServices.Controllers.Comment
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : Controller
    {
        private ICommentService service = new CommentService();
        private readonly IMapper _mapper;


        public CommentController(IMapper mapper)
        {
            _mapper = mapper;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<CommentResponse>>> GetComments()
        {
            var response = new ServiceResponse<List<CommentResponse>>();
            var commentResponseList = new List<CommentResponse>();
            var commentList = service.GetComments();
            foreach (var comment in commentList)
            {
                commentResponseList.Add(_mapper.Map<CommentResponse>(comment));
            }
            response.Data = commentResponseList;
            response.Message = "Get Comment List";
            response.Status = 200;
            response.TotalDataList = commentResponseList.Count;
            return response;
        }
        [HttpGet("movie/movieId")]
        public ActionResult<ServiceResponse<List<CommentResponse>>> GetCommentByMovieId(int movieId)
        {
            var response = new ServiceResponse<List<CommentResponse>>();
            var commentResponseList = new List<CommentResponse>();
            var commentList = service.GetCommentByMovieId(movieId);
            foreach (var comment in commentList)
            {
                commentResponseList.Add(_mapper.Map<CommentResponse>(comment));
            }
            response.Data = commentResponseList;
            response.Message = "Get Comment List";
            response.Status = 200;
            response.TotalDataList = commentResponseList.Count;
            return response;
        }
        [HttpGet("averageRating/{movieId}")]
        public ActionResult<ServiceResponse<double>> CalculateAverageRating(int movieId)
        {
            var response = new ServiceResponse<double>();
            var comments = service.GetCommentByMovieId(movieId);

            var validComments = comments.Where(comment => comment.IsActive);

            if (validComments.Any())
            {
                double averageRating = (double)validComments.Average(comment => comment.Rating);
                response.Data = averageRating;
                response.Message = "Average Rating Calculated";
                response.Status = 200;
            }
            else
            {
                response.Data = 0; 
                response.Message = "No Valid Comments Found";
                response.Status = 404;
            }

            return response;
        }


        [HttpGet("id")]
        public ActionResult<ServiceResponse<CommentResponse>> GetCommentById(int id)
        {
            var comment = service.GetCommentById(id);
            var commentResponse = _mapper.Map<CommentResponse>(comment);
            var response = new ServiceResponse<CommentResponse>();
            response.Data = commentResponse;
            response.Message = "Get Movie Detail";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }


        [HttpPost("Create")]
        [Authorize(Roles = "User")]
        public ActionResult<ServiceResponse<CommentResponse>> CreateComment(CreateCommentDto createCommentDto)
        {
            Models.Comment comment = _mapper.Map<Models.Comment>(createCommentDto);

            var commentResponse = _mapper.Map<CommentResponse>(service.CreateComment(comment));
            var response = new ServiceResponse<CommentResponse>();
            response.Data = commentResponse;
            response.Status = 200;
            response.Message = "Create Comment";
            return response;
        }
        [HttpPut("Update")]
        [Authorize(Roles = "User")]
        public ActionResult<ServiceResponse<CommentResponse>> UpdateComment(UpdateCommentDto updateCommentDto)
        {
            var commentResponse = _mapper.Map<CommentResponse>(service.UpdateComment(_mapper.Map<Models.Comment>(updateCommentDto)));
            var response = new ServiceResponse<CommentResponse>();
            response.Data = commentResponse;
            response.Status = 200;
            response.Message = "Update Comment";
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Delete")]
        public ActionResult<ServiceResponse<CommentResponse>> DeleteComment(int id)
        {
            var commentResponse = _mapper.Map<CommentResponse>(service.DeleteComment(id));
            var response = new ServiceResponse<CommentResponse>();
            response.Data = commentResponse;
            response.Status = 200;
            response.Message = "Delete Comment";
            return response;
        }
    }
}
