import { Product } from "./product.model";
import { User } from "./user.model";

export enum DeliveryStatus{ 
    PENDING = 0,
    DELIVERING = 1
}


export class ProductOrder{
    product:Product = new Product();
    quantity:number = 0;

    constructor(product:Product, quantity:number)
    {
        this.product = product;
        this.quantity = quantity;
    }
}

export class Order{
    id:number=0;
    userId:number=0;
    userName:string = '';
    delivererName:string = ''; 
    delivererId:number=0;
    deliveryStatus:DeliveryStatus = DeliveryStatus.PENDING
    address:string='';
    comment:string='';
    productOrders:Array<ProductOrder> = new Array<ProductOrder>;
    timeOfDelivery:Date=new Date();
    totalPrice:number = 0;

    constructor(id:number, address:string, comment:string)
    {
        this.productOrders=new Array();
        this.userId = id;
        this.address = address;
        this.comment = comment;
    }    
}