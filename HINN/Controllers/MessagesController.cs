using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;
        private readonly Microsoft.AspNetCore.SignalR.IHubContext<MyHealthcareApi.Hubs.NotificationsHub> _hubContext;

        public MessagesController(
            AppDbContext db, 
            IMapper mapper,
            Microsoft.AspNetCore.SignalR.IHubContext<MyHealthcareApi.Hubs.NotificationsHub> hubContext)
        {
            _db = db;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto dto)
        {
            var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (senderId == null) return Unauthorized();

            var receiverExists = await _db.Users.AnyAsync(u => u.Id == dto.ReceiverId);
            if (!receiverExists)
                return BadRequest(new { Message = "المستخدم المستلم (Receiver) غير موجود في النظام." });

            var msg = new Message
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                Content = dto.Content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            _db.Messages.Add(msg);
            await _db.SaveChangesAsync();

            // Real-time notification via SignalR
            await _hubContext.Clients.User(dto.ReceiverId).SendAsync("ReceiveMessage", new 
            {
                SenderId = senderId,
                Content = dto.Content,
                SentAt = msg.SentAt
            });

            return Ok(_mapper.Map<MessageDto>(msg));
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var me = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (me == null) return Unauthorized();

            // Get all unique users I've chatted with
            var senderIds = await _db.Messages.Where(m => m.ReceiverId == me).Select(m => m.SenderId).Distinct().ToListAsync();
            var receiverIds = await _db.Messages.Where(m => m.SenderId == me).Select(m => m.ReceiverId).Distinct().ToListAsync();
            var otherUserIds = senderIds.Union(receiverIds).Distinct().ToList();

            var conversations = new List<ConversationDto>();

            foreach (var otherId in otherUserIds)
            {
                var otherUser = await _db.Users.FindAsync(otherId);
                if (otherUser == null) continue;

                var lastMessage = await _db.Messages
                    .Where(m => (m.SenderId == me && m.ReceiverId == otherId) || (m.SenderId == otherId && m.ReceiverId == me))
                    .OrderByDescending(m => m.SentAt)
                    .FirstOrDefaultAsync();

                var unreadCount = await _db.Messages
                    .CountAsync(m => m.SenderId == otherId && m.ReceiverId == me && !m.IsRead);

                conversations.Add(new ConversationDto
                {
                    OtherUserId = otherId,
                    OtherUserName = otherUser.FullName ?? "غير معروف",
                    LastMessage = lastMessage?.Content,
                    LastMessageTime = lastMessage?.SentAt ?? DateTime.MinValue,
                    UnreadCount = unreadCount,
                    UserType = otherUser.UserType.ToString()
                });
            }

            return Ok(conversations.OrderByDescending(c => c.LastMessageTime).ToList());
        }

        [HttpGet("conversations/{otherUserId}")]
        public async Task<IActionResult> GetConversation(string otherUserId)
        {
            var me = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (me == null) return Unauthorized();

            var conv = await _db.Messages
                .Where(m => (m.SenderId == me && m.ReceiverId == otherUserId) ||
                            (m.SenderId == otherUserId && m.ReceiverId == me))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(_mapper.Map<List<MessageDto>>(conv));
        }

        [HttpPut("read/{otherUserId}")]
        public async Task<IActionResult> MarkAsRead(string otherUserId)
        {
            var me = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (me == null) return Unauthorized();

            var unreadMessages = await _db.Messages
                .Where(m => m.SenderId == otherUserId && m.ReceiverId == me && !m.IsRead)
                .ToListAsync();

            foreach (var msg in unreadMessages)
            {
                msg.IsRead = true;
            }

            await _db.SaveChangesAsync();
            return Ok(new { Message = "تم تحديد الرسائل كمقروءة" });
        }
    }
}
