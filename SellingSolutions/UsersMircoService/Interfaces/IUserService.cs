using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using UsersMicroService.Dto;

namespace UsersMicroService.Interfaces
{
    public interface IUserService
    {
        public UserDto AddUser(UserDto user);
        public TokenDto Login(LoginDto user);
        ModifyUserDto ModifyUser(ModifyUserDto user, long id);
        UserDto FindById(long id);
        ModifyPasswordDto ModifyPassword(ModifyPasswordDto password, long id);
        void AddImage(long id, IFormFile file);
        string GetImage(long id);
        TokenDto LoginGoogle(UserDto user);
        List<UserDto> GetAllDeliverers();
        VerifyDelivererDto VerifyDeliverer(VerifyDelivererDto user);
    }
}
