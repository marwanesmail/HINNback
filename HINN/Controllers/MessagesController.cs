using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;
using System.Security.Claims;

namespace MyHealthcareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public MessagesController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto dto)
        {
            var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (senderId == null) return Unauthorized();

            // التأكد من أن المستخدم المستلم موجود فعلاً لمنع خطأ قاعدة البيانات
            var receiverExists = await _db.Users.AnyAsync(u => u.Id == dto.ReceiverId);
            if (!receiverExists)
                return BadRequest(new { Message = "المستخدم المستلم (Receiver) غير موجود في النظام." });

            var msg = new Message
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                Content = dto.Content
            };

            _db.Messages.Add(msg);
            await _db.SaveChangesAsync();

            return Ok(_mapper.Map<MessageDto>(msg));
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
    }
}
