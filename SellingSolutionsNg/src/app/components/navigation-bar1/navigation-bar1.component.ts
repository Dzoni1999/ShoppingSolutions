import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenData } from 'src/app/models/token.model';
import { UserType } from 'src/app/models/user.model';

@Component({
  selector: 'app-navigation-bar1',
  templateUrl: './navigation-bar1.component.html',
  styleUrls: ['./navigation-bar1.component.css']
})
export class NavigationBar1Component implements OnInit {

  constructor(private router: Router, private helper:JwtHelperService) { }

  ngOnInit(): void {}

  isUserLoggedIn(): boolean {
    return localStorage.getItem('token') != null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('ids');
    this.router.navigateByUrl('/login');
  }

  getRole():string {
    let temp = localStorage.getItem('token');
    if(temp != null){
      
      let token = this.helper.decodeToken(temp);
      return (token as TokenData).role;
    }
    return '';
  }
}
