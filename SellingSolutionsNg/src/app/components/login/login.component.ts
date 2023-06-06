import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { Login } from 'src/app/models/login.model';
import { Token } from 'src/app/models/token.model';
import { UserService } from 'src/app/services/user.service';
import { GoogleLoginProvider, SocialUser } from "angularx-social-login";
import { SocialAuthService } from "angularx-social-login"; 
import { User } from 'src/app/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  googleUser:object = new Object();
  user:User = new User();
  constructor(private userService:UserService, private toastr:ToastrService,
    private router:Router, private socialAuthService:SocialAuthService) {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      'password': new FormControl('', [Validators.required, Validators.maxLength(30)])
    });
  }  

  ngOnInit():void{}

  onSubmit():void { 
    let login = new Login();
    login.username = this.loginForm.value['username'];
    login.password = this.loginForm.value['password'];
    if(this.loginForm.valid) {
      this.userService.login(login).subscribe(
        (data : Token) => {
          if(data.token == 'Incorrect username or password.') {
            this.toastr.error(data.token);
            return;
          } 
          else if(data.token == 'Your account is still not accepted. We will send you an email notification when we review your account.') {
            this.toastr.error(data.token);
            return;
          }
          else {
            localStorage.setItem('ids', JSON.stringify(new Array<number>));
            localStorage.setItem('token', data.token);
            this.toastr.success('Successful login.');
            this.router.navigateByUrl('/home');
          }
        },
        error => {
          this.toastr.error('Server error. Please try again later.');
        }
      );
    }
    else{
      this.toastr.error('Form filled incorrectly. Please try again later.');
    }
  } 

  loginWithGoogle():void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {this.socialAuthService.authState.subscribe((user:SocialUser) => {
        this.user.firstname=user.firstName; 
        this.user.lastname=user.lastName; 
        this.user.email=user.email; 
        this.user.photoUrl=user.photoUrl; 
        this.user.username=user.name; 
        this.user.birthDate=new Date().toISOString();
        this.userService.loginGoogle(this.user).subscribe(
          (data : Token) => { 
            if(data.token == 'You already have an account.') {
              this.toastr.error(data.token);
              return;
            }
            else {
              localStorage.setItem('token', data.token);
              localStorage.setItem('ids', JSON.stringify(new Array<number>));
              this.toastr.success('Successful login.');
              this.router.navigateByUrl('/home');
            }
          },
          error => {
            this.toastr.error('Server error. Please try again later.');
          }
        );
      });
    });
  }
}