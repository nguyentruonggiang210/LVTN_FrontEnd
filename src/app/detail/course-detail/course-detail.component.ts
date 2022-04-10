import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { BillType } from 'src/app/enums/BillType';
import { CartType } from 'src/app/enums/CartType';
import { PaymentType } from 'src/app/enums/PaymentType';
import { CartDto } from 'src/app/models/CartDto';
import { CommentDto } from 'src/app/models/CommentDto';
import { CourseDto } from 'src/app/models/CourseDto';
import { PaymentDetailDto } from 'src/app/models/PaymentDetailDto';
import { PaymentDto } from 'src/app/models/PaymentDto';
import { PayPalItem } from 'src/app/models/PayPalItem';
import { SendCommentDto } from 'src/app/models/SendCommentDto';
import { UnitAmount } from 'src/app/models/UnitAmount';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DetailService } from 'src/app/services/detail/detail.service';
import { CartService } from 'src/app/services/home/cart.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { environment } from 'src/environments/environment';

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
  courseId: number;
  commentDto: CommentDto[];
  commentContent: string = null;

  constructor(private detailService: DetailService,
    private router: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private commonService: CommonService,
    private paymentService: PaymentService) {
    this.token = authService.getDecodedAccessToken();
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
          this.dataSource = x.body;
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

  private getComment() {
    this.detailService.getCourseComment(this.courseId)
      .subscribe(x => {
        if (x) {
          this.commentDto = x.body;
        }
      });
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
            type: CartType.course
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
        console.log('onClick', data, actions);
      },
    };
  }
}
