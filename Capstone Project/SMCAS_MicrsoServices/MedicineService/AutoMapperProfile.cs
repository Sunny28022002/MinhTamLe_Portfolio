using AutoMapper;
using MedicineService.DTOs;
using MedicineService.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MedicineService
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            CreateMap<Unit, UnitResponse>();
            CreateMap<UnitResponse, Unit>();
            CreateMap<Unit, CreateUnitRequest>();
            CreateMap<CreateUnitRequest, Unit>();
            CreateMap<Unit, UpdateUnitRequest>();
            CreateMap<UpdateUnitRequest, Unit>();

            CreateMap<MedicineCode, MedicineCodeResponse>();
            CreateMap<MedicineCodeResponse, MedicineCode>();
            CreateMap<MedicineCode, CreateMedicineCodeRequest>();
            CreateMap<CreateMedicineCodeRequest, MedicineCode>();
            CreateMap<MedicineCode, UpdateMedicineCodeRequest>();
            CreateMap<UpdateMedicineCodeRequest, MedicineCode>();

            CreateMap<Medicine, MedicineResponse>();
            CreateMap<MedicineResponse, Medicine>();
            CreateMap<Medicine, CreateMedicineRequest>();
            CreateMap<CreateMedicineRequest, Medicine>();
            CreateMap<Medicine, UpdateMedicineRequest>();
            CreateMap<UpdateMedicineRequest, Medicine>();

            CreateMap<ExaminatedRecord, ExaminatedRecordResponse>();
            CreateMap<ExaminatedRecordResponse, ExaminatedRecord>();
            CreateMap<CreateExaminatedRecordRequest, ExaminatedRecord>();
            CreateMap<ExaminatedRecord, CreateExaminatedRecordRequest>();
            CreateMap<UpdateExaminatedRecordRequest, ExaminatedRecord>();
            CreateMap<ExaminatedRecord, UpdateExaminatedRecordRequest>();

            CreateMap<MedicineExaminatedRecord,  MedicineExaminatedRecordResponse>();
            CreateMap<MedicineExaminatedRecordResponse,  MedicineExaminatedRecord>();
            CreateMap<CreateMedicineExaminatedRecordRequest, MedicineExaminatedRecord>();
            CreateMap<MedicineExaminatedRecord, CreateMedicineExaminatedRecordRequest>();
            CreateMap<UpdateMedicineExaminatedRecordRequest, MedicineExaminatedRecord>();
            CreateMap<MedicineExaminatedRecord, UpdateMedicineExaminatedRecordRequest>();
        }
    }
}
