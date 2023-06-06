import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, VerifiedStatus } from 'src/app/models/user.model';
import { VerifyDeliverer } from 'src/app/models/verifyDeliverer.model';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  deliverers:Array<User>=new Array<User>();

  constructor(private userService:UserService, private orderService:OrderService, private router: Router, private toastr: ToastrService) { 
    userService.getAllDeliverers().subscribe(
      (data:Array<User>)=>
      {
        this.deliverers = data;
      });
  }

  ngOnInit(): void { }
  
  getStatus(idx:number):string{
    switch(this.deliverers[idx].isVerified){
      case VerifiedStatus.REJECTED: return 'Rejected';
      case VerifiedStatus.UNVERIFIED: return 'Pending';
      case VerifiedStatus.VERIFIED: return 'Accepted';
    }
  }

  onValueChange(status:string, idx:number):void
  {
    let user:VerifyDeliverer = new VerifyDeliverer();
    user.id = this.deliverers[idx].id;
    switch(status){
      case 'Rejected': user.isVerified = VerifiedStatus.REJECTED; break;
      case 'Accepted': user.isVerified = VerifiedStatus.VERIFIED; break;
      case 'Pending': return;
    }

    this.orderService.isDelivererFree(user.id).subscribe(
      (data:Boolean) => {
        if(data) {
          this.userService.verifyDeliverer(user).subscribe(
            (data : VerifyDeliverer) => {
              if(data.isVerified == VerifiedStatus.REJECTED) this.toastr.success('Deliverer ' + this.deliverers[idx].username + ' successfuly rejected.');
              else this.toastr.success('Deliverer ' + this.deliverers[idx].username + ' successfuly accepted.');
              this.router.navigateByUrl("/deliverers");
            },
            error => {
              this.toastr.error('Server error. Please try again later.');
            }
          ); 
        }
        else {
          this.toastr.error('Deliverer ' + this.deliverers[idx].username  + ' is currently delivering order. Please try again later.');
        }
      },
      error => {
        this.toastr.error('Server error. Please try again later.');
      }
    );
  }
}
