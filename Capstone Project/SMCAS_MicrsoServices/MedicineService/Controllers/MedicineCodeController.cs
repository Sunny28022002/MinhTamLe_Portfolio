using AutoMapper;
using MedicineService.DTOs;
using MedicineService.Models;
using MedicineService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicineService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineCodeController : ControllerBase
    {
        private IMedicineCodeService medicineCodeService = new MedicineCodeService();

        public readonly IMapper _mapper;
        public readonly IConfiguration _configuration;

        public MedicineCodeController(IMapper mapper, IConfiguration configuration)
        {
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult<ServiceResponse<List<MedicineCodeResponse>>> GetAllCodes()
        {
            var response = new ServiceResponse<List<MedicineCodeResponse>>();
            var codeList = new List<MedicineCodeResponse>();
            var codes = medicineCodeService.GetMedicineCodes();
            foreach (var code in codes)
            {
                MedicineCodeResponse MedicineCodeResponse = _mapper.Map<MedicineCodeResponse>(code);
                codeList.Add(MedicineCodeResponse);
            }
            response.Data = codeList;
            response.Status = 200;
            response.Message = "Get All Medicine Codes";
            response.TotalDataList = codeList.Count;
            return response;
        }

        [HttpGet("ListAdmin")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<MedicineCodeResponse>>> GetAllCodesAdmin()
        {
            var response = new ServiceResponse<List<MedicineCodeResponse>>();
            var codeList = new List<MedicineCodeResponse>();
            var codes = medicineCodeService.GetMedicineCodesAdmin();
            foreach (var code in codes)
            {
                MedicineCodeResponse MedicineCodeResponse = _mapper.Map<MedicineCodeResponse>(code);
                codeList.Add(MedicineCodeResponse);
            }
            response.Data = codeList;
            response.Status = 200;
            response.Message = "Get All Medicine Codes By Admin";
            response.TotalDataList = codeList.Count;
            return response;
        }

        [HttpGet("id")]
        public ActionResult<ServiceResponse<MedicineCodeResponse>> GetCodeById(int id)
        {
            var response = new ServiceResponse<MedicineCodeResponse>();
            var code = medicineCodeService.GetMedicineCodeById(id);
            if (code == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine Code not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var MedicineCodeResponse = _mapper.Map<MedicineCodeResponse>(code);
                response.Data = MedicineCodeResponse;
                response.Status = 200;
                response.Message = "Get Medicine Code By Id = " + id;
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpGet("DetailAdmin/id")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<MedicineCodeResponse>> GetCodeByIdAdmin(int id)
        {
            var response = new ServiceResponse<MedicineCodeResponse>();
            var code = medicineCodeService.GetMedicineCodeByIdAdmin(id);
            if (code == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine Code not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var MedicineCodeResponse = _mapper.Map<MedicineCodeResponse>(code);
                response.Data = MedicineCodeResponse;
                response.Status = 200;
                response.Message = "Get Medicine Code By Id = " + id + " By Admin";
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpPost("Create")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<MedicineCodeResponse>> CreateMedicineCode(CreateMedicineCodeRequest request)
        {
            var response = new ServiceResponse<MedicineCodeResponse>();
            var codeMap = _mapper.Map<MedicineCode>(request);
            var created = medicineCodeService.CreateMedicineCode(codeMap);
            if (created == null)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Medicine Code name has been already exists.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var medicineCodeResponse = _mapper.Map<MedicineCodeResponse>(created);
                response.Data = medicineCodeResponse;
                response.Status = 200;
                response.Message = "Medicine Code created successful.";
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpPut("Update")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<MedicineCodeResponse>> UpdateMedicineCode(UpdateMedicineCodeRequest request)
        {
            var response = new ServiceResponse<MedicineCodeResponse>();
            var codeMap = _mapper.Map<MedicineCode>(request);
            var updated = medicineCodeService.UpdateMedicineCode(codeMap);
            if (updated == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine Code not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            var MedicineCodeResponse = _mapper.Map<MedicineCodeResponse>(updated);
            response.Data = MedicineCodeResponse;
            response.Status = 200;
            response.Message = "Medicine Code updated successful.";
            response.TotalDataList = 1;
            return Ok(response);
        }

        [HttpPut("Delete")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<MedicineCodeResponse>> DeleteMedicineCode(int id)
        {
            var response = new ServiceResponse<MedicineCodeResponse>();
            var deleted = medicineCodeService.DeleteMedicineCode(id);
            if (deleted == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Medicine Code not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            var MedicineCodeResponse = _mapper.Map<MedicineCodeResponse>(deleted);
            response.Data = MedicineCodeResponse;
            response.Status = 200;
            response.Message = "Medicine Code deleted successful.";
            response.TotalDataList = 1;
            return Ok(response);
        }

        [HttpGet("Search/name")]
        public ActionResult<ServiceResponse<List<MedicineCodeResponse>>> SearchMedicineCodesByName(string name)
        {
            var response = new ServiceResponse<List<MedicineCodeResponse>>();
            var medicineCodeResponseList = new List<MedicineCodeResponse>();
            var medicineCodeList = medicineCodeService.GetMedicineCodesByName(name);
            foreach (var medicineCode in medicineCodeList)
            {
                MedicineCodeResponse blogResponse = _mapper.Map<MedicineCodeResponse>(medicineCode);
                medicineCodeResponseList.Add(blogResponse);
            }

            response.Data = medicineCodeResponseList;
            response.Message = "Search Medicine Code By Name";
            response.Status = 200;
            response.TotalDataList = medicineCodeResponseList.Count;
            return response;
        }

        [HttpGet("SearchAdmin/name")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<MedicineCodeResponse>>> SearchMedicineCodesByNameAdmin(string name)
        {
            var response = new ServiceResponse<List<MedicineCodeResponse>>();
            var medicineCodeResponseList = new List<MedicineCodeResponse>();
            var medicineCodeList = medicineCodeService.GetMedicineCodesByNameAdmin(name);
            foreach (var medicineCode in medicineCodeList)
            {
                MedicineCodeResponse blogResponse = _mapper.Map<MedicineCodeResponse>(medicineCode);
                medicineCodeResponseList.Add(blogResponse);
            }

            response.Data = medicineCodeResponseList;
            response.Message = "Search Medicine Code By Name By Admin";
            response.Status = 200;
            response.TotalDataList = medicineCodeResponseList.Count;
            return response;
        }
    }
}
