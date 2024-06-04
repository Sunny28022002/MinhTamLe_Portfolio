using AutoMapper;
using ScheduleService.DTOs;
using ScheduleService.Models;

namespace ScheduleService
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            CreateMap<MedicalExaminationSchedule, ScheduleResponse>();
            CreateMap<ScheduleResponse, MedicalExaminationSchedule>();
            CreateMap<MedicalExaminationSchedule, AddScheduleRequest>();
            CreateMap<AddScheduleRequest, MedicalExaminationSchedule>();
            CreateMap<MedicalExaminationSchedule, UpdateScheduleRequest>();
            CreateMap<UpdateScheduleRequest, MedicalExaminationSchedule>();
            CreateMap<MedicalExaminationSchedule, RegisterScheduleRequest>();
            CreateMap<RegisterScheduleRequest, MedicalExaminationSchedule>();
        }
    }
}
