import { Injectable } from '@angular/core';
import { CartDto } from 'src/app/models/CartDto';
import { CommonService } from '../common/common.service';

const MaxQuantity = 1000;
const MinQuantity = 0;
const CartName = "fitnessCart";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private commonService: CommonService) { }

  getCart(): CartDto[] {
    var obj = this.commonService.getLocalStorage(CartName);

    if (obj !== null && obj != undefined) {
      return <CartDto[]>obj;
    }

    let cartArray: CartDto[] = [];

    return cartArray;
  }

  setCart(cart: CartDto) {
    var obj = this.getCart();

    var tempObj = obj.find(x => x.id == cart.id);

    if (tempObj) {
      this.plusObject(cart);
    }
    else {
      obj.push(cart);
      this.updateToLocalStorage(obj);
    }
  }

  plusObject(cart: CartDto) {
    var listObj = this.getCart();

    var result = listObj.find(c => c.id == cart.id);

    if (result && result.quantity < MaxQuantity) {
      result.quantity += 1;
      this.updateToLocalStorage(listObj);
    }
    return;
  }

  minusObject(cart: CartDto) {
    var listObj = this.getCart();

    var result = listObj.find(c => c.id == cart.id);

    if (result && result.quantity > MinQuantity) {
      result.quantity -= 1;
      if (result.quantity === 0) {
        this.deleteObject(cart);
      }
      else {
        this.updateToLocalStorage(listObj);
      }
    }
    return;
  }

  deleteObject(cart: CartDto) {
    var listObj = this.getCart();

    var result = listObj.find(c => c.id == cart.id);

    if (result) {
      var newList = listObj.filter(x => x.id != cart.id);
      this.updateToLocalStorage(newList);
    }
    return;
  }

  clearAll() {
    this.commonService.setLocalStorage(CartName, []);
  }

  private updateToLocalStorage(cartArray: CartDto[]): void {
    this.commonService.setLocalStorage(CartName, cartArray);
  }
}
