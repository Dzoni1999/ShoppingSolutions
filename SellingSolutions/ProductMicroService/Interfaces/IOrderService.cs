using System.Collections.Generic;
using ProductsMicroService.Dto;

namespace ProductsMicroService.Interfaces
{
    public interface IOrderService
    {
        OrderDto NewOrder(OrderDto entity, string username, long id);
        List<OrderDto> HistoryCustomer(long id);
        List<OrderDto> GetAllOrders();
        List<OrderDto> HistoryDeliverer(long id);
        List<OrderDto> AllPendingOrders();
        bool TakeOrder(long delivererId, string delivererName, long orderId);
        OrderDto CurrentOrderCustomer(long id);
        OrderDto CurrentOrderDeliverer(long id);
        bool IsDelivererFree(long id);
    }
}
