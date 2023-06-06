using System;
using System.Collections.Generic;
using ProductsMicroService.Models;

namespace ProductsMicroService.Dto
{
    public class OrderDto
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string DelivererName { get; set; }
        public long UserId { get; set; }
        public long DelivererId { get; set; }
        public DeliveryStatus DeliveryStatus { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public List<ProductOrderDto> ProductOrders { get; set; }
        public DateTime TimeOfDelivery { get; set; }
        public float TotalPrice { get; set; }
    }
}
