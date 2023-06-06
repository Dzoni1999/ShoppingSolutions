import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { ModifyPassword } from 'src/app/models/modifyPassword.model';
import { ModifyUser } from 'src/app/models/modifyUser.model';
import { TokenData } from 'src/app/models/token.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

//csss grid

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  imageForm: FormGroup;
  confirmForm: FormGroup = new FormGroup({
    'firstname': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    'lastname': new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    'address': new FormControl('', [Validators.required, Validators.maxLength(30)])
  });
  passwordForm: FormGroup;
  user?: User|null;
  birthday = new Date();

  image:Blob=new Blob();
  imageURL:SafeUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";

  constructor(private userService:UserService, private router: Router, private helper:JwtHelperService,
    private sanitizer: DomSanitizer, private toastr:ToastrService) {   
    let token = localStorage.getItem("token");

    if(token != null && !this.helper.isTokenExpired(token))
    {
      this.getImage();
      this.userService.getUser().subscribe(
        (data : User) => {
          if(data != null) {
            this.user = data;
            this.birthday = new Date(data.birthDate);
            this.user!.birthDate =  this.user!.birthDate.slice(0, 10);

            this.confirmForm = new FormGroup({
              'firstname': new FormControl(this.user.firstname, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
              'lastname': new FormControl(this.user.lastname,[Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
              'address': new FormControl(this.user.address, [Validators.required, Validators.maxLength(30)])
            });
          }
          else {
            this.user = null;
          } 
        },
        error => {
          this.confirmForm = new FormGroup({
            'firstname': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
            'lastname': new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
            'address': new FormControl('', [Validators.required, Validators.maxLength(30)])
          });
          
        this.toastr.error('Server error. Please try again later.');
        }
      );
    }
    else {
      this.user = null;
    }

    this.passwordForm = new FormGroup({
      'oldpassword': new FormControl('',[Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      'newpassword': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      'passwordrepeat': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)])
    });

    this.imageForm = new FormGroup({'image':new FormControl(null)});
  }

  ngOnInit(): void { }

  onSubmit(): void {
    console.log(this.confirmForm.value);
    if(this.confirmForm.valid) {
      let modifiedUser = new ModifyUser();
      modifiedUser.firstname = this.confirmForm.value['firstname'];
      modifiedUser.lastname = this.confirmForm.value['lastname'];
      modifiedUser.address = this.confirmForm.value['address'];

      this.userService.editUser(modifiedUser).subscribe(
        (data : ModifyUser) => { 
          this.toastr.success('Profile modified successfuly.');
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

  onSubmitPassword(): void{
    console.log(this.confirmForm.value);
    if(this.passwordForm.valid)
    {
      let passwordForm = new ModifyPassword();
      passwordForm.oldPassword = this.passwordForm.value['oldpassword'];
      passwordForm.newPassword = this.passwordForm.value['newpassword'];
      passwordForm.repeatPassword = this.passwordForm.value['passwordrepeat'];

      this.userService.editPassword(passwordForm).subscribe(
        (data : ModifyPassword) => { 
          if(data.oldPassword == 'Old password wrong. Please try again.') {
            this.toastr.error(data.oldPassword);
            return;
          } 
          else if(data.oldPassword == 'Passwords do not match. Please try again.') {
            this.toastr.error(data.oldPassword);
            return;
          }
          else {
            this.toastr.success('Password changed successfuly.');
            this.router.navigateByUrl('/profile');
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

  getImage():void
  {
    this.userService.getImage().subscribe(
      (response: Blob) => {
        if(response != null)
        {
          this.image = response;
          this.imageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image));
        }
      },
      error => {
        this.toastr.error('You have no profile picture.');
      }
    );
  }

  onFileChange(event:Event):void
  {  
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0]; 
    const formData = new FormData();
    formData.append('file', file, file.name);

    this.userService.uploadImage(formData).subscribe(
      (data : Object) => { 
        if(data) {
          this.toastr.success('Picture uploaded successfuly.');
          this.getImage();
        }
        else {
          this.toastr.error('There was an error. Please try again.');
        }
      },
      error => {
        this.toastr.error('Server error. Please try again.');
      }
    );
  }

  onSubmitImage():void{
    let element:HTMLElement = document.getElementById('fileimg') as HTMLElement;
    element.click();
  }
  
  isGoogle() : boolean {
    let tokens = localStorage.getItem("token"); 
    if(tokens == null) return false;
    let token = this.helper.decodeToken(tokens);
    return (token as TokenData).isGoogle == "true";
  }
}
