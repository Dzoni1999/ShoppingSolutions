import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  addProduct(product:Product) :Observable<Product> { 
    return this.http.post<Product>(environment.apiUrl + '/api/products', product); 
  }

  editProduct(product:Product) :Observable<Product> { 
    return this.http.post<Product>(environment.apiUrl + '/api/products/edit', product); 
  }

  getAll() :Observable<Array<Product>> { 
    return this.http.get<Array<Product>>(environment.apiUrl + '/api/products'); 
  }

  deleteProduct(id: any) :Observable<boolean>{ 
    return this.http.delete<boolean>(environment.apiUrl + '/api/products/' + id);
  }

  getProduct(id: any) :Observable<boolean>{ 
    return this.http.get<boolean>(environment.apiUrl + '/api/products/' + id);
  }
}
