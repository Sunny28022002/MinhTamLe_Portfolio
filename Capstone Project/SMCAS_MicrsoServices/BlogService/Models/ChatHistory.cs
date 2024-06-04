using System;
using System.Collections.Generic;

namespace BlogService.Models;

public partial class ChatHistory
{
    public int ChatHistoryId { get; set; }

    public int ChatId { get; set; }

    public int ReceiverId { get; set; }

    public int SenderId { get; set; }

    public string Message { get; set; } = null!;

    public DateTime SendingTime { get; set; }

    public bool IsActive { get; set; }

    public virtual Chat Chat { get; set; } = null!;
}
