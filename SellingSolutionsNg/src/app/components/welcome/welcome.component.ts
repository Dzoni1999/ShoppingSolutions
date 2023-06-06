import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenData } from 'src/app/models/token.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  username:string = '';

  constructor(private helper:JwtHelperService) {
    let temp = localStorage.getItem('token');
    if(temp == null) {
      this.username = '';
    }
    else
    {
      let token = this.helper.decodeToken(temp);
      this.username = (token as TokenData).username;
    }
  }

  ngOnInit(): void {
  }

  isUserLoggedIn(): boolean{
    return localStorage.getItem('token') != null;
  }
}
