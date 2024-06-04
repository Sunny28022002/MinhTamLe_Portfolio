using AutoMapper;
using MedicineService.DTOs;
using MedicineService.Models;
using MedicineService.Services;
using MedicineService.Services.ExaminatedRecordFolder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MedicineService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private IMedicineService medicineService = new Services.MedicineService();
        private IUnitService unitService = new UnitService();
        private IMedicineCodeService medicineCodeService = new MedicineCodeService();
        private IExaminatedRecordService recordService = new ExaminatedRecordService();
        private IMedicineCodeService codeService = new MedicineCodeService();

        public readonly IMapper _mapper;
        public readonly IConfiguration _configuration;

        public MedicineController(IMapper mapper, IConfiguration configuration)
        {
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult<ServiceResponse<List<MedicineResponse>>> GetAllMedicines()
        {
            var response = new ServiceResponse<List<MedicineResponse>>();
            var medicineList = new List<MedicineResponse>();
            var medicines = medicineService.GetMedicines();
            foreach (var medicine in medicines)
            {
                MedicineResponse medicineResponse = _mapper.Map<MedicineResponse>(medicine);
                var unit = unitService.GetUnitById(medicineResponse.UnitId);
                medicineResponse.UnitName = unit.UnitName;
                var code = medicineCodeService.GetMedicineCodeById(medicineResponse.CodeId);
                medicineResponse.CodeName = code.CodeName;
                var user = recordService.GetPeopleInfo(medicineResponse.UserId);
                medicineResponse.UserFullName = user.FirstName + " " + user.LastName;
                medicineList.Add(medicineResponse);
            }
            response.Data = medicineList;
            response.Status = 200;
            response.Message = "Get All Medicines";
            response.TotalDataList = medicineList.Count;
            return response;
        }

        [HttpGet("ListAdmin")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<MedicineResponse>>> GetAllMedicinesAdmin()
        {
            var response = new ServiceResponse<List<MedicineResponse>>();
            var medicineList = new List<MedicineResponse>();
            var medicines = medicineService.GetMedicinesAdmin();
            foreach (var medicine in medicines)
            {
                MedicineResponse medicineResponse = _mapper.Map<MedicineResponse>(medicine);
                var unit = unitService.GetUnitById(medicineResponse.UnitId);
                medicineResponse.UnitName = unit.UnitName;
                var code = medicineCodeService.GetMedicineCodeById(medicineResponse.CodeId);
                medicineResponse.CodeName = code.CodeName;
                var user = recordService.GetPeopleInfo(medicineResponse.UserId);
                medicineResponse.UserFullName = user.FirstName + " " + user.LastName;
                medicineList.Add(medicineResponse);
            }
            response.Data = medicineList;
            response.Status = 200;
            response.Message = "Get All Medicines By Admin";
            response.TotalDataList = medicineList.Count;
            return response;
        }

        [HttpGet("id")]
        public ActionResult<ServiceResponse<MedicineResponse>> GetMedicineById(int id)
        {
            var response = new ServiceResponse<MedicineResponse>();
            var medicine = medicineService.GetMedicineById(id);
            if (medicine == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var medicineResponse = _mapper.Map<MedicineResponse>(medicine);
                var unit = unitService.GetUnitById(medicineResponse.UnitId);
                medicineResponse.UnitName = unit.UnitName;
                var code = medicineCodeService.GetMedicineCodeById(medicineResponse.CodeId);
                medicineResponse.CodeName = code.CodeName;
                var user = recordService.GetPeopleInfo(medicineResponse.UserId);
                medicineResponse.UserFullName = user.FirstName + " " + user.LastName;
                response.Data = medicineResponse;
                response.Status = 200;
                response.Message = "Get Medicine By Id = " + id;
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpGet("DetailAdmin/id")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<MedicineResponse>> GetMedicineByIdAdmin(int id)
        {
            var response = new ServiceResponse<MedicineResponse>();
            var medicine = medicineService.GetMedicineByIdAdmin(id);
            if (medicine == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var medicineResponse = _mapper.Map<MedicineResponse>(medicine);
                var unit = unitService.GetUnitById(medicineResponse.UnitId);
                medicineResponse.UnitName = unit.UnitName;
                var code = medicineCodeService.GetMedicineCodeById(medicineResponse.CodeId);
                medicineResponse.CodeName = code.CodeName;
                var user = recordService.GetPeopleInfo(medicineResponse.UserId);
                medicineResponse.UserFullName = user.FirstName + " " + user.LastName;
                response.Data = medicineResponse;
                response.Status = 200;
                response.Message = "Get Medicine By Id = " + id + " By Admin";
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpPost("Create")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<MedicineResponse>> CreateMedicine(CreateMedicineRequest request)
        {
            var response = new ServiceResponse<MedicineResponse>();
            var medicineMap = _mapper.Map<Medicine>(request);
            var created = medicineService.CreateMedicine(medicineMap);
            if (created == null)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Medicine name has been already exists.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var MedicineResponse = _mapper.Map<MedicineResponse>(created);
                response.Data = MedicineResponse;
                response.Status = 200;
                response.Message = "Medicine created successful.";
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpPut("Update")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<MedicineResponse>> UpdateMedicine(UpdateMedicineRequest request)
        {
            var response = new ServiceResponse<MedicineResponse>();
            var medicineMap = _mapper.Map<Medicine>(request);
            var updated = medicineService.UpdateMedicine(medicineMap);
            if (updated == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            var MedicineResponse = _mapper.Map<MedicineResponse>(updated);
            response.Data = MedicineResponse;
            response.Status = 200;
            response.Message = "Medicine updated successful.";
            response.TotalDataList = 1;
            return Ok(response);
        }

        [HttpPut("Delete")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<MedicineResponse>> DeleteMedicine(int id)
        {
            var response = new ServiceResponse<MedicineResponse>();
            var deleted = medicineService.DeleteMedicine(id);
            if (deleted == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            var MedicineResponse = _mapper.Map<MedicineResponse>(deleted);
            response.Data = MedicineResponse;
            response.Status = 200;
            response.Message = "Medicine deleted successful.";
            response.TotalDataList = 1;
            return Ok(response);
        }

        [HttpGet("Search/name")]
        public ActionResult<ServiceResponse<List<MedicineResponse>>> SearchMedicinesByName(string name)
        {
            var response = new ServiceResponse<List<MedicineResponse>>();
            var medicineResponseList = new List<MedicineResponse>();
            var medicineList = medicineService.GetMedicinesByname(name);
            foreach (var medicine in medicineList)
            {
                var medicineResponse = _mapper.Map<MedicineResponse>(medicine);
                var unit = unitService.GetUnitById(medicineResponse.UnitId);
                medicineResponse.UnitName = unit.UnitName;
                var code = medicineCodeService.GetMedicineCodeById(medicineResponse.CodeId);
                medicineResponse.CodeName = code.CodeName;
                var user = recordService.GetPeopleInfo(medicineResponse.UserId);
                medicineResponse.UserFullName = user.FirstName + " " + user.LastName;
                medicineResponseList.Add(medicineResponse);
            }

            response.Data = medicineResponseList;
            response.Message = "Search Medicine By Name";
            response.Status = 200;
            response.TotalDataList = medicineResponseList.Count;
            return response;
        }

        [HttpGet("SearchAdmin/name")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<MedicineResponse>>> SearchMedicinesByNameAdmin(string name)
        {
            var response = new ServiceResponse<List<MedicineResponse>>();
            var medicineResponseList = new List<MedicineResponse>();
            var medicineList = medicineService.GetMedicinesBynameAdmin(name);
            foreach (var medicine in medicineList)
            {
                var medicineResponse = _mapper.Map<MedicineResponse>(medicine);
                var unit = unitService.GetUnitById(medicineResponse.UnitId);
                medicineResponse.UnitName = unit.UnitName;
                var code = medicineCodeService.GetMedicineCodeById(medicineResponse.CodeId);
                medicineResponse.CodeName = code.CodeName;
                var user = recordService.GetPeopleInfo(medicineResponse.UserId);
                medicineResponse.UserFullName = user.FirstName + " " + user.LastName;
                medicineResponseList.Add(medicineResponse);
            }

            response.Data = medicineResponseList;
            response.Message = "Search Medicine By Name By Admin";
            response.Status = 200;
            response.TotalDataList = medicineResponseList.Count;
            return response;
        }

        [HttpGet("CountActiveMedicine")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<int>> CountActiveMedince()
        {
            var response = new ServiceResponse<int>();
            var count = medicineService.CountActiveMedicine();
            response.Data = count;
            response.Message = ("Count Number Of Active Medicine");
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpGet("CountInActiveMedicine")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<int>> CountInActiveMedince()
        {
            var response = new ServiceResponse<int>();
            var count = medicineService.CountInActiveMedicine();
            response.Data = count;
            response.Message = ("Count Number Of InActive Medicine");
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpGet("Statistic")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<MedicineStatisticResponse>>> StatisticMedicineByCode()
        {
            var response = new ServiceResponse<List<MedicineStatisticResponse>>();
            var medicineTemp = new List<Medicine>();
            var codeTemp = new List<MedicineCode>();
            var finalList = new List<MedicineStatisticResponse>();
            var codeList = codeService.GetMedicineCodes();
            var medicineList = medicineService.GetMedicines();
            if (medicineList == null)
            {
                response.Data = null;
                response.Message = "No medicine created.";
                response.Status = 200;
                return response;
            }
            else
            {
                foreach (var medicine in medicineList)
                {
                    if (medicine.IsActive)
                    {
                        medicineTemp.Add(medicine);
                    }
                }
                medicineList = medicineTemp;
                foreach (var code in codeList)
                {
                    if (code.IsActive)
                    {
                        codeTemp.Add(code);
                    }
                }
                codeList = codeTemp;
                for (int i = 0; i <= codeList.Count; i++)
                {
                    while (i < codeList.Count)
                    {
                        int recordCount = 0;
                        var statistic = new MedicineStatisticResponse();
                        for (int j = 0; j < medicineList.Count; j++)
                        {
                            if (codeList[i].CodeId == medicineList[j].CodeId)
                            {
                                recordCount++;
                            }
                        }
                        if (recordCount > 0)
                        {
                            statistic.CodeName = codeService.GetMedicineCodeById(codeList[i].CodeId).CodeName;
                            statistic.Average = (float) recordCount/medicineList.Count;
                            finalList.Add(statistic);
                            i++;
                        }
                        else
                        {
                            i++;
                        }
                    }
                }
                response.Data = finalList;
                response.Message = "Statistic medicine by medicine code.";
                response.Status = 200;
                response.TotalDataList = finalList.Count;
                return response;
            }
        }

        [HttpGet("StatisticNumberOfMedicine")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<StatisticNumberOfMedicine>>> StatisticNumberOfMedicine()
        {
            var response = new ServiceResponse<List<StatisticNumberOfMedicine>>();
            var statistic = medicineService.StatisticNumberOfMedicine();
            response.Data = statistic;
            response.Message = ("Statistic Number Of Medicine");
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }
    }
}
