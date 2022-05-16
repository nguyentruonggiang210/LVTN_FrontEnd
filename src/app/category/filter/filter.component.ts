import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; import { SearchType } from 'src/app/enums/SearchType';
import { SortType } from 'src/app/enums/SortType';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CategoryDto } from 'src/app/models/CategoryDto';
import { CategoryOdata } from 'src/app/models/odata/CategoryOdata';
import { OdataResponse } from 'src/app/models/OdataResponse';
import { CategoryService } from 'src/app/services/category/category.service';
import { CommonService } from 'src/app/services/common/common.service';
import { OdataService } from 'src/app/services/common/odata.service';
import { environment } from 'src/environments/environment';

const pageSize: number = environment.categoryPageSize;
const blankSpace: string = ' ';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {
  /// filter variables
  @Output() emitFilterCategory = new EventEmitter<OdataResponse<CategoryDto[]>>();
  page: number;
  dataSource: OdataResponse<CategoryDto[]>;
  difficulties: number[] = [1, 2, 3, 4, 5,];
  bodyFocuses: string[] = [];
  tags: string[] = [];
  fromPrice: number = null;
  toPrice: number = null;
  calorieMin: number = null;
  calorieMax: number = null;
  startDate: Date = null;
  endDate: Date = null;
  tag: string[] = null;
  difficulty: number = null;
  bodyFocus: string[] = null;
  sortBy: number = 1;
  searchTypeString: string = 'product';
  shopName: string = null;
  trainerName: string = null;
  constructor(
    private odataService: OdataService,
    private commonService: CommonService,
    private activeRoute: ActivatedRoute,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getInitFilter();
    this.searchTypeClassify();
    this.queryData(true);
  }

  emitNewItem(value: OdataResponse<CategoryDto[]>) {
    this.emitFilterCategory.emit(value);
  }

  public queryData(isFirstTime: boolean = false) {
    this.commonService.displaySpinner();
    setTimeout(() => {
      // search type classify
      this.searchTypeClassify()
      // call api
      let model: CategoryOdata = {
        searchType: this.searchTypeString,
        pageSize: pageSize,
        pagePass: (this.page - 1) * pageSize,
        searchValue: this.searchValueQuery(),
        price: this.priceQuery(),
        date: '',
        startDate: this.startDateQuery(),
        endDate: this.endDateQuery(),
        calorie: this.calorieQuery(),
        tag: this.tagQuery(),
        difficulty: this.difficultyQuery(),
        bodyFocus: this.bodyFocusQuery(),
        name: this.shopNameQuery(),
        sort: this.sortQuery(),
        isFirstTime: isFirstTime
      };
      this.odataService.categoryQueryOjbect(model)
        .subscribe(body => {
          if (body) {
            this.commonService.distroySpinner();
            this.emitNewItem(body);
          }
        });
    }, 300);
  }

  priceQuery() {
    const key: string = "price";
    if (this.fromPrice == null && this.toPrice != null) {
      return this.odataService.addFilterLessThanEqual(key, this.toPrice.toString()) + blankSpace;
    }
    else if (this.fromPrice != null && this.toPrice == null) {
      return this.odataService.addFilterGreaterThanEqual(key, this.fromPrice.toString()) + blankSpace;
    }
    else if (this.fromPrice != null && this.toPrice != null) {
      return this.odataService.addFilterBetween(key, this.fromPrice.toString(), this.toPrice.toString()) + blankSpace;
    }
    return "";
  }

  calorieQuery() {
    const key: string = "calorie";
    if (this.calorieMin == null && this.calorieMax != null) {
      return this.odataService.addFilterLessThanEqual(key, this.calorieMax.toString()) + blankSpace;
    }
    else if (this.calorieMin != null && this.calorieMax == null) {
      return this.odataService.addFilterGreaterThanEqual(key, this.calorieMin.toString()) + blankSpace;
    }
    else if (this.calorieMin != null && this.calorieMax != null) {
      return this.odataService.addFilterBetween(key, this.calorieMin.toString(), this.calorieMax.toString()) + blankSpace;
    }
    return "";
  }

  dateQuery() {
    const key: string = "published";
    if (this.startDate == null && this.endDate != null) {
      return this.odataService.addFilterLessThanEqual(key, `${this.endDate.toString()}`) + blankSpace;
    }
    else if (this.startDate != null && this.endDate == null) {
      return this.odataService.addFilterGreaterThanEqual(key, `${this.startDate.toString()}`) + blankSpace;
    }
    else if (this.startDate != null && this.endDate != null) {
      return this.odataService.addFilterBetween(key, `${this.startDate.toString()}`, `${this.endDate.toString()}`) + blankSpace;
    }
    return "";
  }

  startDateQuery() {
    const key: string = "startDate";
    if (this.startDate != null) {
      return this.odataService.addFilterEqual(key, this.startDate.toString()) + blankSpace;
    }
    return "";
  }

  endDateQuery() {
    const key: string = "endDate";
    if (this.endDate != null) {
      return this.odataService.addFilterEqual(key, this.endDate.toString()) + blankSpace;
    }
    return "";
  }

  tagQuery() {
    const key: string = "tag";
    if (this.tag != null) {
      return this.odataService.addFilterIn(key, this.tag) + blankSpace;
    }
    return "";
  }

  difficultyQuery() {
    const key: string = "difficulty";
    if (this.difficulty != null) {
      return this.odataService.addFilterEqual(key, this.difficulty.toString(), true) + blankSpace;
    }
    return "";
  }

  bodyFocusQuery() {
    const key: string = "bodyFocus";
    if (this.bodyFocus != null) {
      return this.odataService.addFilterIn(key, this.bodyFocus) + blankSpace;
    }
    return "";
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  calorieMinChange(event): void {
    let value = event.target.value;
    if (value === "") {
      this.calorieMin = null;
    }
    else {
      this.calorieMin = value;
    }
    this.queryData();
  }

  calorieMaxChange(event): void {
    let value = event.target.value;
    if (value === "") {
      this.calorieMax = null;
    }
    else {
      this.calorieMax = value;
    }
    this.queryData();
  }

  fromPriceChange(event): void {
    let value = event.value;
    if (value === 0) {
      this.fromPrice = null;
    }
    else {
      this.fromPrice = value;
    }
    this.queryData();
  }

  toPriceChange(event): void {
    let value = event.value;
    if (value === 0) {
      this.toPrice = null;
    }
    else {
      this.toPrice = value;
    }
    this.queryData();
  }

  startDateChange(event) {
    let value = event.target.value;
    if (value === "") {
      this.startDate = null;
    }
    else {
      this.startDate = value;
    }
    this.queryData();
  }

  endDateChange(event) {
    let value = event.target.value;
    if (value === "") {
      this.endDate = null;
    }
    else {
      this.endDate = value;
    }
    this.queryData();
  }

  NameChange(event) {
    let value = event.target.value;
    if (value === "") {
      if (this.searchTypeString == 'product') {
        this.shopName = null;
      }
      else {
        this.trainerName = null;
      }
    }
    else {
      if (this.searchTypeString == 'product') {
        this.shopName = value;
      }
      else {
        this.trainerName = value;
      }
    }

    this.queryData();
  }

  shopNameQuery() {
    if (this.searchTypeString == 'product') {
      const key: string = "shopName";
      if (this.shopName != null) {
        return this.odataService.addFilterIn(key, [this.shopName]) + blankSpace;
      }
    }
    else {
      const key: string = "trainerName";
      if (this.trainerName != null) {
        return this.odataService.addFilterIn(key, [this.trainerName]) + blankSpace;
      }
    }

    return "";
  }

  listChange(event): void {
    this.queryData();
  }

  sortListChange(event): void {
    this.sortBy = Number(event.target.value);
    this.queryData();
  }

  sortQuery(): string {
    switch (this.sortBy) {
      case SortType.Newest:
        return this.odataService.sortBy('published', true);
      case SortType.Oldest:
        return this.odataService.sortBy('published', false);
      case SortType.PriceReduce:
        return this.odataService.sortBy('price', true);
      case SortType.PriceGain:
        return this.odataService.sortBy('price', false);
      default:
        return this.odataService.sortBy('published', true);
    }
  }

  searchValueQuery(): string {
    const Name = 'name';
    let searchValue = this.commonService.getLocalStorage('searchValue');

    return searchValue !== '' && searchValue !== null && searchValue != undefined ? this.odataService.addFilterIn(Name, [searchValue]) + blankSpace : '';
  }

  searchTypeClassify() {
    let searchType = this.commonService.getLocalStorage('searchType');
    switch (searchType) {
      case SearchType.Product:
        this.searchTypeString = 'product';
        break;
      case SearchType.Course:
        this.searchTypeString = 'course';
        break;
      default:
        this.searchTypeString = 'product';
    }
  }

  private getInitFilter() {
    this.categoryService.getAllTag()
      .subscribe(x => {
        if (x) {
          this.tags = x.body;
        }
      });

    this.categoryService.getAllBodyFocus()
      .subscribe(x => {
        if (x) {
          this.bodyFocuses = x.body;
        }
      });

    this.activeRoute.params.subscribe(p => {
      if (p && p['type']) {
        this.searchTypeString = p['type'];
      }

      if (p && p['pageIndex'] && p['type']) {
        this.page = p['pageIndex'];
      }
      else {
        this.page = 1;
      }
    })

  }
}
