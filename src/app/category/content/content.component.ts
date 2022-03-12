import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Router } from '@angular/router';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { CommonService } from 'src/app/services/common/common.service';
import { CartDto } from 'src/app/models/CartDto';
import { CartService } from 'src/app/services/home/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { setTime } from '@syncfusion/ej2-angular-schedule';
import { CartType } from 'src/app/enums/CartType';
import { SearchType } from 'src/app/enums/SearchType';

const TrainerType = "trainer";
const CourseType = "course";
const NewQuantity = 1;
const CartMessage = "Add successfully";
const ActionString = "Close";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  dataType: number;
  snackBarTimeout: any;
  dataSource: CategoryDto[] = [];
  productCart = CartType.product;
  courseCart = CartType.course;
  constructor(private categoryService: CategoryService,
    private route: Router,
    private commonService: CommonService,
    private cartService: CartService,
    private snackBar: MatSnackBar) {
    commonService.displaySpinner();
  }

  ngOnInit(): void {
    this.classifyCategoryType();
  }

  private classifyCategoryType(): void {
    let routeStr = this.route.url;
    var routeArr = routeStr.split('/');
    var typeSearch = routeArr[2];
    if (typeSearch.toUpperCase() === TrainerType) {
      this.dataType = SearchType.Trainer;
    }
    else if (typeSearch.toUpperCase() === CourseType) {
      this.dataType = SearchType.Course;
    }
    else {
      this.dataType = SearchType.Product;

      this.categoryService.getAllProduct("?$skip=0&$top=20")
        .subscribe(x => {
          if (x) {
            let data = <OdataResponse<CategoryDto[]>>x;
            this.dataSource = data.items;
            this.commonService.distroySpinner;
          }
        });
    }
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
    this.route.navigate([`/detail/product/${id}`]);
  }
}

