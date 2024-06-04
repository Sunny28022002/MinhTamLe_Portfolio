using AutoMapper;
using CategoryServices.DTOs.RequestDTO;
using CategoryServices.DTOs.ResponseDTO;
using CategoryServices.Models;


namespace ProjectAPI
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            //for Category
            CreateMap<Category, CategoryResponse>();
            CreateMap<AddCategoryDTO, Category>();
            CreateMap<UpdateCategoryDTO, Category>();
        }
    }
}
