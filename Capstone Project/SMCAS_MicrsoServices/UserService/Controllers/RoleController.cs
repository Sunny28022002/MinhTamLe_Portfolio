using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using System.Text.RegularExpressions;
using UserService.DTOs;
using UserService.Models;
using UserService.Services;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private IRoleService roleService = new RoleService();
        public AuthResponse authResponse = new AuthResponse();
        public readonly IMapper _mapper;
        public readonly IConfiguration _configuration;

        public RoleController(IConfiguration configuration, IMapper mapper)
        {
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<RoleResponse>>> GetAllRoles()
        {
            var response = new ServiceResponse<List<RoleResponse>>();
            var roles = new List<RoleResponse>();
            var roleList = roleService.GetRoles();
            foreach (var role in roleList)
            {
                RoleResponse roleResponse = _mapper.Map<RoleResponse>(role);
                roles.Add(roleResponse);
            }
            response.Data = roles;
            response.Status = 200;
            response.Message = "Get All Roles";
            response.TotalDataList = roles.Count;
            return response;
        }

        [HttpGet("id")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<RoleResponse>> GetRoleById(int id)
        {
            var response = new ServiceResponse<RoleResponse>();
            var role = roleService.GetRoleById(id);
            if (role == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Role not found";
                response.TotalDataList = 0;
            }
            var roleMap = _mapper.Map<RoleResponse>(role);
            response.Data = roleMap;
            response.Status = 200;
            response.Message = "Get Role By Id";
            response.TotalDataList = 1;
            return response;
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<RoleResponse>> CreateRole(CreateRoleRequest request)
        {
            var response = new ServiceResponse<RoleResponse>();
            var roleMap = _mapper.Map<Role>(request);
            string regexPattern = @"[^a-zA-Z0-9 ]";
            if (Regex.IsMatch(request.RoleName, regexPattern))
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Role name can not contain special characters.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var role = roleService.CreateRole(roleMap);
                if (role == null)
                {
                    response.Data = null;
                    response.Status = 400;
                    response.Message = "Role name has already exists.";
                    response.TotalDataList = 0;
                    return BadRequest(response);
                }
                else
                {
                    var roleResponse = _mapper.Map<RoleResponse>(role);
                    response.Data = roleResponse;
                    response.Status = 200;
                    response.Message = "Create role successful.";
                    response.TotalDataList = 1;
                }
            }
            return response;
        }

        [HttpPut("Update")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<RoleResponse>> UpdateRole(UpdateRoleRequest request)
        {
            var response = new ServiceResponse<RoleResponse>();
            var roleUpdate = _mapper.Map<Role>(request);
            var role = roleService.UpdateRole(roleUpdate);
            if (role == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Role name has already exists.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var roleResponse = _mapper.Map<RoleResponse>(role);
                response.Data = roleResponse;
                response.Status = 200;
                response.Message = "Role has been updated.";
                response.TotalDataList = 1;
            }
            return response;
        }

        [HttpPut("Delete/id")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<RoleResponse>> DeleteRole(int id)
        {
            var response = new ServiceResponse<RoleResponse>();
            var roleDelete = roleService.DeleteRole(id);
            if (roleDelete == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Role name does not exists.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var role = roleService.GetRoleById(id);
                var roleResponse = _mapper.Map<RoleResponse>(role);
                response.Data = roleResponse;
                response.Status = 200;
                response.Message = "Role has been deleted.";
                response.TotalDataList = 1;
            }
            return response;
        }

        [HttpGet("Search/name")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<RoleResponse>>> SearchRoleByName(string name)
        {
            var response = new ServiceResponse<List<RoleResponse>>();
            var roles = new List<RoleResponse>();
            var roleList = roleService.SearchRoleByName(name);
            foreach (var role in roleList)
            {
                RoleResponse roleResponse = _mapper.Map<RoleResponse>(role);
                roles.Add(roleResponse);
            }
            response.Data = roles;
            response.Status = 200;
            response.Message = "List role have name contain: " + name;
            response.TotalDataList = roles.Count;
            if (roles.Count == 0)
            {
                response.Data = roles;
                response.Status = 404;
                response.Message = "There is no role name: " + name;
                response.TotalDataList = roles.Count;
            }
            return response;
        }

        [HttpGet("Staff")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<List<RoleResponse>>> GetRoleStaff()
        {
            var response = new ServiceResponse<List<RoleResponse>>();
            var roles = new List<RoleResponse>();
            var roleList = roleService.GetRoleStaff();
            foreach (var role in roleList)
            {
                RoleResponse roleResponse = _mapper.Map<RoleResponse>(role);
                roles.Add(roleResponse);
            }
            response.Data = roles;
            response.Status = 200;
            response.Message = "Get Staff Roles";
            response.TotalDataList = roles.Count;
            return response;
        }
    }
}
