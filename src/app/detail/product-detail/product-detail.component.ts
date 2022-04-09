import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CartType } from 'src/app/enums/CartType';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CartDto } from 'src/app/models/CartDto';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { CommentDto } from 'src/app/models/CommentDto';
import { ProductDto } from 'src/app/models/ProductDto';
import { SendCommentDto } from 'src/app/models/SendCommentDto';
import { AuthService } from 'src/app/services/common/auth.service';
import { DetailService } from 'src/app/services/detail/detail.service';
import { CartService } from 'src/app/services/home/cart.service';
import { PaymentDetailDto } from 'src/app/models/PaymentDetailDto';
import { PaymentDto } from 'src/app/models/PaymentDto';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { BillType } from 'src/app/enums/BillType';
import { PaymentType } from 'src/app/enums/PaymentType';
import { PayPalItem } from 'src/app/models/PayPalItem';
import { UnitAmount } from 'src/app/models/UnitAmount';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { CommonService } from 'src/app/services/common/common.service';

const NewQuantity = 1;
const CartMessage = "Add successfully";
const ActionString = "Close";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  moneyCode = 'USD';
  commentContent: string = null;
  defaultAvatar: string = "assets/img/default-avatar.png";
  detailIndex: number = 0;
  imageSource: string;
  fullImageSource: string;
  token: any = null;
  dataSource: ProductDto = null;
  productId: number;
  responsiveOptions: any;
  productSlider: DetailCarousel[] = [];
  recommendationProducts: CategoryDto[] = [];
  productCart = CartType.product;
  snackBarTimeout: any;
  commentDto: CommentDto[];

  constructor(private detailService: DetailService,
    private commonService: CommonService,
    private router: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private route: Router,
    private authService: AuthService,
    private paymentService: PaymentService) {
    commonService.displaySpinner();
    this.token = authService.getDecodedAccessToken();
  }

  ngOnInit(): void {
    this.initConfig();

    this.router.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
    });

    // get product
    this.detailService.getProductDetail(this.productId)
      .subscribe(x => {
        if (x) {
          this.commonService.distroySpinner();
          let data = <BaseResponse<ProductDto>>x;
          if (!data.hasError) {
            let body = data.body;
            this.dataSource = body;
            this.imageSource = body.productDetails[this.detailIndex].productDetailImages[0];
            this.fullImageSource = body.productDetails[this.detailIndex].productBiggerImages[0];
            this.productSlider = data.body.productDetails[this.detailIndex].productDetailImages.map((d, index) => <DetailCarousel>{
              image: d,
              name: index.toString()
            });
          }
        }
      });

    //get recommendation product
    this.detailService.getProductRecommendation(this.getUserId(), this.productId)
      .subscribe(x => {
        if (x) {
          this.recommendationProducts = x.body;
          console.log(x);

        }
      });
    // get commentss
    this.getComment();

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 6,
        numScroll: 6
      },
      {
        breakpoint: '768px',
        numVisible: 5,
        numScroll: 5
      },
      {
        breakpoint: '560px',
        numVisible: 4,
        numScroll: 4
      }
    ];
  }

  changeImageEvent(index: string) {
    let i = Number(index);
    this.imageSource = this.dataSource.productDetails[this.detailIndex].productDetailImages[i];
    this.fullImageSource = this.dataSource.productDetails[this.detailIndex].productBiggerImages[i];
  }

  addToCart(id: string, image: string, price: number, name: string, cartType: CartType) {
    let model: CartDto = {
      id: Number(id),
      name: name,
      image: image,
      price: price,
      quantity: NewQuantity,
      type: cartType
    }
    this.cartService.setCart(model);

    clearTimeout(this.snackBarTimeout);

    this.snackBar.open(CartMessage, ActionString);

    this.snackBarTimeout = setTimeout(() => {
      this.snackBar.dismiss();
    }, 3000);
  }

  navigateToDetail(id: string) {
    window.location.href = `/detail/product/${id}`;
  }

  sendComment() {
    if (this.commentContent == null || this.commentContent == '') {
      this.snackBar.open('Please enter something', 'Close');
      return;
    }

    let tokenObj = this.authService.getDecodedAccessToken();
    let userId = tokenObj['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'].toString();

    let model: SendCommentDto = {
      userId: userId,
      productId: this.dataSource.productId,
      parentCommentId: null,
      content: this.commentContent,
      courseId: null
    };

    this.detailService.sendProductComment(model)
      .subscribe(x => {
        if (x && x.body == true) {
          this.snackBar.open('Comment success', 'Close');
          this.getComment();
          this.commentContent = '';
        }
      });
  }

  sendSubComment(parentId: number) {
    let subComment: any = document.getElementById('subcomment-' + parentId);

    if (subComment == null || subComment == '') {
      this.snackBar.open('Please enter something', 'Close');
      return;
    }

    let userId = this.getUserId();

    let model: SendCommentDto = {
      userId: userId,
      productId: this.dataSource.productId,
      parentCommentId: parentId,
      content: subComment.value,
      courseId: null
    };

    this.detailService.sendProductComment(model)
      .subscribe(x => {
        if (x && x.body == true) {
          this.snackBar.open('Comment success', 'Close');
          this.getComment();
          subComment.value = '';
        }
      });
  }

  private getComment() {
    this.detailService.getProductComment(this.productId)
      .subscribe(x => {
        if (x) {
          this.commentDto = x.body;
        }
      })
  }

  private getUserId() {
    let tokenObj = this.authService.getDecodedAccessToken();
    return tokenObj['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'].toString();
  }

  // init paypal
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
              value: this.dataSource.productDetails[0].price.toString(),
              breakdown: {
                item_total: {
                  currency_code: this.moneyCode,
                  value: this.dataSource.productDetails[0].price.toString(),
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
            amount: this.dataSource.productDetails[0].price,
            quantity: this.dataSource.productDetails[0].quantity,
            productId: this.dataSource.productId,
            productDetailId: this.dataSource.productDetails[0].productDetailId,
          };

          detailArray.push(tempData);

          let payment: PaymentDto = {
            userId: this.token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'].toString(),
            billType: BillType.EWallet,
            paymentType: PaymentType.FullPaid,
            totalAmount: this.dataSource.productDetails[0].price,
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

  private getListItem() {
    let array: PayPalItem[] = [];
    let item: PayPalItem = {
      name: this.dataSource.productName,
      quantity: '1',
      category: 'DIGITAL_GOODS',
      unit_amount: <UnitAmount>{
        currency_code: this.moneyCode,
        value: this.dataSource.productDetails[0].price.toString(),
      }
    };

    array.push(item);

    return array;
  }
}

export interface DetailCarousel {
  image: string
  name: string,
};
