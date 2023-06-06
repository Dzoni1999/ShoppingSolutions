import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  public image: any;

  constructor(private productService:ProductService, private toastr: ToastrService, private router: Router)
  {
    this.productForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      'ingredients': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
      'price': new FormControl('', [Validators.required, Validators.min(0)]),
      'quantity': new FormControl('', [Validators.required, Validators.min(0)]),
      'image': new FormControl('', [Validators.min(0)])
    });
  }  

  onFileChosen(event: any){
    
    if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.toastr.error('You must select an image');
			return;
		}
		
		var mimeType = event.target.files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.toastr.error('Only images are supported');
			return;
		}

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (_event) => {
			this.image = reader.result; 
		}
  }
  

  ngOnInit(): void {}

  onSubmit(): void {
    if(this.productForm.valid)
    {
      if(this.productForm.value['price'] < 0)
      {
        this.toastr.error('Product price must be non negative number.');
        return;
      }
      if(this.productForm.value['price'] <= 100)
      {
        this.toastr.error('Product price must be greater than 100 RSD.');
        return;
      }

      let product:Product = new Product();
      product.name = this.productForm.value['name'];
      product.ingredients = this.productForm.value['ingredients'];
      product.price = this.productForm.value['price'];
      product.quantity = this.productForm.value['quantity'];
      product.image = this.image;
      this.productService.addProduct(product).subscribe(
        (data:Product)=>{
          if(data.name == 'Product with that name already exists.') {
            this.toastr.error(data.name);
            return;
          } 
          else if(data.name == 'Server error. Please try again.'){
            this.toastr.error(data.name);
            return;
          } 
          else if(data.name == 'Product price must be greater than 100 RSD.') {
            this.toastr.error(data.name);
            return;
          }
          else {
            this.toastr.success('Product added successfully.');
            this.router.navigateByUrl('/all-products');
          }
        },
        error => {
          this.toastr.error('Server error. Please try again later.');
        }
      ); 
    }
    else
    {
      this.toastr.error('From filled out incorrectly. Please try again');
    }
  }
}
