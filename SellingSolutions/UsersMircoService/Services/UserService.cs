using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using UsersMicroService.Dto;
using UsersMicroService.Infrastructure;
using UsersMicroService.Interfaces;
using UsersMicroService.Models;

namespace UsersMicroService.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly UsersDbContext _dbContext;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _tokenAddress;
        private const string Pepper = "q1w2e3r4vswubver_";

        private readonly string _password;
        private readonly string _email;

        public UserService(IMapper mapper, UsersDbContext dbContext, IConfiguration config)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _secretKey = config.GetSection("SecretKey");
            _tokenAddress = config.GetSection("tokenAddress");
            _password = config.GetConnectionString("Password");
            _email = config.GetConnectionString("Email");
        }

        private string Encode(string raw)
        {
            using var sha = SHA256.Create();
            var computedHash = sha.ComputeHash(
                Encoding.Unicode.GetBytes(raw + Pepper));
            return Convert.ToBase64String(computedHash);
        }

        public UserDto AddUser(UserDto user)
        {
            try
            {
                var users = _dbContext.Users.Where(x => x.Email.Equals(user.Email) && x.Username.Equals(user.Username))
                    .ToList();
                if (users.Count != 0) return new UserDto() { Address = "Username or email already taken." };

                var y18 = DateTime.Now;
                y18 = y18.AddYears(-18);
                
                if(user.BirthDate > y18) return new UserDto() { Address = "You must be older than 18 to register." };

                user.Password = Encode(user.Password);

                if (user.UserType == UserType.DELIVERY)
                {
                    user.Activated = false;
                    user.IsVerified = VerifiedStatus.UNVERIFIED;
                }
                else
                {
                    user.Activated = true;
                    user.IsVerified = VerifiedStatus.VERIFIED;
                }

                User u = _mapper.Map<User>(user);
                u.PhotoUrl = "NO_PHOTO";
                _dbContext.Users.Add(u);
                _dbContext.SaveChanges();
            }
            catch
            {
                return new UserDto() { Address = "Server error. Pleasy try again later." };
            }


            user.Password = "";
            return user;
        }

        public TokenDto Login(LoginDto user)
        {
            var users = _dbContext.Users.FirstOrDefault(s =>
                s.Username == user.Username && s.Password == Encode(user.Password));
            if (users == null) return new TokenDto() { Token = "Incorrect username or password." };
            if (users.UserType == UserType.DELIVERY && 
                users.IsVerified is VerifiedStatus.REJECTED or VerifiedStatus.UNVERIFIED)
                return new TokenDto(){ Token = "Your account is still not accepted. We will send you an email notification when we review your account."};
            
            List<Claim> claims = new List<Claim>
            {
                new Claim("username", users.Username),
                new Claim("id", users.Id.ToString()),
                new Claim("role", users.UserType.ToString()),
                new Claim("isGoogle", "false"),
                new Claim("status", users.IsVerified.ToString())
            };
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: _tokenAddress.Value,
                claims: claims,
                expires: DateTime.Now.AddMinutes(50),
                signingCredentials: signinCredentials
            );
            return new TokenDto() {Token = new JwtSecurityTokenHandler().WriteToken(tokeOptions)};
        }

        public UserDto FindById(long id)
        {
            var user = _mapper.Map<UserDto>(_dbContext.Users.Find(id));
            user.Password = "";
            return user;
        }

        public ModifyUserDto ModifyUser(ModifyUserDto user, long id)
        {
            User u = _dbContext.Users.Find(id);
            u.Firstname = user.Firstname;
            u.Lastname = user.Lastname;
            u.Address = user.Address;
            _dbContext.SaveChanges();

            return user;
        }

        public ModifyPasswordDto ModifyPassword(ModifyPasswordDto password, long id)
        {
            User u = _dbContext.Users.Find(id);
            if (!u.Password.Equals(Encode(password.OldPassword))) return new ModifyPasswordDto { OldPassword = "Old password wrong. Please try again." };
            if (!password.NewPassword.Equals(password.RepeatPassword)) return new ModifyPasswordDto { OldPassword = "Passwords do not match. Please try again." };
            u.Password = Encode(password.NewPassword);
            _dbContext.SaveChanges();
            return new ModifyPasswordDto() { OldPassword = "", NewPassword = "", RepeatPassword = ""};
        }

        public void AddImage(long userId, IFormFile file)
        {
            User user = _dbContext.Users.Find(userId);
            string filePath = "./Images/" + $"{user.Username}.png";
            using (var stream = File.Create(filePath)) file.CopyTo(stream);
            user.PhotoUrl = filePath;
            _dbContext.SaveChanges();
        }

        public string GetImage(long id) => _dbContext.Users.Find(id).PhotoUrl;

        public TokenDto LoginGoogle(UserDto user)
        {
            var users = _dbContext.Users.FirstOrDefault(s => s.Email == user.Email);
            User u;
            if (users == null)
            {
                using (WebClient client = new WebClient())
                {
                    client.DownloadFile(new Uri(user.PhotoUrl),
                        Path.Combine("Images", user.Email.Remove(user.Email.Length - 10) + ".png"));
                }

                u = _mapper.Map<User>(user);
                u.Password = "";
                u.IsGoogle = true;
                u.UserType = UserType.CUSTOMER;
                u.Address = "";
                u.Username = user.Email.Remove(user.Email.Length - 10);
                u.PhotoUrl = @"./Images/" + user.Email.Remove(user.Email.Length - 10) + ".png";
                _dbContext.Users.Add(u);
                _dbContext.SaveChanges();
            }
            else
            {
                u = users;
                if (!users.IsGoogle) return new TokenDto() { Token = "You already have an account."};
            }
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim("username", u.Username));
            claims.Add(new Claim("id", u.Id.ToString()));
            claims.Add(new Claim("role", u.UserType.ToString()));
            claims.Add(new Claim("isGoogle", "true"));
            claims.Add(new Claim("status", u.IsVerified.ToString()));
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "https://localhost:44305",
                claims: claims,
                expires: DateTime.Now.AddMinutes(50),
                signingCredentials: signinCredentials
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return new TokenDto() { Token = tokenString };
        }

        public List<UserDto> GetAllDeliverers()
        {
            var users = _mapper.Map<List<UserDto>>(_dbContext.Users.Where(x=> x.UserType == UserType.DELIVERY).ToList());
            foreach (var item in users) item.Password = "";
            return users;
        }

        public VerifyDelivererDto VerifyDeliverer(VerifyDelivererDto user)
        {
            var u = _dbContext.Users.Find(user.Id);
            u.IsVerified = user.IsVerified == VerifiedStatus.REJECTED ? VerifiedStatus.REJECTED : VerifiedStatus.VERIFIED;
            _dbContext.SaveChanges();
            SendMail(u);
            return user;
        }

        private void SendMail(User user)
        {
            MailMessage message = new MailMessage(_email, user.Email);
            string body = user.IsVerified == VerifiedStatus.REJECTED ?  $"Dear {user.Firstname}\n\n" +
                                                                        $"We infrom you that we are suspending your account temporary.\n\n" +
                                                                        $"Best regards\n" +
                                                                        $"Team Nidzo" 
                                                                            :
                                                                        $"Dear {user.Firstname}\n\n" +
                                                                        $"We infrom you that we accepted your account.\n\n" +
                                                                        $"Best regards\n" +
                                                                        $"Team Nidzo";
            message.Subject = "Account Verification";
            message.Body = body;
            message.BodyEncoding = Encoding.UTF8;
            message.IsBodyHtml = false;

            using (SmtpClient client = new SmtpClient("smtp.gmail.com", 587))
            {
                client.Credentials = new NetworkCredential(_email, _password);
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                
                client.Send(message);
            }
        }
    }
}
