using APIS.DTOs.AuthenticationDTOs.ResponseDto;
using AutoMapper;
using CategoryServices.DTOs.RequestDTO;
using CategoryServices.DTOs.ResponseDTO;
using CategoryServices.Models;
using CategoryServices.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CategoryServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private ICategoryService service = new CategoryService();
        private readonly IMapper _mapper;

        public CategoriesController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<ServiceResponse<List<CategoryResponse>>> GetCategoryList()
        {
            var response = new ServiceResponse<List<CategoryResponse>>();
            var categoryResponseList = new List<CategoryResponse>();
            var categoryList = service.GetCategoryList();
            foreach (var category in categoryList)
            {
                categoryResponseList.Add(_mapper.Map<CategoryResponse>(category));
            }
            response.Data = categoryResponseList;
            response.Message = "Get Category List";
            response.Status = 200;
            response.TotalDataList = categoryResponseList.Count;
            return response;
        }

        [HttpGet("id")]
        public ActionResult<ServiceResponse<CategoryResponse>> GetCategoryById(int id)
        {
            var category = service.GetCategoryById(id);
            var categoryResponse = _mapper.Map<CategoryResponse>(category);

            var response = new ServiceResponse<CategoryResponse>();
            response.Data = categoryResponse;
            response.Message = "Get Category";
            response.Status = 200;

            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Create")]
        public ActionResult<ServiceResponse<Category>> CreateCategory(AddCategoryDTO addCategoryDTO)
        {
            Category category = _mapper.Map<Category>(addCategoryDTO);
            category = service.CreateCategory(category);
            var response = new ServiceResponse<Category>();
            response.Data = category;
            response.Message = "Create Category";
            response.Status = 200;
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Update")]
        public ActionResult<ServiceResponse<Category>> UpdateCategory(UpdateCategoryDTO updateCategoryDTO)
        {
            Category category = _mapper.Map<Category>(updateCategoryDTO);

            category = service.UpdateCategory(category);
            var response = new ServiceResponse<Category>();
            response.Data = category;
            response.Message = "Update Category";
            response.Status = 200;
            return response;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("Delete")]
        public ActionResult<ServiceResponse<CategoryResponse>> DeleteCategory(int id)
        {
            Models.Category category = service.DeleteCategory(id);
            var categoryResponse = _mapper.Map<CategoryResponse>(category);
            var response = new ServiceResponse<CategoryResponse>();
            response.Data = categoryResponse;
            response.Message = "Delete Category";
            response.Status = 200;
            return response;
        }
    }
}
