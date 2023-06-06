import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  allOrders:Array<Order>;

  constructor(private orderService: OrderService, private toastr: ToastrService, private userService:UserService) {
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
