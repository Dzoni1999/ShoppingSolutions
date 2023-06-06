import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  products:Array<Product>=new Array<Product>();

  constructor(private productService:ProductService, private cartService:CartService, private router: Router, private toastr: ToastrService) { 
    this.productService.getAll().subscribe(
      (data: Array<Product>) =>
      {
        this.products = data;
      },
      error =>
      {
        this.toastr.error('Server error. Please try again later.');
      }
    );

  }

  ngOnInit(): void { }
  
  onValueChange(idx:number):void
  {
    this.cartService.addProduct(this.products[idx].id);
    this.toastr.success('Successfuly added ' + this.products[idx].name + '.');
  }
}
