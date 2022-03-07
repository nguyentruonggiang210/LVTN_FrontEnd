import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdePopoverPanel } from '@material-extended/mde';
import { CartDto } from 'src/app/models/CartDto';
import { CartService } from 'src/app/services/home/cart.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { PayPalItem } from 'src/app/models/PayPalItem';
import { CartType } from 'src/app/enums/CartType';
import { UnitAmount } from 'src/app/models/UnitAmount';

const ProductString = "Product";
const CourseString = "Course";

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.scss']
})
export class CartDialogComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  cartArray: CartDto[] = [];
  productArray: CartDto[] = [];
  courseArray: CartDto[] = [];
  paypalArray: PayPalItem[] = [];
  moneyCode = 'EUR';

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartArray = this.cartService.getCart();
    this.initConfig();
    this.productArray = this.cartArray.filter(x => x.type == CartType.product);
    this.courseArray = this.cartArray.filter(x => x.type == CartType.course);

    console.log(this.getListItem());
  }

  plusCart(item: CartDto) {
    this.cartService.plusObject(item);
    item.quantity += 1;
  }

  minusCart(item: CartDto) {
    this.cartService.minusObject(item);
    item.quantity -= 1;
    if (item.quantity == 0) {
      let newArray = this.cartArray.filter(x => x.id != item.id);
      this.cartArray = newArray;
      if (item.type == CartType.product) {
        this.productArray = newArray.filter(x => x.type == CartType.product);
      }
      else {
        this.courseArray = newArray.filter(x => x.type == CartType.course);
      }
    }
  }

  private getListItem() {
    return this.cartArray
      .map(x =><PayPalItem>{
        name: x.name,
        quantity: x.quantity.toString(),
        category: 'DIGITAL_GOODS',
        unit_amount: <UnitAmount>{
          currency_code: this.moneyCode,
          value: x.price.toString()
        }
      })
  }

  private getTotalAmount() {
    return this.cartArray.reduce((sum, current) => sum + (current.price * current.quantity), 0);
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: this.moneyCode,
      clientId: environment.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: this.moneyCode,
              value: this.getTotalAmount().toString(),
              breakdown: {
                item_total: {
                  currency_code: this.moneyCode,
                  value: this.getTotalAmount().toString(),
                }
              }
            },
            items: this.getListItem()
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        /// call api to update into database

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
