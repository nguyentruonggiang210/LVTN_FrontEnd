import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { BillType } from 'src/app/enums/BillType';
import { CartType } from 'src/app/enums/CartType';
import { PaymentType } from 'src/app/enums/PaymentType';
import { CartDto } from 'src/app/models/CartDto';
import { CommentDto } from 'src/app/models/CommentDto';
import { CourseDto } from 'src/app/models/CourseDto';
import { PaymentDetailDto } from 'src/app/models/PaymentDetailDto';
import { PaymentDto } from 'src/app/models/PaymentDto';
import { PayPalItem } from 'src/app/models/PayPalItem';
import { ProductPromotionDto } from 'src/app/models/ProductPromotionDto';
import { SendCommentDto } from 'src/app/models/SendCommentDto';
import { UnitAmount } from 'src/app/models/UnitAmount';
import { ValidPromotion } from 'src/app/models/ValidPromotion';
import { MoneyPipe } from 'src/app/pipes/money.pipe';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DetailService } from 'src/app/services/detail/detail.service';
import { CartService } from 'src/app/services/home/cart.service';
import { PromotionService } from 'src/app/services/management/promotion.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { environment } from 'src/environments/environment';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  moneyCode = 'USD';

  preload: string = 'auto';
  api: VgApiService;
  token: string = null;
  defaultAvatar: string = "assets/img/default-avatar.png";
  dataSource: CourseDto = null;
  originPrice: number;
  courseId: number;
  commentDto: CommentDto[];
  commentContent: string = null;
  promotionId?: number = null;
  isPromotionRemain: boolean = true;
  private hubConnection: signalR.HubConnection;

  constructor(private detailService: DetailService,
    private router: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private commonService: CommonService,
    private paymentService: PaymentService,
    private moneyPipe: MoneyPipe,
    private promotionService: PromotionService,
    public dialog: MatDialog) {
    commonService.displaySpinner();
    this.token = authService.getUserId();
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;

    this.api.getDefaultMedia().subscriptions.ended.subscribe(
      () => {
        // Set the video to the beginning
        this.api.getDefaultMedia().currentTime = 0;
      }
    );
  }

  ngOnInit(): void {
    this.initConfig();
    this.router.paramMap.subscribe(params => {
      this.courseId = Number(params.get('id'));
    });

    this.detailService.getCourseDetail(this.courseId)
      .subscribe(x => {
        if (x) {
          this.commonService.distroySpinner();

          this.dataSource = x.body;

          this.originPrice = x.body.price;
          if (x.body.coursePromotions != null && x.body.coursePromotions.length > 0) {
            let productPromotionDto: ProductPromotionDto = {
              promotionId: null,
              promotionName: 'None'
            };

            x.body.coursePromotions = [productPromotionDto].concat(x.body.coursePromotions);

            this.changePricePromotion();
          }
        }
      });

    this.getComment();
  }

  addToCart(courseId: string, name: string, price: number, cartType: CartType) {
    let model: CartDto = {
      id: Number(courseId),
      name: name,
      image: "",
      price: price,
      quantity: 1,
      type: cartType
    }
    this.cartService.setCart(model);
  }

  private getListItem() {
    let array: PayPalItem[] = [];

    let item: PayPalItem = {
      name: this.dataSource.name,
      quantity: '1',
      category: 'DIGITAL_GOODS',
      unit_amount: <UnitAmount>{
        currency_code: this.moneyCode,
        value: this.dataSource.price.toString(),
      }
    };

    array.push(item);

    return array;
  }

  sendComment() {
    if (this.commentContent == null || this.commentContent == '') {
      this.commonService.displaySnackBar('Please enter something', 'Close');
      return;
    }

    let model: SendCommentDto = {
      userId: this.authService.getUserId(),
      courseId: this.dataSource.courseId,
      parentCommentId: null,
      content: this.commentContent,
    };

    this.detailService.sendCourseComment(model)
      .subscribe(x => {
        if (x && x.body == true) {
          this.commonService.displaySnackBar('Comment success', 'Close');
          this.getComment();
          this.commentContent = '';
        }
      });
  }

  sendSubComment(parentId: number) {
    let subComment: any = document.getElementById('subcomment-' + parentId);

    if (subComment == null || subComment == '') {
      this.commonService.displaySnackBar('Please enter something', 'Close');
      return;
    }

    let model: SendCommentDto = {
      userId: this.authService.getUserId(),
      parentCommentId: parentId,
      content: subComment.value,
      courseId: this.dataSource.courseId
    };

    this.detailService.sendCourseComment(model)
      .subscribe(x => {
        if (x && x.body == true) {
          this.commonService.displaySnackBar('Comment success', 'Close');
          this.getComment();
          subComment.value = '';
        }
      });
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '50%',
      maxWidth: '800px',
      minWidth: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  private getComment() {
    this.detailService.getCourseComment(this.courseId)
      .subscribe(x => {
        if (x) {
          this.commentDto = x.body;
        }
      });
  }

  promotionChange(event: any) {
    this.promotionId = this.dataSource.coursePromotions[event.index].promotionId;
    if (this.promotionId != null) {
      this.changePricePromotion();
      this.promotionService.isPromotionRemain(this.promotionId)
        .subscribe(x => this.isPromotionRemain = x.body);
    }
    else {
      this.isPromotionRemain = true;
      this.dataSource.price = this.originPrice;
    }
  }

  private changePricePromotion() {
    let promotion = this.dataSource.coursePromotions.find(x => x.promotionId == this.promotionId);
    if (promotion.lkPromotionUnitId == 1) {
      this.dataSource.price = this.originPrice - promotion.amount;
      if (this.dataSource.price < 0) {
        this.dataSource.price = 0;
      }
    }
    else if (promotion.lkPromotionUnitId == 2) {
      this.dataSource.price = this.originPrice - (this.dataSource.price * promotion.amount / 100);
    }
    else {
      this.dataSource.price = this.originPrice;
    }
  }

  displayPrice() {
    if (this.originPrice == this.dataSource?.price) {
      return this.moneyPipe.transform(this.dataSource?.price, 'money');
    }
    else {
      return this.moneyPipe.transform(this.originPrice, 'money') + ' Sale ' + this.moneyPipe.transform(this.dataSource?.price, 'money')
    }
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: this.moneyCode,
      clientId: environment.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest><unknown>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: this.moneyCode,
              value: this.dataSource.price.toString(),
              breakdown: {
                item_total: {
                  currency_code: this.moneyCode,
                  value: this.dataSource.price.toString(),
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
          let tempData: PaymentDetailDto = {
            amount: this.dataSource.price,
            quantity: 1,
            courseId: this.courseId,
            productId: this.courseId,
            type: CartType.course,
            promotionId: this.promotionId
          };

          detailArray.push(tempData);

          let payment: PaymentDto = {
            userId: this.authService.getUserId(),
            billType: BillType.EWallet,
            paymentType: PaymentType.FullPaid,
            totalAmount: this.dataSource.price,
            paymentDetails: detailArray
          };
          this.paymentService.uploadPayment(payment)
            .subscribe(x => {
              if (x) {
                this.triggerNotify();
                this.commonService.displaySnackBar("Applied payment success", "Close")
              }
            });
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
        if (this.promotionId != null) {
          let validPromotion: ValidPromotion = {
            promotionId: this.promotionId,
            quantity: 1
          };
          let arrayValidPromotion: ValidPromotion[] = [validPromotion];
          this.paymentService.validatePromotionPayment(arrayValidPromotion)
            .subscribe(x => {
              if (x && x.body == false) {
                this.commonService.displaySnackBar(x.error, 'Close');
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              }
            });
        }
      },
    };
  }


  private triggerNotify() {
    this.hubConnection.invoke('GetNotification')
  }
}
