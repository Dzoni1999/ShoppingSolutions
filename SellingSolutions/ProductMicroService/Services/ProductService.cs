using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProductsMicroService.Dto;
using ProductsMicroService.Infrastucture;
using ProductsMicroService.Interfaces;
using ProductsMicroService.Models;

namespace ProductsMicroService.Services
{
    public class ProductService : IProductService
    {
        private readonly IMapper _mapper;
        private readonly ProductsDbContext _dbContext;

        public ProductService(IMapper mapper, ProductsDbContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public ProductDto AddProduct(ProductDto product)
        {
            try
            {
                var products = _dbContext.Products.Where(x => x.Name == product.Name).ToList();
                if (products.Count != 0) return new ProductDto() { Name = "Product with that name already exists." };
                if (product.Price < 100) return new ProductDto() { Name = "Product price must be greater than 100 RSD." };

                Product p = _mapper.Map<Product>(product);
                _dbContext.Products.Add(p);
                _dbContext.SaveChanges();
            }
            catch
            {
                return new ProductDto() { Name = "Server error. Please try again." };
            }

            return product;
        }

        public List<ProductDto> DeleteProduct(int id)
        {
            var product = _dbContext.Products.FirstOrDefault(x => x.Id == id); //Nije implementirano logicko brisanje, mrzelo me iskreno
            product.IsDeleted = true;
            _dbContext.SaveChanges();
            return _mapper.Map<List<ProductDto>>(_dbContext.Products.Where(x => x.IsDeleted == false).ToList());
        }

        public List<ProductDto> EditProduct(ProductDto product)
        {
            var productDB = _dbContext.Products.FirstOrDefault(x => x.Id == product.Id);
            productDB.Quantity = product.Quantity;
            productDB.Image = product.Image;
            productDB.Price = product.Price;
            productDB.Ingredients = product.Ingredients;
            productDB.Name = product.Name;
            _dbContext.SaveChanges();

            return _mapper.Map<List<ProductDto>>(_dbContext.Products.Where(x => x.IsDeleted == false).ToList());
        }

        public List<ProductDto> GetAll() => _mapper.Map<List<ProductDto>>(_dbContext.Products.Where(x => x.IsDeleted == false).ToList());

        public ProductDto GetProduct(int id)
        {
            var product = _dbContext.Products.FirstOrDefault(x => x.Id == id && x.IsDeleted == false); //Nije implementirano logicko brisanje, mrzelo me iskreno
            return _mapper.Map<ProductDto>(product);
        }
    }
}
