using UserService.Models;

namespace UserService.Services
{
    public interface IChatService
    {
        bool CheckExist(int patientId, int doctorId);
        Chat CreateChatRoom(int patientId, int doctorId);
        Chat GetChat(int patientId, int doctorId);
        Chat EndChat(int chatId);
        ChatHistory SaveChat(ChatHistory chatHistory);
        List<Chat> GetAllChat();
        List<ChatHistory> GetAllChatHistory();
    }
}
