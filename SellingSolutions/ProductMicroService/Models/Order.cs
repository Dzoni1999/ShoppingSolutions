using System;
using System.Collections.Generic;

namespace ProductsMicroService.Models
{
    public enum DeliveryStatus : int
    { 
        PENDING = 0,
        DELIVERING = 1
    }

    public class Order
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string DelivererName { get; set; }
        public long UserId { get; set; }
        public long DelivererId { get; set; }
        public DeliveryStatus DeliveryStatus { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public List<ProductOrder> ProductOrders { get; set; }
        public DateTime TimeOfDelivery { get; set; }
        public float TotalPrice { get; set; }
    }
}
    