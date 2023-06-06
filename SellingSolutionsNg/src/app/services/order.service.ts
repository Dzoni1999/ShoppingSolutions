import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  add(order: Order):Observable<Order> {
    return this.http.post<Order>(environment.apiUrl + '/api/orders', order);
  }

  getOrderHistory():Observable<Array<Order>>{
    return this.http.get<Array<Order>>(environment.apiUrl + '/api/orders/history');
  }

  getAllOrders():Observable<Array<Order>>{
    return this.http.get<Array<Order>>(environment.apiUrl + '/api/orders/all-orders');
  }

  getAllPendingOrders():Observable<Array<Order>>{
    return this.http.get<Array<Order>>(environment.apiUrl + '/api/orders/all-pending-orders');
  }

  takeOrder(id:number):Observable<boolean> {
    return this.http.post<boolean>(environment.apiUrl + '/api/orders/take-order', id);
  }

  getCurrentOrder():Observable<Order> {
    return this.http.get<Order>(environment.apiUrl + '/api/orders/current-order');
  }

  isDelivererFree(id: number|undefined):Observable<boolean>{ 
    return this.http.get<boolean>(environment.apiUrl + '/api/orders/' + id);
  }
}