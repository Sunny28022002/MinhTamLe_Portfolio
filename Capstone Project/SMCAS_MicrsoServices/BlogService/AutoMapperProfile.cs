using AutoMapper;
using BlogService.DTOs;
using BlogService.Models;

namespace BlogService
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Blog, BlogResponse>();
            CreateMap<BlogResponse, Blog>();
            CreateMap<Blog, AddBlogRequest>();
            CreateMap<AddBlogRequest, Blog>();
            CreateMap<Blog, UpdateBlogResquest>();
            CreateMap<UpdateBlogResquest, Blog>();
        }
    }
}
