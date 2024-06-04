using AutoMapper;
using UserService.DTOs;
using UserService.Models;

namespace UserService
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            CreateMap<UpdateUserRequest, User>();
            CreateMap<User, UpdateUserRequest>();
            CreateMap<RegisterRequest, User>();
            CreateMap<User, RegisterRequest>();

            CreateMap<UserResponse, User>();
            CreateMap<User, UserResponse>();
            CreateMap<User, DoctorResponse>();
            CreateMap<DoctorResponse, User>();
            CreateMap<User, DoctorResponse>();
            CreateMap<StudentResponse, User>();
            CreateMap<User, StudentResponse>();
            CreateMap<UserManagementResponse, User>();
            CreateMap<User, UserManagementResponse>();
            CreateMap<StaffResponse, User>();  
            CreateMap<User, StaffResponse>();
            CreateMap<User, CreateUserRequest>();
            CreateMap<CreateUserRequest, User>();

            CreateMap<RoleResponse, Role>();
            CreateMap<Role, RoleResponse>();
            CreateMap<CreateRoleRequest, Role>();
            CreateMap<Role, CreateRoleRequest>();
            CreateMap<UpdateRoleRequest, Role>();
            CreateMap<Role, UpdateRoleRequest>();

            CreateMap<Feedback, FeedbackResponse>();
            CreateMap<FeedbackResponse, Feedback>();
            CreateMap<Feedback, AddFeedbackRequest>();
            CreateMap<AddFeedbackRequest, Feedback>();
            CreateMap<Feedback, UpdateFeedbackRequest>();
            CreateMap<UpdateFeedbackRequest, Feedback>();
            CreateMap<Feedback, DeleteFeedbackRequest>();
            CreateMap<DeleteFeedbackRequest, Feedback>();

            CreateMap<Chat,ChatResponse>();
            CreateMap<ChatResponse, Chat>();
            CreateMap<ChatHistory, SaveChatRequest>();
            CreateMap<SaveChatRequest, ChatHistory>();
        }
    }
}
