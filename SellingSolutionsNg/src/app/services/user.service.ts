import { Injectable } from '@angular/core'; 
import { Observable } from 'rxjs'; 
import { environment } from 'src/environments/environment'; 
import { HttpClient } from "@angular/common/http";
import { User } from '../models/user.model';
import { Login } from '../models/login.model';
import { Token } from 'src/app/models/token.model';
import { ModifyUser } from '../models/modifyUser.model';
import { ModifyPassword } from '../models/modifyPassword.model';
import { VerifyDeliverer } from '../models/verifyDeliverer.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  register(user: User) : Observable<User>{ 
    return this.http.post<User>(environment.apiUrl + '/api/users', user); 
  }

  login(login:Login) : Observable<Token> { 
    return this.http.post<Token>(environment.apiUrl + '/api/users/login', login); 
   }

  getUser() : Observable<User>{ 
    return this.http.get<User>(environment.apiUrl + '/api/users');
  }

  editUser(user:ModifyUser):Observable<ModifyUser>{ 
    return this.http.post<ModifyUser>(environment.apiUrl + '/api/users/put', user); 
  }
  editPassword(password:ModifyPassword):Observable<ModifyPassword> { 

    return this.http.post<ModifyPassword>(environment.apiUrl + '/api/users/put/password', password); 
  }

  getImage():Observable<Blob> {
    return this.http.get(environment.apiUrl + '/api/users/image', { responseType: 'blob' });
  }

  uploadImage(image: any) :Observable<Object>{
    return this.http.post<Object>(environment.apiUrl + '/api/users/upload-image', image); 
  }

  loginGoogle(user: User):Observable<Token> {
    return this.http.post<Token>(environment.apiUrl + '/api/users/login-google', user);
  }

  getAllDeliverers():Observable<Array<User>>{
    return this.http.get<Array<User>>(environment.apiUrl + '/api/users/get-all-deliverers');
  }

  verifyDeliverer(user: VerifyDeliverer) :Observable<VerifyDeliverer>{ 
      return this.http.post<VerifyDeliverer>(environment.apiUrl + '/api/users/verify-deliverer', user);
  }
}
