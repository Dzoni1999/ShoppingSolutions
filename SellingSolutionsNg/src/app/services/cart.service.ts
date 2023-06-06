import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public addedProducts:Array<number>;
  private readonly key:string = 'ids';

  constructor(){
    this.addedProducts = new Array<number>;
  }

  addProduct(id: number) : void
  {
    this.addedProducts = JSON.parse(localStorage.getItem(this.key) || '[]');
    this.addedProducts.push(id);
    localStorage.setItem(this.key, JSON.stringify(this.addedProducts));
  }

  removeProduct(id: number) : void
  {
    this.addedProducts = JSON.parse(localStorage.getItem(this.key) || '[]');
    

    let idx:number = 0;
    for(let i = 0; i < this.addedProducts.length; i++)
    {
      if(this.addedProducts[i] == id)
      {
        idx = i;
        break;
      }
    }
    this.addedProducts.splice(idx ,1);
    localStorage.setItem(this.key, JSON.stringify(this.addedProducts));
  }

  clearCart() : void
  {
    localStorage.removeItem(this.key);
  }

  getIdsAsMap() : Map<number, number>
  {
    let temp = JSON.parse(localStorage.getItem(this.key) || '[]');
    let retVal:Map<number, number> = new Map<number, number>();

    temp.forEach((element: number) => {
      if(retVal.has(element)) retVal.set(element, (retVal.get(element) ?? 0) + 1)
      else retVal.set(element, 1);
    });

    return retVal;
  }
}
