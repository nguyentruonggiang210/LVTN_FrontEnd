import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Router } from '@angular/router';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { CommonService } from 'src/app/services/common/common.service';
import { CartDto } from 'src/app/models/CartDto';
import { CartService } from 'src/app/services/home/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartType } from 'src/app/enums/CartType';
import { SearchType } from 'src/app/enums/SearchType';

const pageSize: number = 40;
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
  @Input() dataSource: OdataResponse<CategoryDto[]>;
  dataType: number;
  snackBarTimeout: any;
  productCart = CartType.product;
  courseCart = CartType.course;
  pageIndexArray: number[] = [];

  constructor(private categoryService: CategoryService,
    private route: Router,
    private commonService: CommonService,
    private cartService: CartService,
    private snackBar: MatSnackBar) {
    commonService.displaySpinner();
  }

  ngOnInit(): void {
    for(let i = 0; i < (this.dataSource.count / pageSize) + 1;i++){
      this.pageIndexArray.push(i + 1);
    }
    console.log(this.dataSource);
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

