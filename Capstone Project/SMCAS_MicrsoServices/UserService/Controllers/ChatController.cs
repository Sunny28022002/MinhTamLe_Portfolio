using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using UserService.DTOs;
using UserService.Models;
using UserService.Services;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private IChatService service = new Services.ChatService();
        private readonly IMapper _mapper;

        [HttpGet("CheckExist")]
        public ActionResult<ServiceResponse<bool>> CheckExist(int patientId, int doctorId)
        {
            var response = new ServiceResponse<bool>();
            var check = service.CheckExist(patientId, doctorId);
  
            response.Data = check;
            response.Message = "Check Exist Of Chat Room";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpPost("CreateChatRoom")]
        public ActionResult<ServiceResponse<Chat>> CreateChatRoom(int patientId, int doctorId)
        {
            var response = new ServiceResponse<Chat>();
            var chat = service.CreateChatRoom(patientId, doctorId);

            response.Data = chat;
            response.Message = "Create chat room";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpGet("GetChat")]
        public ActionResult<ServiceResponse<Chat>> GetChat(int patientId, int doctorId)
        {
            var response = new ServiceResponse<Chat>();
            var chat = service.GetChat(patientId, doctorId);

            response.Data = chat;
            response.Message = "Get Chat";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpPut("EndChat")]
        public ActionResult<ServiceResponse<Chat>> EndChat(int chatId)
        {
            var response = new ServiceResponse<Chat>();
            var chat = service.EndChat(chatId);

            response.Data = chat;
            response.Message = "End Chat";
            response.Status = 200;
            response.TotalDataList = 1;
            return response;
        }

        [HttpPost("Save")]
        public ActionResult<ServiceResponse<ChatHistory>> SaveChat(SaveChatRequest request)
        {
            var response = new ServiceResponse<ChatHistory>();
            request.SendingTime = DateTime.Now;
            var chat = new ChatHistory();
            chat.ChatId = request.ChatId;
            chat.ReceiverId = request.ReceiverId;
            chat.SenderId = request.SenderId;
            chat.Message = request.Message;
            chat.SendingTime = DateTime.Now;
            var history = service.SaveChat(chat);
            if (history == null)
            {
                response.Data = history;
                response.Status = 200;
                response.Message = "Save chat failed.";
                response.TotalDataList = 1;
                return BadRequest(response);
            }
            response.Data = history;
            response.Status = 200;
            response.Message = "Save chat successful.";
            response.TotalDataList = 1;
            return response;
        }

        [HttpGet("Statistic")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<ChatStatisticResponse>> Statistic()
        {
            var response = new ServiceResponse<ChatStatisticResponse>();
            var statistic = new ChatStatisticResponse();
            statistic.NumberOfRoom = service.GetAllChat().Count;
            statistic.NumberOfMessages = service.GetAllChatHistory().Count;
            response.Data = statistic;
            response.Status = 200;
            response.Message = "Statistic number of chat room and messages";
            response.TotalDataList = 1;
            return response;
        }
    }
}
