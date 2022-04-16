import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { CommonService } from 'src/app/services/common/common.service';
import { CartDto } from 'src/app/models/CartDto';
import { CartService } from 'src/app/services/home/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartType } from 'src/app/enums/CartType';
import { environment } from 'src/environments/environment';

const pageSize: number = environment.categoryPageSize;
const NewQuantity = 1;
const CartMessage = "Add successfully";
const ActionString = "Close";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() dataSource?: OdataResponse<CategoryDto[]>;

  currentPageIndex: number = 1;
  dataType: number;
  snackBarTimeout: any;
  productCart = CartType.product;
  courseCart = CartType.course;
  pageIndexArray: number[] = [];
  categoryType: string = 'product';
  defaultAvatar: string = "assets/img/default-avatar.png";

  constructor(private categoryService: CategoryService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    private cartService: CartService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.setCurrentPageIndex();
  }

  addToCart(id: string, image: string, price: number, name: string, cartType: CartType) {
    debugger
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
    this.route.navigate([`/detail/${this.categoryType}/${id}`]);
  }

  getListPageIndex() {
    let pageIndexes: number[] = [];

    for (let i = 0; i < (this.dataSource?.count / pageSize); i++) {
      pageIndexes.push(i + 1);
    }

    return pageIndexes;
  }

  hadnlerRouteLink(value: number) {
    window.location.href = `/category/${this.categoryType}/${value}`;
  }

  nextPage() {
    this.setCurrentPageIndex();
    let value = parseInt(((this.dataSource?.count / pageSize)).toString());
    value += this.dataSource?.count <= pageSize ? 0 : 1;
    if (this.currentPageIndex == value) {
      return;
    }

    window.location.href = `/category/${this.categoryType}/${++this.currentPageIndex}`;
  }

  previousPage() {
    this.setCurrentPageIndex();

    if (this.currentPageIndex == 1) {
      return;
    }

    window.location.href = `/category/${this.categoryType}/${--this.currentPageIndex}`;
  }

  firstPage() {
    const FirstPage = 1;
    if (this.currentPageIndex == FirstPage) {
      return;
    }
    window.location.href = `/category/${this.categoryType}/${FirstPage}`;
  }

  lastPage() {
    debugger
    let value = parseInt(((this.dataSource?.count / pageSize)).toString());
    value += this.dataSource?.count <= pageSize ? 0 : 1;

    if (this.currentPageIndex == value) {
      return;
    }
    window.location.href = `/category/${this.categoryType}/${value}`;
  }

  private setCurrentPageIndex() {
    this.activeRoute.params
      .subscribe(p => {
        console.log(p);
        if (p && p['type']) {
          this.categoryType = p['type'];
          this.dataType = p['type'] == 'product' ? 1 : 2;
        }

        if (p && p['pageIndex']) {
          this.currentPageIndex = p['pageIndex'];
        }
      });
  }
}

