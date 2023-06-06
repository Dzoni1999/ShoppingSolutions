using System;

namespace UsersMicroService.Models
{
    public enum VerifiedStatus : int
    {
        VERIFIED = 0,
        UNVERIFIED = 1,
        REJECTED = 2
    }

    public enum UserType : int
    {
        ADMINISTARTOR = 0,
        CUSTOMER = 1,
        DELIVERY = 2
    }

    public class User
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
        public string PhotoUrl { get; set; }
        public VerifiedStatus IsVerified { get; set; }
        public bool IsGoogle { get; set; }
    }
}
