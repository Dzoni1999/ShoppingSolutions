using System.Collections.Generic;
using ProductsMicroService.Dto;

namespace ProductsMicroService.Interfaces
{
    public interface IProductService
    {
        ProductDto AddProduct(ProductDto product);
        List<ProductDto> EditProduct(ProductDto product); 
        List<ProductDto> GetAll();
        ProductDto GetProduct(int id);
        List<ProductDto> DeleteProduct(int id);
        
    }
}
