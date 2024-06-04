using AutoMapper;
using Azure.Core;
using MedicineService.DTOs;
using MedicineService.Models;
using MedicineService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MedicineService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitController : ControllerBase
    {
        private IUnitService unitService = new UnitService();

        public readonly IMapper _mapper;
        public readonly IConfiguration _configuration;

        public UnitController(IMapper mapper, IConfiguration configuration)
        {
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet("ListAdmin")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<List<UnitResponse>>> GetAllUnits()
        {
            var response = new ServiceResponse<List<UnitResponse>>();
            var unitList = new List<UnitResponse>();
            var units = unitService.GetUnits();
            foreach (var unit in units)
            {
                UnitResponse unitResponse = _mapper.Map<UnitResponse>(unit);
                unitList.Add(unitResponse);
            }
            response.Data = unitList;
            response.Status = 200;
            response.Message = "Get All Units";
            response.TotalDataList = unitList.Count;
            return response;
        }

        [HttpGet]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<List<UnitResponse>>> GetAllUnitsActive()
        {
            var response = new ServiceResponse<List<UnitResponse>>();
            var unitList = new List<UnitResponse>();
            var units = unitService.GetUnits();
            foreach (var unit in units)
            {
                if (unit.IsActive)
                {
                    UnitResponse unitResponse = _mapper.Map<UnitResponse>(unit);
                    unitList.Add(unitResponse);
                }
            }
            response.Data = unitList;
            response.Status = 200;
            response.Message = "Get All Units";
            response.TotalDataList = unitList.Count;
            return response;
        }

        [HttpGet("id")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<UnitResponse>> GetUnitById(int id)
        {
            var response = new ServiceResponse<UnitResponse>();
            var unit = unitService.GetUnitById(id);
            if (unit == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Unit not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var unitResponse = _mapper.Map<UnitResponse>(unit);
                response.Data = unitResponse;
                response.Status = 200;
                response.Message = "Get Unit By Id = " + id;
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpPost("Create")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<UnitResponse>> CreateUnit(CreateUnitRequest request)
        {
            var response = new ServiceResponse<UnitResponse>();
            var unitMap = _mapper.Map<Unit>(request);
            var created = unitService.CreateUnit(unitMap);
            if (created == null)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Unit name has been already exists.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var unitResponse = _mapper.Map<UnitResponse>(created);
                response.Data = unitResponse;
                response.Status = 200;
                response.Message = "Unit created successful.";
                response.TotalDataList = 1;
                return Ok(response);
            }
        }

        [HttpPut("Update")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<UnitResponse>> UpdateUnit(UpdateUnitRequest request)
        {
            var response = new ServiceResponse<UnitResponse>();
            var unitMap = _mapper.Map<Unit>(request);
            var updated = unitService.UpdateUnit(unitMap);
            if (updated == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Unit not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            var unitResponse = _mapper.Map<UnitResponse>(updated);
            response.Data = unitResponse;
            response.Status = 200;
            response.Message = "Unit updated successful.";
            response.TotalDataList = 1;
            return Ok(response);
        }

        [HttpPut("id")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<UnitResponse>> DeleteUnit(int id)
        {
            var response = new ServiceResponse<UnitResponse>();
            var deleted = unitService.DeleteUnit(id);
            if (deleted == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Unit not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            var unitResponse = _mapper.Map<UnitResponse>(deleted);
            response.Data = unitResponse;
            response.Status = 200;
            response.Message = "Unit deleted successful.";
            response.TotalDataList = 1;
            return Ok(response);
        }

        [HttpGet("SearchAdmin/name")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<List<UnitResponse>>> SearchUnitByName(string name)
        {
            var response = new ServiceResponse<List<UnitResponse>>();
            var unitList = new List<UnitResponse>();
            var units = unitService.SearchUnitByName(name);
            foreach (var unit in units)
            {
                UnitResponse unitResponse = _mapper.Map<UnitResponse>(unit);
                unitList.Add(unitResponse);
            }
            response.Data = unitList;
            response.Status = 200;
            response.Message = "Search unit by name contain: " + name;
            response.TotalDataList = unitList.Count;
            if (unitList.Count == 0)
            {
                response.Data = unitList;
                response.Status = 404;
                response.Message = "There is no unit contains: " + name;
                response.TotalDataList = unitList.Count;
            }
            return response;
        }

        [HttpGet("Search/name")]
        [Authorize(Policy = "MedicineFullAccess")]
        public ActionResult<ServiceResponse<List<UnitResponse>>> SearchUnitActiveByName(string name)
        {
            var response = new ServiceResponse<List<UnitResponse>>();
            var unitList = new List<UnitResponse>();
            var units = unitService.SearchUnitByName(name);
            foreach (var unit in units)
            {
                if (unit.IsActive)
                {
                    UnitResponse unitResponse = _mapper.Map<UnitResponse>(unit);
                    unitList.Add(unitResponse);
                }
            }
            response.Data = unitList;
            response.Status = 200;
            response.Message = "Search unit by name contain: " + name;
            response.TotalDataList = unitList.Count;
            if (unitList.Count == 0)
            {
                response.Data = unitList;
                response.Status = 404;
                response.Message = "There is no unit contains: " + name;
                response.TotalDataList = unitList.Count;
            }
            return response;
        }
    }
}
