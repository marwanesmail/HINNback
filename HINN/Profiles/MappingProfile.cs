using AutoMapper;
using MyHealthcareApi.DTOs;
using MyHealthcareApi.Models;

namespace MyHealthcareApi.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, UserDto>();
            CreateMap<Message, MessageDto>().ReverseMap();
        }
    }
}
