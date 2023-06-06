using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UsersMicroService.Dto;
using UsersMicroService.Interfaces;


namespace UsersMicroService.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService) => _userService = userService;

        [HttpPost]
        public ActionResult Post([FromBody] UserDto user) => Ok(_userService.AddUser(user));

        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginDto user) => Ok(_userService.Login(user));

        private bool GetUserIdByIdentity(ref long id)
        {
            var identity = (ClaimsIdentity)User.Identity;
            return Int64.TryParse(identity.Claims.First(i => i.Type == "id").Value, out id);
        }

        [HttpGet()]
        [Authorize]
        public ActionResult Get()
        {
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return BadRequest();
            return Ok(_userService.FindById(id));
        }

        [HttpPost("put")]
        [Authorize]
        public ActionResult Put([FromBody] ModifyUserDto user)
        {
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return BadRequest();
            return Ok(_userService.ModifyUser(user, id));
        }

        [HttpPost("put/password")]
        [Authorize]
        public ActionResult PutPassword([FromBody] ModifyPasswordDto password)
        {
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return BadRequest();
            return Ok(_userService.ModifyPassword(password, id));
        }

        [HttpPost("upload-image")]
        [Authorize]
        public ActionResult UploadFile(IFormFile file)
        {
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return Ok(false);
            if (file.Length <= 0) return Ok(false);
            _userService.AddImage(id, file);
            return Ok(true);
        }

        [HttpGet("image")]
        [Authorize]
        public IActionResult GetImage()
        {
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return NotFound();
            string path = _userService.GetImage(id);
            if (path.Equals("NO_PHOTO")) return NotFound();
            var bytes = System.IO.File.ReadAllBytes(path);

            var cd = new System.Net.Mime.ContentDisposition
            {
                FileName = path.Split('/')[path.Split('/').Length - 1],
                Inline = false
            };

            Response.Headers.Add("Content-Disposition", cd.ToString());
            Response.Headers.Add("X-Content-Type-Options", "nosniff");
            return File(bytes, "image/png");
        }

        [HttpPost("login-google")]
        public ActionResult LoginGoogle([FromBody] UserDto user) => Ok(_userService.LoginGoogle(user));

        [HttpGet("get-all-deliverers")]
        [Authorize(Roles = "ADMINISTARTOR")]
        public ActionResult GetAllDeliverers() => Ok(_userService.GetAllDeliverers());

        [HttpPost("verify-deliverer")]
        [Authorize(Roles = "ADMINISTARTOR")]
        public ActionResult VerifyDeliverer(VerifyDelivererDto user) => Ok(_userService.VerifyDeliverer(user));
    }
}
