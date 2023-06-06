using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductsMicroService.Dto;
using ProductsMicroService.Interfaces;
using ProductsMicroService.Services;

namespace ProductsMicroService.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService) => _productService = productService;

        [HttpPost]
        [Authorize(Roles = "DELIVERY")]
        public ActionResult Post([FromBody] ProductDto product) => Ok(_productService.AddProduct(product));

        [HttpPost("edit")]
        [Authorize(Roles = "DELIVERY")]
        public ActionResult Edit([FromBody] ProductDto product) => Ok(_productService.EditProduct(product));

        [HttpGet]
        [Authorize(Roles = "DELIVERY, CUSTOMER")]
        public ActionResult Get() => Ok(_productService.GetAll());

        [HttpGet("{id}")]
        [Authorize(Roles = "DELIVERY")]
        public ActionResult Delete(int id)
        {
            return Ok(_productService.DeleteProduct(id));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "DELIVERY")]
        public ActionResult GetUsernameById(int id) => Ok(_productService.DeleteProduct(id));

        [HttpGet("get/{id}")]
        [Authorize(Roles = "DELIVERY")]
        public ActionResult Get(int id) => Ok(_productService.GetProduct(id));
    }
}
