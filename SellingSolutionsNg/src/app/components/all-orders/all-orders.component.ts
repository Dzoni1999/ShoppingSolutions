import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DeliveryStatus, Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  allOrders:Array<Order>;

  constructor(private orderService:OrderService, private toastr:ToastrService) { 
    this.allOrders = new Array<Order>();

    this.orderService.getAllOrders().subscribe(
      (data:Array<Order>) => {
        if(data.length == 0) return;
        this.allOrders = data;
        console.log(data);
      },
      error => {
        this.toastr.error('Server error. Please try again later.');
      }
    );
  }

  getStatus(idx:number):string {
    if(this.allOrders[idx].deliveryStatus == DeliveryStatus.PENDING) return 'PENDING';
    if(this.allOrders[idx].deliveryStatus == DeliveryStatus.DELIVERING) {
      let currentDate = new Date();
      let deliveryDate = new Date(this.allOrders[idx].timeOfDelivery);
      if(deliveryDate > currentDate) return 'DELIVERING';
      else return 'DELIVERED';
    }
    return 'UNKNOWN';
  }

  isPending(idx:number):boolean {
    return this.allOrders[idx].deliveryStatus == DeliveryStatus.PENDING;
  }

  ngOnInit(): void { }
}
