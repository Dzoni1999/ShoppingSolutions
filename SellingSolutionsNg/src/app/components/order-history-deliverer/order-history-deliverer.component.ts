import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-history-deliverer',
  templateUrl: './order-history-deliverer.component.html',
  styleUrls: ['./order-history-deliverer.component.css']
})
export class OrderHistoryDelivererComponent implements OnInit {
  allOrders:Array<Order>;

  constructor(private orderService: OrderService, private toastr: ToastrService) {
    this.allOrders = new Array<Order>();
    this.orderService.getOrderHistory().subscribe(
      (data:Array<Order>) =>{
        this.allOrders = data;
      },
      error =>{
        this.toastr.error('Server error. Please try again later.');
      }
    );
  }

  ngOnInit(): void { }
}