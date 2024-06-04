using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogService.Models;
using BlogService.Services;
using AutoMapper;
using BlogService.DTOs;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace BlogService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogsController : ControllerBase
    {
        private readonly HttpClient _httpClient = null;
        private IBlogService service = new Services.BlogService();
        private readonly IMapper _mapper;

        public BlogsController(IMapper mapper)
        {
            _httpClient = new HttpClient();
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<ServiceResponse<List<BlogResponse>>> GetBlogList()
        {
            var response = new ServiceResponse<List<BlogResponse>>();
            var blogResponseList = new List<BlogResponse>();
            var blogList = service.GetBlogList();
            foreach (var blog in blogList)
            {
                BlogResponse blogResponse = _mapper.Map<BlogResponse>(blog);
                blogResponseList.Add(blogResponse);
            }

            response.Data = blogResponseList;
            response.Message = "Get Blog List";
            response.Status = 200;
            response.TotalDataList = blogResponseList.Count;
            return response;
        }

        [HttpGet("ListAdmin")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<BlogResponse>>> GetBlogListAdmin()
        {
            var response = new ServiceResponse<List<BlogResponse>>();
            var blogResponseList = new List<BlogResponse>();
            var blogList = service.GetBlogListAdmin();
            foreach (var blog in blogList)
            {
                BlogResponse blogResponse = _mapper.Map<BlogResponse>(blog);
                blogResponseList.Add(blogResponse);
            }

            response.Data = blogResponseList;
            response.Message = "Get Blog List";
            response.Status = 200;
            response.TotalDataList = blogResponseList.Count;
            return response;
        }

        [HttpGet("id")]
        public async Task<ActionResult<ServiceResponse<BlogResponse>>> GetBlogById(int id)
        {
            var blog = service.GetBlogById(id);
            var blogResponse = _mapper.Map<BlogResponse>(blog);

            var response = new ServiceResponse<BlogResponse>();
            response.Data = blogResponse;
            response.Message = "Get Blog Detail";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpGet("DetailAdmin/id")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<BlogResponse>>> GetBlogByIdAdmin(int id)
        {
            var blog = service.GetBlogByIdAdmin(id);
            var blogResponse = _mapper.Map<BlogResponse>(blog);

            var response = new ServiceResponse<BlogResponse>();
            response.Data = blogResponse;
            response.Message = "Get Blog Detail By Admin";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpPost("Create")]
        [Authorize(Policy = "BlogFullAccess")]
        public ActionResult<ServiceResponse<BlogResponse>> CreateBlog(AddBlogRequest addBlog)
        {
            Blog blog = _mapper.Map<Blog>(addBlog);
            blog = service.CreateBlog(blog);
            var blogResponse = _mapper.Map<BlogResponse>(blog);
            var response = new ServiceResponse<BlogResponse>();
            response.Data = blogResponse;
            response.Message = "Create Successful";
            response.Status = 200;
            return response;
        }

        [HttpPut("Update")]
        [Authorize(Policy = "BlogFullAccess")]
        public ActionResult<ServiceResponse<BlogResponse>> UpdateBlog(UpdateBlogResquest updateBlog)
        {
            Blog blog = _mapper.Map<Blog>(updateBlog);

            blog = service.UpdateBlog(blog);
            var blogResponse = _mapper.Map<BlogResponse>(blog);
            var response = new ServiceResponse<BlogResponse>();
            response.Data = blogResponse;
            response.Message = "Update Successful";
            response.Status = 200;
            return response;
        }

        [HttpPut("Delete")]
        [Authorize(Policy = "BlogFullAccess")]
        public ActionResult<ServiceResponse<BlogResponse>> DeleteBlog(int id)
        {
            Blog blog = service.DeleteBlog(id);
            var blogResponse = _mapper.Map<BlogResponse>(blog);
            var response = new ServiceResponse<BlogResponse>();
            response.Data = blogResponse;
            response.Message = "Delete Successful";
            response.Status = 200;
            return response;
        }

        [HttpGet("Search/title")]
        public ActionResult<ServiceResponse<List<BlogResponse>>> SearchBlogByTitle(string? title)
        {
            var response = new ServiceResponse<List<BlogResponse>>();
            var blogResponseList = new List<BlogResponse>();
            var blogList = service.GetBlogsByTitle(title);
            foreach (var blog in blogList)
            {
                BlogResponse blogResponse = _mapper.Map<BlogResponse>(blog);
                blogResponseList.Add(blogResponse);
            }

            response.Data = blogResponseList;
            response.Message = "Search Blog By Title";
            response.Status = 200;
            response.TotalDataList = blogResponseList.Count;
            return response;
        }

        [HttpGet("SearchForAdmin/title")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<BlogResponse>>> SearchBlogForAdminByTitle(string? title)
        {
            var response = new ServiceResponse<List<BlogResponse>>();
            var blogResponseList = new List<BlogResponse>();
            var blogList = service.GetBlogsByTitleAdmin(title);
            foreach (var blog in blogList)
            {
                BlogResponse blogResponse = _mapper.Map<BlogResponse>(blog);
                blogResponseList.Add(blogResponse);
            }

            response.Data = blogResponseList;
            response.Message = "Search Blog By Title Admin";
            response.Status = 200;
            response.TotalDataList = blogResponseList.Count;
            return response;
        }
    }
}
