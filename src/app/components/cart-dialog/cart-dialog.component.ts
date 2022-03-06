import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdePopoverPanel } from '@material-extended/mde';
import { CartDto } from 'src/app/models/CartDto';
import { CartService } from 'src/app/services/home/cart.service';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent implements OnInit {
  cartArray: CartDto[] = [];

  constructor(private cartService: CartService) { }


  ngOnInit(): void {
    this.cartArray = this.cartService.getCart();
  }

  plusCart(item: CartDto) {
    this.cartService.plusObject(item);
    item.quantity += 1;
  }

  minusCart(item: CartDto) {
    this.cartService.minusObject(item);
    item.quantity -= 1;
    if(item.quantity == 0){
      let newArray = this.cartArray.filter(x => x.id != item.id);
      this.cartArray = newArray;
    }
  }
}
