using AutoMapper;
using UsersMicroService.Dto;
using UsersMicroService.Models;

namespace UsersMicroService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
        }
    }
}
