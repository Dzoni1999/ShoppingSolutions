using System;
using UsersMicroService.Models;

namespace UsersMicroService.Dto
{
    public class UserDto
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime BirthDate { get; set; }
        public string Address { get; set; }
        public UserType UserType { get; set; }
        public bool Activated { get; set; }
        public string PhotoUrl { get; set; }
        public VerifiedStatus IsVerified { get; set; }
    }
}
