import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MdePopoverPanel } from '@material-extended/mde';
import { CartDto } from 'src/app/models/CartDto';
import { CartService } from 'src/app/services/home/cart.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { PayPalItem } from 'src/app/models/PayPalItem';
import { CartType } from 'src/app/enums/CartType';
import { UnitAmount } from 'src/app/models/UnitAmount';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { PaymentDto } from 'src/app/models/PaymentDto';
import { PaymentDetailDto } from 'src/app/models/PaymentDetailDto';
import { BillType } from 'src/app/enums/BillType';
import { PaymentType } from 'src/app/enums/PaymentType';
import { MatSnackBar } from '@angular/material/snack-bar';

const ProductString = "Product";
const CourseString = "Course";
const CartMessage = "Payment successful";
const ActionString = "Close";

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
  moneyCode = 'USD';
  snackBarTimeout: any;

  constructor(private cartService: CartService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar) {
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
      .map(x => <PayPalItem>{
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
        if (data.status == 'COMPLETED') {
          let detailArray: PaymentDetailDto[] = [];
          for (const d of this.cartArray) {
            let tempData: PaymentDetailDto = {
              amount: d.price,
              quantity: d.quantity,
              productId: d.id,
              productDetailId: 1
            };
            detailArray.push(tempData);
          }

          let payment: PaymentDto = {
            userId: '8e3e873b-c0fe-412c-b3d7-c6480ae1bbf8',
            billType: BillType.EWallet,
            paymentType: PaymentType.FullPaid,
            totalAmount: this.getTotalAmount(),
            paymentDetails: detailArray
          };
          this.paymentService.uploadPayment(payment)
            .subscribe(x => {
              if (x) {
                clearTimeout(this.snackBarTimeout);

                this.snackBar.open(CartMessage, ActionString);

                this.snackBarTimeout = setTimeout(() => {
                  this.snackBar.dismiss();
                }, 3000);
              }
            });

          this.clearCart();
        }
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

  private clearCart() {
    this.cartArray = [];
    this.productArray = [];
    this.courseArray = [];
    this.cartService.clearAll();
  }
}
