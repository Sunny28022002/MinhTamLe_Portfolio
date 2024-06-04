using System.Diagnostics;
using UserService.Models;

namespace UserService.DAOs
{
    public class ChatDAO
    {
        public static bool CheckExist(int patientId, int doctorId)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var chats = context.Chats.Where(c => c.DoctorId == doctorId && c.PatientId == patientId && c.EndTime == null).ToList();
                    if (chats.Count > 0)
                    {
                        return true;
                    }
                    else return false;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Chat CreateChatRoom(int patientId, int doctorId)
        {
            var chat = new Chat();
            chat.DoctorId = doctorId;
            chat.PatientId = patientId;
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    chat.IsActive = true;
                    chat.ChatDate = DateTime.Now;
                    chat.StartTime = DateTime.Now;

                    context.Chats.Add(chat);
                    context.SaveChanges();

                    return chat;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Chat GetChat(int patientId, int doctorId)
        {
            Chat chat = new Chat();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    chat = context.Chats.SingleOrDefault(c => c.DoctorId == doctorId && c.PatientId == patientId && c.EndTime == null);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return chat;
        }

        public static Chat EndChat(int chatId)
        {
            Chat updateChat = new Chat();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var chatCheck = context.Chats.FirstOrDefault(c => c.ChatId == chatId);
                    if (chatCheck != null)
                    {
                        updateChat = chatCheck;
                        updateChat.EndTime = DateTime.Now;
                        TimeSpan timeDifference = (TimeSpan)(updateChat.EndTime - updateChat.StartTime);
                        updateChat.TotalTime = timeDifference.ToString();
                        context.Entry(chatCheck).CurrentValues.SetValues(updateChat);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }

                    return updateChat;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static ChatHistory SaveChat(ChatHistory chatHistory)
        {
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    chatHistory.IsActive = true;
                    context.ChatHistories.Add(chatHistory);
                    context.SaveChanges();
                    return chatHistory;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Chat> GetAllChat()
        {
            var list = new List<Chat>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    list = context.Chats.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public static List<ChatHistory> GetAllChatHistory()
        {
            var list = new List<ChatHistory>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    list = context.ChatHistories.ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }
    }
}
