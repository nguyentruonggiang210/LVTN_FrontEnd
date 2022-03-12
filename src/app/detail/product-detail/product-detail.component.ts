import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { CartType } from 'src/app/enums/CartType';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CartDto } from 'src/app/models/CartDto';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { ProductDto } from 'src/app/models/ProductDto';
import { CommonService } from 'src/app/services/common/common.service';
import { DetailService } from 'src/app/services/detail/detail.service';
import { CartService } from 'src/app/services/home/cart.service';

const NewQuantity = 1;
const CartMessage = "Add successfully";
const ActionString = "Close";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  detailIndex: number = 0;
  imageSource: string;
  fullImageSource: string;
  myThumbnail = "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  myFullresImage = "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
  token: string = null;
  dataSource: ProductDto = null;
  productId: number;
  responsiveOptions: any;
  productSlider: DetailCarousel[] = [];
  recommendationProducts: CategoryDto[] = [];
  userId: string = '5282c02f-c8ee-41ac-bc7f-66d948cdef37';
  productCart = CartType.product;
  snackBarTimeout: any;

  constructor(private detailService: DetailService,
    private router: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private route: Router) {
  }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
    });

    this.detailService.getProductDetail(this.productId)
      .subscribe(x => {
        if (x) {
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

    this.detailService.getProductRecommendation(this.userId, this.productId)
      .subscribe(x => {
        console.log(x);
        
        if (x) {
          this.recommendationProducts = x.body;
        }
      });

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

  products: Product[] = [
    {
      image: "https://www.primefaces.org/showcase/javax.faces.resource/demo/images/product/bamboo-watch.jpg.xhtml",
      name: "abc",
      inventoryStatus: "abc",
      price: 10
    },
    {
      image: "https://www.primefaces.org/showcase/javax.faces.resource/demo/images/product/bamboo-watch.jpg.xhtml",
      name: "abc",
      inventoryStatus: "abc",
      price: 10
    },
    {
      image: "https://www.primefaces.org/showcase/javax.faces.resource/demo/images/product/bamboo-watch.jpg.xhtml",
      name: "abc",
      inventoryStatus: "abc",
      price: 10
    },
    {
      image: "https://www.primefaces.org/showcase/javax.faces.resource/demo/images/product/bamboo-watch.jpg.xhtml",
      name: "abc",
      inventoryStatus: "abc",
      price: 10
    }
  ];

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
    this.route.navigate([`/detail/product/${id}`]);
  }
}
export interface DetailCarousel {
  image: string
  name: string,
};

export interface Product {
  image: string
  name: string,
  inventoryStatus: string,
  price: number,

};
