namespace ProductsMicroService.Dto
{
    public class ProductDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Ingredients { get; set; }
        public string Image { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
    }
}
