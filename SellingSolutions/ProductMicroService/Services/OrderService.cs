using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductsMicroService.Dto;
using ProductsMicroService.Infrastucture;
using ProductsMicroService.Interfaces;
using ProductsMicroService.Models;

namespace ProductsMicroService.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly ProductsDbContext _dbContext;
        private static readonly Object _thisLock = new Object();

        public OrderService(IMapper mapper, ProductsDbContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public OrderDto NewOrder(OrderDto entity, string username, long id)
        {
            try
            {
                if (StatusCustomer(id)) return new OrderDto(){Comment = "You can't have more than one order at the time." +
                                                                        " Please wait for your current order to arrive."};
                Order order = _mapper.Map<Order>(entity);
                order.DeliveryStatus = DeliveryStatus.PENDING;
                order.DelivererId = 0;
                order.TimeOfDelivery = new DateTime(2500, 12, 12);
                order.UserName = username;
                _dbContext.Orders.Add(order);
                _dbContext.SaveChanges();
                return entity;
            }
            catch
            {
                return new OrderDto() { Comment = "Can't add new order now. Please try again later."};
            }
        }

        private bool StatusCustomer(long id) => _dbContext.Orders
            .Where(x => ((x.DeliveryStatus == DeliveryStatus.DELIVERING && x.TimeOfDelivery > DateTime.Now)
                         || (x.DeliveryStatus == DeliveryStatus.PENDING)) && x.UserId == id)
            .ToList().Count != 0;

        public List<OrderDto> HistoryCustomer(long id) => _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x => x.ProductOrders)
            .ThenInclude(c => c.Product)
            .Where(x=> x.UserId == id)
            .Where(z => z.DeliveryStatus == DeliveryStatus.DELIVERING && z.TimeOfDelivery < DateTime.Now).ToList());

        public List<OrderDto> GetAllOrders() => _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x=> x.ProductOrders).ThenInclude(x=> x.Product).ToList());

        public List<OrderDto> HistoryDeliverer(long id) => _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x => x.ProductOrders)
            .ThenInclude(c => c.Product)
            .Where(x => x.DelivererId == id)
            .Where(x => x.DeliveryStatus == DeliveryStatus.DELIVERING && x.TimeOfDelivery < DateTime.Now).ToList());

        public List<OrderDto> AllPendingOrders() => _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x => x.ProductOrders)
            .ThenInclude(c => c.Product).Where(x => x.DeliveryStatus == DeliveryStatus.PENDING).ToList());

        private bool StatusDeliverer(long id) => _dbContext.Orders.Where(x => x.DeliveryStatus == DeliveryStatus.DELIVERING
                    && x.DelivererId == id && x.TimeOfDelivery > DateTime.Now).ToList().Count != 0;

        public bool TakeOrder(long delivererId, string delivererName, long orderId)
        {
            if (StatusDeliverer(delivererId)) return false;

            lock (_thisLock)
            {
                var order = _dbContext.Orders.Find(orderId);
                if (order.DeliveryStatus != DeliveryStatus.PENDING) return false;

                order.DeliveryStatus = DeliveryStatus.DELIVERING;
                order.DelivererName = delivererName;
                order.DelivererId = delivererId;
                int eta = new Random().Next(5, 20);
                order.TimeOfDelivery = DateTime.Now;
                order.TimeOfDelivery = order.TimeOfDelivery.AddMinutes((double)eta);

                _dbContext.SaveChanges();
                return true;
            }
        }

        public OrderDto CurrentOrderCustomer(long id)
        {
            var orders = _dbContext.Orders
                .Include(x => x.ProductOrders).ThenInclude(c => c.Product)
                .Where(x => (x.DeliveryStatus == DeliveryStatus.PENDING && x.UserId == id)
                            || (x.DeliveryStatus == DeliveryStatus.DELIVERING && x.UserId == id && x.TimeOfDelivery > DateTime.Now)).ToList();

            return orders.Count == 0 ? new OrderDto() {Comment = "Empty"} : _mapper.Map<OrderDto>(orders.First());
        }

        public OrderDto CurrentOrderDeliverer(long id)
        {
            var orders = _mapper.Map<List<OrderDto>>(_dbContext.Orders.Include(x => x.ProductOrders)
                .ThenInclude(c => c.Product).
                Where(x => x.DeliveryStatus == DeliveryStatus.DELIVERING && x.DelivererId == id && x.TimeOfDelivery > DateTime.Now).ToList());

            return orders.Count == 0 ? new OrderDto() { Comment = "Empty" } : _mapper.Map<OrderDto>(orders.First());
        }

        public bool IsDelivererFree(long id) => !StatusDeliverer(id);
    }
}

