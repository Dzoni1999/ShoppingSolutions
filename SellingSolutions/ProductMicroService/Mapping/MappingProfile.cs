using AutoMapper;
using ProductsMicroService.Dto;
using ProductsMicroService.Models;

namespace ProductsMicroService.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<ProductOrder, ProductOrderDto>().ReverseMap();
        }
    }
}
