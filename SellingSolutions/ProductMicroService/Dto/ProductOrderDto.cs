namespace ProductsMicroService.Dto
{
    public class ProductOrderDto
    {
        public long ProductId { get; set; }
        public ProductDto Product { get; set; }
        public int Quantity { get; set; }
    }
}
