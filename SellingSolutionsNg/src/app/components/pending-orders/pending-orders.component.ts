import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent implements OnInit {
  allOrders:Array<Order>;

  constructor(private orderService:OrderService, private toastr:ToastrService, private router:Router) {
    this.allOrders = new Array<Order>();

    this.orderService.getAllPendingOrders().subscribe(
      (data:Array<Order>) => {
        this.allOrders = data;
      },
      error => {
        this.toastr.error('Server error. Please try again.');
      }
    );
    
  }

  ngOnInit(): void { }

  onValueChange(idx:number):void {
    this.orderService.takeOrder(this.allOrders[idx].id).subscribe(
      (data:boolean) => {
        if(data) {
          this.toastr.success('Order successfuly taken.');
          this.router.navigateByUrl('/current-order');
        }
        else {
          this.toastr.error("Can't have more than one delivery at the time. Please finish your current delivery.");
        }
      },
      error => {
        this.toastr.error('Server error. Please try again later.');
      }
    );
  }
}
