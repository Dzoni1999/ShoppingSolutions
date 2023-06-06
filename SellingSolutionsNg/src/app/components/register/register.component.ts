import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { User, UserType } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private userService:UserService, private toastr: ToastrService, private router: Router)
  {
    this.registerForm = new FormGroup({
      'username': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      'firstname': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'lastname': new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.maxLength(30)]),
      'passwordrepeat': new FormControl('', [Validators.required, Validators.maxLength(30)]),
      'adress': new FormControl('', [Validators.required, Validators.maxLength(30)]),
      'date': new FormControl('', [Validators.required]),
      'role': new FormControl('', [Validators.required]),
    });
  }  

  ngOnInit(): void {}

  onSubmit(): void {
    if(this.registerForm.valid)
    {  
      let user=new User(); 
      user.username=this.registerForm.value['username'];
      user.email=this.registerForm.value['email'];
      user.password=this.registerForm.value['password'];
      user.firstname=this.registerForm.value['firstname'];
      user.lastname=this.registerForm.value['lastname'];
      user.birthDate=this.registerForm.value['date'];
      user.address=this.registerForm.value['adress'];
      if(this.registerForm.value['role'] == 'Deliverer') {
        user.userType = UserType.DELIVERY;
      }  
      else {
        user.userType = UserType.CUSTOMER;
      }
      if(user.password != this.registerForm.value['passwordrepeat']) {
        this.toastr.error('Passwords do not match.');
        return;
      }
      var currentYear = new Date().getFullYear();
      var y18 = new Date();
      y18.setFullYear(currentYear - 18);
      var birthDate = new Date(this.registerForm.value['date']);
      if(birthDate > y18) {
        this.toastr.error('You must be older than 18 to register.');
        return;
      }

      this.userService.register(user).subscribe(
        (data : User) => {
          if(data.address == 'Username or email already taken.') {
            this.toastr.error(data.address);
            return;
          }
          else if(data.address == 'You must be older than 18 to register.') {
            this.toastr.error(data.address);
            return;
          }
          else if(data.address == 'Server error. Pleasy try again later.'){
            this.toastr.error(data.address);
            return;
          }
          else {
            this.toastr.success('Successful registration.');
            this.router.navigateByUrl("/login");
          }
        },
        error => {
          this.toastr.error('Server error. Please try again later.');
        }
      ); 
    }
    else {
      this.toastr.error('From filled incorrecty. Please try again.');
    } 
  }
}
