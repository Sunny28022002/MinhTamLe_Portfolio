using APIS.DTOs.RequestDto;
using AuthenticationServices.DTOs.AuthenticationDTOs.ResponseDto;
using AuthenticationServices.Models;
using AutoMapper;

namespace ProjectAPI
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            CreateMap<RegisterDto, User>();
            //For Mapper User
            CreateMap<UserResponse, User>();
            CreateMap<User, UserResponse>();
        }
    }
}
