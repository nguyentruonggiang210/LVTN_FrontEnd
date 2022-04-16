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
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import * as signalR from '@aspnet/signalr';

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
  defaultCourseImage: string = "assets/img/default-course-image.png";
  defaultProductImage: string = "assets/img/default-product-image.png";

  token?: string = null;
  cartArray: CartDto[] = [];
  productArray: CartDto[] = [];
  courseArray: CartDto[] = [];
  paypalArray: PayPalItem[] = [];
  moneyCode = 'USD';
  snackBarTimeout: any;
  private hubConnection: signalR.HubConnection;

  constructor(private cartService: CartService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private commonService: CommonService) {
    this.token = authService.getUserId();
  }

  ngOnInit(): void {
    this.signalRConnection();
    this.cartArray = this.cartService.getCart();
    console.log(this.cartArray);

    this.initConfig();
    this.productArray = this.cartArray.filter(x => x.type == CartType.product);
    this.courseArray = this.cartArray.filter(x => x.type == CartType.course);
    console.log('product' + this.productArray);
    console.log('course' + this.courseArray);
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
              courseId: d.id,
              type: d.type
            };
            detailArray.push(tempData);
          }

          let payment: PaymentDto = {
            userId: this.authService.getUserId(),
            billType: BillType.EWallet,
            paymentType: PaymentType.FullPaid,
            totalAmount: this.getTotalAmount(),
            paymentDetails: detailArray
          };
          this.paymentService.uploadPayment(payment)
            .subscribe(x => {
              if (x) {
                this.triggerNotify();
                this.commonService.displaySnackBar(CartMessage, ActionString);
              }
            });

          this.clearCart();
        }
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
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

  private signalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalConnection + 'notify', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    this.hubConnection.start()
      .then(res => {
        console.log(res);
      });
  }

  private triggerNotify() {
    this.hubConnection.invoke('GetNotification')
  }
}
