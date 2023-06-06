import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.css']
})
export class CurrentOrderComponent implements OnInit {
  currentOrder:Order;
  minutes:any;
  seconds:any

  constructor(private orderService:OrderService, private toastr:ToastrService, private router:Router) { 
    this.currentOrder = new Order(-1, '', '');

    this.orderService.getCurrentOrder().subscribe(
      (data:Order) => {
        if(data.comment != 'Empty') {
          this.currentOrder = data;

          let miliseconds = +new Date(this.currentOrder.timeOfDelivery) - +new Date();
          miliseconds = Math.round(miliseconds);
          let seconds = Math.floor(miliseconds / 1000);

          this.minutes = Math.floor(seconds / 60);
          this.seconds = seconds % 60;

          let intervalId = setInterval(() => {
            if(this.seconds > 0) {
              this.seconds--;
            }
            else {
              if(this.minutes == 0) {
                clearInterval(intervalId);
                this.toastr.success('Order delivered!');
                this.router.navigateByUrl('/history-deliverer');
              }
              else {
                this.seconds = 59;
                this.minutes--;
              }
            }
          }
          , 1000);
        }
        else {
          this.currentOrder = new Order(-1, '', '');
        }
        
      },
      error => {
        this.currentOrder = new Order(-1, '', '');
        this.toastr.error('Server error. Please try again later');
      }
    );
  
  }

  ngOnInit(): void { }
}
