using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductsMicroService.Dto;
using ProductsMicroService.Interfaces;

namespace ProductsMicroService.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService) => _orderService = orderService;

        [HttpPost]
        [Authorize(Roles = "CUSTOMER")]
        public ActionResult Post([FromBody] OrderDto order)
        {
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return BadRequest();
            foreach (var item in order.ProductOrders)
            {
                item.ProductId = item.Product.Id;
                item.Product = null;
            }
            return Ok(_orderService.NewOrder(order, GetUserNameIdByIdentity(), id));
        }

        private string GetUserNameIdByIdentity()
        {
            var identity = (ClaimsIdentity)User.Identity;
            return identity.Claims.First(i => i.Type == "username").Value;
        }

        private bool GetUserIdByIdentity(ref long id)
        {
            var identity = (ClaimsIdentity)User.Identity;
            return Int64.TryParse(identity.Claims.First(i => i.Type == "id").Value, out id);
        }

        private string GetUserRoleByIdentity()
        {
            var identity = (ClaimsIdentity) User.Identity;
            return identity.Claims.First(i => i.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Value;
        }

        [HttpGet("history")]
        [Authorize(Roles = "CUSTOMER, DELIVERY")]
        public ActionResult History()
        {
            long id = 0;
            if(!GetUserIdByIdentity(ref id)) return BadRequest();
            return Ok(GetUserRoleByIdentity() == "CUSTOMER" ? _orderService.HistoryCustomer(id) : _orderService.HistoryDeliverer(id));
        }

        [HttpGet("all-orders")]
        [Authorize(Roles = "ADMINISTARTOR")]
        public ActionResult GetAllOrders() => Ok(_orderService.GetAllOrders());

        [HttpGet("all-pending-orders")]
        [Authorize(Roles = "DELIVERY")]
        public ActionResult GetAllPendingOrders() => Ok(_orderService.AllPendingOrders());

        [HttpPost("take-order")]
        [Authorize(Roles = "DELIVERY")]
        public ActionResult TakeOrder([FromBody] long order)
        {
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return BadRequest();
            return Ok(_orderService.TakeOrder(id, GetUserNameIdByIdentity(), order));
        }

        [HttpGet("current-order")]
        [Authorize(Roles = "CUSTOMER, DELIVERY")]
        public ActionResult CurrentOrder()
        { 
            long id = 0;
            if (!GetUserIdByIdentity(ref id)) return BadRequest();
            return Ok(GetUserRoleByIdentity() == "CUSTOMER" ? _orderService.CurrentOrderCustomer(id) : _orderService.CurrentOrderDeliverer(id));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "ADMINISTARTOR")]
        public ActionResult GetUsernameById(long id) => Ok(_orderService.IsDelivererFree(id));
    }
}
