using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Data;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;

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
            var senderId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (senderId == null) return Unauthorized();

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
            var me = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
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
