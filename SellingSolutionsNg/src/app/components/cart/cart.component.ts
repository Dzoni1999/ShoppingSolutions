import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { DisplayProduct } from 'src/app/models/displayProduct.modelt';
import { Order, ProductOrder } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Token, TokenData } from 'src/app/models/token.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  allProducts:Array<Product> = new Array<Product>();
  map:Map<number, number> = new Map<number, number>();
  presentProducts:Array<DisplayProduct> = new Array<DisplayProduct>();
  cartForm: FormGroup;

  constructor( private router: Router,public cartService:CartService, private productService:ProductService,
    private orderService: OrderService, private toastr: ToastrService, private helper:JwtHelperService) {
    this.cartForm = new FormGroup({
      'address': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      'comment': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)])
    });
    this.loadCart();
  }

  loadCart(): void{
    this.presentProducts = new Array<DisplayProduct>();
    this.productService.getAll().subscribe(
      (data: Array<Product>) =>
      {
        this.allProducts = data;
        this.map = this.cartService.getIdsAsMap()
        for(let i = 0; i < data.length; i++)
        {
          if(this.map.has(data[i].id))
          {
            let t:DisplayProduct = new DisplayProduct();
            t.id = data[i].id;
            t.name = data[i].name;
            t.price = data[i].price;
            t.amount = this.map.get(data[i].id) || 0;
            this.presentProducts.push(t);
          }
        }
      },
      error =>
      {
        this.toastr.error('Server error. Please try again later');
      }
    );
  }

  ngOnInit(): void {
  }

  addOne(idx:number): void{
    this.cartService.addProduct(this.presentProducts[idx].id);
    this.loadCart();
  }

  removeOne(idx:number): void{
    this.cartService.removeProduct(this.presentProducts[idx].id);
    this.loadCart();
  }

  onClick(type:number):void{
    if(type == 1){
      this.cartService.clearCart();
      this.loadCart();
    }
    else{
      if(localStorage.getItem('token') != null && localStorage.getItem('ids')!=null){
        if(this.cartForm.valid){
          let temp = localStorage.getItem('token');
          if(temp == null) return;
          let token = this.helper.decodeToken(temp);
          let id:number = +(token as TokenData).id
          
          let order:Order = new Order(id, this.cartForm.value['address'], this.cartForm.value['comment']);
          this.map.forEach((value, key) =>
          {
            order.productOrders.push(new ProductOrder(this.getProductById(key), value));
          });
          order.totalPrice = this.getTotalPrice();

          this.orderService.add(order).subscribe(
            (data: Order) =>
            {
              if(data.comment == "You can't have more than one order at the time. Please wait for your current order to arrive.") {
                this.toastr.error(data.comment);
              }
              else if(data.comment == "Can't add new order now. Please try again later.") {
                this.toastr.error(data.comment);
              }
              else {
                this.toastr.success('Order purchased successfully. One of our avaible deliverers will take your order soon.');
                this.cartService.clearCart();
                this.router.navigateByUrl('/current-delivery');
              }
            },
            error =>
            {
              this.toastr.error('Server error. Please try again later.');
            }
          )
        }
        else
        {
          this.toastr.error('Form filled incorrectly. Please try again.');
        }
      }
      else{
        this.router.navigateByUrl('login');
      }
    }
  }

  getTotalPrice():number{
    let retVal:number = 300;
    this.map.forEach((value, key) =>
    {
      retVal += value * this.gerPrice(key);
    });

    return retVal;
  }

  getProductById(id:number):Product{
    for(let i = 0; i < this.allProducts.length; i++)
    {
      if(this.allProducts[i].id == id)
      {
        return this.allProducts[i];
      }
    }

    return new Product();
  }

  gerPrice(id:number):number{
    for(let i = 0; i < this.allProducts.length; i++)
    {
      if(this.allProducts[i].id == id)
      {
        return this.allProducts[i].price;
      }
    }

    return 0;
  }
}
