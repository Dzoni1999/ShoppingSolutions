using System.Collections.Generic;

namespace ProductsMicroService.Models
{
    public class Product
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Ingredients { get; set; }
        public string Image { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public bool IsDeleted { get; set; }
        public List<ProductOrder> ProductOrders { get; set; }
    }
}
